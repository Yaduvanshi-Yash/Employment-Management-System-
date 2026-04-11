import { Router } from "express";
import { createSession, requireAuth } from "../middleware/auth.js";
import { isMongoEnabled } from "../config/databaseState.js";
import { readDb, sanitizeUser } from "../data/store.js";
import {
  findUserByCredentials,
  getCurrentUserById,
  getEmployeeByEmail,
} from "../services/mongoRepository.js";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    let user = null;

    if (isMongoEnabled()) {
      user = await findUserByCredentials(email, password);
    } else {
      const db = await readDb();
      const admin = db.admin.find(
        (candidate) => candidate.email === email && candidate.password === password,
      );

      const employee = db.employees.find(
        (candidate) => candidate.email === email && candidate.password === password,
      );

      user = admin || employee;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createSession(user);
    const employee =
      isMongoEnabled() && user.role === "employee"
        ? await getEmployeeByEmail(user.email)
        : null;

    return res.json({
      message: "Login successful.",
      token,
      user: isMongoEnabled() ? user : sanitizeUser(user),
      employee,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    if (isMongoEnabled()) {
      const user = await getCurrentUserById(req.user.id);

      if (!user) {
        return res.status(401).json({ message: "Authenticated user not found." });
      }

      const employee =
        user.role === "employee" ? await getEmployeeByEmail(user.email) : null;

      return res.json({
        user,
        employee,
      });
    }

    const db = await readDb();
    const localUser =
      db.admin.find((candidate) => candidate.email === req.user.email) ||
      db.employees.find((candidate) => candidate.email === req.user.email);

    if (!localUser) {
      return res.status(401).json({ message: "Authenticated user not found." });
    }

    return res.json({
      user: sanitizeUser(localUser),
      employee:
        localUser.role === "employee" ? sanitizeUser(localUser) : null,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
