const statusConfig = {
  new: { label: "New", tone: "bg-teal-400", color: "#5cc4b8" },
  active: { label: "Active", tone: "bg-amber-400", color: "#d9a35f" },
  complete: { label: "Complete", tone: "bg-emerald-400", color: "#5eb98e" },
  failed: { label: "Failed", tone: "bg-rose-400", color: "#df6a5b" },
};

const priorityConfig = {
  low: { label: "Low", tone: "bg-slate-400" },
  medium: { label: "Medium", tone: "bg-teal-400" },
  high: { label: "High", tone: "bg-amber-400" },
  urgent: { label: "Urgent", tone: "bg-rose-400" },
};

const riskTone = {
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
};

const MetricCard = ({ label, value }) => (
  <div className="panel rounded-[24px] p-5">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="mt-6 text-4xl font-semibold text-slate-800">{value}</p>
  </div>
);

const DistributionBlock = ({ title, items, config }) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="panel rounded-[24px] p-5">
      <div className="mb-5">
        <p className="text-lg font-semibold text-slate-800">{title}</p>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">{config[item.key].label}</span>
              <span className="text-slate-500">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${config[item.key].tone}`}
                style={{
                  width: `${Math.max((item.value / maxValue) * 100, item.value ? 10 : 0)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const segments = items
    .filter((item) => item.value > 0)
    .reduce(
      (accumulator, item) => {
        const dash = total ? (item.value / total) * 100 : 0;
        const segment = (
          <circle
            key={item.key}
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={statusConfig[item.key].color}
            strokeDasharray={`${dash} ${100 - dash}`}
            strokeDashoffset={accumulator.offset}
            strokeLinecap="round"
            strokeWidth="10"
          />
        );

        return {
          offset: accumulator.offset - dash,
          nodes: [...accumulator.nodes, segment],
        };
      },
      { offset: 25, nodes: [] },
    ).nodes;

  return (
    <div className="panel rounded-[24px] p-5">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-lg font-semibold text-slate-800">Task health chart</p>
        </div>
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="rgba(148,163,184,0.18)"
              strokeWidth="10"
            />
            {segments}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-slate-800">{total}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Tasks
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-sm text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusConfig[item.key].color }}
            />
            {statusConfig[item.key].label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductivityTrend = ({ trend = [] }) => {
  const maxValue = Math.max(...trend.map((item) => item.completed), 1);

  return (
    <div className="panel rounded-[24px] p-5">
      <div className="mb-5">
        <p className="text-lg font-semibold text-slate-800">7-day productivity</p>
      </div>
      <div className="flex h-44 items-end gap-3">
        {trend.length ? (
          trend.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end rounded-full bg-slate-100 p-1">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-teal-300"
                  style={{
                    height: `${Math.max((item.completed / maxValue) * 100, item.completed ? 10 : 3)}%`,
                  }}
                  title={`${item.completed} completed`}
                />
              </div>
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-[20px] border border-dashed border-slate-200 text-sm text-slate-500">
            No completed tasks yet.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminAnalytics = ({ analytics, isLoading }) => {
  if (isLoading) {
    return (
      <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
        <div className="text-sm text-slate-500">Loading...</div>
      </section>
    );
  }

  const performance = analytics?.performance || {
    completedCount: 0,
    overdueCount: 0,
    reviewedCount: 0,
    averageRating: 0,
    onTimeRate: 0,
  };

  const statusItems = Object.entries(analytics?.statusCounts || statusConfig).map(([key, value]) => ({
    key,
    value: typeof value === "number" ? value : 0,
  }));

  const priorityItems = Object.entries(analytics?.priorityCounts || priorityConfig).map(
    ([key, value]) => ({
      key,
      value: typeof value === "number" ? value : 0,
    }),
  );

  const topPerformer = analytics?.employeePerformance?.[0];
  const reviewedCount = performance.reviewedCount || 0;
  const ratingCoverage = performance.completedCount
    ? Math.round((reviewedCount / performance.completedCount) * 100)
    : 0;
  const highRiskEmployees = (analytics?.employeePerformance || []).filter(
    (employee) => employee.riskLevel === "high",
  );

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700/80">
            Analytics overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">
            Workforce insights
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Completed Tasks"
          value={performance.completedCount}
        />
        <MetricCard
          label="On-Time Rate"
          value={`${performance.onTimeRate}%`}
        />
        <MetricCard
          label="Average Rating"
          value={`${performance.averageRating || "0.0"}/5`}
        />
        <MetricCard
          label="High Risk Team"
          value={highRiskEmployees.length}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
        <DonutChart items={statusItems} />
        <DistributionBlock
          title="Priority distribution"
          items={priorityItems}
          config={priorityConfig}
        />
        <div className="panel rounded-[24px] p-5">
          <p className="text-lg font-semibold text-slate-800">Top performer</p>
          {topPerformer ? (
            <div className="mt-6 rounded-[20px] border border-blue-100 bg-blue-50/70 p-5">
              <p className="text-xl font-semibold text-slate-800">{topPerformer.employeeName}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Growth
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {topPerformer.growthScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Completed
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {topPerformer.completedCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Avg rating
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {topPerformer.averageRating || "0.0"}/5
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    On-time
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">
                    {topPerformer.onTimeRate}%
                  </p>
                </div>
              </div>
              {topPerformer.badges?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topPerformer.badges.map((badge) => (
                    <span
                      key={badge.key}
                          className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 rounded-[20px] border border-dashed border-slate-200 px-5 py-6 text-sm text-slate-500">
              No completed reviews yet.
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
              Team leaderboard
            </p>
            <div className="mt-4 space-y-3">
              {(analytics?.employeePerformance || []).slice(0, 4).map((employee, index) => (
                <div
                  key={employee.employeeId}
                  className="rounded-[18px] border border-slate-200 bg-white/70 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        #{index + 1} {employee.employeeName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Growth {employee.growthScore} | {employee.completedCount} completed
                      </p>
                    </div>
                    <div
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskTone[employee.riskLevel] || riskTone.low}`}
                    >
                      {employee.riskLabel}
                    </div>
                  </div>
                  {employee.badges?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {employee.badges.slice(0, 2).map((badge) => (
                        <span
                          key={badge.key}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ProductivityTrend trend={analytics?.completionTrend || []} />
        <div className="panel rounded-[24px] p-5">
          <p className="text-lg font-semibold text-slate-800">Summary</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Rating coverage
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{ratingCoverage}%</p>
            </div>
            <div className="rounded-[18px] border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Team members
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">
                {analytics?.employeePerformance?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalytics;
