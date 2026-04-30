const priorityClassNames = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

const FailedTask = ({ data, onAccept, onReset, isUpdating }) => {
  return (
    <article className="task-card task-card--failed panel-strong flex min-h-80 min-w-0 flex-col rounded-[24px] border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill status-failed">
            Needs Attention
          </span>
          <span className="status-pill bg-white/80 text-slate-700 shadow-sm">
            {data.category}
          </span>
          <span className={`status-pill ${priorityClassNames[data.priority] || priorityClassNames.medium}`}>
            {data.priority || "medium"}
          </span>
          {data.isOverdue ? (
            <span className="status-pill bg-rose-50 text-rose-700">Overdue</span>
          ) : null}
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {data.taskDate}
        </span>
      </div>
      <div className="mt-6 flex-1">
        <h3 className="text-2xl font-semibold text-slate-800">{data.taskTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {data.taskDescription}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={onAccept} disabled={isUpdating} className="btn-info w-full disabled:cursor-not-allowed disabled:opacity-60">
          {isUpdating ? "Updating..." : "Retry Task"}
        </button>
        <button onClick={onReset} disabled={isUpdating} className="btn-danger w-full disabled:cursor-not-allowed disabled:opacity-60">
          Reset to New
        </button>
      </div>
    </article>
  );
};

export default FailedTask;
