import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { seedData } from "./seedData.js";
import {
  buildEmployeeInsights,
  buildPerformanceSummary,
  buildPriorityNumbers,
  buildTaskNumbers,
} from "../utils/taskHelpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

const normalizeUserSecurity = (user) => {
  if (!user) {
    return user;
  }

  if (user.passwordHash || !user.password) {
    return user;
  }

  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    passwordHash: bcrypt.hashSync(password, 10),
  };
};

const normalizeTask = (task) => {
  const priority = task.priority || "medium";
  const status = task.status || (task.complete ? "complete" : task.failed ? "failed" : task.active ? "active" : "new");
  const review = task.review
    ? {
        rating: task.review.rating || null,
        feedback: task.review.feedback || "",
        reviewedBy: task.review.reviewedBy || null,
        reviewedAt: task.review.reviewedAt || null,
      }
    : null;
  const activityLog = Array.isArray(task.activityLog) ? task.activityLog : [];

  if (status === "complete") {
    return {
      ...task,
      priority,
      status,
      review,
      activityLog,
      active: false,
      newTask: false,
      failed: false,
      complete: true,
    };
  }

  if (status === "failed") {
    return {
      ...task,
      priority,
      status,
      review,
      activityLog,
      active: false,
      newTask: false,
      complete: false,
      failed: true,
    };
  }

  if (status === "active") {
    return {
      ...task,
      priority,
      status,
      review,
      activityLog,
      active: true,
      newTask: false,
      complete: false,
      failed: false,
    };
  }

  return {
    ...task,
    priority,
    status,
    review,
    activityLog,
    active: false,
    newTask: true,
    complete: false,
    failed: false,
  };
};

const addTaskNumbers = (employee) => {
  const tasks = (employee.tasks || []).map(normalizeTask);
  const taskNumbers = buildTaskNumbers(tasks);
  const priorityNumbers = buildPriorityNumbers(tasks);
  const performance = buildPerformanceSummary(tasks);
  const insights = buildEmployeeInsights(tasks);

  return {
    ...employee,
    tasks,
    taskNumbers: {
      active: taskNumbers.active,
      newTask: taskNumbers.new,
      complete: taskNumbers.complete,
      failed: taskNumbers.failed,
    },
    priorityNumbers,
    performance,
    insights,
  };
};

const normalizeDb = (db) => ({
  admin: (db.admin || []).map((user) => ({
    ...normalizeUserSecurity(user),
    role: "admin",
  })),
  employees: (db.employees || []).map((employee) =>
    addTaskNumbers({
      ...normalizeUserSecurity(employee),
      role: "employee",
    }),
  ),
});

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password: _password, passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

export const initializeStore = async () => {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(normalizeDb(seedData), null, 2));
    return;
  }

  const current = await readDb();
  await writeDb(current);
};

export const readDb = async () => {
  const raw = await fs.readFile(dbPath, "utf8");
  return normalizeDb(JSON.parse(raw));
};

export const writeDb = async (db) => {
  const normalized = normalizeDb(db);
  await fs.writeFile(dbPath, JSON.stringify(normalized, null, 2));
  return normalized;
};

export const getNextTaskId = (employees) =>
  employees.reduce((maxId, employee) => {
    const employeeMax = (employee.tasks || []).reduce(
      (taskMax, task) => Math.max(taskMax, Number(task.id) || 0),
      0,
    );

    return Math.max(maxId, employeeMax);
  }, 0) + 1;

export const getNextUserId = (users) =>
  users.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1;

export const checkLocalEmailExists = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await readDb();

  return [...db.admin, ...db.employees].some(
    (user) => user.email?.toLowerCase() === normalizedEmail,
  );
};

export const findLocalUserByCredentials = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await readDb();
  const user = [...db.admin, ...db.employees].find(
    (candidate) => candidate.email?.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    return null;
  }

  if (user.passwordHash) {
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    return passwordMatches ? user : null;
  }

  return user.password === password ? user : null;
};

export const createLocalUser = async ({ firstName, email, password, role }) => {
  const db = await readDb();
  const collectionKey = role === "admin" ? "admin" : "employees";
  const nextUserId = getNextUserId([...db.admin, ...db.employees]);
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: nextUserId,
    firstName,
    lastName: "",
    email: email.trim().toLowerCase(),
    passwordHash,
    role,
  };

  if (role === "employee") {
    newUser.tasks = [];
  }

  db[collectionKey].push(newUser);
  const updatedDb = await writeDb(db);

  if (role === "admin") {
    return sanitizeUser(updatedDb.admin.find((user) => user.id === nextUserId));
  }

  return sanitizeUser(updatedDb.employees.find((user) => user.id === nextUserId));
};
