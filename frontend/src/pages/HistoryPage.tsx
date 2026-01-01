import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisApi } from "../api/analysis";
import type { AnalysisHistoryItem, AnalysisResult } from "../types/analysis";
import { EthicalBanner } from "../components/EthicalBanner";
import { RiskMeter } from "../components/RiskMeter";
import { VulnerabilityCard } from "../components/VulnerabilityCard";
import "./DashboardAnimations.css"; // Reuse the animations file

const HistoryPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // -----------------------------
  // State
  // -----------------------------
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Track ID for UI highlighting
  
  const [loading, setLoading] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Load history
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await analysisApi.getHistory();
        setHistory(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load analysis history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // -----------------------------
  // Load full analysis
  // -----------------------------
  const loadAnalysis = async (id: string) => {
    try {
      setSelectedId(id); // Set active state immediately for UI feedback
      setLoadingAnalysis(true);
      const analysis = await analysisApi.getAnalysisById(id);
      setSelectedAnalysis(analysis);
    } catch (err) {
      console.error("Failed to load analysis", err);
      setError("Failed to load selected analysis");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 bg-noise-subtle">
      
      {/* 1. Sticky Glass Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 status-beacon-pulse">
                <span className="text-white font-bold text-lg">V</span>
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analysis History</h1>
             </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-all btn-magnetic"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-magnetic"
            >
              New Analysis
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-slate-500 hover:text-red-600 font-medium transition-colors btn-magnetic"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="frosted-divider"></div>
      </header>

      {/* 2. Main Content - Staggered Entry */}
      <main className="max-w-7xl mx-auto px-6 py-8 stagger-container">
        
        <div className="mb-8 hover:scale-[1.01] transition-transform duration-300">
           <EthicalBanner />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm flex items-center justify-between animate-pulse">
            {error}
          </div>
        )}

        {loading ? (
           // 3. Skeleton Loading State
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-[500px] rounded-xl skeleton-shimmer"></div>
              <div className="lg:col-span-2 h-[500px] rounded-xl skeleton-shimmer"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ==================================================
                HISTORY LIST (SUMMARY)
               ================================================== */}
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-xl border border-white/60 p-4 h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">
                  Past Analyses <span className="text-slate-400 font-normal text-sm ml-1">({history.length})</span>
                </h2>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    No analysis history found
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {history.map((analysis) => {
                       const isSelected = selectedId === analysis.id;
                       return (
                        <button
                          key={analysis.id}
                          onClick={() => loadAnalysis(analysis.id)}
                          className={`
                            w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                            ${isSelected 
                               ? "bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-400 scale-[1.02]" 
                               : "bg-white/50 border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
                            }
                          `}
                        >
                          {/* Accent Border Reveal (Vertical on Left for active) */}
                          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                          
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                              {analysis.inputType}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {new Date(analysis.analysisDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="text-sm font-semibold text-slate-700">
                                Risk Score
                             </div>
                             <div className={`text-xl font-bold ${
                                analysis.overallRiskScore > 70 ? "text-red-500" : 
                                analysis.overallRiskScore > 40 ? "text-amber-500" : "text-emerald-500"
                             }`}>
                                {analysis.overallRiskScore}
                             </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             {analysis.vulnerabilityCount} Vulnerabilities
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ==================================================
                SELECTED ANALYSIS (FULL OBJECT)
               ================================================== */}
            <div className="lg:col-span-2">
              {loadingAnalysis ? (
                 <div className="glass-panel p-8 rounded-xl h-full flex flex-col gap-6">
                    <div className="h-8 w-1/3 rounded bg-slate-200 animate-pulse"></div>
                    <div className="h-32 w-full rounded bg-slate-100 skeleton-shimmer"></div>
                    <div className="space-y-4">
                        <div className="h-20 w-full rounded bg-slate-100 skeleton-shimmer"></div>
                        <div className="h-20 w-full rounded bg-slate-100 skeleton-shimmer"></div>
                    </div>
                 </div>
              ) : selectedAnalysis ? (
                // 4. Detail Panel Entry Animation
                <div className="glass-panel rounded-xl border border-white/60 p-6 animate-[fadeInUp_0.4s_ease-out] shadow-xl shadow-slate-200/50">
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Analysis Report</h2>
                        {selectedAnalysis.createdAt && (
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-indigo-500 status-beacon-pulse"></span>
                             Generated on {new Date(selectedAnalysis.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-500 uppercase tracking-wide text-center">Risk Level</p>
                          <RiskMeter
                            riskScore={selectedAnalysis.overallRiskScore ?? selectedAnalysis.riskScore}
                          />
                      </div>
                    </div>
                  </div>

                  <div>
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Detected Vulnerabilities
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{selectedAnalysis.vulnerabilities.length}</span>
                     </h3>

                     {selectedAnalysis.vulnerabilities.length === 0 ? (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-3">
                           <div className="bg-green-100 p-2 rounded-full">
                               <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div>
                              <p className="font-semibold">System Secure</p>
                              <p className="text-sm opacity-80">No vulnerabilities were detected in this scan.</p>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {/* 5. Vulnerability Cards with Hover Lift */}
                           {selectedAnalysis.vulnerabilities.map((vuln, index) => (
                              <div key={index} className="card-hover-effect bg-white rounded-lg border border-slate-100 shadow-sm transition-all duration-300">
                                 <VulnerabilityCard
                                    vulnerability={vuln}
                                 />
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-xl border border-white/60 p-12 text-center h-full flex flex-col items-center justify-center text-slate-400">
                   <div className="bg-slate-50 p-4 rounded-full mb-4">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                   </div>
                   <p className="font-medium">Select an analysis from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;