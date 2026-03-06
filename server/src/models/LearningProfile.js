// Stores the full per-child learning data used by the AI personalization layer.
// This is the richest model — it tracks everything the AI needs to adapt,
// hint, detect confusion, and trigger remediation.

import mongoose from "mongoose";

// A single attempt at a task
const attemptSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    // The code the child submitted
    submittedCode: {
      type: String,
      default: "",
    },

    // Whether this attempt was correct
    isCorrect: {
      type: Boolean,
      required: true,
    },

    // The actual output returned by Judge0
    actualOutput: {
      type: String,
      default: "",
    },

    // What kind of error was made (if any)
    errorType: {
      type: String,
      enum: ["none", "syntax", "logic", "conceptual", "incomplete", "runtime"],
      default: "none",
    },

    // The raw error message from Judge0 if there was one
    errorMessage: {
      type: String,
      default: null,
    },

    // How many seconds elapsed between the previous attempt and this one
    timeSincePreviousAttemptSeconds: {
      type: Number,
      default: 0,
    },

    // How many hints had been revealed before this attempt
    hintsUsedCount: {
      type: Number,
      default: 0,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Per-concept mastery tracking
const conceptMasterySchema = new mongoose.Schema(
  {
    concept: {
      type: String,
      required: true,
    },

    // How many tasks involving this concept the child has attempted
    tasksAttempted: { type: Number, default: 0 },

    // How many they got correct on first attempt
    firstAttemptCorrect: { type: Number, default: 0 },

    // Total attempts across all tasks for this concept
    totalAttempts: { type: Number, default: 0 },

    // Average time spent per task for this concept (seconds)
    avgTimeSeconds: { type: Number, default: 0 },

    // Mastery score 0-100 calculated by the AI service
    masteryScore: { type: Number, default: 0, min: 0, max: 100 },

    // Whether the AI has flagged this concept as a weak area
    isFlagged: { type: Boolean, default: false },

    // Whether the AI has inserted a remediation lesson for this concept
    remediationInserted: { type: Boolean, default: false },

    lastAttemptedAt: { type: Date, default: null },
  },
  { _id: false }
);

const learningProfileSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
      unique: true, // One learning profile per child
    },

    // Full history of every task attempt
    attempts: {
      type: [attemptSchema],
      default: [],
    },

    // Per-concept mastery data
    conceptMastery: {
      type: [conceptMasterySchema],
      default: [],
    },

    // Current difficulty multiplier set by the AI (0.5 = easier, 1.5 = harder)
    difficultyMultiplier: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0,
    },

    // Consecutive correct first-attempt answers — used to increase difficulty
    consecutiveSuccesses: {
      type: Number,
      default: 0,
    },

    // Consecutive failures — used to decrease difficulty
    consecutiveFailures: {
      type: Number,
      default: 0,
    },

    // Whether the child is currently in a confusion state
    // Set to true when stuck threshold is exceeded
    isConfused: {
      type: Boolean,
      default: false,
    },

    // Timestamp when confusion was last detected
    confusionDetectedAt: {
      type: Date,
      default: null,
    },

    // Which concepts the AI has flagged for remediation
    flaggedConcepts: {
      type: [String],
      default: [],
    },

    // Preferred learning patterns detected by AI
    // Example: "responds well to visual hints", "benefits from extra time"
    aiNotes: {
      type: String,
      default: null,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const LearningProfile = mongoose.model("LearningProfile", learningProfileSchema);

export default LearningProfile;