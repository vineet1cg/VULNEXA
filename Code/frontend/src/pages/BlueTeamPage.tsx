import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck, Network, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { GlassCard } from '../components/GlassCard';

export const BlueTeamPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'defense' | 'monitoring' | 'reports'>('overview');

  const defenseMetrics = [
    { label: 'Protected Systems', value: '24', icon: Shield, color: 'text-cyber-blue' },
    { label: 'Active Defenses', value: '18', icon: Lock, color: 'text-cyber-green' },
    { label: 'Threats Blocked', value: '1,247', icon: XCircle, color: 'text-red-400' },
    { label: 'Security Score', value: '94%', icon: CheckCircle, color: 'text-cyber-green' },
  ];

  const recentThreats = [
    { id: 1, type: 'SQL Injection Attempt', severity: 'High', status: 'Blocked', time: '2m ago' },
    { id: 2, type: 'XSS Attack Detected', severity: 'Medium', status: 'Blocked', time: '15m ago' },
    { id: 3, type: 'Unauthorized Access', severity: 'Critical', status: 'Blocked', time: '1h ago' },
    { id: 4, type: 'DDoS Attempt', severity: 'High', status: 'Mitigated', time: '2h ago' },
  ];

  const defenseStrategies = [
    {
      title: 'Web Application Firewall',
      status: 'Active',
      description: 'Protecting all web endpoints from common attacks',
      icon: Shield,
    },
    {
      title: 'Intrusion Detection System',
      status: 'Active',
      description: 'Monitoring network traffic for suspicious activity',
      icon: Eye,
    },
    {
      title: 'Code Analysis',
      status: 'Active',
      description: 'Automated vulnerability scanning in CI/CD pipeline',
      icon: FileCheck,
    },
    {
      title: 'Network Monitoring',
      status: 'Active',
      description: 'Real-time network traffic analysis and alerting',
      icon: Network,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-cyber-white mb-2 flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Shield size={24} className="text-white" />
              </div>
              Blue Team Operations
            </h1>
            <p className="text-cyber-slate">Defensive security and threat protection</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'defense', label: 'Defense Systems' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'reports', label: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'text-cyber-blue border-b-2 border-cyber-blue'
                  : 'text-cyber-slate hover:text-cyber-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {defenseMetrics.map((metric, index) => (
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
            {/* Recent Threats */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-black text-cyber-white mb-4 flex items-center">
                <AlertTriangle size={20} className="mr-2 text-red-400" />
                Recent Threat Activity
              </h3>
              <div className="space-y-3">
                {recentThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-cyber-white">{threat.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {threat.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-cyber-slate">
                      <span className="text-cyber-green flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        {threat.status}
                      </span>
                      <span>{threat.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Defense Status */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-black text-cyber-white mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-cyber-blue" />
                Defense Systems Status
              </h3>
              <div className="space-y-4">
                {defenseStrategies.map((strategy, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <strategy.icon size={20} className="text-cyber-blue" />
                        <span className="font-bold text-cyber-white">{strategy.title}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">
                        {strategy.status}
                      </span>
                    </div>
                    <p className="text-xs text-cyber-slate mt-2">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'defense' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Active Defense Systems</h3>
            <p className="text-cyber-slate">Detailed defense system configuration and management</p>
          </GlassCard>
        )}

        {activeTab === 'monitoring' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Real-time Monitoring</h3>
            <p className="text-cyber-slate">Live threat monitoring and alerting dashboard</p>
          </GlassCard>
        )}

        {activeTab === 'reports' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-black text-cyber-white mb-4">Security Reports</h3>
            <p className="text-cyber-slate">Generate and view security assessment reports</p>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

