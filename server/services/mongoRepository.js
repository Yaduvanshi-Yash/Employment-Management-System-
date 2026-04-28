import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import {
  buildEmployeeInsights,
  buildPerformanceSummary,
  buildCalendarTasks,
  buildPriorityNumbers,
  shapeEmployeeWithTasks,
  shapeTaskForFrontend,
} from "../utils/taskHelpers.js";

const appendActivity = (task, activity) => {
  task.activityLog ||= [];
  task.activityLog.push({
    type: activity.type,
    message: activity.message,
    actorId: activity.actorId || "",
    actorRole: activity.actorRole || "",
    createdAt: activity.createdAt || new Date(),
    meta: activity.meta || {},
  });
};

const sanitizeMongoUser = (user) => ({
  id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName || "",
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

export const buildUniqueWorkEmail = async (firstName, role, emailExistsChecker = checkEmailExists) => {
  const emailDomain = role === "admin" ? "admin.com" : "emp.com";
  const baseName =
    firstName.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") ||
    "user";
  let suffix = 0;

  while (true) {
    const candidateEmail =
      suffix === 0 ? `${baseName}@${emailDomain}` : `${baseName}${suffix}@${emailDomain}`;

    if (!(await emailExistsChecker(candidateEmail))) {
      return candidateEmail;
    }

    suffix += 1;
  }
};

export const findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return null;
  }

  return sanitizeMongoUser(user);
};

export const getCurrentUserById = async (userId) => {
  if (!isValidObjectId(userId)) {
    return null;
  }

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    return null;
  }

  return sanitizeMongoUser(user);
};

export const getAllEmployees = async () => {
  const employees = await User.find({ role: "employee", isActive: true }).sort({
    firstName: 1,
  });

  const employeeIds = employees.map((employee) => employee._id);
  const tasks = await Task.find({ assignedTo: { $in: employeeIds } }).sort({ taskDate: 1 });

  const tasksByEmployee = tasks.reduce((accumulator, task) => {
    const key = task.assignedTo.toString();
    accumulator[key] ||= [];
    accumulator[key].push(task);
    return accumulator;
  }, {});

  return employees.map((employee) =>
    shapeEmployeeWithTasks(employee, tasksByEmployee[employee._id.toString()] || []),
  );
};

export const getEmployeeById = async (employeeId) => {
  if (!isValidObjectId(employeeId)) {
    return null;
  }

  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    return null;
  }

  const tasks = await Task.find({ assignedTo: employee._id }).sort({ taskDate: 1 });
  return shapeEmployeeWithTasks(employee, tasks);
};

export const getEmployeeByEmail = async (email) => {
  const employee = await User.findOne({
    email: email.toLowerCase(),
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    return null;
  }

  const tasks = await Task.find({ assignedTo: employee._id }).sort({ taskDate: 1 });
  return shapeEmployeeWithTasks(employee, tasks);
};

export const getEmployeeTasks = async (employeeId) => {
  if (!isValidObjectId(employeeId)) {
    return null;
  }

  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    return null;
  }

  const tasks = await Task.find({ assignedTo: employee._id }).sort({ taskDate: 1 });
  const shapedEmployee = shapeEmployeeWithTasks(employee, tasks);

  return {
    employeeId: shapedEmployee.id,
    tasks: shapedEmployee.tasks,
    taskNumbers: shapedEmployee.taskNumbers,
  };
};

export const getEmployeePerformanceSummary = async (employeeId) => {
  if (!isValidObjectId(employeeId)) {
    return null;
  }

  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    return null;
  }

  const tasks = await Task.find({ assignedTo: employee._id }).sort({ taskDate: 1 });
  return buildPerformanceSummary(tasks);
};

export const createTaskForEmployee = async ({
  taskTitle,
  taskDescription,
  taskDate,
  category,
  priority,
  employeeId,
  createdBy,
}) => {
  if (!isValidObjectId(employeeId) || !isValidObjectId(createdBy)) {
    return null;
  }

  const employee = await User.findOne({
    _id: employeeId,
    role: "employee",
    isActive: true,
  });

  if (!employee) {
    return null;
  }

  const task = await Task.create({
    taskTitle,
    taskDescription,
    taskDate: new Date(taskDate),
    category,
    priority: priority || "medium",
    status: "new",
    assignedTo: employee._id,
    createdBy,
    activityLog: [
      {
        type: "task_created",
        message: `Task "${taskTitle}" was assigned.`,
        actorId: String(createdBy),
        actorRole: "admin",
        createdAt: new Date(),
        meta: {
          employeeId: employee._id.toString(),
          priority: priority || "medium",
        },
      },
    ],
  });

  const shapedEmployee = await getEmployeeById(employee._id);

  return {
    task: shapeTaskForFrontend(task),
    employee: shapedEmployee,
  };
};

