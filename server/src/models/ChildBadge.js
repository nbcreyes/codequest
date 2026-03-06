// Records which badges a child has earned and when.
// Separate from Badge so badge definitions can be updated
// without affecting a child's earned history.

import mongoose from "mongoose";

const childBadgeSchema = new mongoose.Schema(
  {
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },

    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },

    earnedAt: {
      type: Date,
      default: Date.now,
    },

    // Context snapshot at time of earning — useful for display and analytics
    context: {
      // The lesson or chapter that triggered the award, if applicable
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        default: null,
      },
      chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        default: null,
      },
      // Description of what the kid did to earn it
      triggerDescription: {
        type: String,
        default: null,
        maxlength: 200,
      },
    },

    // Whether the kid has seen the badge award animation yet
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// A child can only earn each badge once
childBadgeSchema.index({ child: 1, badge: 1 }, { unique: true });

const ChildBadge = mongoose.model("ChildBadge", childBadgeSchema);

export default ChildBadge;