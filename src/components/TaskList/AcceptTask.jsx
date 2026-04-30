const priorityClassNames = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

const AcceptTask = ({ data, onComplete, onFail, isUpdating }) => {
  return (
    <article className="task-card task-card--active panel-strong flex min-h-80 min-w-0 flex-col rounded-[24px] border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill status-active">
            In Progress
          </span>
          <span className="status-pill bg-white/80 text-slate-700 shadow-sm">
            {data.category}
          </span>
          <span className={`status-pill ${priorityClassNames[data.priority] || priorityClassNames.medium}`}>
            {data.priority || "medium"}
          </span>
          {data.isOverdue ? (
            <span className="status-pill status-failed">Overdue</span>
          ) : null}
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {data.taskDate}
        </span>
      </div>
      <div className="mt-6 flex-1">
        <h2 className="text-2xl font-semibold text-slate-800">{data.taskTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {data.taskDescription}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button onClick={onComplete} disabled={isUpdating} className="btn-success w-full disabled:cursor-not-allowed disabled:opacity-60">
          {isUpdating ? "Updating..." : "Mark Complete"}
        </button>
        <button onClick={onFail} disabled={isUpdating} className="btn-danger w-full disabled:cursor-not-allowed disabled:opacity-60">
          Mark Failed
        </button>
      </div>
    </article>
  );
};

export default AcceptTask;
