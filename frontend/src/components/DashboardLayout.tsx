import React from 'react';
import { LayoutDashboard, ShieldCheck, History, Terminal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${active
          ? 'bg-cyber-blue/10 text-cyber-blue border-l-4 border-cyber-blue shadow-neon-blue'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}>
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-cyber-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-cyber-dark p-6 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="w-10 h-10 bg-cyber-blue rounded-xl flex items-center justify-center shadow-neon-blue">
            <ShieldCheck size={24} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VULNEXA</span>
        </div>

        {/* Navigation */}
        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 px-2">Main Menu</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={Terminal} label="Analysis" path="/analyze" active={location.pathname === '/analyze'} />
          <SidebarItem icon={History} label="History" path="/history" active={location.pathname === '/history'} />
        </div>

        {/* User Profile */}
        <div className="mt-auto border-t border-white/5 pt-6">
          <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyber-purple to-cyber-blue border border-white/20" />
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-[10px] text-cyber-green flex items-center uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green mr-2 animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-blue/10 via-cyber-black to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};