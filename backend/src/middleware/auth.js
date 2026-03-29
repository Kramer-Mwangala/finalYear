import jwt from "jsonwebtoken";
import { requireAuth } from "@clerk/express";

// Clerk-based authentication middleware - requires auth for specific routes
const clerkAuth = requireAuth();

// JWT-based authentication (legacy)
function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Alias for verifyToken
const authenticateToken = verifyToken;

// Combined authentication: Try Clerk first, fallback to JWT
const authenticateUser = async (req, res, next) => {
  try {
    // Try Clerk authentication
    if (req.auth && req.auth.userId) {
      req.user = {
        id: req.auth.userId,
        clerkId: req.auth.userId,
        email: req.auth.claims?.email,
      };
      return next();
    }
  } catch (err) {
    // If Clerk fails, try JWT
  }

  // Fallback to JWT authentication
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Authorize by role
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }
    next();
  };
}

export {
  verifyToken,
  authenticateToken,
  authorizeRole,
  clerkAuth,
  authenticateUser,
};
