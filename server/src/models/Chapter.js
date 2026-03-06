// A Chapter is the top-level story unit.
// Chapters 1-3 are free. Chapter 4+ requires premium.
// Each chapter maps to two coding stages (see platform overview).

import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    // Display order on the story map
    order: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },

    title: {
      type: String,
      required: [true, "Chapter title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Short description shown on the story map before unlocking
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    // The coding stage this chapter belongs to (1-5)
    // Stage 1: chapters 1-2, Stage 2: chapters 3-4, etc.
    codingStage: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Free chapters are 1, 2, 3 — premium required for 4+
    isPremium: {
      type: Boolean,
      default: false,
    },

    // Cloudinary URL for the chapter artwork shown on the story map
    coverImageUrl: {
      type: String,
      default: null,
    },

    // Story setting / world name for this chapter
    worldName: {
      type: String,
      trim: true,
      maxlength: [100, "World name cannot exceed 100 characters"],
      default: null,
    },

    // Total points a child can earn by completing all lessons in this chapter
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Whether this chapter is published and visible to kids
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Lessons are referenced here for ordering purposes
    // The actual lesson documents reference this chapter
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;