const riskTone = {
  low: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  medium: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  high: "border-rose-400/20 bg-rose-400/10 text-rose-100",
};

const badgeTone = [
  "bg-blue-400/14 text-blue-100 border-blue-300/20",
  "bg-amber-300/14 text-amber-100 border-amber-300/20",
  "bg-emerald-400/14 text-emerald-100 border-emerald-300/20",
  "bg-fuchsia-400/14 text-fuchsia-100 border-fuchsia-300/20",
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-blue-300/80">
            Career insights
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Growth score, workload risk, and badges
          </h2>
        </div>
        <p className="max-w-2xl text-sm text-slate-400">
          A fresher-friendly analytics layer that turns task history into interview-ready performance signals.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="panel rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Employee growth score
          </p>
          <div className="mt-4 flex items-end gap-4">
            <p className="text-6xl font-semibold text-white">{insights.growthScore}</p>
            <p className="pb-2 text-sm text-slate-400">/100</p>
          </div>
          <div className="mt-5 h-3 rounded-full bg-white/6">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400"
              style={{ width: `${insights.growthScore}%` }}
            />
          </div>
          <div
            className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${riskTone[insights.riskLevel] || riskTone.low}`}
          >
            {insights.riskLabel}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Urgent open tasks
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">{insights.urgentOpenTasks}</p>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Weighted workload
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">{insights.weightedLoad}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel rounded-[24px] p-5">
            <p className="text-lg font-semibold text-white">Achievement badges</p>
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
                <div className="rounded-[18px] border border-dashed border-white/10 px-4 py-3 text-sm text-slate-400">
                  Badges unlock as you complete more work on time with strong reviews.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reviewed tasks</p>
              <p className="mt-2 text-3xl font-semibold text-white">{performance.reviewedCount}</p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">On-time rate</p>
              <p className="mt-2 text-3xl font-semibold text-white">{performance.onTimeRate}%</p>
            </div>
            <div className="panel rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Avg rating</p>
              <p className="mt-2 text-3xl font-semibold text-white">{performance.averageRating}/5</p>
            </div>
          </div>

          <div className="panel rounded-[24px] p-5">
            <p className="text-lg font-semibold text-white">Latest feedback</p>
            {latestReview ? (
              <div className="mt-4 rounded-[20px] border border-white/8 bg-white/4 p-4">
                <p className="text-sm font-semibold text-white">{latestReview.taskTitle}</p>
                <p className="mt-2 text-sm text-slate-300">
                  {latestReview.review.feedback || "Reviewed without written feedback."}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                Feedback will appear here once an admin reviews your completed work.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeInsights;
