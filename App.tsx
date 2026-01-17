
import React, { useState } from 'react';
import { AppTab, UserStats, AppState, AIRecommendation } from './types';
import AmbientGlow from './components/AmbientGlow';
import Dashboard from './views/Dashboard';
import Community from './views/Community';
import Activities from './views/Activities';
import Counselors from './views/Counselors';
import LiveCounselor from './views/LiveCounselor';
import Login from './views/Login';
import Onboarding from './views/Onboarding';
import CounsellorLogin from './views/CounsellorLogin';
import CounsellorMain from './views/CounsellorMain';
import ResultsView from './views/ResultsView';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [counsellorName, setCounsellorName] = useState<string>('');
  const [lastResults, setLastResults] = useState<AIRecommendation | null>(null);
  const [stats, setStats] = useState<UserStats>({
    streak: 12,
    points: 2450,
    level: 4,
    xpToNextLevel: 3000,
    mood: 8,
    waterLevel: 65,
    isScreened: false,
  });

  const handleTestComplete = (results: AIRecommendation) => {
    setLastResults(results);
    setActiveTab(AppTab.RESULTS);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOGIN:
        return (
          <Login 
            onUserStart={() => setAppState(AppState.ONBOARDING)} 
            onCounsellorStart={() => setAppState(AppState.COUNSELLOR_LOGIN)} 
          />
        );
      case AppState.ONBOARDING:
        return <Onboarding onComplete={() => setAppState(AppState.MAIN)} />;
      case AppState.COUNSELLOR_LOGIN:
        return (
          <CounsellorLogin 
            onLogin={(name) => {
              setCounsellorName(name);
              setAppState(AppState.COUNSELLOR_MAIN);
            }} 
            onBack={() => setAppState(AppState.LOGIN)} 
          />
        );
      case AppState.COUNSELLOR_MAIN:
        return <CounsellorMain name={counsellorName} onLogout={() => setAppState(AppState.LOGIN)} />;
      case AppState.MAIN:
        return renderMainApp();
      default:
        return <Login onUserStart={() => setAppState(AppState.ONBOARDING)} onCounsellorStart={() => setAppState(AppState.COUNSELLOR_LOGIN)} />;
    }
  };

  const renderMainApp = () => {
    if (activeTab === AppTab.RESULTS) {
      return (
        <ResultsView 
          results={lastResults} 
          onBack={() => setActiveTab(AppTab.DASHBOARD)} 
          navigateTo={setActiveTab} 
        />
      );
    }

    switch (activeTab) {
      case AppTab.DASHBOARD: 
        return (
          <Dashboard 
            stats={stats} 
            setStats={setStats} 
            navigateTo={setActiveTab} 
            onTestComplete={handleTestComplete}
          />
        );
      default: 
        return (
          <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <button 
              onClick={() => setActiveTab(AppTab.DASHBOARD)} 
              className="mb-6 flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-all w-fit group"
            >
              <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/50">
                <ArrowLeft size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Return to Hub</span>
            </button>
            <div className="flex-1">
              {activeTab === AppTab.COMMUNITY && <Community />}
              {activeTab === AppTab.ACTIVITIES && <Activities />}
              {activeTab === AppTab.COUNSELORS && <Counselors />}
              {activeTab === AppTab.LIVE && <LiveCounselor />}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020202] text-white selection:bg-cyan-500/30">
      <AmbientGlow />
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto min-h-screen p-6 md:p-12 pb-32">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
