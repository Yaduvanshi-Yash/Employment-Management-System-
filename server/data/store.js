import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedData } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

const normalizeTask = (task) => {
  if (task.complete) {
    return { ...task, active: false, newTask: false, failed: false, complete: true };
  }

  if (task.failed) {
    return { ...task, active: false, newTask: false, complete: false, failed: true };
  }

  if (task.active) {
    return { ...task, active: true, newTask: false, complete: false, failed: false };
  }

  return { ...task, active: false, newTask: true, complete: false, failed: false };
};

const addTaskNumbers = (employee) => {
  const tasks = (employee.tasks || []).map(normalizeTask);
  const taskNumbers = tasks.reduce(
    (counts, task) => {
      if (task.newTask) counts.newTask += 1;
      if (task.active) counts.active += 1;
      if (task.complete) counts.complete += 1;
      if (task.failed) counts.failed += 1;
      return counts;
    },
    { active: 0, newTask: 0, complete: 0, failed: 0 },
  );

  return { ...employee, tasks, taskNumbers };
};

const normalizeDb = (db) => ({
  admin: (db.admin || []).map((user) => ({ ...user, role: "admin" })),
  employees: (db.employees || []).map((employee) =>
    addTaskNumbers({ ...employee, role: "employee" }),
  ),
});

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password: _password, ...safeUser } = user;
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
