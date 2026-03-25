import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const CreateTask = () => {
  const [authData, setAuthData] = useContext(AuthContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskAssignTo, setTaskAssignTo] = useState("");
  const [taskCategory, setTaskCategory] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const createdTask = {
      taskTitle,
      taskDescription,
      taskDate,
      category: taskCategory,
      active: false,
      complete: false,
      failed: false,
      newTask: true,
    };

    const updatedEmployees = authData.map((elem) => {
      if (elem.firstName !== taskAssignTo) {
        return elem;
      }

      return {
        ...elem,
        taskNumbers: {
          ...elem.taskNumbers,
          newTask: elem.taskNumbers.newTask + 1,
        },
        tasks: [...elem.tasks, createdTask],
      };
    });

    setAuthData(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    setTaskDate("");
    setTaskDescription("");
    setTaskTitle("");
    setTaskAssignTo("");
    setTaskCategory("");

    // Handle form submission logic here
  };
  return (
    <div className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
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

      <form onSubmit={submitHandler} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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
            <input
              id="taskAssignTo"
              value={taskAssignTo}
              onChange={(e) => {
                setTaskAssignTo(e.target.value);
              }}
              className="field-input"
              type="text"
              placeholder="Employee first name"
            />
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
          <button className="btn-primary mt-5 w-full">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
