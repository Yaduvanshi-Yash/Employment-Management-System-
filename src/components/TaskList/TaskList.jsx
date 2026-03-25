import AcceptTask from "./AcceptTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";
import NewTask from "./NewTask";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";
import { getStoredSession, setStoredSession } from "../../utils/SessionStorage";

const TaskList = ({ data }) => {
  const [authData, setAuthData] = useContext(AuthContext);

  if (!data?.tasks || !authData) {
    return null;
  }

  const syncEmployees = (updatedEmployees, employeeEmail) => {
    setAuthData(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    const storedSession = getStoredSession();
    const loggedInUser = storedSession ? JSON.parse(storedSession) : null;
    if (loggedInUser?.role === "employee" && loggedInUser.email === employeeEmail) {
      const updatedEmployee = updatedEmployees.find(
        (employee) => employee.email === employeeEmail,
      );

      setStoredSession(
        {
          ...loggedInUser,
          data: updatedEmployee,
        },
        Boolean(localStorage.getItem("loggedinUser")),
      );
    }
  };

  const updateTaskStatus = (taskIndex, nextTask) => {
    const updatedEmployees = authData.map((employee) => {
      if (employee.email !== data.email) {
        return employee;
      }

      const updatedTasks = employee.tasks.map((task, index) =>
        index === taskIndex ? nextTask : task,
      );

      const taskNumbers = updatedTasks.reduce(
        (counts, task) => {
          if (task.newTask) counts.newTask += 1;
          if (task.active) counts.active += 1;
          if (task.complete) counts.complete += 1;
          if (task.failed) counts.failed += 1;
          return counts;
        },
        { newTask: 0, active: 0, complete: 0, failed: 0 },
      );

      return {
        ...employee,
        tasks: updatedTasks,
        taskNumbers,
      };
    });

    syncEmployees(updatedEmployees, data.email);
  };

  const handleAccept = (taskIndex) => {
    const currentTask = data.tasks[taskIndex];
    updateTaskStatus(taskIndex, {
      ...currentTask,
      active: true,
      newTask: false,
      complete: false,
      failed: false,
    });
  };

  const handleMoveToNew = (taskIndex) => {
    const currentTask = data.tasks[taskIndex];
    updateTaskStatus(taskIndex, {
      ...currentTask,
      active: false,
      newTask: true,
      complete: false,
      failed: false,
    });
  };

  const handleComplete = (taskIndex) => {
    const currentTask = data.tasks[taskIndex];
    updateTaskStatus(taskIndex, {
      ...currentTask,
      active: false,
      newTask: false,
      complete: true,
      failed: false,
    });
  };

  const handleFail = (taskIndex) => {
    const currentTask = data.tasks[taskIndex];
    updateTaskStatus(taskIndex, {
      ...currentTask,
      active: false,
      newTask: false,
      complete: false,
      failed: true,
    });
  };

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
            Assigned work
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Task board
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Review the queue and update progress directly from each card.
        </p>
      </div>

      <div
        id="tasklist"
        className="task-board flex min-h-80 gap-5 overflow-x-auto pb-2"
      >
        {data.tasks.map((elem, idx) => {
          if (elem.active) {
            return (
              <AcceptTask
                key={idx}
                data={elem}
                onComplete={() => handleComplete(idx)}
                onFail={() => handleFail(idx)}
              />
            );
          }
          if (elem.complete) {
            return (
              <CompleteTask
                key={idx}
                data={elem}
                onAccept={() => handleAccept(idx)}
              />
            );
          }
          if (elem.failed) {
            return (
              <FailedTask
                key={idx}
                data={elem}
                onAccept={() => handleAccept(idx)}
                onReset={() => handleMoveToNew(idx)}
              />
            );
          }
          if (elem.newTask) {
            return (
              <NewTask
                key={idx}
                data={elem}
                onAccept={() => handleAccept(idx)}
                onFail={() => handleFail(idx)}
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
