import { useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getStoredToken } from "../../utils/SessionStorage";
import { apiRequest } from "../../utils/api";

const suggestPriority = ({ taskTitle, taskDescription, taskDate, taskCategory }) => {
  const content = `${taskTitle} ${taskDescription} ${taskCategory}`.toLowerCase();
  const urgentKeywords = ["client", "security", "payroll", "outage", "production", "launch"];
  const highKeywords = ["audit", "compliance", "review", "report", "interview", "escalation"];
  let score = 2;

  if (taskDate) {
    const dueDate = new Date(taskDate);
    const today = new Date();
    dueDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

    if (daysUntilDue <= 1) {
      score += 2;
    } else if (daysUntilDue <= 3) {
      score += 1;
    }
  }

  if (urgentKeywords.some((keyword) => content.includes(keyword))) {
    score += 2;
  } else if (highKeywords.some((keyword) => content.includes(keyword))) {
    score += 1;
  }

  if (content.includes("bug") || content.includes("fix")) {
    score += 1;
  }

  if (score >= 5) {
    return {
      priority: "urgent",
      reason: "This looks client-facing, production-critical, or due immediately.",
    };
  }

  if (score >= 4) {
    return {
      priority: "high",
      reason: "This looks important and time-sensitive for delivery.",
    };
  }

  if (score >= 2) {
    return {
      priority: "medium",
      reason: "This looks like normal planned execution work.",
    };
  }

  return {
    priority: "low",
    reason: "This looks flexible and low urgency.",
  };
};

const CreateTask = ({ onTaskCreated }) => {
  const { employees, upsertEmployee } = useContext(AuthContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommendation = useMemo(
    () => suggestPriority({ taskTitle, taskDescription, taskDate, taskCategory }),
    [taskCategory, taskDate, taskDescription, taskTitle],
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = getStoredToken();
    if (!token) {
      setErrorMessage("Your session expired. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
          taskDate,
          category: taskCategory,
          priority: taskPriority,
          employeeId: taskAssignTo,
        }),
      });

      upsertEmployee(response.employee);
      setTaskDate("");
      setTaskDescription("");
      setTaskTitle("");
      setTaskAssignTo("");
      setTaskCategory("");
      setTaskPriority("medium");
      setSuccessMessage("Task created successfully.");
      onTaskCreated?.();
    } catch (error) {
      setErrorMessage(error.message || "Unable to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-blue-300/80">
          Admin workspace
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Create a new task
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Assign work with a cleaner input flow while keeping the same employee
          data structure and task behavior.
        </p>
      </div>

      {errorMessage ? (
        <p className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="mb-5 rounded-2xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-100">
          {successMessage}
        </p>
      ) : null}

      <form
        onSubmit={submitHandler}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="taskTitle">
              Task title
            </label>
            <input
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
              }}
              className="field-input"
              type="text"
              placeholder="Prepare monthly performance review"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="taskDate">
              Due date
            </label>
            <input
              id="taskDate"
              value={taskDate}
              onChange={(e) => {
                setTaskDate(e.target.value);
              }}
              className="field-input"
              type="date"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="taskAssignTo">
              Assign to
            </label>
            <select
              id="taskAssignTo"
              value={taskAssignTo}
              onChange={(e) => {
                setTaskAssignTo(e.target.value);
              }}
              className="field-input"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="taskCategory">
              Category
            </label>
            <input
              id="taskCategory"
              value={taskCategory}
              onChange={(e) => {
                setTaskCategory(e.target.value);
              }}
              className="field-input"
              type="text"
              placeholder="Operations, reporting, design, follow-up"
            />
          </div>
          <div className="sm:col-span-2 rounded-[22px] border border-blue-400/20 bg-blue-400/8 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-200/80">
                  Smart priority suggestion
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Recommended: {recommendation.priority}
                </p>
                <p className="mt-1 text-sm text-slate-300">{recommendation.reason}</p>
              </div>
              <button
                type="button"
                onClick={() => setTaskPriority(recommendation.priority)}
                className="btn-secondary whitespace-nowrap"
              >
                Apply suggestion
              </button>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="taskPriority">
              Priority
            </label>
            <select
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => {
                setTaskPriority(e.target.value);
              }}
              className="field-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="panel rounded-[24px] p-5">
          <label className="field-label" htmlFor="taskDescription">
            Description
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => {
              setTaskDescription(e.target.value);
            }}
            className="field-input min-h-52 resize-none"
            placeholder="Add context, deliverables, and expectations for the assignee."
          ></textarea>
          <button disabled={isSubmitting} className="btn-primary mt-5 w-full">
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
