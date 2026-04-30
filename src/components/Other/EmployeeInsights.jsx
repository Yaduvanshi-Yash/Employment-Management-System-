const riskTone = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
};

const badgeTone = [
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-slate-100 text-slate-700 border-slate-200",
];

const EmployeeInsights = ({ data }) => {
  const insights = data?.insights;
  const performance = data?.performance;
  const latestReview = (data?.tasks || [])
    .filter((task) => task.review?.reviewedAt)
    .sort((left, right) => new Date(right.review.reviewedAt) - new Date(left.review.reviewedAt))[0];

  if (!insights || !performance) {
    return null;
  }

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700/80">
            Insights
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">
            Performance
          </h2>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="panel rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Employee growth score
          </p>
          <div className="mt-4 flex items-end gap-4">
            <p className="text-6xl font-semibold text-slate-800">{insights.growthScore}</p>
            <p className="pb-2 text-sm text-slate-500">/100</p>
          </div>
          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-teal-300 via-amber-300 to-emerald-400"
              style={{ width: `${insights.growthScore}%` }}
            />
          </div>
          <div
            className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${riskTone[insights.riskLevel] || riskTone.low}`}
          >
            {insights.riskLabel}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Urgent open tasks
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{insights.urgentOpenTasks}</p>
            </div>
            <div className="rounded-[18px] border border-slate-200 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Weighted workload
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{insights.weightedLoad}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel rounded-[24px] p-5">
            <p className="text-lg font-semibold text-slate-800">Achievement badges</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {insights.badges.length ? (
                insights.badges.map((badge, index) => (
                  <div
                    key={badge.key}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${badgeTone[index % badgeTone.length]}`}
                    title={badge.helper}
                  >
                    {badge.label}
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
                  No badges yet.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reviewed tasks</p>
              <p className="mt-2 text-3xl font-semibold text-slate-800">{performance.reviewedCount}</p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">On-time rate</p>
              <p className="mt-2 text-3xl font-semibold text-slate-800">{performance.onTimeRate}%</p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Avg rating</p>
              <p className="mt-2 text-3xl font-semibold text-slate-800">{performance.averageRating}/5</p>
            </div>
          </div>

          <div className="panel rounded-[24px] p-5">
            <p className="text-lg font-semibold text-slate-800">Latest feedback</p>
            {latestReview ? (
              <div className="mt-4 rounded-[20px] border border-slate-200 bg-white/70 p-4">
                <p className="text-sm font-semibold text-slate-800">{latestReview.taskTitle}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {latestReview.review.feedback || "No feedback added."}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                No feedback yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeInsights;
