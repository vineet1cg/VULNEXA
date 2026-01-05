// services/securityAnalysis.service.js
import securityEngine from "../security-engine/index.js";

export async function runSecurityAnalysis(code, language) {
  const result = await securityEngine.analyze(code, language);

  return {
    findings: result.findings || [],
    riskScore: result.riskScore || 0,
    summary: result.summary || "",
    breakdown: result.breakdown || {},
  };
}
