import React from "react";

const priorityClassNames = {
  low: "bg-slate-400/16 text-slate-100",
  medium: "bg-blue-400/16 text-blue-100",
  high: "bg-amber-300/16 text-amber-100",
  urgent: "bg-rose-400/16 text-rose-100",
};

const AcceptTask = ({ data, onComplete, onFail }) => {
  return (
    <article className="task-card panel-strong flex min-h-80 shrink-0 flex-col rounded-[24px] border-blue-300/15 bg-gradient-to-br from-blue-400/18 to-slate-900/85 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill bg-amber-300/16 text-amber-100">
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
        <h2 className="text-2xl font-semibold text-white">{data.taskTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {data.taskDescription}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={onComplete} className="btn-success w-full">
          Complete
        </button>
        <button onClick={onFail} className="btn-danger w-full">
          Mark Failed
        </button>
      </div>
    </article>
  );
};

export default AcceptTask;
