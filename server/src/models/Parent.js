// Parent is the real account holder.
// Kids never have their own accounts — COPPA compliance.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const parentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // Never return password in queries by default
      select: false,
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    // Email must be verified before the parent can use the platform
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Token sent in the verification email
    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // Password reset flow
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // Subscription — free allows 3 chapters, premium unlocks all
    subscription: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    // References to all child profiles under this parent account
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
      },
    ],

    // Optional PIN the parent sets to switch between child profiles on the same device
    profileSwitchPin: {
      type: String,
      select: false,
      default: null,
    },

    // Tracks last login for session management
    lastLoginAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Hooks ─────────────────────────────────────────────────────────────────

// Hash the password before saving if it was modified
parentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Hash the PIN before saving if it was modified
parentSchema.pre("save", async function (next) {
  if (!this.isModified("profileSwitchPin")) return next();
  if (!this.profileSwitchPin) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.profileSwitchPin = await bcrypt.hash(this.profileSwitchPin, saltRounds);
  next();
});

// ── Instance methods ──────────────────────────────────────────────────────

// Compare a plain text password against the stored hash
parentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare a plain text PIN against the stored hash
parentSchema.methods.comparePin = async function (candidatePin) {
  return bcrypt.compare(candidatePin, this.profileSwitchPin);
};

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;