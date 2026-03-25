import React from "react";

const FailedTask = ({ data, onAccept, onReset }) => {
  return (
    <article className="panel-strong flex min-h-80 w-[320px] shrink-0 flex-col rounded-[24px] border-rose-300/15 bg-gradient-to-br from-rose-400/16 to-slate-900/85 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="status-pill bg-rose-400/16 text-rose-100">
          {data.category}
        </span>
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
      <div className="mt-6 grid grid-cols-2 gap-3">
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
