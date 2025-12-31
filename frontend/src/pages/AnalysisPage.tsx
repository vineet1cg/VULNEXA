import { useState } from "react";
import type { AnalysisResult, Vulnerability } from "../types/analysis";
import { analysisApi } from "../api/analysis";
import { RiskMeter } from "../components/RiskMeter";
import { VulnerabilityCard } from "../components/VulnerabilityCard";
import { EthicalBanner } from "../components/EthicalBanner";

type InputType = "code" | "api" | "sql" | "config";

const AnalysisPage = () => {
  const [inputType, setInputType] = useState<InputType>("code");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("Please enter content to analyze");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analysisApi.analyze({
        inputType,
        content: content.trim(),
      });

      setResult(analysisResult);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Analysis failed. Please try again."
      );
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Helper: merge engine outputs
  // -----------------------------
  const buildMergedVulnerability = (
    vuln: Vulnerability,
    index: number,
    result: AnalysisResult
  ): Vulnerability => {
    return {
      ...vuln,

      // Old engine-derived fields (optional & safe)
      attackerLogic:
        vuln.attackerLogic ??
        result.attackerView?.[index]?.abuseLogic,

      defenderLogic:
        vuln.defenderLogic ??
        result.defenderFixes?.[index]?.secureFix,

      secureCodeFix:
        vuln.secureCodeFix ??
        result.defenderFixes?.[index]?.secureExample,

      simulatedPayload:
        vuln.simulatedPayload ??
        result.simulatedPayloads?.[index]?.payloads?.join("\n"),

      killChainStage:
        vuln.killChainStage ??
        result.impactAnalysis?.[index]?.killChainStage,

      impact: vuln.impact ?? {
        technical:
          result.impactAnalysis?.[index]?.technicalImpact,
        business:
          result.impactAnalysis?.[index]?.businessImpact,
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EthicalBanner />

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security Analysis Workspace
          </h1>
          <p className="text-gray-600">
            Analyze code, API endpoints, SQL queries, or configuration files
            for security vulnerabilities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* INPUT */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Input
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Type
              </label>
              <select
                value={inputType}
                onChange={(e) =>
                  setInputType(e.target.value as InputType)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="code">Code</option>
                <option value="api">API Endpoint</option>
                <option value="sql">SQL Query</option>
                <option value="config">Configuration File</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to Analyze
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder={`Enter your ${inputType} here...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Security"}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RESULTS */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analysis Results
            </h2>

            {!result && !loading && (
              <div className="text-center py-12 text-gray-500">
                Enter content and click “Analyze Security”
              </div>
            )}

            {loading && (
              <div className="text-center py-12 text-gray-600">
                Analyzing security vulnerabilities...
              </div>
            )}

            {result && (
              <div>
                {/* Risk Meter */}
                <div className="mb-6">
                  <RiskMeter
                    riskScore={
                      result.overallRiskScore ?? result.riskScore
                    }
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Vulnerabilities Found:{" "}
                  {result.vulnerabilities?.length ?? 0}
                </h3>

                {(result.vulnerabilities ?? []).length === 0 ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
                    No vulnerabilities detected.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {(result.vulnerabilities ?? []).map(
                      (vuln, index) => (
                        <VulnerabilityCard
                          key={vuln.id ?? vuln._id ?? index}
                          vulnerability={buildMergedVulnerability(
                            vuln,
                            index,
                            result
                          )}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
