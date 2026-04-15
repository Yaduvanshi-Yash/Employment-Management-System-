import { Router } from "express";
import { createSession, requireAuth } from "../middleware/auth.js";
import { isMongoEnabled } from "../config/databaseState.js";
<<<<<<< HEAD
import { readDb, sanitizeUser } from "../data/store.js";
=======
import { validateCompanyCode } from "../config/companyCodes.js";
import { readDb, sanitizeUser } from "../data/store.js";
import { sendCredentialsEmail } from "../services/emailService.js";
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)
import {
  findUserByCredentials,
  getCurrentUserById,
  getEmployeeByEmail,
<<<<<<< HEAD
=======
  checkEmailExists,
  createUser,
>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)
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

<<<<<<< HEAD
=======
router.post("/register", async (req, res, next) => {
  try {
    const { firstName, personalEmail, password, companyCode } = req.body;

    // Validation
    if (!firstName || !personalEmail || !password || !companyCode) {
      return res.status(400).json({
        message: "firstName, personalEmail, password, and companyCode are required.",
      });
    }

    if (password.length < 3) {
      return res.status(400).json({ message: "Password must be at least 3 characters." });
    }

    if (!personalEmail.includes("@")) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Determine role from company code
    let role = null;
    if (validateCompanyCode(companyCode, "admin")) {
      role = "admin";
    } else if (validateCompanyCode(companyCode, "employee")) {
      role = "employee";
    } else {
      return res.status(401).json({ message: "Invalid company code." });
    }

    // Only works with MongoDB
    if (!isMongoEnabled()) {
      return res.status(400).json({
        message: "Registration requires MongoDB to be connected.",
      });
    }

    // Auto-generate work email based on role
    const emailDomain = role === "admin" ? "admin.com" : "emp.com";
    const workEmail = `${firstName.toLowerCase()}@${emailDomain}`;

    // Check if work email already exists
    const emailExists = await checkEmailExists(workEmail);
    if (emailExists) {
      return res.status(409).json({
        message: `Work email ${workEmail} already exists. Please use a different name.`,
      });
    }

    // Create user
    const newUser = await createUser(firstName, workEmail, password, role);

    // Send credentials to personal email
    const emailSent = await sendCredentialsEmail(personalEmail, workEmail, password, role);

    if (!emailSent) {
      console.warn(`Failed to send credentials email to ${personalEmail} for user ${workEmail}`);
    }

    // Create session token
    const token = createSession(newUser);

    return res.json({
      message: "Registration successful. Check your email for login credentials.",
      token,
      user: newUser,
      emailSent,
    });
  } catch (error) {
    return next(error);
  }
});

>>>>>>> 2e1ece7 (Flatten project structure and finalize full-stack EMS setup)
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
