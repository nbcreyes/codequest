// Handles all parent authentication actions.
// Each function is an Express route handler.

import { Parent } from "../models/index.js";
import { signToken } from "../config/jwt.js";
import { generateSecureToken, hashToken } from "../utils/crypto.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email/emailService.js";

// ── Register ──────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if a parent with this email already exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Generate email verification token
    const { token, hashed } = generateSecureToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create the parent — password is hashed by the pre-save hook in the model
    const parent = await Parent.create({
      firstName,
      lastName,
      email,
      password,
      emailVerificationToken: hashed,
      emailVerificationExpires: expires,
    });

    // Send the verification email — plain token goes in the URL
    await sendVerificationEmail(email, firstName, token);

    res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify your account.",
      data: {
        id: parent._id,
        email: parent.email,
        firstName: parent.firstName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify Email ──────────────────────────────────────────────────────────

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hash the incoming token to compare with the stored hash
    const hashed = hashToken(token);

    const parent = await Parent.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!parent) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired.",
      });
    }

    // Mark the account as verified and clear the token
    parent.isEmailVerified = true;
    parent.emailVerificationToken = undefined;
    parent.emailVerificationExpires = undefined;
    await parent.save();

    // Issue a JWT so the parent is logged in immediately after verification
    const jwtToken = signToken(parent._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Welcome to CodeQuest!",
      data: {
        token: jwtToken,
        parent: {
          id: parent._id,
          email: parent.email,
          firstName: parent.firstName,
          lastName: parent.lastName,
          subscription: parent.subscription,
          children: parent.children,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Resend Verification Email ─────────────────────────────────────────────

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const parent = await Parent.findOne({ email })
      .select("+emailVerificationToken +emailVerificationExpires");

    // Always return success to prevent email enumeration
    if (!parent || parent.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered and unverified, a new link has been sent.",
      });
    }

    const { token, hashed } = generateSecureToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    parent.emailVerificationToken = hashed;
    parent.emailVerificationExpires = expires;
    await parent.save();

    await sendVerificationEmail(email, parent.firstName, token);

    res.status(200).json({
      success: true,
      message: "If that email is registered and unverified, a new link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch password explicitly — it is select: false in the schema
    const parent = await Parent.findOne({ email })
      .select("+password")
      .populate("children", "firstName username avatar currentStage");

    if (!parent) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await parent.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!parent.isActive) {
      return res.status(401).json({
        success: false,
        message: "This account has been deactivated.",
      });
    }

    if (!parent.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Update last login timestamp
    parent.lastLoginAt = new Date();
    await parent.save({ validateBeforeSave: false });

    const token = signToken(parent._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        token,
        parent: {
          id: parent._id,
          email: parent.email,
          firstName: parent.firstName,
          lastName: parent.lastName,
          subscription: parent.subscription,
          children: parent.children,
          lastLoginAt: parent.lastLoginAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Current Parent (me) ───────────────────────────────────────────────

export const getMe = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.parentId)
      .populate("children", "firstName username avatar currentStage points level streakDays");

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        parent: {
          id: parent._id,
          email: parent.email,
          firstName: parent.firstName,
          lastName: parent.lastName,
          subscription: parent.subscription,
          children: parent.children,
          createdAt: parent.createdAt,
          lastLoginAt: parent.lastLoginAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const parent = await Parent.findOne({ email });

    // Always return success to prevent email enumeration
    if (!parent) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, a password reset link has been sent.",
      });
    }

    const { token, hashed } = generateSecureToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    parent.passwordResetToken = hashed;
    parent.passwordResetExpires = expires;
    await parent.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(email, parent.firstName, token);

    res.status(200).json({
      success: true,
      message: "If that email is registered, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = hashToken(token);

    const parent = await Parent.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!parent) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired.",
      });
    }

    // Set the new password — pre-save hook will hash it
    parent.password = password;
    parent.passwordResetToken = undefined;
    parent.passwordResetExpires = undefined;
    await parent.save();

    // Issue a fresh JWT so the parent is logged in after resetting
    const jwtToken = signToken(parent._id);

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
      data: { token: jwtToken },
    });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by deleting the token.
// This endpoint exists so the client has a consistent API to call.

export const logout = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};