import React from "react";

const priorityClassNames = {
  low: "bg-slate-400/16 text-slate-100",
  medium: "bg-blue-400/16 text-blue-100",
  high: "bg-amber-300/16 text-amber-100",
  urgent: "bg-rose-400/16 text-rose-100",
};

const FailedTask = ({ data, onAccept, onReset }) => {
  return (
    <article className="task-card panel-strong flex min-h-80 min-w-0 flex-col rounded-[24px] border-rose-300/15 bg-gradient-to-br from-rose-400/16 to-slate-900/85 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill bg-rose-400/16 text-rose-100">
            {data.category}
          </span>
          <span className={`status-pill ${priorityClassNames[data.priority] || priorityClassNames.medium}`}>
            {data.priority || "medium"}
          </span>
          {data.isOverdue ? (
            <span className="status-pill bg-rose-400/16 text-rose-100">Overdue</span>
          ) : null}
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
          {data.taskDate}
        </span>
      </div>
      <div className="mt-6 flex-1">
        <h3 className="text-2xl font-semibold text-white">{data.taskTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {data.taskDescription}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={onAccept} className="btn-secondary w-full">
          Retry
        </button>
        <button onClick={onReset} className="btn-danger w-full">
          Reset
        </button>
      </div>
    </article>
  );
};

export default FailedTask;
