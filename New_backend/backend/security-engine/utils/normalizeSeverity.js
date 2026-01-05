/**
 * NORMALIZE SEVERITY (ENGINE → DB)
 * --------------------------------
 * Converts internal engine severities (ALL CAPS)
 * into DB- and dashboard-safe enums.
 *
 * ENGINE: CRITICAL | HIGH | MEDIUM | LOW
 * DB/UI:  Critical | High | Medium | Low
 */

export function normalizeSeverity(severity) {
  switch (severity) {
    case "CRITICAL":
      return "Critical";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return "Low";
  }
}
