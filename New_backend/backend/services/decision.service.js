// services/decision.service.js

/**
 * Decides analysis presentation mode.
 *
 * IMPORTANT:
 * - Static security engine ALWAYS runs
 * - AI is advisory-only and contextual
 * - There is NO AI-only analysis mode
 *
 * Modes:
 * - SECURITY_ONLY        → Engine results only
 * - SECURITY_PLUS_AI     → Engine + AI explanation
 */
export function decideAnalysisMode({ useAI = false, riskScore = 0 }) {
  // Explicit user opt-in for AI explanation
  if (useAI === true) {
    return "SECURITY_PLUS_AI";
  }

  // System-recommended AI explanation for high risk
  if (riskScore >= 80) {
    return "SECURITY_PLUS_AI";
  }

  // Default: deterministic engine only
  return "SECURITY_ONLY";
}
