// Auth route definitions.
// Each route applies rate limiting, then validation, then the controller.

import { Router } from "express";
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../validators/authValidators.js";
import validate from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Public routes
router.post("/register", authLimiter, registerValidation, validate, register);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);
router.post("/login", authLimiter, loginValidation, validate, login);
router.post("/forgot-password", authLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPasswordValidation, validate, resetPassword);

// Protected routes
router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

export default router;