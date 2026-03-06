// Progress routes — returns and updates a child's progress.

import { Router } from "express";
import { Progress } from "../models/index.js";
import { requireChildSession } from "../middleware/auth.js";

const router = Router();

// Get the current child's progress
router.get("/", requireChildSession, async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ child: req.childId })
      .populate("chapters.chapter", "title order codingStage")
      .select("-__v");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
});

export default router;