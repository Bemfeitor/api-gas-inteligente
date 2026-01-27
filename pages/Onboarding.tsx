
import React, { useState } from 'react';
import { Flame, Check, Globe, Smartphone, User, Weight, Phone, Bell } from 'lucide-react';
import { CylinderType, SystemConfig } from '../types';

interface OnboardingProps {
  onComplete: (config: SystemConfig) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [cylinderType, setCylinderType] = useState<CylinderType>('13kg');
  const [userName, setUserName] = useState('');
  const [tareWeight, setTareWeight] = useState('13.0');
  const [notificationPhone, setNotificationPhone] = useState('');
  const [notificationThreshold, setNotificationThreshold] = useState(15);
  const [serverUrl, setServerUrl] = useState('gas.allanturing.com');

  const handleFinish = () => {
    if (!userName || !notificationPhone) {
      alert("Por favor, preencha seu nome e telefone de contato.");
      return;
    }
    onComplete({
      cylinderType,
      serverUrl,
      userName,
      tareWeight,
      notificationPhone,
      notificationThreshold,
      isInitialConfigDone: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-8 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="bg-[#10b981] p-3 rounded-2xl shadow-lg mb-3">
          <Flame size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a]">Cadastro do Botijão</h1>
        <p className="text-slate-500 text-sm mt-1">Personalize seu monitoramento inteligente.</p>
      </div>

      <div className="space-y-4 overflow-y-auto pb-4">
        {/* Campo Nome */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <User size={20} className="text-slate-400" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Seu Nome</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Escolha do Tipo Visual */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2 px-1">Tipo de Botijão</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { setCylinderType('13kg'); setTareWeight('13.0'); }}
              className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                cylinderType === '13kg' ? 'border-[#10b981] bg-emerald-50' : 'border-slate-200 bg-white'
              }`}
            >
              {cylinderType === '13kg' && <div className="absolute top-2 right-2 bg-[#10b981] rounded-full p-0.5"><Check size={10} className="text-white" /></div>}
              <div className="w-10 h-14 bg-slate-200 rounded-md mb-2"></div>
              <span className="font-bold text-slate-800 text-sm">13kg</span>
            </button>
            <button 
              onClick={() => { setCylinderType('45kg'); setTareWeight('45.0'); }}
              className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                cylinderType === '45kg' ? 'border-[#10b981] bg-emerald-50' : 'border-slate-200 bg-white'
              }`}
            >
              {cylinderType === '45kg' && <div className="absolute top-2 right-2 bg-[#10b981] rounded-full p-0.5"><Check size={10} className="text-white" /></div>}
              <div className="w-8 h-16 bg-slate-200 rounded-md mb-2"></div>
              <span className="font-bold text-slate-800 text-sm">45kg</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Campo Tara */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <Weight size={18} className="text-slate-400" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tara (kg)</label>
              <input 
                type="number" 
                step="0.1"
                value={tareWeight}
                onChange={(e) => setTareWeight(e.target.value)}
                className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Porcentagem Aviso */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <Bell size={18} className="text-slate-400" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Avisar em</label>
              <select 
                value={notificationThreshold}
                onChange={(e) => setNotificationThreshold(Number(e.target.value))}
                className="w-full text-slate-800 font-medium focus:outline-none bg-transparent appearance-none"
              >
                <option value={10}>10%</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
                <option value={25}>25%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campo Telefone */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Phone size={20} className="text-slate-400" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Telefone para Alerta</label>
            <input 
              type="tel" 
              value={notificationPhone}
              onChange={(e) => setNotificationPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Servidor */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 opacity-60">
          <Globe size={20} className="text-slate-400" />
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Servidor IoT</label>
            <input 
              type="text" 
              value={serverUrl}
              readOnly
              className="w-full text-slate-500 text-xs focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={handleFinish}
            className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
          >
            <Smartphone size={20} />
            Finalizar Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
