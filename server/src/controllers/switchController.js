// Handles child session switching and PIN management.

import { Parent, Child } from "../models/index.js";
import { signChildToken } from "../config/jwt.js";

// ── Switch to child session ───────────────────────────────────────────────

export const switchToChild = async (req, res, next) => {
  try {
    const { id: childId } = req.params;

    // Confirm this child belongs to the authenticated parent
    const child = await Child.findOne({
      _id: childId,
      parent: req.parentId,
      isActive: true,
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found.",
      });
    }

    // Check if the parent has a PIN set
    const parent = await Parent.findById(req.parentId).select("+profileSwitchPin");
    const pinIsSet = !!parent.profileSwitchPin;

    // If a PIN is set, the client must send it with the switch request
    if (pinIsSet) {
      const { pin } = req.body;

      if (!pin) {
        return res.status(403).json({
          success: false,
          message: "PIN required to switch profiles.",
          code: "PIN_REQUIRED",
        });
      }

      const pinMatch = await parent.comparePin(pin);
      if (!pinMatch) {
        return res.status(403).json({
          success: false,
          message: "Incorrect PIN.",
          code: "PIN_INCORRECT",
        });
      }
    }

    // Issue a child session token
    const childToken = signChildToken(req.parentId, child._id.toString());

    res.status(200).json({
      success: true,
      message: `Switched to ${child.firstName}'s profile.`,
      data: {
        childToken,
        child: {
          id: child._id,
          firstName: child.firstName,
          username: child.username,
          avatar: child.avatar,
          currentStage: child.currentStage,
          stageTitle: child.stageTitle,
          points: child.points,
          level: child.level,
          streakDays: child.streakDays,
          dailyTimeLimitMinutes: child.dailyTimeLimitMinutes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Set PIN ───────────────────────────────────────────────────────────────

export const setPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin || !/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN must be 4 to 6 digits.",
      });
    }

    const parent = await Parent.findById(req.parentId).select("+profileSwitchPin");

    // Setting profileSwitchPin will trigger the pre-save hook to hash it
    parent.profileSwitchPin = pin;
    await parent.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Profile switch PIN has been set.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify PIN ────────────────────────────────────────────────────────────
// Standalone PIN check — used by the frontend before showing the
// switch profile UI so it can confirm the PIN without switching yet.

export const verifyPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "PIN is required.",
      });
    }

    const parent = await Parent.findById(req.parentId).select("+profileSwitchPin");

    if (!parent.profileSwitchPin) {
      return res.status(400).json({
        success: false,
        message: "No PIN has been set for this account.",
      });
    }

    const pinMatch = await parent.comparePin(pin);

    if (!pinMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect PIN.",
        code: "PIN_INCORRECT",
      });
    }

    res.status(200).json({
      success: true,
      message: "PIN verified.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Remove PIN ────────────────────────────────────────────────────────────

export const removePin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "Please provide your current PIN to remove it.",
      });
    }

    const parent = await Parent.findById(req.parentId).select("+profileSwitchPin");

    if (!parent.profileSwitchPin) {
      return res.status(400).json({
        success: false,
        message: "No PIN has been set for this account.",
      });
    }

    const pinMatch = await parent.comparePin(pin);

    if (!pinMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect PIN.",
        code: "PIN_INCORRECT",
      });
    }

    parent.profileSwitchPin = null;
    await parent.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Profile switch PIN has been removed.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Check PIN status ──────────────────────────────────────────────────────
// Lets the frontend know whether a PIN is set so it can show or hide
// the PIN entry UI without exposing the PIN itself.

export const getPinStatus = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.parentId).select("+profileSwitchPin");

    res.status(200).json({
      success: true,
      data: {
        pinIsSet: !!parent.profileSwitchPin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get current child session ─────────────────────────────────────────────
// Called by the kid experience on load to confirm the session is still valid
// and get the latest child data.

export const getCurrentChildSession = async (req, res, next) => {
  try {
    const child = await Child.findById(req.childId);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child session is no longer valid.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        child: {
          id: child._id,
          firstName: child.firstName,
          username: child.username,
          avatar: child.avatar,
          currentStage: child.currentStage,
          stageTitle: child.stageTitle,
          points: child.points,
          level: child.level,
          streakDays: child.streakDays,
          dailyTimeLimitMinutes: child.dailyTimeLimitMinutes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};