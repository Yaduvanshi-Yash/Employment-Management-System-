import bcrypt from "bcryptjs";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { shapeEmployeeWithTasks, shapeTaskForFrontend } from "../utils/taskHelpers.js";

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

export const createTaskForEmployee = async ({
  taskTitle,
  taskDescription,
  taskDate,
  category,
  employeeId,
  createdBy,
}) => {
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
    status: "new",
    assignedTo: employee._id,
    createdBy,
  });

  const shapedEmployee = await getEmployeeById(employee._id);

  return {
    task: shapeTaskForFrontend(task),
    employee: shapedEmployee,
  };
};

export const updateTaskStatus = async ({ taskId, status, requester }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return { error: "not_found" };
  }

  if (requester.role !== "admin" && requester.id !== task.assignedTo.toString()) {
    return { error: "forbidden" };
  }

  task.status = status;
  task.completedAt = status === "complete" ? new Date() : null;
  await task.save();

  const shapedEmployee = await getEmployeeById(task.assignedTo);

  return {
    task: shapeTaskForFrontend(task),
    employee: shapedEmployee,
  };
};
<<<<<<< HEAD
=======

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
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)
