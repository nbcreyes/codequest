// Handles MongoDB connection via Mongoose.
// Called once at server startup from src/index.js.

import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options prevent deprecation warnings and ensure
      // stable connection behavior in production
      dbName: "codequest",
    });

    console.warn(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Exit the process — the server is useless without a database
    process.exit(1);
  }
};

// Graceful shutdown — close the connection when the Node process ends
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.warn("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDatabase;