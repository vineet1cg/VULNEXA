import api from "./axios";
import type {
  AnalysisRequest,
  AnalysisResult,
  AnalysisHistoryItem,
  DashboardMetrics,
} from "../types/analysis";

export const analysisApi = {
  // -----------------------------
  // POST /api/analyze
  // -----------------------------
  analyze: async (payload: AnalysisRequest): Promise<AnalysisResult> => {
    const response = await api.post("/api/analyze", payload);

    // Backend already returns a full analysis object
    // DO NOT normalize or strip fields here
    return response.data.analysis;
  },

  // -----------------------------
  // GET /api/analyze/history
  // -----------------------------
  getHistory: async (): Promise<AnalysisHistoryItem[]> => {
    const response = await api.get("/api/analyze/history");
    // Backend returns { success: true, analyses: [...] }
    return response.data.analyses || [];
  },

  // -----------------------------
  // GET /api/analyze/:id
  // -----------------------------
  getAnalysisById: async (id: string) => {
    const response = await api.get(`/api/analyze/${id}`);
    // Backend returns { success: true, analysis: {...} }
    return response.data;
  },

  // -----------------------------
  // GET /api/dashboard/metrics
  // -----------------------------
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get("/api/dashboard/metrics");
    return response.data.metrics;
  },
};
