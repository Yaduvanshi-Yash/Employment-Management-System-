import { Router } from "express";
import { isMongoEnabled } from "../config/databaseState.js";
import { getNextTaskId, readDb, sanitizeUser, writeDb } from "../data/store.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import {
  createTaskForEmployee,
  updateTaskStatus as updateMongoTaskStatus,
} from "../services/mongoRepository.js";

const router = Router();

const statusMap = {
  new: { active: false, newTask: true, complete: false, failed: false },
  active: { active: true, newTask: false, complete: false, failed: false },
  complete: { active: false, newTask: false, complete: true, failed: false },
  failed: { active: false, newTask: false, complete: false, failed: true },
};

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { taskTitle, taskDescription, taskDate, category, employeeId } = req.body;

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
    const { status } = req.body;

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

      if (req.user.role !== "admin" && req.user.id !== employee.id) {
        return res
          .status(403)
          .json({ message: "You can only update your own assigned tasks." });
      }

      Object.assign(task, statusMap[status]);
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

export default router;