export const updateTaskStatus = async ({ taskId, status, requester }) => {
  if (!isValidObjectId(taskId)) {
    return { error: "not_found" };
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return { error: "not_found" };
  }

  if (requester.role !== "admin" && requester.id !== task.assignedTo.toString()) {
    return { error: "forbidden" };
  }

  task.status = status;
  task.completedAt = status === "complete" ? new Date() : null;
  if (status !== "complete" && task.review) {
    task.review = null;
  }
  appendActivity(task, {
    type: "status_changed",
    message: `Task moved to ${status}.`,
    actorId: requester.id,
    actorRole: requester.role,
    meta: {
      status,
    },
  });
  await task.save();

  const shapedEmployee = await getEmployeeById(task.assignedTo);

  return {
    task: shapeTaskForFrontend(task),
    employee: shapedEmployee,
  };
};

export const reviewTask = async ({ taskId, rating, feedback, reviewer }) => {
  if (!isValidObjectId(taskId)) {
    return { error: "not_found" };
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return { error: "not_found" };
  }

  if (reviewer.role !== "admin") {
    return { error: "forbidden" };
  }

  if (task.status !== "complete") {
    return { error: "invalid_state" };
  }

  task.review = {
    rating,
    feedback,
    reviewedBy: reviewer.id,
    reviewedAt: new Date(),
  };
  appendActivity(task, {
    type: "task_reviewed",
    message: `Task reviewed with ${rating}/5 rating.`,
    actorId: reviewer.id,
    actorRole: reviewer.role,
    meta: {
      rating,
      feedback,
    },
  });
  await task.save();

  const shapedEmployee = await getEmployeeById(task.assignedTo);

  return {
    task: shapeTaskForFrontend(task),
    employee: shapedEmployee,
  };
};

export const getAdminAnalytics = async () => {
  const employees = await User.find({ role: "employee", isActive: true }).sort({ firstName: 1 });
  const tasks = await Task.find({ assignedTo: { $in: employees.map((employee) => employee._id) } })
    .populate("assignedTo", "firstName email")
    .sort({ updatedAt: -1 });

  const statusCounts = tasks.reduce(
    (counts, task) => {
      counts[task.status] += 1;
      return counts;
    },
    { new: 0, active: 0, complete: 0, failed: 0 },
  );

  const priorityCounts = buildPriorityNumbers(tasks);
  const performance = buildPerformanceSummary(tasks);
  const employeePerformance = employees
    .map((employee) => {
      const employeeTasks = tasks.filter(
        (task) => task.assignedTo?._id?.toString() === employee._id.toString(),
      );
      const employeePerformanceStats = buildPerformanceSummary(employeeTasks);
      const employeeInsights = buildEmployeeInsights(employeeTasks);

      return {
        employeeId: employee._id.toString(),
        employeeName: employee.firstName,
        completedCount: employeePerformanceStats.completedCount,
        averageRating: employeePerformanceStats.averageRating,
        onTimeRate: employeePerformanceStats.onTimeRate,
        growthScore: employeeInsights.growthScore,
        riskLevel: employeeInsights.riskLevel,
        riskLabel: employeeInsights.riskLabel,
        badges: employeeInsights.badges,
      };
    })
    .sort((left, right) => {
      if (right.growthScore !== left.growthScore) {
        return right.growthScore - left.growthScore;
      }

      return right.completedCount - left.completedCount;
    });

  const recentActivity = tasks
    .flatMap((task) =>
      (task.activityLog || []).map((event) => ({
        type: event.type,
        message: event.message,
        createdAt:
          event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
        actorRole: event.actorRole || "",
        taskId: task._id.toString(),
        taskTitle: task.taskTitle,
        employeeName: task.assignedTo?.firstName || "Employee",
        meta: event.meta || {},
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
      completed: tasks.filter((task) => {
        if (!task.completedAt) {
          return false;
        }

        return new Date(task.completedAt).toISOString().slice(0, 10) === key;
      }).length,
    };
  });

  return {
    statusCounts,
    priorityCounts,
    performance,
    employeePerformance,
    completionTrend,
    calendarTasks: buildCalendarTasks(
      tasks.map((task) => ({
        ...task.toObject(),
        employeeName: task.assignedTo?.firstName || "Employee",
      })),
    ),
    recentActivity,
  };
};

export const checkEmailExists = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  return user !== null;
};

export const createUser = async (firstName, email, password, role) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName: "",
    email: email.toLowerCase(),
    passwordHash,
    role,
    isActive: true,
  });

  return sanitizeMongoUser(user);
};
