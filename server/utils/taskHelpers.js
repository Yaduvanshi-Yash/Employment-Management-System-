const priorityWeight = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

const badgeCatalog = [
  {
    key: "deadline-hero",
    label: "Deadline Hero",
    helper: "Delivers work on time consistently.",
    qualifies: ({ performance }) =>
      performance.completedCount >= 4 && performance.onTimeRate >= 85,
  },
  {
    key: "five-star",
    label: "5-Star Performer",
    helper: "Maintains a strong review rating.",
    qualifies: ({ performance }) =>
      performance.reviewedCount >= 2 && performance.averageRating >= 4.5,
  },
  {
    key: "fast-finisher",
    label: "Fast Finisher",
    helper: "Builds momentum with a high completion count.",
    qualifies: ({ performance }) => performance.completedCount >= 8,
  },
  {
    key: "consistent-performer",
    label: "Consistent Performer",
    helper: "Keeps quality high with low delivery risk.",
    qualifies: ({ performance, taskNumbers }) =>
      performance.completedCount >= 3 &&
      performance.overdueCount === 0 &&
      (taskNumbers.failed || 0) === 0,
  },
];

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export const statusToFlags = (status) => ({
  active: status === "active",
  newTask: status === "new",
  complete: status === "complete",
  failed: status === "failed",
});

export const isTaskOverdue = (task) => {
  if (!task?.taskDate) {
    return false;
  }

  const dueDate = new Date(task.taskDate);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  if (task.status === "complete") {
    return false;
  }

  const now = new Date();
  dueDate.setHours(23, 59, 59, 999);
  return dueDate < now;
};

export const buildTaskNumbers = (tasks = []) =>
  tasks.reduce(
    (counts, task) => {
      counts[task.status] += 1;
      return counts;
    },
    { new: 0, active: 0, complete: 0, failed: 0 },
  );

export const buildPriorityNumbers = (tasks = []) =>
  tasks.reduce(
    (counts, task) => {
      const priority = task.priority || "medium";
      counts[priority] += 1;
      return counts;
    },
    { low: 0, medium: 0, high: 0, urgent: 0 },
  );

export const buildPerformanceSummary = (tasks = []) => {
  const completedTasks = tasks.filter((task) => task.status === "complete");
  const reviewedTasks = completedTasks.filter((task) => task.review?.rating);
  const overdueTasks = tasks.filter((task) => isTaskOverdue(task));
  const onTimeCompleted = completedTasks.filter((task) => {
    if (!task.completedAt || !task.taskDate) {
      return false;
    }

    return new Date(task.completedAt) <= new Date(task.taskDate);
  });

  const averageRating = reviewedTasks.length
    ? reviewedTasks.reduce((total, task) => total + task.review.rating, 0) / reviewedTasks.length
    : 0;

  return {
    completedCount: completedTasks.length,
    overdueCount: overdueTasks.length,
    reviewedCount: reviewedTasks.length,
    averageRating: Number(averageRating.toFixed(1)),
    onTimeRate: completedTasks.length
      ? Math.round((onTimeCompleted.length / completedTasks.length) * 100)
      : 0,
  };
};

export const buildEmployeeInsights = (tasks = []) => {
  const taskNumbers = buildTaskNumbers(tasks);
  const performance = buildPerformanceSummary(tasks);
  const activeTasks = tasks.filter((task) => task.status === "active");
  const urgentOpenTasks = tasks.filter(
    (task) => task.status !== "complete" && (task.priority || "medium") === "urgent",
  ).length;
  const weightedLoad = tasks
    .filter((task) => task.status !== "complete")
    .reduce((total, task) => total + (priorityWeight[task.priority || "medium"] || 2), 0);
  const failedCount = taskNumbers.failed || 0;
  const score =
    40 +
    Math.min(performance.completedCount * 4, 28) +
    performance.averageRating * 6 +
    performance.onTimeRate * 0.22 -
    performance.overdueCount * 8 -
    failedCount * 6 -
    urgentOpenTasks * 3;

  let riskLevel = "low";
  if (performance.overdueCount >= 2 || urgentOpenTasks >= 3 || activeTasks.length >= 5 || weightedLoad >= 14) {
    riskLevel = "high";
  } else if (
    performance.overdueCount >= 1 ||
    urgentOpenTasks >= 2 ||
    activeTasks.length >= 3 ||
    weightedLoad >= 8
  ) {
    riskLevel = "medium";
  }

  const badges = badgeCatalog
    .filter((badge) => badge.qualifies({ performance, taskNumbers, activeTasks, weightedLoad }))
    .map(({ key, label, helper }) => ({ key, label, helper }));

  return {
    growthScore: Math.round(clamp(score, 0, 100)),
    riskLevel,
    riskLabel:
      riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk",
    weightedLoad,
    urgentOpenTasks,
    activeTasks: activeTasks.length,
    badges,
  };
};

