
import React, { useState } from 'react';
// Add Loader2 to the imports from lucide-react
import { Save, FlaskConical, RefreshCw, BatteryLow, WifiOff, Package, User, Phone, Bell, Weight, Loader2 } from 'lucide-react';
import { mockGasService } from '../services/mockGasService';
import { CylinderType } from '../types';

const Settings: React.FC = () => {
  const config = mockGasService.getConfig();
  
  const [cylinderType, setCylinderType] = useState<CylinderType>(config.cylinderType);
  const [userName, setUserName] = useState(config.userName);
  const [tareWeight, setTareWeight] = useState(config.tareWeight);
  const [notificationPhone, setNotificationPhone] = useState(config.notificationPhone);
  const [notificationThreshold, setNotificationThreshold] = useState(config.notificationThreshold);
  const [serverUrl, setServerUrl] = useState(config.serverUrl);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      mockGasService.saveConfig({
        cylinderType,
        serverUrl,
        userName,
        tareWeight,
        notificationPhone,
        notificationThreshold,
        isInitialConfigDone: true
      });
      setSaving(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
          <Package size={20} className="text-slate-400" />
          Dados do Cadastro
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Nome */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <User size={18} className="text-slate-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Cliente</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <Phone size={18} className="text-slate-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Telefone Alerta</label>
                <input 
                  type="tel" 
                  value={notificationPhone}
                  onChange={(e) => setNotificationPhone(e.target.value)}
                  className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tara */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <Weight size={18} className="text-slate-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tara (kg)</label>
                <input 
                  type="number" 
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Limite */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <Bell size={18} className="text-slate-400" />
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Limite (%)</label>
                <select 
                  value={notificationThreshold}
                  onChange={(e) => setNotificationThreshold(Number(e.target.value))}
                  className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                >
                  <option value={10}>10%</option>
                  <option value={15}>15%</option>
                  <option value={20}>20%</option>
                  <option value={25}>25%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2 px-1">Tamanho Padrão</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCylinderType('13kg')}
                className={`py-2 rounded-xl border-2 font-bold text-xs transition-all ${
                  cylinderType === '13kg' ? 'border-[#10b981] bg-emerald-50 text-[#10b981]' : 'border-slate-100 text-slate-400'
                }`}
              >
                Residencial (13kg)
              </button>
              <button 
                onClick={() => setCylinderType('45kg')}
                className={`py-2 rounded-xl border-2 font-bold text-xs transition-all ${
                  cylinderType === '45kg' ? 'border-[#10b981] bg-emerald-50 text-[#10b981]' : 'border-slate-100 text-slate-400'
                }`}
              >
                Industrial (45kg)
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 shadow-lg active:scale-95 transition-all"
          >
            {/* Loader2 now available via import */}
            {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Cadastro</>}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
        <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-4 text-sm">
          <FlaskConical size={18} className="text-amber-500" />
          Simulador IoT
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => mockGasService.consumeGas(5)} className="bg-white p-3 rounded-xl shadow-sm text-xs font-bold text-amber-900 active:bg-amber-100"><RefreshCw size={14} className="mb-1 inline mr-1" /> Gastar 5%</button>
          <button onClick={() => mockGasService.rechargeGas()} className="bg-white p-3 rounded-xl shadow-sm text-xs font-bold text-emerald-700 active:bg-emerald-100"><RefreshCw size={14} className="mb-1 inline mr-1" /> Recarregar</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
