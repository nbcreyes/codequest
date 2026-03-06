// Code execution route — proxies to Judge0 API.
// Full implementation in Step 12. This stub returns mock output
// so the lesson UI works end to end before Judge0 is wired.

import { Router } from "express";
import { requireChildSession } from "../middleware/auth.js";

const router = Router();

router.post("/", requireChildSession, async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "No code provided.",
      });
    }

    // Stub — simulate execution delay and return mock output
    // Replace with real Judge0 call in Step 12
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple simulation: find print statements and echo their arguments
    const printMatches = [...code.matchAll(/print\(([^)]+)\)/g)];
    const mockOutput = printMatches
      .map((m) => m[1].replace(/['"]/g, ""))
      .join("\n") || "Code executed successfully";

    res.status(200).json({
      success: true,
      data: {
        output: mockOutput,
        error: null,
        isError: false,
        executionTime: 0.8,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;