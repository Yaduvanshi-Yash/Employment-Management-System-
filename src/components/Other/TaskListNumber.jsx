const TaskListNumber = ({ data }) => {
  const metrics = [
    {
      label: "New Tasks",
      value: data?.taskNumbers?.newTask ?? 0,
      accent: "from-sky-400/25 to-transparent",
      tone: "text-sky-200",
    },
    {
      label: "Active Tasks",
      value: data?.taskNumbers?.active ?? 0,
      accent: "from-indigo-400/25 to-transparent",
      tone: "text-indigo-200",
    },
    {
      label: "Completed",
      value: data?.performance?.completedCount ?? data?.taskNumbers?.complete ?? 0,
      accent: "from-blue-400/25 to-transparent",
      tone: "text-blue-200",
    },
    {
      label: "Overdue",
      value: data?.performance?.overdueCount ?? 0,
      accent: "from-rose-400/25 to-transparent",
      tone: "text-rose-200",
    },
    {
      label: "Avg Rating",
      value: data?.performance?.averageRating?.toFixed?.(1) ?? data?.performance?.averageRating ?? "0.0",
      accent: "from-amber-300/25 to-transparent",
      tone: "text-amber-100",
    },
    {
      label: "Growth Score",
      value: data?.insights?.growthScore ?? 0,
      accent: "from-emerald-400/25 to-transparent",
      tone: "text-emerald-100",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`metric-card panel rounded-[24px] p-6 bg-gradient-to-br ${metric.accent}`}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {metric.label}
          </p>
          <div className="mt-8 flex items-end justify-between">
            <h2 className="text-4xl font-semibold text-white">{metric.value}</h2>
            <span className={`text-sm font-semibold ${metric.tone}`}>Live</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListNumber;
