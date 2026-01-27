
import React, { useState, useEffect } from 'react';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import WifiSetup from './pages/WifiSetup';
import Layout from './components/Layout';
import { mockGasService } from './services/mockGasService';
import { SystemConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(mockGasService.getConfig());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'wifi'>('dashboard');

  const handleOnboardingComplete = (newConfig: SystemConfig) => {
    mockGasService.saveConfig(newConfig);
    setConfig(newConfig);
  };

  // If initial config not done, show onboarding
  if (!config.isInitialConfigDone) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'settings' && <Settings />}
      {activeTab === 'wifi' && <WifiSetup onComplete={() => setActiveTab('dashboard')} />}
    </Layout>
  );
};

export default App;
