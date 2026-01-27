
export type CylinderType = '13kg' | '45kg';

export interface GasStatus {
  level: number;
  battery: number;
  signal: number;
  isOnline: boolean;
  cylinderType: CylinderType;
  serverUrl: string;
  lastUpdate: string;
  // Novos campos de cadastro
  userName: string;
  tareWeight: string;
  notificationPhone: string;
  notificationThreshold: number;
}

export interface WifiNetwork {
  ssid: string;
  signal: number;
  secure: boolean;
}

export interface SystemConfig {
  cylinderType: CylinderType;
  serverUrl: string;
  isInitialConfigDone: boolean;
  // Novos campos de configuração
  userName: string;
  tareWeight: string;
  notificationPhone: string;
  notificationThreshold: number;
}

export interface AiInsight {
  statusSummary: string;
  safetyTip: string;
  recommendation: string;
  sentiment: 'positive' | 'warning' | 'critical';
}
