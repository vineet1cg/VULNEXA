import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisApi } from "../api/analysis";
import type {
  AnalysisHistoryItem,
  AnalysisResult,
} from "../types/analysis";
import { EthicalBanner } from "../components/EthicalBanner";
import { RiskMeter } from "../components/RiskMeter";
import { VulnerabilityCard } from "../components/VulnerabilityCard";

/**
 * HistoryPage
 *
 * CRITICAL RULE:
 * - History list uses AnalysisHistoryItem (summary)
 * - Selected analysis uses AnalysisResult (full)
 * - NEVER mix these two shapes
 */

const HistoryPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // -----------------------------
  // State
  // -----------------------------

  // Summary list from /api/analyze/history
  const [history, setHistory] =
    useState<AnalysisHistoryItem[]>([]);

  // Full analysis from /api/analyze/:id
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Load history (SUMMARY ONLY)
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await analysisApi.getHistory();
        setHistory(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load analysis history"
        );
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // -----------------------------
  // Load full analysis on click
  // -----------------------------
  const loadAnalysis = async (id: string) => {
    try {
      setLoadingAnalysis(true);
      const analysis =
        await analysisApi.getAnalysisById(id);
      setSelectedAnalysis(analysis);
    } catch (err) {
      console.error("Failed to load analysis", err);
      setError("Failed to load selected analysis");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // -----------------------------
  // Auth / navigation
  // -----------------------------
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -----------------------------
  // Initial loading
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analysis History
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.name}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              New Analysis
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <EthicalBanner />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ==================================================
              HISTORY LIST (SUMMARY)
             ================================================== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">
                Past Analyses ({history.length})
              </h2>

              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No analysis history found
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.map((analysis) => (
                    <button
                      key={analysis.id}
                      onClick={() =>
                        loadAnalysis(analysis.id)
                      }
                      className="w-full text-left p-3 rounded border bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {analysis.inputType.toUpperCase()}
                        </span>

                        <span className="text-xs text-gray-500">
                          {new Date(
                            analysis.analysisDate
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600">
                        Risk: {analysis.overallRiskScore}/100 •
                        Vulns: {analysis.vulnerabilityCount}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              SELECTED ANALYSIS (FULL OBJECT)
             ================================================== */}
          <div className="lg:col-span-2">
            {loadingAnalysis ? (
              <div className="bg-white p-12 rounded shadow text-center">
                Loading analysis…
              </div>
            ) : selectedAnalysis ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-semibold">
                      Analysis Details
                    </h2>
                    {selectedAnalysis.createdAt && (
                      <span className="text-sm text-gray-500">
                        {new Date(
                          selectedAnalysis.createdAt
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <RiskMeter
                    riskScore={
                      selectedAnalysis.overallRiskScore ??
                      selectedAnalysis.riskScore
                    }
                  />
                </div>

                <h3 className="text-lg font-semibold mb-4">
                  Vulnerabilities (
                  {selectedAnalysis.vulnerabilities.length})
                </h3>

                {selectedAnalysis.vulnerabilities.length ===
                0 ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
                    No vulnerabilities detected.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedAnalysis.vulnerabilities.map(
                      (vuln, index) => (
                        <VulnerabilityCard
                          key={String(
                            vuln.id ??
                              vuln._id ??
                              index
                          )}
                          vulnerability={vuln}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center text-gray-500">
                Select an analysis from the list to view
                details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
