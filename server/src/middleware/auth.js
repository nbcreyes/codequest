// Authentication middleware.
// requireAuth        — validates parent JWT, attaches req.parentId
// requireChildSession — validates child JWT, attaches req.parentId and req.childId
// optionalAuth       — attaches parentId if token present, continues either way

import { verifyToken } from "../config/jwt.js";
import { Parent, Child } from "../models/index.js";

// ── Parent auth ───────────────────────────────────────────────────────────

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // This middleware is for parent tokens only
    if (decoded.role !== "parent") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type. Please log in as a parent.",
      });
    }

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

// ── Child session auth ────────────────────────────────────────────────────

export const requireChildSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No active child session. Please select a child profile.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // This middleware is for child session tokens only
    if (decoded.role !== "child") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type for this action.",
      });
    }

    // Confirm the child still exists, is active, and belongs to the parent
    const child = await Child.findOne({
      _id: decoded.childId,
      parent: decoded.id,
      isActive: true,
    }).select("_id parent firstName currentStage dailyTimeLimitMinutes");

    if (!child) {
      return res.status(401).json({
        success: false,
        message: "Child profile not found or no longer active.",
      });
    }

    // Attach both IDs to the request for use in controllers
    req.parentId = decoded.id;
    req.childId = child._id.toString();
    req.child = child;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Child session has expired. Please switch profiles again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid child session token.",
      });
    }
    next(error);
  }
};

// ── Optional auth ─────────────────────────────────────────────────────────

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
    next();
  }
};