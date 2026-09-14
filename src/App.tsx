import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider } from './context/AppContext';
import { CompanyProvider } from './context/CompanyContext';
import { FarmerPortal } from './components/FarmerPortal';
import { CompanyPortalLayout } from './components/company/CompanyPortalLayout';
import { FieldAgentPortalLayout } from './components/agent/FieldAgentPortalLayout';
import { LogisticsPortalLayout } from './components/logistics/LogisticsPortalLayout';
import { AdminPortalLayout } from './components/admin/AdminPortalLayout';
import { AuthPortal } from './components/auth/AuthPortal';
import { LogOut, RefreshCw, Sprout, Building2, UserCheck, Truck, ShieldCheck } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-slate-100 font-sans">
          <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-400 mb-4">
              {this.state.error?.message || 'A runtime error occurred in the browser.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              Reset & Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export type PlatformPersona = 'farmer' | 'company' | 'agent' | 'logistics' | 'admin';

function MainAppContent() {
  const currentPort = typeof window !== 'undefined' ? window.location.port : '';
  const isAdminPort = currentPort === '5174';

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      if (isAdminPort) return true;
      const isLoggedOut = localStorage.getItem('kisan_auth_logged_out') === 'true';
      if (isLoggedOut) return false;
      const sessionActive = sessionStorage.getItem('kisan_session_active') === 'true';
      return sessionActive;
    } catch {
      return false;
    }
  });

  const [currentPersona, setCurrentPersona] = useState<PlatformPersona>(() => {
    if (isAdminPort) return 'admin';
    try {
      const saved = localStorage.getItem('kisan_portal_persona') as PlatformPersona;
      if (saved && ['farmer', 'company', 'agent', 'logistics', 'admin'].includes(saved)) {
        return saved;
      }
      return 'farmer';
    } catch {
      return 'farmer';
    }
  });

  const handleSwitchPersona = (persona: string) => {
    const validPersona = (['farmer', 'company', 'agent', 'logistics', 'admin'].includes(persona) ? persona : 'farmer') as PlatformPersona;
    setCurrentPersona(validPersona);
    try {
      localStorage.setItem('kisan_portal_persona', validPersona);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLoginSuccess = (role: PlatformPersona) => {
    handleSwitchPersona(role);
    setIsLoggedIn(true);
    try {
      localStorage.removeItem('kisan_auth_logged_out');
      sessionStorage.setItem('kisan_session_active', 'true');
      localStorage.setItem('kisan_auth_logged_in', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('kisan_auth_logged_out', 'true');
      sessionStorage.removeItem('kisan_session_active');
      localStorage.removeItem('kisan_auth_logged_in');
    } catch (e) {
      console.warn(e);
    }
  };

  // Port 5174: Dedicated Admin Port
  if (isAdminPort) {
    return (
      <div>
        <div className="bg-slate-950 text-white px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-amber-900/40 z-50 sticky top-0 shadow-md font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-300">Dedicated Admin Environment (Port 5174):</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
              👑 Executive Admin & Operations Control Center
            </span>
          </div>
        </div>
        <AdminPortalLayout onSwitchPersona={handleSwitchPersona} />
      </div>
    );
  }

  // Not logged in: Render Unified Authentication Gate
  if (!isLoggedIn) {
    return <AuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  // Logged In: Render top navigation bar with quick persona switcher + active portal
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Universal Ecosystem Persona Switcher Bar */}
      <header className="bg-slate-950 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-bold border-b border-slate-800 z-50 sticky top-0 shadow-lg font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 hidden sm:inline">Kisan Jod Live Ecosystem:</span>
          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-[11px] font-black uppercase border border-slate-700">
            {currentPersona === 'farmer' && '🌾 Farmer Portal'}
            {currentPersona === 'company' && '🏢 Buyer Company'}
            {currentPersona === 'agent' && '👨‍🌾 Field Agent / Middleman'}
            {currentPersona === 'logistics' && '🚚 Freight Logistics'}
            {currentPersona === 'admin' && '👑 Executive Admin'}
          </span>
        </div>

        {/* 5-Persona Quick Tabs for Founder / Reviewer */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            onClick={() => handleSwitchPersona('farmer')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              currentPersona === 'farmer' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Farmer Portal"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Farmer</span>
          </button>

          <button
            onClick={() => handleSwitchPersona('company')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              currentPersona === 'company' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Industrial Buyer Portal"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Buyer</span>
          </button>

          <button
            onClick={() => handleSwitchPersona('agent')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              currentPersona === 'agent' ? 'bg-teal-700 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Middleman / Field Agent Portal"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Field Agent</span>
          </button>

          <button
            onClick={() => handleSwitchPersona('logistics')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              currentPersona === 'logistics' ? 'bg-indigo-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Freight Logistics Portal"
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logistics</span>
          </button>

          <button
            onClick={() => handleSwitchPersona('admin')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              currentPersona === 'admin' ? 'bg-amber-600 text-white font-black shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Admin Command Center"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Admin</span>
          </button>
        </div>

        {/* Right Logout & Switcher Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Logout and return to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Active Persona Portal View */}
      <main className="flex-1">
        {currentPersona === 'farmer' && <FarmerPortal />}
        {currentPersona === 'company' && <CompanyPortalLayout onSwitchPersona={handleSwitchPersona} />}
        {currentPersona === 'agent' && <FieldAgentPortalLayout onSwitchPersona={handleSwitchPersona} onLogout={handleLogout} />}
        {currentPersona === 'logistics' && <LogisticsPortalLayout onSwitchPersona={handleSwitchPersona as any} />}
        {currentPersona === 'admin' && <AdminPortalLayout onSwitchPersona={handleSwitchPersona} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <CompanyProvider>
          <MainAppContent />
        </CompanyProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
