const TaskListNumber = ({ data }) => {
  const metrics = [
    {
      label: "New Tasks",
      value: data?.taskNumbers?.newTask ?? 0,
      accent: "from-cyan-400/25 to-transparent",
      tone: "text-cyan-200",
    },
    {
      label: "Completed",
      value: data?.taskNumbers?.complete ?? 0,
      accent: "from-emerald-400/25 to-transparent",
      tone: "text-emerald-200",
    },
    {
      label: "Accepted",
      value: data?.taskNumbers?.active ?? 0,
      accent: "from-blue-400/25 to-transparent",
      tone: "text-blue-200",
    },
    {
      label: "Failed",
      value: data?.taskNumbers?.failed ?? 0,
      accent: "from-amber-300/25 to-transparent",
      tone: "text-amber-100",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
