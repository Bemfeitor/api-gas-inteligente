
import React, { useState, useEffect } from 'react';
import { Search, Wifi, Lock, Eye, EyeOff, Loader2, CheckCircle, ChevronRight, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { mockGasService } from '../services/mockGasService';
import { WifiNetwork } from '../types';

interface WifiSetupProps {
  onComplete: () => void;
}

const WifiSetup: React.FC<WifiSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScanning = async () => {
    setScanning(true);
    setNetworks([]);
    try {
      const results = await mockGasService.scanWifiNetworks();
      setNetworks(results);
      setStep(2);
    } catch (err) {
      setError("Falha ao buscar dispositivos.");
    } finally {
      setScanning(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedNetwork) return;
    setError(null);
    setConnecting(true);
    try {
      await mockGasService.connectDevice(selectedNetwork, password);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setConnecting(false);
    }
  };

  const renderSignalIcon = (strength: number) => {
    if (strength > 75) return <SignalHigh size={18} className="text-emerald-500" />;
    if (strength > 40) return <SignalMedium size={18} className="text-slate-400" />;
    return <SignalLow size={18} className="text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Setup Wi-Fi</h2>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-6 rounded-full ${step >= i ? 'bg-[#10b981]' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse-custom"></div>
            <div className="relative bg-emerald-500 p-8 rounded-full shadow-lg text-white">
              <Search size={48} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Descoberta</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Certifique-se que o dispositivo está ligado em Modo de Configuração (Luz Azul piscando).
            Conecte seu celular à rede <span className="font-bold text-slate-800">GAS_SETUP</span> se necessário.
          </p>
          <button 
            onClick={startScanning}
            disabled={scanning}
            className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {scanning ? <Loader2 className="animate-spin" /> : 'Buscar Dispositivo'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Redes Encontradas</p>
          <div className="space-y-2">
            {networks.map((net) => (
              <div 
                key={net.ssid}
                className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                  selectedNetwork === net.ssid ? 'border-[#10b981] shadow-md' : 'border-slate-100'
                }`}
                onClick={() => setSelectedNetwork(net.ssid)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <Wifi size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{net.ssid}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Sinal: {net.signal}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {net.secure && <Lock size={14} className="text-slate-300" />}
                    {renderSignalIcon(net.signal)}
                  </div>
                </div>

                {selectedNetwork === net.ssid && net.secure && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha da rede"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none pr-12"
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {error && <p className="text-rose-500 text-[10px] font-bold mt-2 px-1">{error}</p>}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleConnect(); }}
                      disabled={connecting}
                      className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
                    >
                      {connecting ? <Loader2 className="animate-spin" /> : 'Conectar Agora'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setStep(1)}
            className="w-full py-4 text-slate-400 font-bold text-xs"
          >
            VOLTAR E BUSCAR NOVAMENTE
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="bg-emerald-100 p-6 rounded-full mb-6">
            <CheckCircle size={64} className="text-[#10b981]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Tudo Pronto!</h3>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed">
            Seu dispositivo foi conectado com sucesso. O monitoramento em tempo real já está ativo e enviando dados para <span className="text-slate-800 font-bold">gas.allanturing.com</span>.
          </p>
          <button 
            onClick={onComplete}
            className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            Voltar ao Dashboard
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WifiSetup;
