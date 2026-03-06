// Badge definitions — these are the badge templates.
// ChildBadge (next model) records which badges a child has earned.

import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    // Internal identifier used in code
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },

    name: {
      type: String,
      required: [true, "Badge name is required"],
      trim: true,
      maxlength: [80, "Badge name cannot exceed 80 characters"],
    },

    description: {
      type: String,
      required: [true, "Badge description is required"],
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    // Cloudinary URL for the badge artwork
    imageUrl: {
      type: String,
      default: null,
    },

    // What triggers this badge to be awarded
    trigger: {
      type: String,
      enum: [
        "complete_chapter",      // Awarded when a chapter is completed
        "complete_stage",        // Awarded when a coding stage is completed
        "streak_days",           // Awarded for consecutive days
        "first_lesson",          // Awarded for completing the very first lesson
        "no_hints",              // Awarded for completing a task without hints
        "first_attempt",         // Awarded for getting a task right first try
        "speed_run",             // Awarded for completing a lesson under a time threshold
        "concept_mastery",       // Awarded when a concept reaches 90+ mastery score
        "remediation_complete",  // Awarded for finishing a remediation mini-lesson
        "custom",                // Admin-defined custom trigger
      ],
      required: true,
    },

    // The threshold value for the trigger
    // Examples: streak_days trigger needs threshold = 7 for a 7-day streak badge
    triggerThreshold: {
      type: Number,
      default: null,
    },

    // For concept_mastery and complete_chapter triggers — which one
    triggerReference: {
      type: String,
      default: null,
    },

    // Points awarded alongside this badge
    pointsReward: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Rarity affects visual treatment on the profile page
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "legendary"],
      default: "common",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;