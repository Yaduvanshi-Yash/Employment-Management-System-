const renderRatingLabel = (rating) => `${rating}/5 performance rating`;

const CompleteTask = ({ data, onAccept, isUpdating }) => {
  return (
    <article className="task-card task-card--complete panel-strong flex min-h-80 min-w-0 flex-col rounded-[24px] border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill status-complete">Completed</span>
          <span className="status-pill bg-white/80 text-slate-700 shadow-sm">{data.category}</span>
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
        {data.review ? (
          <div className="mt-5 rounded-[18px] border border-emerald-200/80 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-700/80">
              Performance review
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {renderRatingLabel(data.review.rating)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {data.review.feedback || "Reviewed without written feedback."}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-[18px] border border-dashed border-white/10 p-4 text-sm text-slate-400">
            Awaiting admin review and rating.
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <span className="btn-success w-full">Completed</span>
        <button onClick={onAccept} disabled={isUpdating} className="btn-info w-full disabled:cursor-not-allowed disabled:opacity-60">
          {isUpdating ? "Updating..." : "Reopen Task"}
        </button>
      </div>
    </article>
  );
};

export default CompleteTask;
