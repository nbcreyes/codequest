// Input validation rules for child profile endpoints.

import { body } from "express-validator";
import { AVATAR_OPTIONS } from "../models/Child.js";

export const createChildValidation = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("Child first name is required")
    .isLength({ max: 50 }).withMessage("First name cannot exceed 50 characters"),

  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
    .matches(/^[a-z0-9_]+$/).withMessage("Username can only contain lowercase letters, numbers, and underscores")
    .toLowerCase(),

  body("age")
    .notEmpty().withMessage("Age is required")
    .isInt({ min: 6, max: 17 }).withMessage("Age must be between 6 and 17"),

  body("avatar")
    .notEmpty().withMessage("Avatar is required")
    .isIn(AVATAR_OPTIONS).withMessage(`Avatar must be one of: ${AVATAR_OPTIONS.join(", ")}`),

  body("dailyTimeLimitMinutes")
    .optional()
    .isInt({ min: 0, max: 480 }).withMessage("Daily time limit must be between 0 and 480 minutes"),
];

export const updateChildValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage("First name cannot exceed 50 characters"),

  body("age")
    .optional()
    .isInt({ min: 6, max: 17 }).withMessage("Age must be between 6 and 17"),

  body("avatar")
    .optional()
    .isIn(AVATAR_OPTIONS).withMessage(`Avatar must be one of: ${AVATAR_OPTIONS.join(", ")}`),

  body("dailyTimeLimitMinutes")
    .optional()
    .isInt({ min: 0, max: 480 }).withMessage("Daily time limit must be between 0 and 480 minutes"),
];