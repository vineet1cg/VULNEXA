import { LayoutDashboard, ShieldCheck, History, Terminal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 group relative overflow-hidden ${active
        ? 'bg-cyber-blue/10 text-cyber-blue shadow-subtle-blue ring-1 ring-cyber-blue/20'
        : 'text-cyber-slate hover:bg-white/5 hover:text-cyber-white active:scale-95'
        } cyber-btn`}>
      <Icon size={18} className={active ? 'text-cyber-blue animate-pulse' : 'text-cyber-slate group-hover:text-cyber-white transition-colors'} />
      <span className="font-semibold text-sm tracking-tight">{label}</span>
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "AU";
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-cyber-black text-cyber-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-cyber-dark p-6 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10 px-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 bg-cyber-blue rounded-lg flex items-center justify-center shadow-subtle-blue group-hover:shadow-[0_0_20px_rgb(var(--cyber-blue))] transition-all group-hover:rotate-12">
            <ShieldCheck size={20} className="text-cyber-black" />
          </div>
          <span className="text-lg font-black tracking-tighter text-cyber-white">VULNEXA</span>
        </div>

        {/* Navigation */}
        <div className="space-y-1 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-cyber-slate/60 font-bold mb-4 px-2">Main Menu</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={Terminal} label="Analysis" path="/analyze" active={location.pathname === '/analyze'} />
          <SidebarItem icon={History} label="History" path="/history" active={location.pathname === '/history'} />
        </div>

        {/* User Profile */}
        <div className="mt-auto border-t border-white/5 pt-6">


          <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-cyber-dark-lighter border border-white/10 flex items-center justify-center text-cyber-blue font-black text-xs">
              {getInitials(user?.name || "Admin User")}
            </div>
            <div>
              <p className="text-sm font-bold text-cyber-white">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-cyber-green flex items-center uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green mr-2 animate-pulse" /> Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 relative min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};