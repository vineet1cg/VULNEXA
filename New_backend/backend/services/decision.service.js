// services/decision.service.js

/**
 * Decides which analysis mode to use.
 *
 * SECURITY_ONLY       → Deterministic engine only
 * AI_ONLY             → AI explanation only (manual override)
 * SECURITY_PLUS_AI    → Engine detection + AI reasoning (high risk)
 */
export function decideAnalysisMode({ useAI = false, riskScore = 0 }) {
  if (useAI === true) return "AI_ONLY";

  if (riskScore >= 80) return "SECURITY_PLUS_AI";

  return "SECURITY_ONLY";
}
