
import { GasStatus, CylinderType, SystemConfig, WifiNetwork } from '../types';

const STORAGE_KEY = 'gas_inteligente_data';
const CONFIG_KEY = 'gas_inteligente_config';

const INITIAL_GAS_STATUS: GasStatus = {
  level: 78,
  battery: 95,
  signal: 80,
  isOnline: true,
  cylinderType: '13kg',
  serverUrl: 'gas.allanturing.com',
  lastUpdate: new Date().toISOString(),
  userName: 'Cliente',
  tareWeight: '13.0',
  notificationPhone: '',
  notificationThreshold: 15,
};

const INITIAL_CONFIG: SystemConfig = {
  cylinderType: '13kg',
  serverUrl: 'gas.allanturing.com',
  isInitialConfigDone: false,
  userName: '',
  tareWeight: '13.0',
  notificationPhone: '',
  notificationThreshold: 15,
};

export const mockGasService = {
  getGasStatus: (): GasStatus => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GAS_STATUS));
      return INITIAL_GAS_STATUS;
    }
    return JSON.parse(stored);
  },

  updateGasStatus: (status: Partial<GasStatus>) => {
    const current = mockGasService.getGasStatus();
    const updated = { ...current, ...status, lastUpdate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getConfig: (): SystemConfig => {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : INITIAL_CONFIG;
  },

  saveConfig: (config: SystemConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    // Sincroniza o status principal com os dados do config
    mockGasService.updateGasStatus({ 
      cylinderType: config.cylinderType, 
      serverUrl: config.serverUrl,
      userName: config.userName,
      tareWeight: config.tareWeight,
      notificationPhone: config.notificationPhone,
      notificationThreshold: config.notificationThreshold
    });
  },

  requestRefill: async () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  scanWifiNetworks: async (): Promise<WifiNetwork[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { ssid: 'Minha Casa 2.4G', signal: 90, secure: true },
          { ssid: 'Vizinho_NET', signal: 45, secure: true },
          { ssid: 'Gás_Link', signal: 85, secure: true },
          { ssid: 'Public_WiFi', signal: 30, secure: false },
        ]);
      }, 2000);
    });
  },

  connectDevice: async (ssid: string, password?: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password && password.length < 8) {
          reject(new Error('A senha deve ter pelo menos 8 caracteres.'));
        } else {
          mockGasService.updateGasStatus({ isOnline: true, signal: 95 });
          resolve(true);
        }
      }, 3000);
    });
  },

  consumeGas: (amount: number = 1) => {
    const current = mockGasService.getGasStatus();
    const newLevel = Math.max(0, current.level - amount);
    return mockGasService.updateGasStatus({ level: newLevel });
  },

  rechargeGas: () => {
    return mockGasService.updateGasStatus({ level: 100 });
  },

  simulateSignalLoss: () => {
    const current = mockGasService.getGasStatus();
    return mockGasService.updateGasStatus({ isOnline: !current.isOnline, signal: current.isOnline ? 0 : 80 });
  },

  drainBattery: () => {
    const current = mockGasService.getGasStatus();
    const newBattery = Math.max(0, current.battery - 5);
    return mockGasService.updateGasStatus({ battery: newBattery });
  }
};
