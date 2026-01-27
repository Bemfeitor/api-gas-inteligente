
import React, { useState, useEffect } from 'react';
import { Flame, Settings, LayoutDashboard, Wifi } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'settings' | 'wifi';
  onTabChange: (tab: 'dashboard' | 'settings' | 'wifi') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-2">
          <div className="bg-[#10b981] p-1.5 rounded-lg">
            <Flame size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Gás Inteligente</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">IoT Monitor</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{formatTime(currentTime)}</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">{formatDate(currentTime)}</div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex items-center justify-around py-3 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-30">
        <button 
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-[#10b981]' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button 
          onClick={() => onTabChange('wifi')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'wifi' ? 'text-[#10b981]' : 'text-slate-400'}`}
        >
          <Wifi size={24} />
          <span className="text-[10px] font-bold">Wi-Fi</span>
        </button>
        <button 
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-[#10b981]' : 'text-slate-400'}`}
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
