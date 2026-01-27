
import React from 'react';
import { Wifi, Battery, Signal, Zap } from 'lucide-react';

interface StatusBadgeProps {
  type: 'wifi' | 'battery' | 'signal' | 'online';
  value?: number;
  active?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value = 0, active = false }) => {
  const getIcon = () => {
    switch (type) {
      case 'wifi': return <Wifi size={16} className={value < 30 ? 'text-amber-500' : 'text-slate-500'} />;
      case 'battery': return <Battery size={16} className={value < 20 ? 'text-rose-500' : 'text-slate-500'} />;
      case 'signal': return <Signal size={16} className="text-slate-500" />;
      case 'online': return <Zap size={16} className={active ? 'text-emerald-500' : 'text-slate-400'} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'online': return active ? 'Online' : 'Offline';
      default: return `${value}%`;
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
      {getIcon()}
      <span className={`text-xs font-semibold ${type === 'online' && active ? 'text-emerald-600' : 'text-slate-600'}`}>
        {getLabel()}
      </span>
    </div>
  );
};

export default StatusBadge;
