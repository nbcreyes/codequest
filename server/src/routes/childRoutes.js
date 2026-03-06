// Child profile route definitions.
// All routes require the parent to be authenticated.

import { Router } from "express";
import {
  createChild,
  getChildren,
  getChild,
  updateChild,
  deleteChild,
  getAvatarOptions,
} from "../controllers/childController.js";
import {
  createChildValidation,
  updateChildValidation,
} from "../validators/childValidators.js";
import validate from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All child routes require authentication
router.use(requireAuth);

router.get("/avatars", getAvatarOptions);
router.post("/", createChildValidation, validate, createChild);
router.get("/", getChildren);
router.get("/:id", getChild);
router.put("/:id", updateChildValidation, validate, updateChild);
router.delete("/:id", deleteChild);

export default router;