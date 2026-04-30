const TaskListNumber = ({ data }) => {
  const metrics = [
    {
      label: "New Tasks",
      value: data?.taskNumbers?.newTask ?? 0,
      accent: "from-blue-200/70 via-blue-100/40 to-transparent",
      tone: "text-blue-700",
    },
    {
      label: "Active Tasks",
      value: data?.taskNumbers?.active ?? 0,
      accent: "from-amber-200/70 via-amber-100/40 to-transparent",
      tone: "text-amber-700",
    },
    {
      label: "Completed",
      value: data?.performance?.completedCount ?? data?.taskNumbers?.complete ?? 0,
      accent: "from-emerald-200/70 via-emerald-100/40 to-transparent",
      tone: "text-emerald-700",
    },
    {
      label: "Overdue",
      value: data?.performance?.overdueCount ?? 0,
      accent: "from-rose-200/75 to-transparent",
      tone: "text-rose-700",
    },
    {
      label: "Avg Rating",
      value: data?.performance?.averageRating?.toFixed?.(1) ?? data?.performance?.averageRating ?? "0.0",
      accent: "from-yellow-200/75 via-amber-100/40 to-transparent",
      tone: "text-amber-700",
    },
    {
      label: "Growth Score",
      value: data?.insights?.growthScore ?? 0,
      accent: "from-cyan-200/75 via-teal-100/40 to-transparent",
      tone: "text-cyan-700",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`metric-card panel rounded-[24px] p-6 bg-gradient-to-br ${metric.accent}`}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {metric.label}
          </p>
          <div className="mt-8 flex items-end justify-between">
            <h2 className="text-4xl font-semibold text-slate-800">{metric.value}</h2>
            <span className={`text-sm font-semibold ${metric.tone}`}>Live</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListNumber;
