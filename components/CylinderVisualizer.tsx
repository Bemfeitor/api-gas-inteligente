
import React from 'react';

interface CylinderVisualizerProps {
  level: number;
  type: '13kg' | '45kg';
}

const CylinderVisualizer: React.FC<CylinderVisualizerProps> = ({ level, type }) => {
  // Determine color based on level
  const getColor = () => {
    if (level > 40) return 'bg-[#10b981]'; // Emerald
    if (level > 15) return 'bg-amber-500'; // Amber
    return 'bg-rose-500'; // Red
  };

  const isIndustrial = type === '45kg';

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Tank Top Handle */}
      <div className={`w-16 h-3 bg-slate-300 rounded-t-lg mb-1 z-10 ${isIndustrial ? 'w-24 h-4' : 'w-16 h-3'}`}></div>
      
      {/* Tank Body Container */}
      <div className={`relative overflow-hidden bg-slate-200 border-4 border-slate-300 rounded-3xl shadow-inner
        ${isIndustrial ? 'w-32 h-64' : 'w-36 h-48'}`}>
        
        {/* The "Liquid" Fill */}
        <div 
          className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${getColor()}`}
          style={{ height: `${level}%` }}
        >
          {/* Subtle liquid shine effect */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/10"></div>
          
          {/* Bubbles animation simulation (optional visual) */}
          {level > 0 && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75"></div>
            </div>
          )}
        </div>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800 mix-blend-overlay">
            {level}%
          </span>
        </div>
      </div>

      {/* Tank Base */}
      <div className={`w-24 h-2 bg-slate-400 rounded-full mt-2 ${isIndustrial ? 'w-28' : 'w-24'}`}></div>
      
      {/* Capacity Indicator */}
      <div className="mt-4 text-slate-500 font-medium text-sm bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
        P{type === '13kg' ? '13' : '45'} • {type}
      </div>
    </div>
  );
};

export default CylinderVisualizer;
