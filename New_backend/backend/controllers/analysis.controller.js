import mongoose from "mongoose";
import crypto from "crypto";

import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import { runCombinedAnalysis } from "../services/combinedAnalysis.service.js";

/* --------------------------------------------------
 * Constants
 * -------------------------------------------------- */
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
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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

    await User.updateOne(
      { _id: userId },
      { $inc: { analysisCount: 1 } }
    );

    /* ---------- Response ---------- */
    return res.status(200).json({
      success: true,
      mode: result.mode,
      analysis: {
        id: analysis._id,
        inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        processingTime: analysis.processingTime,
        analysisDate: analysis.analysisDate,
      },
      ai: result.ai,
      ethics: result.ethics,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Analysis failed",
    });
  }
};

/* ==================================================
 * GET /api/analyze/history
 * ================================================== */
export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find({ userId })
        .sort({ analysisDate: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      Analysis.countDocuments({ userId }),
    ]);

    return res.json({
      success: true,
      analyses: analyses.map((a) => ({
        id: a._id,
        inputType: a.inputType,
        overallRiskScore: a.overallRiskScore,
        vulnerabilityCount: a.vulnerabilities?.length || 0,
        analysisDate: a.analysisDate,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis history",
    });
  }
};

/* ==================================================
 * GET /api/analyze/:id
 * ================================================== */
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    const analysis = await Analysis.findOne({
      _id: id,
      userId,
    }).lean();

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.json({
      success: true,
      analysis: {
        id: analysis._id,
        inputType: analysis.inputType,
        overallRiskScore: analysis.overallRiskScore,
        vulnerabilities: analysis.vulnerabilities,
        analysisDate: analysis.analysisDate,
        processingTime: analysis.processingTime,
      },
    });
  } catch (error) {
    console.error("Fetch analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis",
    });
  }
};
