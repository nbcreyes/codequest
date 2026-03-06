// A Scene is a single story dialogue beat within a Lesson.
// Kids click through scenes before reaching the coding task.

import mongoose from "mongoose";

// Who can speak in a scene
const SPEAKER_TYPES = ["narrator", "character", "mentor", "villain", "kid"];

const sceneSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    // Display order within the lesson
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    // Who is speaking
    speaker: {
      type: String,
      enum: SPEAKER_TYPES,
      required: true,
    },

    // The name displayed above the dialogue bubble
    speakerName: {
      type: String,
      trim: true,
      maxlength: [50, "Speaker name cannot exceed 50 characters"],
      default: null,
    },

    // The dialogue text shown in the speech bubble
    dialogue: {
      type: String,
      required: [true, "Dialogue text is required"],
      maxlength: [500, "Dialogue cannot exceed 500 characters"],
    },

    // Cloudinary URL for the character illustration shown in this scene
    characterImageUrl: {
      type: String,
      default: null,
    },

    // Background scene illustration
    backgroundImageUrl: {
      type: String,
      default: null,
    },

    // Optional: emotion/expression variant for the character sprite
    // Used by the animation system to pick the right sprite frame
    emotion: {
      type: String,
      enum: ["neutral", "happy", "excited", "thinking", "surprised", "worried"],
      default: "neutral",
    },

    // Whether there is a transition animation before this scene appears
    transitionEffect: {
      type: String,
      enum: ["none", "fade", "slide_left", "slide_right", "zoom"],
      default: "fade",
    },
  },
  {
    timestamps: true,
  }
);

const Scene = mongoose.model("Scene", sceneSchema);

export { SPEAKER_TYPES };
export default Scene;