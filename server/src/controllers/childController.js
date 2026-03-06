// Handles all child profile CRUD operations.
// All routes here require the parent to be authenticated.
// A parent can only access their own children.

import { Child, Parent, Progress, LearningProfile } from "../models/index.js";

// ── Create Child ──────────────────────────────────────────────────────────

export const createChild = async (req, res, next) => {
  try {
    const { firstName, username, age, avatar, dailyTimeLimitMinutes } = req.body;

    // Check how many children this parent already has
    const parent = await Parent.findById(req.parentId).select("children subscription");

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent account not found.",
      });
    }

    // Cap at 10 child profiles per account
    if (parent.children.length >= 10) {
      return res.status(400).json({
        success: false,
        message: "You can have a maximum of 10 child profiles per account.",
      });
    }

    // Check username uniqueness across all children on the platform
    const existingUsername = await Child.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "That username is already taken. Please choose a different one.",
      });
    }

    // Create the child profile
    const child = await Child.create({
      parent: req.parentId,
      firstName,
      username,
      age,
      avatar,
      dailyTimeLimitMinutes: dailyTimeLimitMinutes ?? 60,
    });

    // Auto-create a Progress document for this child so it is ready when
    // lessons start — no need to create it on the fly later
    await Progress.create({
      child: child._id,
      chapters: [],
      todayTimeSeconds: 0,
      todayTimeDate: new Date(),
    });

    // Auto-create a LearningProfile document for the AI personalization layer
    await LearningProfile.create({
      child: child._id,
      attempts: [],
      conceptMastery: [],
    });

    // Add the child reference to the parent's children array
    parent.children.push(child._id);
    await parent.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: `${firstName}'s profile has been created.`,
      data: { child },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get All Children for Parent ───────────────────────────────────────────

export const getChildren = async (req, res, next) => {
  try {
    const children = await Child.find({
      parent: req.parentId,
      isActive: true,
    }).select("-__v");

    res.status(200).json({
      success: true,
      data: { children },
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Child ──────────────────────────────────────────────────────

export const getChild = async (req, res, next) => {
  try {
    const child = await Child.findOne({
      _id: req.params.id,
      parent: req.parentId,
      isActive: true,
    }).select("-__v");

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: { child },
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Child ──────────────────────────────────────────────────────────

export const updateChild = async (req, res, next) => {
  try {
    // Only allow these fields to be updated — never username, parent, or stage
    const allowedFields = ["firstName", "age", "avatar", "dailyTimeLimitMinutes"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const child = await Child.findOneAndUpdate(
      {
        _id: req.params.id,
        parent: req.parentId,
        isActive: true,
      },
      updates,
      {
        new: true,          // Return the updated document
        runValidators: true, // Run schema validators on the updated fields
      }
    ).select("-__v");

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `${child.firstName}'s profile has been updated.`,
      data: { child },
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete Child (soft delete) ────────────────────────────────────────────
// We soft delete by setting isActive to false.
// This preserves the child's learning history for the parent's records.

export const deleteChild = async (req, res, next) => {
  try {
    const child = await Child.findOneAndUpdate(
      {
        _id: req.params.id,
        parent: req.parentId,
        isActive: true,
      },
      { isActive: false },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child profile not found.",
      });
    }

    // Remove the child reference from the parent's children array
    await Parent.findByIdAndUpdate(req.parentId, {
      $pull: { children: child._id },
    });

    res.status(200).json({
      success: true,
      message: `${child.firstName}'s profile has been removed.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Avatar Options ────────────────────────────────────────────────────
// Public-ish endpoint — returns the list of valid avatar keys
// so the frontend can render the avatar selection UI dynamically.

export const getAvatarOptions = async (_req, res) => {
  const { AVATAR_OPTIONS } = await import("../models/Child.js");

  res.status(200).json({
    success: true,
    data: { avatars: AVATAR_OPTIONS },
  });
};