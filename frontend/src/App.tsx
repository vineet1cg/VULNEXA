import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";         // ✅ FIXED: Added { }
import { DashboardPage } from "./pages/DashboardPage"; // ✅ FIXED: Added { }
import { AnalysisPage } from "./pages/AnalysisPage";   // ✅ FIXED: Added { }
import HistoryPage from "./pages/HistoryPage";         // Kept as default (unless you updated it too)
import ProtectedRoute from "./components/ProtectedRoute";
import "./pages/DashboardAnimations.css"; 

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 bg-noise-subtle antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;