import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { isMongoEnabled } from "../config/databaseState.js";
import { getAdminAnalytics } from "../services/mongoRepository.js";
import { readDb } from "../data/store.js";
import {
  buildCalendarTasks,
  buildEmployeeInsights,
  buildPerformanceSummary,
  buildPriorityNumbers,
} from "../utils/taskHelpers.js";

const router = Router();

const buildLocalAdminAnalytics = async () => {
  const db = await readDb();
  const employees = db.employees || [];
  const tasks = employees.flatMap((employee) =>
    (employee.tasks || []).map((task) => ({
      ...task,
      employeeId: employee.id,
      employeeName: employee.firstName,
    })),
  );

  const statusCounts = tasks.reduce(
    (counts, task) => {
      const key =
        task.complete ? "complete" : task.failed ? "failed" : task.active ? "active" : "new";
      counts[key] += 1;
      return counts;
    },
    { new: 0, active: 0, complete: 0, failed: 0 },
  );

  const priorityCounts = buildPriorityNumbers(
    tasks.map((task) => ({
      ...task,
      status: task.complete ? "complete" : task.failed ? "failed" : task.active ? "active" : "new",
    })),
  );

  const employeePerformance = employees
    .map((employee) => {
      const employeeTasks = employee.tasks || [];
      const insights = buildEmployeeInsights(employeeTasks);
      const performance = buildPerformanceSummary(employeeTasks);

      return {
        employeeId: employee.id,
        employeeName: employee.firstName,
        completedCount: performance.completedCount,
        averageRating: performance.averageRating,
        onTimeRate: performance.onTimeRate,
        growthScore: insights.growthScore,
        riskLevel: insights.riskLevel,
        riskLabel: insights.riskLabel,
        badges: insights.badges,
      };
    })
    .sort((left, right) => right.growthScore - left.growthScore);

  const recentActivity = tasks
    .flatMap((task) =>
      (task.activityLog || []).map((event) => ({
        ...event,
        taskId: task.id,
        taskTitle: task.taskTitle,
        employeeName: task.employeeName,
      })),
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 12);
  const completionTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      label: date.toLocaleDateString("en-IN", { weekday: "short" }),
      completed: tasks.filter((task) => task.completedAt?.slice?.(0, 10) === key).length,
    };
  });

  return {
    statusCounts,
    priorityCounts,
    performance: buildPerformanceSummary(
      tasks.map((task) => ({
        ...task,
        status: task.complete ? "complete" : task.failed ? "failed" : task.active ? "active" : "new",
      })),
    ),
    employeePerformance,
    completionTrend,
    calendarTasks: buildCalendarTasks(tasks),
    recentActivity,
  };
};

router.get("/admin", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (isMongoEnabled()) {
      return res.json(await getAdminAnalytics());
    }

    return res.json(await buildLocalAdminAnalytics());
  } catch (error) {
    return next(error);
  }
});

export default router;
