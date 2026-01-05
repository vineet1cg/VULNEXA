import mongoose from "mongoose";
import crypto from "crypto";

import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import { runCombinedAnalysis } from "../services/combinedAnalysis.service.js";

/* -------------------------------------------------- */
const ALLOWED_INPUT_TYPES = new Set(["code", "api", "sql", "config"]);
const MAX_CONTENT_LENGTH = 100_000;

const hashContent = (content) =>
  crypto.createHash("sha256").update(content).digest("hex");

/* ==================================================
 * POST /api/analyze
 * ================================================== */
export const analyzeCode = async (req, res) => {
  try {
    const { inputType, content, useAI = false } = req.body;
    const userId = req.userId;

    /* ---------- Auth ---------- */
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    /* ---------- Input Validation ---------- */
    if (!inputType || !content) {
      return res.status(400).json({
        success: false,
        message: "inputType and content are required",
      });
    }

    if (!ALLOWED_INPUT_TYPES.has(inputType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputType",
      });
    }

    if (typeof content !== "string" || content.length > MAX_CONTENT_LENGTH) {
      return res.status(413).json({
        success: false,
        message: "Content too large or invalid",
      });
    }

    /* ==================================================
     * SINGLE ORCHESTRATION CALL (AUTHORITATIVE)
     * ================================================== */
    const result = await runCombinedAnalysis({
      inputType,
      content,
      useAI,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    /* ---------- Persist Analysis ---------- */
    const analysis = await Analysis.create({
      userId,
      inputType,
      contentHash: hashContent(content),
      overallRiskScore: result.analysis.overallRiskScore,
      vulnerabilities: result.analysis.vulnerabilities,
      processingTime: result.analysis.processingTime || 0,
      analysisDate: new Date(),
    });

    await User.updateOne({ _id: userId }, { $inc: { analysisCount: 1 } });

    /* ---------- Response ---------- */
    return res.status(200).json({
      ...result,
      analysis: {
        ...result.analysis,
        id: analysis._id,
        inputType,
        analysisDate: analysis.analysisDate,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};
