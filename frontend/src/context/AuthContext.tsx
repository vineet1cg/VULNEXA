import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth";

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (googleIdToken: string) => Promise<void>;
  devLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sentinai_token");

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then((res) => {
        if (res.success) {
          setUser(res.user);
        } else {
          localStorage.removeItem("sentinai_token");
        }
      })
      .finally(() => {
        // Add a small artificial delay to show off the animation 
        // (Remove setTimeout in production if you want instant load)
        setTimeout(() => setLoading(false), 800);
      });
  }, []);

  const login = async (googleIdToken: string) => {
    const res = await authApi.googleLogin(googleIdToken);

    if (res.success) {
      localStorage.setItem("sentinai_token", res.token);
      setUser(res.user);
    } else {
      throw new Error("Login failed");
    }
  };

  const devLogin = async () => {
    const res = await authApi.devLogin();
    if (res.success) {
      localStorage.setItem("sentinai_token", res.token);
      setUser(res.user);
    } else {
      throw new Error("Dev login failed");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("sentinai_token");
      setUser(null);
    }
  };

  // ------------------------------------------------------------------
  //  VISUAL LOGIC: High-End "System Boot" Loading Screen
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] overflow-hidden">
        {/* CSS Engine for this screen */}
        <style>{`
          @keyframes gradient-drift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(2); opacity: 0; }
          }
          @keyframes scan-vertical {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>

        {/* 1. Background Gradient Drift & Noise */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-black animate-[gradient-drift_10s_ease_infinite] bg-[length:400%_400%]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* 2. Vertical Scan Line (System Scanning) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div className="w-full h-[20vh] bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent animate-[scan-vertical_3s_linear_infinite]"></div>
        </div>

        {/* 3. Main Loader Container */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Logo / Icon with Pulse Attention Effect */}
          <div className="relative mb-8">
            {/* Outer Rings */}
            <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-[pulse-ring_3s_linear_infinite]"></div>
            <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[pulse-ring_3s_linear_infinite_1s]"></div>

            {/* Core Icon */}
            <div className="relative h-16 w-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <span className="text-3xl font-bold text-white animate-pulse">V</span>
            </div>

            {/* Status Beacon (Green Dot) */}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_#10b981] animate-bounce"></div>
          </div>

          {/* Loading Bar with Liquid Shimmer */}
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative mb-4 ring-1 ring-slate-700">
            <div className="absolute inset-0 bg-indigo-600/20"></div>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-[gradient-drift_2s_linear_infinite] bg-[length:200%_100%]"
              style={{ width: '60%', borderRadius: '99px' }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
            </div>
          </div>

          {/* Text with Soft Focus Blur & Fade In */}
          <div className="text-center space-y-1">
            <h2 className="text-white font-bold tracking-[0.2em] text-sm uppercase animate-pulse">
              Initializing Core
            </h2>
            <p className="text-slate-500 text-xs font-mono">
              Verifying encryption keys...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // Render children (The App) when loaded
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        devLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};