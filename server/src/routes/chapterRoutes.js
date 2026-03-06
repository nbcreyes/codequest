// Chapter routes — returns chapters for the story map.
// Full content management is implemented in Step 30 (admin dashboard).

import { Router } from "express";
import { Chapter } from "../models/index.js";
import { requireChildSession } from "../middleware/auth.js";

const router = Router();

// Get all published chapters — used by the world map
router.get("/", requireChildSession, async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ isPublished: true })
      .sort({ order: 1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      data: { chapters },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single chapter with its lessons
router.get("/:id", requireChildSession, async (req, res, next) => {
  try {
    const chapter = await Chapter.findOne({
      _id: req.params.id,
      isPublished: true,
    })
      .populate({
        path: "lessons",
        match: { isPublished: true },
        options: { sort: { order: 1 } },
        select: "title order concept estimatedMinutes pointsReward",
      })
      .select("-__v");

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: { chapter },
    });
  } catch (error) {
    next(error);
  }
});

export default router;