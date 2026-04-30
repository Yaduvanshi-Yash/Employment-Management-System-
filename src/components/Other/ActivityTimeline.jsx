const formatActivityTime = (value) => {
  if (!value) {
    return "Just now";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ActivityTimeline = ({
  title = "Recent activity",
  subtitle = "",
  items = [],
}) => {
  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700/80">
            Activity feed
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">{title}</h2>
        </div>
        {subtitle ? <p className="max-w-xl text-sm text-slate-600">{subtitle}</p> : null}
      </div>

      <div className="space-y-4">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={`${item.type}-${item.createdAt}-${index}`}
              className="relative rounded-[22px] border border-slate-200 bg-white/70 px-5 py-4"
            >
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-[22px] bg-amber-300/60" />
              <div className="ml-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.message}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.employeeName ? `${item.employeeName} | ` : ""}
                    {item.taskTitle || "Task update"}
                  </p>
                </div>
                <div className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {formatActivityTime(item.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-200 px-5 py-6 text-sm text-slate-500">
            No activity yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityTimeline;
