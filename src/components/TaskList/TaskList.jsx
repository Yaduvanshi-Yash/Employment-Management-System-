import AcceptTask from "./AcceptTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";
import NewTask from "./NewTask";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useMemo, useState } from "react";
import {
  getStoredSession,
  getStoredToken,
  isPersistentSession,
  setStoredSession,
} from "../../utils/SessionStorage";
import { apiRequest } from "../../utils/api";

const statusOrder = {
  new: 0,
  active: 1,
  failed: 2,
  complete: 3,
};

const TaskList = ({ data, onEmployeeUpdate }) => {
  const { upsertEmployee } = useContext(AuthContext);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const sortedTasks = useMemo(
    () => {
      const tasks = data?.tasks || [];

      return [...tasks].sort((left, right) => {
        const leftOrder = statusOrder[left.status] ?? 99;
        const rightOrder = statusOrder[right.status] ?? 99;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return new Date(left.taskDate) - new Date(right.taskDate);
      });
    },
    [data?.tasks],
  );

  if (!data?.tasks) {
    return null;
  }

  const syncEmployeeSession = (updatedEmployee) => {
    upsertEmployee(updatedEmployee);
    onEmployeeUpdate?.(updatedEmployee);
    const storedSession = getStoredSession();
    const loggedInUser = storedSession ? JSON.parse(storedSession) : null;

    if (loggedInUser?.role === "employee" && loggedInUser.email === updatedEmployee.email) {
      setStoredSession(
        {
          ...loggedInUser,
          data: updatedEmployee,
        },
        isPersistentSession(),
      );
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    const token = getStoredToken();

    if (!token) {
      setErrorMessage("Your session expired. Please log in again.");
      return;
    }

    setUpdatingTaskId(taskId);
    setErrorMessage("");

    try {
      const response = await apiRequest(`/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      syncEmployeeSession(response.employee);
    } catch (error) {
      setErrorMessage(error.message || "Unable to update the task status.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700/80">
            Assigned work
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">
            Task board
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Review the queue and update progress directly from each card.
        </p>
      </div>
      {errorMessage ? (
        <p className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <div
        id="tasklist"
        className="task-board grid min-h-80 gap-5 md:grid-cols-2 xl:grid-cols-3"
        aria-label="Employee task list"
      >
        {sortedTasks.map((elem, idx) => {
          const taskKey = elem.id || idx;
          const isUpdating = updatingTaskId === elem.id;

          if (elem.active) {
            return (
              <AcceptTask
                key={taskKey}
                data={elem}
                isUpdating={isUpdating}
                onComplete={() => !isUpdating && updateTaskStatus(elem.id, "complete")}
                onFail={() => !isUpdating && updateTaskStatus(elem.id, "failed")}
              />
            );
          }
          if (elem.complete) {
            return (
              <CompleteTask
                key={taskKey}
                data={elem}
                isUpdating={isUpdating}
                onAccept={() => !isUpdating && updateTaskStatus(elem.id, "active")}
              />
            );
          }
          if (elem.failed) {
            return (
              <FailedTask
                key={taskKey}
                data={elem}
                isUpdating={isUpdating}
                onAccept={() => !isUpdating && updateTaskStatus(elem.id, "active")}
                onReset={() => !isUpdating && updateTaskStatus(elem.id, "new")}
              />
            );
          }
          if (elem.newTask) {
            return (
              <NewTask
                key={taskKey}
                data={elem}
                isUpdating={isUpdating}
                onAccept={() => !isUpdating && updateTaskStatus(elem.id, "active")}
                onFail={() => !isUpdating && updateTaskStatus(elem.id, "failed")}
              />
            );
          }

          return null;
        })}
        {!data.tasks.length && (
          <div className="panel flex min-h-72 w-full items-center justify-center rounded-[24px] text-slate-400">
            No tasks assigned yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskList;
