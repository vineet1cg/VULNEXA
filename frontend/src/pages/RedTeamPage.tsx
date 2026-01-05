import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Bug, Code, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { GlassCard } from '../components/GlassCard';

export const RedTeamPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attacks' | 'exploits' | 'simulation'>('overview');

  const attackMetrics = [
    { label: 'Attack Vectors', value: '12', icon: Target, color: 'text-red-400' },
    { label: 'Exploits Found', value: '8', icon: Bug, color: 'text-orange-400' },
    { label: 'Success Rate', value: '67%', icon: TrendingUp, color: 'text-yellow-400' },
    { label: 'Tests Run', value: '156', icon: Activity, color: 'text-cyber-blue' },
  ];

  const recentAttacks = [
    { id: 1, type: 'SQL Injection Test', target: 'Login API', status: 'Successful', time: '5m ago' },
    { id: 2, type: 'XSS Vulnerability', target: 'User Dashboard', status: 'Exploited', time: '20m ago' },
    { id: 3, type: 'Authentication Bypass', target: 'Admin Panel', status: 'Failed', time: '1h ago' },
    { id: 4, type: 'CSRF Attack', target: 'Payment Form', status: 'Successful', time: '2h ago' },
  ];

  const attackTools = [
    {
      title: 'Penetration Testing',
      description: 'Simulate real-world attacks to identify vulnerabilities',
      icon: Target,
      status: 'Ready',
    },
    {
      title: 'Exploit Development',
      description: 'Create and test custom exploits for discovered vulnerabilities',
      icon: Code,
      status: 'Active',
    },
    {
      title: 'Social Engineering',
      description: 'Test human factors and security awareness',
      icon: Zap,
      status: 'Ready',
    },
    {
      title: 'Network Reconnaissance',
      description: 'Gather intelligence about target systems and infrastructure',
      icon: Activity,
      status: 'Active',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-cyber-white mb-2 flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <Target size={24} className="text-white" />
              </div>
              Red Team Operations
            </h1>
            <p className="text-cyber-slate">Offensive security testing and ethical hacking</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle size={20} className="text-red-400 mt-0.5" />
          <div>
            <p className="text-red-400 font-bold text-sm mb-1">Ethical Hacking Only</p>
            <p className="text-xs text-red-300/70">
              All red team activities are authorized and conducted in controlled environments for security testing purposes only.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'attacks', label: 'Attack Vectors' },
            { id: 'exploits', label: 'Exploits' },
            { id: 'simulation', label: 'Simulation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-cyber-slate hover:text-cyber-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {attackMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon size={32} className={metric.color} />
                </div>
                <p className="text-3xl font-black text-cyber-white mb-1">{metric.value}</p>
                <p className="text-xs text-cyber-slate uppercase tracking-wider">{metric.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Attacks */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-black text-cyber-white mb-4 flex items-center">
                <Target size={20} className="mr-2 text-red-400" />
                Recent Attack Tests
              </h3>
              <div className="space-y-3">
                {recentAttacks.map((attack) => (
                  <div
                    key={attack.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-cyber-white">{attack.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        attack.status === 'Successful' || attack.status === 'Exploited'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {attack.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-cyber-slate">
                      <span>Target: {attack.target}</span>
                      <span>{attack.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Attack Tools */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-black text-cyber-white mb-4 flex items-center">
                <Zap size={20} className="mr-2 text-red-400" />
                Attack Tools & Techniques
              </h3>
              <div className="space-y-4">
                {attackTools.map((tool, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <tool.icon size={20} className="text-red-400" />
                        <span className="font-bold text-cyber-white">{tool.title}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                        {tool.status}
                      </span>
                    </div>
                    <p className="text-xs text-cyber-slate mt-2">{tool.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'attacks' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Attack Vector Library</h3>
            <p className="text-cyber-slate">Browse and execute various attack vectors for security testing</p>
          </GlassCard>
        )}

        {activeTab === 'exploits' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Exploit Development</h3>
            <p className="text-cyber-slate">Create and manage custom exploits for discovered vulnerabilities</p>
          </GlassCard>
        )}

        {activeTab === 'simulation' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Attack Simulation</h3>
            <p className="text-cyber-slate">Run comprehensive attack simulations to test system defenses</p>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

