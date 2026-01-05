import { SEVERITY_WEIGHTS } from "./utils/constants.js";
import { normalizeSeverity } from "./utils/normalizeSeverity.js";

/**
 * RISK ENGINE
 * -----------
 * Produces a normalized risk score (0–100)
 * based on severity-weighted findings.
 */

export function calculateRiskScore(vulnerabilities = []) {
  if (!Array.isArray(vulnerabilities) || vulnerabilities.length === 0) {
    return 0;
  }

  const totalWeight = vulnerabilities.reduce((sum, vuln) => {
    // Normalize severity to ensure it matches specific casing in SEVERITY_WEIGHTS (e.g. "CRITICAL" -> "Critical")
    const safeSeverity = normalizeSeverity(vuln?.severity);
    const weight = SEVERITY_WEIGHTS[safeSeverity] || 0;
    return sum + weight;
  }, 0);

  /**
   * Normalization:
   * - Prevents instant saturation
   * - Keeps score proportional
   * - Still rewards severity
   */
  const maxPossible =
    vulnerabilities.length * SEVERITY_WEIGHTS.Critical;

  const normalizedScore = (totalWeight / maxPossible) * 100;

  return Math.min(Math.round(normalizedScore), 100);
}
