import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "ems-dev-secret-change-me";

export const createSession = (user) =>
  jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required." });
  }

  return next();
};

export const requireSelfOrAdmin = (req, res, next) => {
  const employeeId = req.params.employeeId;

  if (req.user?.role === "admin" || String(req.user?.id) === String(employeeId)) {
    return next();
  }

  return res.status(403).json({ message: "You can only access your own records." });
};
