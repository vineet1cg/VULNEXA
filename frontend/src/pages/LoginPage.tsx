import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Cpu, Activity } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import "./DashboardAnimations.css";

export const LoginPage = () => {
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center relative overflow-hidden bg-grid-pattern">
      <GlassCard className="w-full max-w-md p-8 relative z-10 border-t-2 border-t-cyber-blue/50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-cyber-blue/10 blur-xl rounded-full" />
            <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
              <ShieldCheck size={32} className="text-cyber-blue" />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tighter text-white">VULNEXA<span className="text-cyber-blue">_CORE</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2 flex items-center justify-center">
            <Lock size={10} className="mr-1" /> Secure Access Gateway
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-xs text-red-400 font-mono"
          >
            <Activity size={14} className="mr-2" />
            ERR_AUTH_FAIL: {error}
          </motion.div>
        )}

        {/* Login Area */}
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Authenticate Identity</p>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    if (!credentialResponse.credential) throw new Error("No ID Token");
                    await login(credentialResponse.credential);
                    navigate("/dashboard");
                  } catch (err) {
                    console.error(err);
                    setError("Authentication handshake failed.");
                  }
                }}
                onError={() => setError("Google Service Unreachable")}
                theme="filled_black"
                shape="pill"
                width="280"
              />
            </div>
            {/* DEV LOGIN BYPASS */}
            <div className="flex justify-center pt-4 border-t border-white/5 mt-4">
              <button
                onClick={async () => {
                  try {
                    await devLogin();
                    navigate("/dashboard");
                  } catch (err) {
                    setError("Dev Login failed");
                  }
                }}
                className="text-xs font-bold text-cyber-green hover:text-white underline font-mono uppercase tracking-[0.2em] transition-colors"
              >
                [ BYPASS_AUTH_PROTOCOL ]
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-600 font-mono uppercase">
            <span className="flex items-center"><Cpu size={10} className="mr-1" /> V.4.0.2 Stable</span>
            <span className="flex items-center"><Activity size={10} className="mr-1 text-cyber-green" /> Nodes Online</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};