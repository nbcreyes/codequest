// Routes for child switching and PIN management.

import { Router } from "express";
import {
  switchToChild,
  setPin,
  verifyPin,
  removePin,
  getPinStatus,
  getCurrentChildSession,
} from "../controllers/switchController.js";
import { requireAuth, requireChildSession } from "../middleware/auth.js";

const router = Router();

// Parent must be authenticated for all switch and PIN routes
router.post("/children/:id/switch", requireAuth, switchToChild);
router.get("/pin/status", requireAuth, getPinStatus);
router.post("/pin/set", requireAuth, setPin);
router.post("/pin/verify", requireAuth, verifyPin);
router.post("/pin/remove", requireAuth, removePin);

// Requires an active child session token
router.get("/session/current", requireChildSession, getCurrentChildSession);

export default router;