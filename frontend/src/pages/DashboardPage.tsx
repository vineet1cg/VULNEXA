import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { analysisApi } from "../api/analysis";
import type { DashboardMetrics } from "../types/analysis";
import { EthicalBanner } from "../components/EthicalBanner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// -----------------------------
// Constants
// -----------------------------
const COLORS = {
  Low: "#10b981",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const EMPTY_SEVERITY = {
  Low: 0,
  Medium: 0,
  High: 0,
  Critical: 0,
};

// -----------------------------
// Component
// -----------------------------
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Fetch dashboard metrics
  // -----------------------------
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await analysisApi.getDashboardMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard metrics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // -----------------------------
  // Loading / Error states
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No dashboard data available
      </div>
    );
  }

  // -----------------------------
  // Safe defaults (CRITICAL)
  // -----------------------------
  const severityDistribution =
    metrics.severityDistribution ?? EMPTY_SEVERITY;

  const riskTrends = metrics.riskTrends ?? [];

  const pieData = [
    {
      name: "Low",
      value: severityDistribution.Low,
      color: COLORS.Low,
    },
    {
      name: "Medium",
      value: severityDistribution.Medium,
      color: COLORS.Medium,
    },
    {
      name: "High",
      value: severityDistribution.High,
      color: COLORS.High,
    },
    {
      name: "Critical",
      value: severityDistribution.Critical,
      color: COLORS.Critical,
    },
  ].filter((item) => item.value > 0);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.name}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/analyze")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              New Analysis
            </button>

            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              History
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <EthicalBanner />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm text-gray-600">Total Scans</h3>
            <p className="text-3xl font-bold">{metrics.totalScans}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm text-gray-600">
              Total Vulnerabilities
            </h3>
            <p className="text-3xl font-bold">
              {metrics.totalVulnerabilities}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Severity Distribution
            </h3>

            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${(percent! * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">
                No vulnerability data
              </p>
            )}
          </div>

          {/* Risk Trend */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Risk Trend
            </h3>

            {riskTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={riskTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-10">
                No trend data available
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
