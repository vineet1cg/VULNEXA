import type { Severity } from "../types/analysis";

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const getSeverityStyles = (severity: Severity) => {
    switch (severity) {
      case "LOW":
        return "bg-green-100 text-green-800 border-green-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityStyles(
        severity
      )}`}
    >
      {severity}
    </span>
  );
};
