// A Lesson belongs to a Chapter and contains one or more Scenes
// followed by a coding Task.

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    // Display order within the chapter
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Brief description shown in the parent dashboard
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    // The Python concept this lesson teaches
    // Used by the AI to track concept mastery and detect regression
    concept: {
      type: String,
      required: [true, "Concept is required"],
      enum: [
        "variables",
        "strings",
        "integers",
        "booleans",
        "lists",
        "loops",
        "conditionals",
        "functions",
        "parameters",
        "return_values",
        "dictionaries",
        "classes",
        "objects",
      ],
    },

    // Ordered list of story scenes that play before the coding task
    scenes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scene",
      },
    ],

    // The single coding task for this lesson
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    // Points awarded for completing this lesson
    pointsReward: {
      type: Number,
      default: 10,
      min: 0,
    },

    // Estimated time to complete in minutes — shown to parent
    estimatedMinutes: {
      type: Number,
      default: 10,
      min: 1,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;