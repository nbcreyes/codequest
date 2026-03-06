// Middleware that protects routes by verifying the JWT.
// Attaches the authenticated parent's ID to req.parentId.

import { verifyToken } from "../config/jwt.js";
import { Parent } from "../models/index.js";

/**
 * Requires a valid JWT in the Authorization header.
 * Format: Authorization: Bearer <token>
 */
export const requireAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token — throws if invalid or expired
    const decoded = verifyToken(token);

    // Confirm the parent still exists and is active
    const parent = await Parent.findById(decoded.id).select("_id isActive isEmailVerified");

    if (!parent) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please log in again.",
      });
    }

    if (!parent.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated.",
      });
    }

    if (!parent.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before continuing.",
      });
    }

    // Attach parent ID to the request for use in controllers
    req.parentId = parent._id.toString();
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    next(error);
  }
};

/**
 * Middleware for routes that should work whether or not the user
 * is logged in — attaches parentId if token is present, continues either way.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.parentId = decoded.id;
    next();
  } catch {
    // Token invalid or expired — just continue without attaching parentId
    next();
  }
};