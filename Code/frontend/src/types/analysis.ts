// ==================================================
// Shared enums & base types (BACKEND SOURCE OF TRUTH)
// ==================================================

export type InputType = "code" | "api" | "sql" | "config";

// Backend + DB canonical severity (DO NOT CHANGE CASING)
export type Severity = "Low" | "Medium" | "High" | "Critical";

// ==================================================
// Vulnerability (MERGED: OLD + NEW, BACKWARD SAFE)
// ==================================================

export interface Vulnerability {
  // Core identifiers
  id?: string;        // old frontend
  _id?: string;       // new frontend / Mongo
  name?: string;      // old engine
  type?: string;      // new engine

  // Classification
  severity: Severity;

  // Description & location
  description: string;
  location?: string;

  // Attacker / Defender views
  attackerLogic?: string;
  defenderLogic?: string;
  secureCodeFix?: string;

  // Advanced engine outputs
  simulatedPayload?: string;
  killChainStage?: string;

  impact?: {
    technical?: string;
    business?: string;
  };
}

// ==================================================
// Analyze request
// ==================================================

export interface AnalysisRequest {
  inputType: InputType;
  content: string;
}

// ==================================================
// Engine sub-structures (OLD FRONTEND SUPPORT)
// ==================================================

export interface AttackerView {
  abuseLogic: string;
}

export interface DefenderFix {
  secureFix: string;
  secureExample: string;
}

export interface SimulatedPayload {
  payloads: string[];
}

export interface ImpactAnalysis {
  killChainStage: string;
  technicalImpact: string;
  businessImpact: string;
}

// ==================================================
// Analyze response (MERGED SHAPE)
// ==================================================

export interface AnalysisResult {
  // Old frontend fields
  success?: boolean;
  overallRiskScore?: number;

  // Core (shared)
  riskScore: number;
  vulnerabilities: Vulnerability[];

  // Old engine outputs (optional, FIXES YOUR 8 ERRORS)
  attackerView?: AttackerView[];
  defenderFixes?: DefenderFix[];
  simulatedPayloads?: SimulatedPayload[];
  impactAnalysis?: ImpactAnalysis[];

  summary?: {
    total: number;
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };

  processingTime?: number;

  // New frontend / DB fields
  _id?: string;
  inputType?: InputType;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================================================
// History
// ==================================================

export interface AnalysisHistoryItem {
  id: string;
  inputType: InputType;
  overallRiskScore: number;
  vulnerabilityCount: number;
  analysisDate: string;
}

// ==================================================
// Dashboard
// ==================================================

export interface DashboardMetrics {
  totalScans: number;
  totalVulnerabilities: number;

  // Canonical backend casing
  severityDistribution: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };

  // Backend contract (plural + riskScore)
  riskTrends: {
    date: string;
    riskScore: number;
  }[];

  // Optional extended dashboard
  recentScans?: AnalysisResult[];
}

// ==================================================
// Ethics
// ==================================================

export interface EthicalNotice {
  title: string;
  content: string;
  lastUpdated: string;
}
