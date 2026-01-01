import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import { GlassCard } from '../components/GlassCard';
import {
  Terminal, ShieldAlert, Cpu, Play, Search,
  Activity, AlertTriangle, Code2,
  Wand2, RefreshCw, Zap, Bug, Fingerprint
} from 'lucide-react';
import { analysisApi } from '../api/analysis';
import type { AnalysisResult } from '../types/analysis';

export const AnalysisPage = () => {
  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'FINISHED'>('IDLE');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Helper to safely get risk score regardless of backend field naming
  const getRiskScore = (res: AnalysisResult | null) => {
    if (!res) return 0;
    // Check both potential keys: riskScore (type def) or overallRiskScore (backend actual)
    return res.riskScore ?? res.overallRiskScore ?? 0;
  };

  // UI Helpers
  const isDanger = getRiskScore(result) > 0;
  const terminalEndRef = useRef<null | HTMLDivElement>(null);

  // --- ACTIONS ---
  const startScan = async () => {
    if (status === 'SCANNING' || !code.trim()) return;

    setStatus('SCANNING');
    setError(null);
    setResult(null);
    setLogs(["> INITIALIZING SECURE CONNECTION...", "> PACKAGING PAYLOAD..."]);

    try {
      // 1. Minimum "Scanning" Duration for UX (2.5 seconds)
      const minDurationPromise = new Promise(r => setTimeout(r, 2500));

      // Simulate progressive log loading
      setLogs(prev => [...prev, "> TRANSMITTING TO ENGINE...", "> ENCRYPTING PACKETS..."]);
      setTimeout(() => setLogs(prev => [...prev, "> HANDSHAKE ESTABLISHED", "> SCANNING VECTORS..."]), 800);
      setTimeout(() => setLogs(prev => [...prev, "> HEURISTICS ENGINE: ACTIVE", "> DEEP PACKET INSPECTION..."]), 1600);

      // 2. Real API Call (Parallel)
      const dataPromise = analysisApi.analyze({
        inputType: 'code',
        content: code
      });

      const [_, data] = await Promise.all([minDurationPromise, dataPromise]);

      if (!data) {
        throw new Error("Received empty response from server");
      }

      // 3. Handle Success safely
      setResult(data);

      const vulnCount = data.vulnerabilities?.length ?? 0;
      const rScore = getRiskScore(data);

      setLogs(prev => [
        ...prev,
        "> ANALYSIS COMPLETE.",
        `> RISK_SCORE: ${rScore.toFixed(1)}`,
        `> VULNERABILITIES DETECTED: ${vulnCount}`,
        "> DECRYPTING RESULTS..."
      ]);
      setStatus('FINISHED');

    } catch (err: any) {
      console.error("Analysis Error:", err);
      // Safely extract error message
      const errMsg = err?.response?.data?.message || err?.message || "Connection failed";

      setError(`Analysis Terminated: ${errMsg}`);
      setLogs(prev => [...prev, `> ERROR: ${errMsg}`, "> ABORTING..."]);
      setStatus('IDLE');
    }
  };

  const handleGeneratePatch = () => {
    // Placeholder for future implementation or navigating to details
    setLogs(prev => [...prev, "> AUTO-PATCHING NOT YET AVAILABLE IN THIS VERSION..."]);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Color helper for severity
  const getSeverityColor = (sev?: string) => {
    if (!sev) return 'text-blue-500 bg-blue-500/20'; // Default safe fallback

    switch (sev.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/20';
    }
  };

  return (
    <DashboardLayout>
      {/* 1. TOP HEADER WITH GLITCH EFFECT */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative group">
          <motion.h1
            animate={isDanger ? { x: [-1, 1, -1, 0], filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="text-3xl font-black tracking-tighter italic select-none text-white"
          >
            VULN-LAB <span className="text-cyber-blue">X-01</span>
          </motion.h1>
          <div className="flex items-center space-x-4 text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-1">
            <span className="flex items-center text-cyber-green/70"><Cpu size={12} className="mr-1" /> ONLINE</span>
            <span className="flex items-center"><Zap size={12} className="mr-1 text-cyber-blue" /> V.2.0.4</span>
          </div>
        </div>

        {/* THREAT ALERT BUTTON (Header) */}
        <AnimatePresence>
          {isDanger && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <AlertTriangle size={16} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Threat Detected</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* ERROR BANNER */}
        {error && (
          <div className="col-span-12 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center text-red-400 mb-2">
            <AlertTriangle className="mr-3" />
            <span className="font-mono text-xs">{error}</span>
          </div>
        )}

        {/* 2. THE SCANNER CARD */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <GlassCard className={`relative overflow-hidden transition-all duration-500 ${isDanger ? 'border-red-500/50' : 'border-cyber-blue/20'}`}>

            {/* LASER SCANNING ANIMATION */}
            <AnimatePresence>
              {status === 'SCANNING' && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-blue to-transparent shadow-[0_0_20px_#00f2ff] z-10 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
              <div className="flex items-center space-x-2"><Code2 size={14} className="mr-2 text-cyber-blue" /> <span>Analysis_Buffer</span></div>
              <div className="flex items-center space-x-2">
                <span className={status === 'SCANNING' ? 'text-cyber-blue animate-pulse' : ''}>
                  {status === 'SCANNING' ? 'Uploading...' : 'Ready'}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'SCANNING' ? 'bg-cyber-blue animate-ping' : 'bg-gray-700'}`} />
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 bg-black/60 rounded-xl p-5 font-mono text-sm text-cyber-blue outline-none border border-white/5 resize-none scrollbar-hide focus:border-cyber-blue/30 transition-colors placeholder-gray-700"
                spellCheck="false"
                placeholder="// Paste code here for security analysis..."
              />
              {/* Overlay CRT grid effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            {/* INITIALIZE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={startScan}
              disabled={status === 'SCANNING' || !code}
              className={`w-full mt-4 py-4 rounded-xl font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all relative overflow-hidden group ${status === 'SCANNING' ? 'bg-gray-800 text-gray-500' :
                isDanger ? 'bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)] text-white' :
                  'bg-gradient-to-r from-cyber-blue to-blue-600 text-black shadow-[0_0_30px_rgba(0,242,255,0.4)]'
                } ${!code ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status === 'SCANNING' ? <RefreshCw className="animate-spin" size={20} /> : <Play fill="currentColor" size={20} />}
              <span className="relative z-10">{status === 'SCANNING' ? 'Processing...' : 'Initialize Analysis'}</span>
            </motion.button>
          </GlassCard>

          {/* 3. TERMINAL LOGS */}
          <GlassCard className="bg-black/90 border-white/5 p-4 h-40 overflow-hidden relative">
            <div className="absolute top-2 right-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center">
              <Terminal size={10} className="mr-1" /> SYSTEM_LOGS
            </div>
            <div className="font-mono text-[10px] text-cyber-green/80 space-y-1 overflow-y-auto h-full pr-2 scrollbar-none">
              {logs.map((log, i) => (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex space-x-2">
                  <span className="text-cyber-green/40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span>{log}</span>
                </motion.div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </GlassCard>
        </div>

        {/* 4. DIAGNOSTICS & THREAT FEED */}
        <div className="col-span-12 lg:col-span-5 space-y-6">

          <GlassCard className="relative min-h-[540px]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center">
              <Search size={14} className="mr-2 text-cyber-blue" /> Diagnostics_Core
            </h3>

            {/* THREAT LEVEL METER */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-gray-600">RISK_SCORE</span>
                <motion.span
                  key={isDanger ? 'crit' : 'sec'}
                  initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className={`text-2xl font-black italic tracking-tighter ${isDanger ? 'text-red-500' : 'text-cyber-green'}`}
                >
                  {getRiskScore(result).toFixed(1)}
                </motion.span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  animate={{
                    width: result ? `${Math.min(getRiskScore(result) * 10, 100)}%` : '0%',
                    backgroundColor: isDanger ? '#ef4444' : '#00ff88'
                  }}
                  className="h-full shadow-[0_0_15px_currentColor]"
                />
              </div>
            </div>

            {/* DANGER LIST */}
            <AnimatePresence mode='wait'>
              {isDanger && result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center text-red-500 space-x-2 mb-4">
                      <ShieldAlert size={16} />
                      <span className="text-[10px] font-black uppercase">Vulnerabilities Detected ({result.vulnerabilities?.length ?? 0})</span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {result.vulnerabilities?.map((vuln, i) => (
                        <motion.div
                          key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                          className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 group hover:border-red-500/30 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-300">{vuln.type || vuln.name || 'Unknown Vulnerability'}</span>
                            <span className="text-[9px] text-gray-500 truncate max-w-[150px]">{vuln.description || 'No description available'}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${getSeverityColor(vuln.severity)}`}>
                            {(vuln.severity || 'LOW').toUpperCase()}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* PATCH BUTTON */}
                    <motion.button
                      onClick={handleGeneratePatch}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-500 transition-all flex items-center justify-center space-x-2"
                    >
                      {false ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                      <span>Generate Report</span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : status === 'FINISHED' && !isDanger ? (
                // SAFE STATE
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyber-green/5 border border-cyber-green/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                    <Activity className="text-cyber-green" size={30} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                    Assessment Complete<br />
                    <span className="text-cyber-green">No Threats Detected</span>
                  </p>
                </motion.div>
              ) : (
                // IDLE STATE
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mb-4">
                    <Activity className="text-gray-600" size={30} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-loose">
                    Awaiting Input<br />Standby Mode
                  </p>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Extra Info Tiles */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
                <Bug size={16} className="mb-2 text-gray-400" />
                <span className="text-[9px] font-bold uppercase text-gray-500">Heuristic Engine</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
                <Fingerprint size={16} className="mb-2 text-gray-400" />
                <span className="text-[9px] font-bold uppercase text-gray-500">Static Analysis</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};
