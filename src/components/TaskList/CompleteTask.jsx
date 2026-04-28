const renderRatingLabel = (rating) => `${rating}/5 performance rating`;

const CompleteTask = ({ data, onAccept }) => {
  return (
    <article className="task-card panel-strong flex min-h-80 min-w-0 flex-col rounded-[24px] border-blue-300/15 bg-gradient-to-br from-blue-400/16 to-slate-900/85 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <span className="status-pill bg-blue-400/16 text-blue-100">
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
        {data.review ? (
          <div className="mt-5 rounded-[18px] border border-blue-400/18 bg-blue-400/8 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-200/80">
              Performance review
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {renderRatingLabel(data.review.rating)}
            </p>
            <p className="mt-2 text-sm text-slate-300">
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
        <button onClick={onAccept} className="btn-secondary w-full">
          Reopen
        </button>
      </div>
    </article>
  );
};

export default CompleteTask;
