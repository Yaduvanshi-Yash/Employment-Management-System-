import jwt from "jsonwebtoken";

const DEV_JWT_SECRET = "ems-dev-secret-change-me";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!jwtSecret) {
    if (isProduction) {
      throw new Error(
        "JWT_SECRET is required in production. Refusing to start with the default development secret.",
      );
    }

    return DEV_JWT_SECRET;
  }

  return jwtSecret;
};

export const createSession = (user) =>
  jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "2d",
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
