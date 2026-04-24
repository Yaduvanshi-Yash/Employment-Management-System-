import { Router } from "express";
import { createSession, requireAuth } from "../middleware/auth.js";
import { isMongoEnabled } from "../config/databaseState.js";
import { validateCompanyCode } from "../config/companyCodes.js";
import {
  checkLocalEmailExists,
  createLocalUser,
  findLocalUserByCredentials,
  readDb,
  sanitizeUser,
} from "../data/store.js";
import { sendCredentialsEmail } from "../services/emailService.js";
import {
  buildUniqueWorkEmail,
  checkEmailExists,
  createUser,
  findUserByCredentials,
  getCurrentUserById,
  getEmployeeByEmail,
} from "../services/mongoRepository.js";

const router = Router();

const MIN_PASSWORD_LENGTH = 8;

const buildLocalUniqueWorkEmail = async (firstName, role) => {
  const emailDomain = role === "admin" ? "admin.com" : "emp.com";
  const baseName = firstName.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "user";
  let suffix = 0;

  while (true) {
    const candidateEmail =
      suffix === 0 ? `${baseName}@${emailDomain}` : `${baseName}${suffix}@${emailDomain}`;

    if (!(await checkLocalEmailExists(candidateEmail))) {
      return candidateEmail;
    }

    suffix += 1;
  }
};

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
      user = await findLocalUserByCredentials(email, password);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createSession(user);
    const employee =
      user.role === "employee"
        ? isMongoEnabled()
          ? await getEmployeeByEmail(user.email)
          : sanitizeUser(user)
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

router.post("/register", async (req, res, next) => {
  try {
    const { firstName, personalEmail, password, companyCode } = req.body;

    // Validation
    if (!firstName || !personalEmail || !password || !companyCode) {
      return res.status(400).json({
        message: "firstName, personalEmail, password, and companyCode are required.",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
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

    const workEmail = isMongoEnabled()
      ? await buildUniqueWorkEmail(firstName, role, checkEmailExists)
      : await buildLocalUniqueWorkEmail(firstName, role);

    const newUser = isMongoEnabled()
      ? await createUser(firstName, workEmail, password, role)
      : await createLocalUser({ firstName, email: workEmail, password, role });

    const emailSent = await sendCredentialsEmail(personalEmail, workEmail, role);

    if (!emailSent) {
      console.warn(`Failed to send credentials email to ${personalEmail} for user ${workEmail}`);
    }

    const token = createSession(newUser);
    const employee =
      role === "employee"
        ? isMongoEnabled()
          ? await getEmployeeByEmail(workEmail)
          : sanitizeUser(newUser)
        : null;

    return res.json({
      message: "Registration successful. Use your chosen password and your new work email to sign in.",
      token,
      user: newUser,
      employee,
      emailSent,
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
