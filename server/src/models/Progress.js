// Tracks which chapters and lessons a child has completed.
// One Progress document per child.

import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // How many attempts it took to pass the task
    attemptsCount: {
      type: Number,
      default: 0,
    },

    // Points earned for this lesson (may differ from max if retried)
    pointsEarned: {
      type: Number,
      default: 0,
    },

    // Time spent on this lesson in seconds
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const chapterProgressSchema = new mongoose.Schema(
  {
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    isUnlocked: {
      type: Boolean,
      default: false,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    unlockedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lessons: {
      type: [lessonProgressSchema],
      default: [],
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
      unique: true, // One progress document per child
    },

    chapters: {
      type: [chapterProgressSchema],
      default: [],
    },

    // Total time spent on the platform today in seconds
    // Reset at midnight
    todayTimeSeconds: {
      type: Number,
      default: 0,
    },

    // Date of the last time todayTimeSeconds was reset
    todayTimeDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;