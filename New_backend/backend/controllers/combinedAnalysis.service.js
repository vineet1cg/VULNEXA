/**
 * COMBINED ANALYSIS SERVICE
 * =========================
 * Supports:
 * 1) SECURITY_ONLY   → Ethical static engine
 * 2) AI_ONLY         → LLM advisory analysis
 * 3) SECURITY_PLUS_AI → Engine + AI advisory
 *
 * This file does NOT execute code or attacks.
 * AI output is advisory-only and non-persistent.
 */

import { analyzeInput } from "../security-engine/index.js";
import { calculateRiskScore } from "../security-engine/riskEngine.js";
import { normalizeSeverity } from "../security-engine/utils/normalizeSeverity.js";

import { runAIAnalysis } from "./aiAnalysis.service.js";
import { decideAnalysisMode } from "./decision.service.js";

/* ---------------------------------------------
 * Main executor
 * --------------------------------------------- */
export async function runCombinedAnalysis({
  inputType,
  content,
  language,
  useAI = false,
}) {
  /* ==================================================
   * STEP 1: Run SECURITY ENGINE (always first)
   * ================================================== */
  const engineResult = analyzeInput({
    inputType,
    content,
    language,
  });

  if (!engineResult || engineResult.error) {
    return {
      success: false,
      error: engineResult?.error || "Security analysis failed",
    };
  }

  const {
    vulnerabilities = [],
    attackerView = [],
    defenderFixes = [],
    payloads = [],
    impactAnalysis = [],
    processingTime = 0,
  } = engineResult;

  /* ==================================================
   * STEP 2: Normalize vulnerabilities
   * ================================================== */
  const normalizedVulnerabilities = vulnerabilities.map((v, i) => ({
    id: `vuln-${Date.now()}-${i}`,
    name: v.type,
    severity: normalizeSeverity(v.severity),
    description: v.description,
    attackerLogic: attackerView[i]?.abuseLogic || null,
    defenderLogic: defenderFixes[i]?.secureFix || null,
    secureCodeFix: defenderFixes[i]?.secureExample || null,
    simulatedPayload: payloads?.[i] || null,
    impact: impactAnalysis?.[i] || null,
  }));

  /* ==================================================
   * STEP 3: Risk score (authoritative)
   * ================================================== */
  const overallRiskScore = calculateRiskScore(
    normalizedVulnerabilities
  );

  /* ==================================================
   * STEP 4: Decide analysis mode
   * ================================================== */
  const mode = decideAnalysisMode({
    useAI,
    riskScore: overallRiskScore,
  });

  /* ==================================================
   * STEP 5: Optional AI advisory
   * ================================================== */
  let aiAdvisory = null;

  if (mode === "AI_ONLY" || mode === "SECURITY_PLUS_AI") {
    aiAdvisory = await runAIAnalysis({
      code: content,
      language: inputType,
      findings: normalizedVulnerabilities,
    });
  }

  /* ==================================================
   * STEP 6: Final response
   * ================================================== */
  return {
    success: true,
    mode,

    security: {
      enabled: true,
      vulnerabilities: normalizedVulnerabilities,
      overallRiskScore,
      processingTime,
    },

    ai: aiAdvisory
      ? {
          enabled: true,
          advisoryOnly: true,
          message: aiAdvisory,
        }
      : {
          enabled: false,
        },

    ethics: {
      staticAnalysisOnly: true,
      noExecution: true,
      aiAdvisoryOnly: true,
    },
  };
}
