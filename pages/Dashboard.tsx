
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Clock, TrendingDown, Sparkles, ShieldAlert, Loader2, Info } from 'lucide-react';
import { GasStatus, AiInsight } from '../types';
import CylinderVisualizer from '../components/CylinderVisualizer';
import StatusBadge from '../components/StatusBadge';
import { mockGasService } from '../services/mockGasService';
import { geminiService } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<GasStatus>(mockGasService.getGasStatus());
  const [refilling, setRefilling] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [insight, setInsight] = useState<AiInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  const fetchAiInsight = useCallback(async (currentStatus: GasStatus) => {
    setLoadingInsight(true);
    const data = await geminiService.getSmartInsights(currentStatus);
    setInsight(data);
    setLoadingInsight(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = mockGasService.getGasStatus();
      setStatus(newStatus);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAiInsight(status);
  }, [status.level, status.isOnline]);

  const handleRequestRefill = async () => {
    setRefilling(true);
    await mockGasService.requestRefill();
    setRefilling(false);
    setToast(`Pedido enviado com sucesso para ${status.serverUrl}`);
    setTimeout(() => setToast(null), 4000);
  };

  const estimateDays = Math.ceil(status.level * (status.cylinderType === '13kg' ? 0.35 : 0.8));

  return (
    <div className="space-y-5">
      {/* Saudação Personalizada */}
      <div className="flex flex-col mb-1">
        <h2 className="text-xl font-bold text-[#0f172a]">Olá, {status.userName}!</h2>
        <p className="text-xs text-slate-500">Aqui está o status do seu botijão hoje.</p>
      </div>

      {toast && (
        <div className="fixed top-20 left-6 right-6 bg-[#0f172a] text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center justify-center text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-5 shadow-lg border border-slate-700 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Sparkles size={60} className="text-emerald-400" />
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-emerald-400" />
          <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Análise do Gemini</h3>
        </div>

        {loadingInsight ? (
          <div className="flex items-center gap-3 py-2">
            <Loader2 size={20} className="text-slate-400 animate-spin" />
            <p className="text-xs text-slate-400 italic">Analisando dados em tempo real...</p>
          </div>
        ) : insight && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-white font-medium text-sm leading-relaxed">
              {insight.statusSummary}
            </p>
            <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <ShieldAlert size={14} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-300">
                {insight.safetyTip}
              </p>
            </div>
            <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">
              Recomendação: {insight.recommendation}
            </div>
          </div>
        )}
      </div>

      {/* Main Tank Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
             <Info size={10} /> Tara: {status.tareWeight}kg
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase">
             <Info size={10} /> Aviso: {status.notificationThreshold}%
          </div>
        </div>

        <CylinderVisualizer level={status.level} type={status.cylinderType} />
        
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <StatusBadge type="online" active={status.isOnline} />
          <StatusBadge type="wifi" value={status.signal} />
          <StatusBadge type="battery" value={status.battery} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="bg-emerald-500/10 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 mb-2">
            <Clock size={18} />
          </div>
          <p className="text-[10px] text-emerald-700 font-bold uppercase opacity-60">Autonomia</p>
          <h3 className="text-lg font-bold text-emerald-900 mt-1">~ {estimateDays} dias</h3>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center mb-2">
            <TrendingDown size={18} className="text-emerald-400" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Consumo Estimado</p>
          <h3 className="text-lg font-bold mt-1">{status.cylinderType === '13kg' ? '0.4' : '1.2'}kg / dia</h3>
        </div>
      </div>

      <button 
        onClick={handleRequestRefill}
        disabled={refilling}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
          refilling ? 'bg-slate-200 text-slate-400' : 'bg-[#10b981] text-white shadow-lg active:scale-95'
        }`}
      >
        {refilling ? <Loader2 size={20} className="animate-spin" /> : <><ShoppingCart size={20} /> SOLICITAR REPOSIÇÃO</>}
      </button>

      <div className="text-center opacity-20 pb-4">
        <p className="text-[9px] font-mono tracking-tighter uppercase">ID: {status.notificationPhone ? status.notificationPhone.slice(-4) : '0000'}-{status.userName.slice(0,3).toUpperCase()}</p>
      </div>
    </div>
  );
};

export default Dashboard;
