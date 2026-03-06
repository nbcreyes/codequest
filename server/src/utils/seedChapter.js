// Run this once to insert a test chapter into your database.
// Usage: node src/utils/seedChapter.js
// Delete the chapter from MongoDB Atlas if you want to reseed.

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Chapter } from "../models/index.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "codequest" });

  const existing = await Chapter.findOne({ order: 1 });
  if (existing) {
    console.warn("Chapter 1 already exists. Skipping seed.");
    process.exit(0);
  }

  await Chapter.create({
    order: 1,
    title: "The Lost Variables",
    description: "Learn the magic of variables and bring light back to the kingdom.",
    codingStage: 1,
    isPremium: false,
    worldName: "The Crystal Caves",
    totalPoints: 100,
    isPublished: true,
  });

  console.warn("Chapter 1 seeded successfully.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});