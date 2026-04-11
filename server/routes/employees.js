import { Router } from "express";
import { isMongoEnabled } from "../config/databaseState.js";
import { readDb, sanitizeUser } from "../data/store.js";
import { requireAdmin, requireAuth, requireSelfOrAdmin } from "../middleware/auth.js";
import { getAllEmployees, getEmployeeById, getEmployeeTasks } from "../services/mongoRepository.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (isMongoEnabled()) {
      return res.json(await getAllEmployees());
    }

    const db = await readDb();
    return res.json(db.employees.map(sanitizeUser));
  } catch (error) {
    return next(error);
  }
});

router.get("/:employeeId", requireAuth, requireSelfOrAdmin, async (req, res, next) => {
  try {
    if (isMongoEnabled()) {
      const employee = await getEmployeeById(req.params.employeeId);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }

      return res.json(employee);
    }

    const employeeId = Number(req.params.employeeId);
    const db = await readDb();
    const employee = db.employees.find((item) => item.id === employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.json(sanitizeUser(employee));
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/:employeeId/tasks",
  requireAuth,
  requireSelfOrAdmin,
  async (req, res, next) => {
    try {
      if (isMongoEnabled()) {
        const employeeTasks = await getEmployeeTasks(req.params.employeeId);

        if (!employeeTasks) {
          return res.status(404).json({ message: "Employee not found." });
        }

        return res.json(employeeTasks);
      }

      const employeeId = Number(req.params.employeeId);
      const db = await readDb();
      const employee = db.employees.find((item) => item.id === employeeId);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }

      return res.json({
        employeeId,
        tasks: employee.tasks,
        taskNumbers: employee.taskNumbers,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
