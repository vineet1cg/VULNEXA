// services/decision.service.js
export function decideAnalysisMode({ useAI, riskScore }) {
  if (useAI === true) return "AI_ONLY";
  if (riskScore >= 80) return "SECURITY_PLUS_AI";
  return "SECURITY_ONLY";
}
