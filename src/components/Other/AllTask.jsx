import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getStoredToken } from "../../utils/SessionStorage";
import { apiRequest } from "../../utils/api";

const statusLabels = {
  new: "New",
  active: "Active",
  complete: "Complete",
  failed: "Failed",
};

const priorityClassNames = {
  low: "bg-slate-400/16 text-slate-100 border-slate-300/20",
  medium: "bg-blue-400/16 text-blue-100 border-blue-300/20",
  high: "bg-amber-300/16 text-amber-100 border-amber-300/20",
  urgent: "bg-rose-400/16 text-rose-100 border-rose-300/20",
};

const renderRatingLabel = (rating) => `${rating}/5 performance rating`;

const downloadCsv = (rows) => {
  const headers = [
    "Employee",
    "Email",
    "Task",
    "Category",
    "Priority",
    "Status",
    "Due Date",
    "Overdue",
    "Rating",
    "Feedback",
  ];

  const csvRows = rows.map((row) =>
    [
      row.employeeName,
      row.employeeEmail,
      row.taskTitle,
      row.category,
      row.priority,
      row.status,
      row.taskDate,
      row.isOverdue ? "Yes" : "No",
      row.review?.rating || "",
      row.review?.feedback || "",
    ]
      .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
      .join(","),
  );

  const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ems-task-insights.csv";
  anchor.click();
  URL.revokeObjectURL(url);
};

const AllTask = ({ onTaskReviewed }) => {
  const { employees, isEmployeesLoading, upsertEmployee } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [reviewingTaskId, setReviewingTaskId] = useState(null);
  const [rating, setRating] = useState("5");
  const [feedback, setFeedback] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const flattenedTasks = useMemo(
    () =>
      employees.flatMap((employee) =>
        (employee.tasks || []).map((task) => ({
          ...task,
          employeeId: employee.id,
          employeeName: employee.firstName,
          employeeEmail: employee.email,
        })),
      ),
    [employees],
  );

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return flattenedTasks.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      if (employeeFilter !== "all" && task.employeeId !== employeeFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        task.employeeName,
        task.employeeEmail,
        task.taskTitle,
        task.category,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [employeeFilter, flattenedTasks, priorityFilter, searchTerm, statusFilter]);

  const handleReviewSubmit = async (taskId) => {
    const token = getStoredToken();
    if (!token) {
      setReviewError("Your session expired. Please log in again.");
      return;
    }

    setReviewError("");
    setReviewSuccess("");
    setIsReviewing(true);

    try {
      const response = await apiRequest(`/tasks/${taskId}/review`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          feedback,
        }),
      });

      upsertEmployee(response.employee);
      setReviewSuccess("Task reviewed successfully.");
      setReviewingTaskId(null);
      setFeedback("");
      setRating("5");
      onTaskReviewed?.();
    } catch (error) {
      setReviewError(error.message || "Unable to review task.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300/80">
            Task explorer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Search, filter, export, and review tasks
          </h2>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(filteredTasks)}
          className="btn-secondary whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="field-input"
          type="text"
          placeholder="Search employee, task, or category"
        />
        <select
          value={employeeFilter}
          onChange={(event) => setEmployeeFilter(event.target.value)}
          className="field-input"
        >
          <option value="all">All employees</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="field-input"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="active">Active</option>
          <option value="complete">Complete</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="field-input"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {reviewError ? (
        <p className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {reviewError}
        </p>
      ) : null}
      {reviewSuccess ? (
        <p className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">
          {reviewSuccess}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {isEmployeesLoading ? (
          <div className="rounded-[22px] border border-white/8 px-5 py-6 text-sm text-slate-400">
            Loading task explorer...
          </div>
        ) : null}

        {!isEmployeesLoading && filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[24px] border border-white/8 bg-white/4 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-2">
                    <span className="status-pill bg-blue-400/16 text-blue-100">
                      {task.category}
                    </span>
                    <span
                      className={`status-pill border ${priorityClassNames[task.priority] || priorityClassNames.medium}`}
                    >
                      {task.priority || "medium"}
                    </span>
                    <span className="status-pill bg-white/10 text-slate-200">
                      {statusLabels[task.status] || task.status}
                    </span>
                    {task.isOverdue ? (
                      <span className="status-pill bg-rose-400/16 text-rose-100">
                        Overdue
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{task.taskTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {task.taskDescription}
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                    <p>
                      <span className="text-slate-500">Employee:</span> {task.employeeName}
                    </p>
                    <p>
                      <span className="text-slate-500">Due:</span> {task.taskDate}
                    </p>
                    <p>
                      <span className="text-slate-500">Email:</span> {task.employeeEmail}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-[20px] border border-white/8 bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Review status
                  </p>
                  {task.review ? (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-white">
                        {renderRatingLabel(task.review.rating)}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {task.review.feedback || "No written feedback added."}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">
                      No review submitted yet.
                    </p>
                  )}

                  {task.status === "complete" ? (
                    <div className="mt-4">
                      {reviewingTaskId === task.id ? (
                        <div className="space-y-3">
                          <select
                            value={rating}
                            onChange={(event) => setRating(event.target.value)}
                            className="field-input"
                          >
                            <option value="5">5 - Outstanding</option>
                            <option value="4">4 - Strong</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Needs improvement</option>
                            <option value="1">1 - Poor</option>
                          </select>
                          <textarea
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            className="field-input min-h-28 resize-none"
                            placeholder="Write feedback for the employee"
                          />
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleReviewSubmit(task.id)}
                              disabled={isReviewing}
                              className="btn-primary w-full"
                            >
                              {isReviewing ? "Saving..." : "Save review"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingTaskId(null);
                                setFeedback("");
                                setRating("5");
                              }}
                              className="btn-secondary w-full"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingTaskId(task.id);
                            setRating(String(task.review?.rating || 5));
                            setFeedback(task.review?.feedback || "");
                          }}
                          className="btn-primary w-full"
                        >
                          {task.review ? "Edit review" : "Review task"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[16px] border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">
                      Review becomes available after the task is completed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : null}

        {!isEmployeesLoading && !filteredTasks.length ? (
          <div className="rounded-[22px] border border-dashed border-white/10 px-5 py-6 text-sm text-slate-400">
            No tasks matched the current filters.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default AllTask;