export const suggestTaskPriority = ({
  taskTitle = "",
  taskDescription = "",
  taskDate = "",
  category = "",
}) => {
  const content = `${taskTitle} ${taskDescription} ${category}`.toLowerCase();
  const urgentKeywords = ["client", "security", "payroll", "outage", "production", "launch"];
  const highKeywords = ["audit", "compliance", "review", "report", "interview", "escalation"];
  let score = 2;

  if (taskDate) {
    const dueDate = new Date(taskDate);
    const today = new Date();
    dueDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

    if (daysUntilDue <= 1) {
      score += 2;
    } else if (daysUntilDue <= 3) {
      score += 1;
    }
  }

  if (urgentKeywords.some((keyword) => content.includes(keyword))) {
    score += 2;
  } else if (highKeywords.some((keyword) => content.includes(keyword))) {
    score += 1;
  }

  if (content.includes("bug") || content.includes("fix")) {
    score += 1;
  }

  if (score >= 5) {
    return {
      priority: "urgent",
      reason: "Deadline or task wording suggests immediate attention is needed.",
    };
  }

  if (score >= 4) {
    return {
      priority: "high",
      reason: "This task looks time-sensitive or important to business delivery.",
    };
  }

  if (score >= 2) {
    return {
      priority: "medium",
      reason: "This task appears like standard planned work for the team.",
    };
  }

  return {
    priority: "low",
    reason: "This task looks non-urgent and suitable for flexible scheduling.",
  };
};

export const buildCalendarTasks = (tasks = []) =>
  tasks
    .filter((task) => task.taskDate)
    .map((task) => ({
      id: task._id?.toString?.() || task.id,
      taskTitle: task.taskTitle,
      taskDate:
        task.taskDate instanceof Date
          ? task.taskDate.toISOString().slice(0, 10)
          : task.taskDate,
      status: task.status,
      priority: task.priority || "medium",
      employeeName: task.employeeName || task.assignedTo?.firstName || "",
      isOverdue: isTaskOverdue(task),
    }))
    .sort((left, right) => left.taskDate.localeCompare(right.taskDate));

export const shapeActivityEvent = (event) => ({
  type: event.type,
  message: event.message,
  actorId: event.actorId || "",
  actorRole: event.actorRole || "",
  createdAt:
    event.createdAt instanceof Date
      ? event.createdAt.toISOString()
      : event.createdAt || new Date().toISOString(),
  meta: event.meta || {},
});

export const shapeTaskForFrontend = (task) => ({
  id: task._id?.toString?.() || task.id,
  taskTitle: task.taskTitle,
  taskDescription: task.taskDescription,
  taskDate:
    task.taskDate instanceof Date
      ? task.taskDate.toISOString().slice(0, 10)
      : task.taskDate,
  category: task.category,
  priority: task.priority || "medium",
  status: task.status,
  isOverdue: isTaskOverdue(task),
  completedAt:
    task.completedAt instanceof Date
      ? task.completedAt.toISOString()
      : task.completedAt || null,
  review: task.review
    ? {
        rating: task.review.rating || null,
        feedback: task.review.feedback || "",
        reviewedBy:
          task.review.reviewedBy?._id?.toString?.() ||
          task.review.reviewedBy?.toString?.() ||
          task.review.reviewedBy ||
          null,
        reviewedAt:
          task.review.reviewedAt instanceof Date
            ? task.review.reviewedAt.toISOString()
            : task.review.reviewedAt || null,
      }
    : null,
  activityLog: (task.activityLog || [])
    .slice()
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(shapeActivityEvent),
  ...statusToFlags(task.status),
});

export const shapeEmployeeWithTasks = (user, tasks = []) => {
  const taskNumbers = buildTaskNumbers(tasks);
  const priorityNumbers = buildPriorityNumbers(tasks);
  const performance = buildPerformanceSummary(tasks);
  const insights = buildEmployeeInsights(tasks);

  return {
    id: user._id?.toString?.() || user.id,
    firstName: user.firstName,
    lastName: user.lastName || "",
    email: user.email,
    role: user.role,
    taskNumbers: {
      newTask: taskNumbers.new,
      active: taskNumbers.active,
      complete: taskNumbers.complete,
      failed: taskNumbers.failed,
    },
    priorityNumbers,
    performance,
    insights,
    tasks: tasks.map(shapeTaskForFrontend),
  };
};
