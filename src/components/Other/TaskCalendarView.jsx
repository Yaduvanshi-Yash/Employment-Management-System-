import { useMemo, useState } from "react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const priorityTone = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-teal-50 text-teal-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-rose-700",
};

const formatMonthLabel = (date) =>
  date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

const getDateKey = (date) => date.toISOString().slice(0, 10);

const TaskCalendarView = ({ tasks = [] }) => {
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const selectedMonthTasks = useMemo(() => {
    const month = cursor.getMonth();
    const year = cursor.getFullYear();
    return tasks.filter((task) => {
      const taskDate = new Date(task.taskDate);
      return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
  }, [cursor, tasks]);

  const tasksByDate = useMemo(
    () =>
      selectedMonthTasks.reduce((accumulator, task) => {
        const key = task.taskDate;
        accumulator[key] ||= [];
        accumulator[key].push(task);
        return accumulator;
      }, {}),
    [selectedMonthTasks],
  );

  const gridDays = useMemo(() => {
    const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const leading = start.getDay();
    const totalDays = end.getDate();
    const cells = [];

    for (let index = 0; index < leading; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [cursor]);

  const upcomingTasks = selectedMonthTasks
    .slice()
    .sort((left, right) => left.taskDate.localeCompare(right.taskDate))
    .slice(0, 6);

  return (
    <section className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-700/80">
            Calendar view
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">
            Task calendar and delivery planning
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="btn-secondary px-4"
          >
            Prev
          </button>
          <p className="min-w-44 text-center text-sm font-semibold text-slate-700">
            {formatMonthLabel(cursor)}
          </p>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="btn-secondary px-4"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[24px] p-5">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="rounded-[16px] border border-amber-100/80 bg-amber-50/60 px-3 py-2 text-center text-xs uppercase tracking-[0.18em] text-slate-500"
              >
                {day}
              </div>
            ))}
            {gridDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="h-24 rounded-[18px] bg-white/35" />;
              }

              const key = getDateKey(date);
              const dayTasks = tasksByDate[key] || [];

              return (
                <div
                  key={key}
                  className="min-h-24 rounded-[18px] border border-slate-200 bg-white/70 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{date.getDate()}</span>
                    {dayTasks.length ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">
                        {dayTasks.length}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-2">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`rounded-[14px] px-2 py-1 text-xs font-medium ${priorityTone[task.priority] || priorityTone.medium}`}
                      >
                        {task.taskTitle}
                      </div>
                    ))}
                    {dayTasks.length > 2 ? (
                      <p className="text-[11px] text-slate-500">+{dayTasks.length - 2} more</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel rounded-[24px] p-5">
          <p className="text-lg font-semibold text-slate-800">Upcoming month highlights</p>
          <div className="mt-4 space-y-3">
            {upcomingTasks.length ? (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[18px] border border-slate-200 bg-white/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">{task.taskTitle}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[task.priority] || priorityTone.medium}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {task.employeeName || "Employee"} | Due {task.taskDate}
                  </p>
                  {task.isOverdue ? (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                      Overdue
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                No tasks are scheduled for this month yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskCalendarView;
