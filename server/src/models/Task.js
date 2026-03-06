// A Task is the coding challenge at the end of a Lesson.
// The structure of a task changes depending on the coding stage.

import mongoose from "mongoose";

// Stage 1: visual — kid interacts with visual only, code generates automatically
// Stage 2: fill_blank — kid types the missing word or value
// Stage 3: fix_bug — kid finds and fixes the deliberate mistake
// Stage 4: complete_code — kid writes the last few lines
// Stage 5: free_code — kid writes the full solution from scratch
const TASK_TYPES = ["visual", "fill_blank", "fix_bug", "complete_code", "free_code"];

const hintSchema = new mongoose.Schema(
  {
    // Order in which hints are revealed
    order: { type: Number, required: true },

    // The hint text shown to the kid
    text: { type: String, required: true, maxlength: 300 },

    // For stage 2 letter-by-letter hints, this is the answer being revealed
    isLetterHint: { type: Boolean, default: false },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    // Which stage type this task belongs to
    type: {
      type: String,
      enum: TASK_TYPES,
      required: true,
    },

    // The instruction shown to the kid above the coding area
    instruction: {
      type: String,
      required: [true, "Task instruction is required"],
      maxlength: [500, "Instruction cannot exceed 500 characters"],
    },

    // ── Stage 1 (visual) ────────────────────────────────────────────────
    // The visual metaphor component to render on the left panel
    visualMetaphor: {
      type: String,
      enum: [
        "variable",
        "string",
        "integer",
        "boolean",
        "list",
        "loop",
        "conditional",
        "function",
        "parameter",
        "return_value",
        "dictionary",
        "class",
        "object",
        null,
      ],
      default: null,
    },

    // Initial configuration passed to the visual metaphor component
    // Stored as flexible JSON since each metaphor has different props
    visualConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ── Stage 2 (fill_blank) ────────────────────────────────────────────
    // Code with blanks represented as __BLANK__ placeholders
    codeTemplate: {
      type: String,
      default: null,
    },

    // The correct values for each blank, in order
    blankAnswers: {
      type: [String],
      default: [],
    },

    // ── Stage 3 (fix_bug) ───────────────────────────────────────────────
    // The buggy code shown to the kid
    buggyCode: {
      type: String,
      default: null,
    },

    // The line number where the bug is located (1-indexed)
    bugLineNumber: {
      type: Number,
      default: null,
    },

    // ── Stage 4 (complete_code) ─────────────────────────────────────────
    // The starter code shown to the kid
    starterCode: {
      type: String,
      default: null,
    },

    // ── Stage 5 (free_code) ─────────────────────────────────────────────
    // No starter code — kid writes from scratch
    // The visual metaphor shows the concept but not the answer

    // ── Shared fields (all stages) ──────────────────────────────────────

    // The correct/expected Python code solution
    solutionCode: {
      type: String,
      required: [true, "Solution code is required"],
    },

    // The expected output when the solution code is executed
    // Used to validate the kid's submission via Judge0
    expectedOutput: {
      type: String,
      required: [true, "Expected output is required"],
    },

    // Ordered hints — shown progressively as the kid struggles
    hints: {
      type: [hintSchema],
      default: [],
    },

    // How many seconds before the first hint is offered
    hintDelaySeconds: {
      type: Number,
      default: 60,
    },

    // Difficulty rating 1-5 — used by the AI adaptation system
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    // Python concept tags — used for regression detection by the AI
    conceptTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export { TASK_TYPES };
export default Task;