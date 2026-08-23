import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider } from './context/AppContext';
import { CompanyProvider } from './context/CompanyContext';
import { FarmerPortal } from './components/FarmerPortal';
import { CompanyPortalLayout } from './components/company/CompanyPortalLayout';
import { AdminPortalLayout } from './components/admin/AdminPortalLayout';
import { AuthPortal } from './components/auth/AuthPortal';
import { LogOut } from 'lucide-react';

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

function MainAppContent() {
  const currentPort = typeof window !== 'undefined' ? window.location.port : '';
  const isAdminPort = currentPort === '5174';

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      // Use sessionStorage so every new tab/visit opens the Login Screen first
      return sessionStorage.getItem('kisan_session_active') === 'true';
    } catch {
      return false;
    }
  });

  const [farmerCompanyPersona, setFarmerCompanyPersona] = useState<'farmer' | 'company'>(() => {
    try {
      const saved = localStorage.getItem('kisan_portal_persona');
      if (saved === 'company') return 'company';
      return 'farmer';
    } catch {
      return 'farmer';
    }
  });

  const handleSwitchPersona = (persona: 'farmer' | 'company') => {
    setFarmerCompanyPersona(persona);
    try { localStorage.setItem('kisan_portal_persona', persona); } catch (e) { console.warn(e); }
  };

  const handleLoginSuccess = (role: 'farmer' | 'company') => {
    handleSwitchPersona(role);
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('kisan_session_active', 'true');
      localStorage.setItem('kisan_auth_logged_in', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('kisan_session_active');
      localStorage.removeItem('kisan_auth_logged_in');
    } catch (e) {
      console.warn(e);
    }
  };

  // Port 5174: Isolated Admin & Operations Control Center
  if (isAdminPort) {
    return (
      <div>
        <div className="bg-slate-950 text-white px-4 py-2 flex items-center justify-between text-xs font-bold border-b border-amber-900/40 z-50 sticky top-0 shadow-md font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-300">Isolated Admin & Operations Environment (Port 5174):</span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30">
              👑 Executive Admin & Operations Control Center
            </span>
          </div>
        </div>

        <AdminPortalLayout onSwitchPersona={() => {}} />
      </div>
    );
  }

  // Port 5173: Requires Login First before entering Farmer or Company Portal
  if (!isLoggedIn) {
    return <AuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      {/* Top Persona Switcher & Logout Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold border-b border-slate-800 z-50 sticky top-0 shadow-md font-sans">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">Kisan Jod Authentication Session:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-black uppercase border border-slate-700">
            {farmerCompanyPersona === 'company' 
              ? '🏢 Industrial Buyer Company Portal' 
              : '🌾 Farmer Application Portal'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
            title="Logout and return to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {farmerCompanyPersona === 'company' ? (
        <CompanyPortalLayout />
      ) : (
        <FarmerPortal />
      )}
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
