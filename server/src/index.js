import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
connectDatabase();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", project: "CodeQuest", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.warn(`CodeQuest server running on port ${PORT}`);
});

export default app;