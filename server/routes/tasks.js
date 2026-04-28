import { Router } from "express";
import { isMongoEnabled } from "../config/databaseState.js";
import { getNextTaskId, readDb, sanitizeUser, writeDb } from "../data/store.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  createTaskForEmployee,
  reviewTask,
  updateTaskStatus as updateMongoTaskStatus,
} from "../services/mongoRepository.js";

const router = Router();

const statusMap = {
  new: { status: "new", active: false, newTask: true, complete: false, failed: false },
  active: { status: "active", active: true, newTask: false, complete: false, failed: false },
  complete: { status: "complete", active: false, newTask: false, complete: true, failed: false },
  failed: { status: "failed", active: false, newTask: false, complete: false, failed: true },
};

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const {
      taskTitle,
      taskDescription,
      taskDate,
      category,
      priority,
      employeeId,
    } = req.body || {};

    if (!taskTitle || !taskDescription || !taskDate || !category || !employeeId) {
      return res.status(400).json({
        message:
          "taskTitle, taskDescription, taskDate, category, and employeeId are required.",
      });
    }

    if (isMongoEnabled()) {
      const result = await createTaskForEmployee({
        taskTitle,
        taskDescription,
        taskDate,
        category,
        priority,
        employeeId,
        createdBy: req.user.id,
      });

      if (!result) {
        return res.status(404).json({ message: "Employee not found." });
      }

      return res.status(201).json({
        message: "Task created successfully.",
        task: result.task,
        employee: result.employee,
      });
    }

    const db = await readDb();
    const assigneeId = Number(employeeId);
    const employeeIndex = db.employees.findIndex((item) => item.id === assigneeId);

    if (employeeIndex === -1) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const newTask = {
      id: getNextTaskId(db.employees),
      taskTitle,
      taskDescription,
      taskDate,
      category,
      priority: priority || "medium",
      review: null,
      activityLog: [
        {
          type: "task_created",
          message: `Task "${taskTitle}" was assigned.`,
          actorId: req.user.id,
          actorRole: req.user.role,
          createdAt: new Date().toISOString(),
          meta: {
            employeeId: assigneeId,
            priority: priority || "medium",
          },
        },
      ],
      ...statusMap.new,
    };

    db.employees[employeeIndex].tasks.push(newTask);
    const updatedDb = await writeDb(db);
    const updatedEmployee = updatedDb.employees[employeeIndex];

    return res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
      employee: sanitizeUser(updatedEmployee),
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:taskId/status", requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body || {};

    if (!statusMap[status]) {
      return res.status(400).json({
        message: "Status must be one of: new, active, complete, failed.",
      });
    }

    if (isMongoEnabled()) {
      const result = await updateMongoTaskStatus({
        taskId: req.params.taskId,
        status,
        requester: req.user,
      });

      if (result.error === "not_found") {
        return res.status(404).json({ message: "Task not found." });
      }

      if (result.error === "forbidden") {
        return res
          .status(403)
          .json({ message: "You can only update your own assigned tasks." });
      }

      return res.json({
        message: "Task status updated successfully.",
        task: result.task,
        employee: result.employee,
      });
    }

    const taskId = Number(req.params.taskId);
    const db = await readDb();
    let matchedEmployee = null;
    let matchedTask = null;

    for (const employee of db.employees) {
      const task = employee.tasks.find((item) => item.id === taskId);
      if (!task) {
        continue;
      }

      if (req.user.role !== "admin" && String(req.user.id) !== String(employee.id)) {
        return res
          .status(403)
          .json({ message: "You can only update your own assigned tasks." });
      }

      Object.assign(task, statusMap[status]);
      task.completedAt = status === "complete" ? new Date().toISOString() : null;
      if (status !== "complete") {
        task.review = null;
      }
      task.activityLog ||= [];
      task.activityLog.push({
        type: "status_changed",
        message: `Task moved to ${status}.`,
        actorId: req.user.id,
        actorRole: req.user.role,
        createdAt: new Date().toISOString(),
        meta: {
          status,
        },
      });
      matchedEmployee = employee;
      matchedTask = task;
      break;
    }

    if (!matchedEmployee || !matchedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const updatedDb = await writeDb(db);
    const updatedEmployee = updatedDb.employees.find((item) => item.id === matchedEmployee.id);
    const updatedTask = updatedEmployee.tasks.find((item) => item.id === taskId);

    return res.json({
      message: "Task status updated successfully.",
      task: updatedTask,
      employee: sanitizeUser(updatedEmployee),
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:taskId/review", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { rating, feedback = "" } = req.body || {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    if (isMongoEnabled()) {
      const result = await reviewTask({
        taskId: req.params.taskId,
        rating,
        feedback,
        reviewer: req.user,
      });

      if (result.error === "not_found") {
        return res.status(404).json({ message: "Task not found." });
      }

      if (result.error === "invalid_state") {
        return res.status(400).json({ message: "Only completed tasks can be reviewed." });
      }

      if (result.error === "forbidden") {
        return res.status(403).json({ message: "Admin access is required." });
      }

      return res.json({
        message: "Task reviewed successfully.",
        task: result.task,
        employee: result.employee,
      });
    }

    const taskId = Number(req.params.taskId);
    const db = await readDb();
    let matchedEmployee = null;
    let matchedTask = null;

    for (const employee of db.employees) {
      const task = employee.tasks.find((item) => item.id === taskId);
      if (!task) {
        continue;
      }

      if (!task.complete) {
        return res.status(400).json({ message: "Only completed tasks can be reviewed." });
      }

      task.review = {
        rating,
        feedback,
        reviewedBy: req.user.id,
        reviewedAt: new Date().toISOString(),
      };
      task.activityLog ||= [];
      task.activityLog.push({
        type: "task_reviewed",
        message: `Task reviewed with ${rating}/5 rating.`,
        actorId: req.user.id,
        actorRole: req.user.role,
        createdAt: new Date().toISOString(),
        meta: {
          rating,
          feedback,
        },
      });
      matchedEmployee = employee;
      matchedTask = task;
      break;
    }

    if (!matchedEmployee || !matchedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const updatedDb = await writeDb(db);
    const updatedEmployee = updatedDb.employees.find((item) => item.id === matchedEmployee.id);
    const updatedTask = updatedEmployee.tasks.find((item) => item.id === taskId);

    return res.json({
      message: "Task reviewed successfully.",
      task: updatedTask,
      employee: sanitizeUser(updatedEmployee),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
