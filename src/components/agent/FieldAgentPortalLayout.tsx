import React, { useState } from 'react';
import { AdminProvider, useAdmin } from '../../context/AgentContext';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import type { LanguageCode } from '../../types';

// Middleman Portal Sub-Components
import { AdminDashboard } from './AdminDashboard';
import { AdminDailyTasks } from './AdminDailyTasks';
import { AdminFarmers } from './AdminFarmers';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminDispatch } from './AdminDispatch';
import { AdminRating } from './AdminRating';
import { AdminReferrals } from './AdminReferrals';
import { AdminNotifications } from './AdminNotifications';
import { AdminTaskHistory } from './AdminTaskHistory';
import { AdminReportIssue } from './AdminReportIssue';
import { AdminProfileView } from './AdminProfileView';
import { AdminVoiceModal } from './AdminVoiceModal';
import { AdminVoiceConfirmModal } from './AdminVoiceConfirmModal';

import { 
  UserCheck, 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Warehouse, 
  PackageCheck, 
  Truck, 
  Star, 
  Share2, 
  Bell, 
  History, 
  AlertTriangle, 
  User, 
  Globe, 
  Mic, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  LogOut, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  PhoneCall, 
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FieldAgentPortalLayoutProps {
  onSwitchPersona?: (persona: string) => void;
}

type AgentSection = 
  | 'dashboard' 
  | 'daily-tasks' 
  | 'farmers' 
  | 'assigned-area'
  | 'inventory' 
  | 'orders' 
  | 'dispatch' 
  | 'rating' 
  | 'referrals' 
  | 'notifications' 
  | 'task-history' 
  | 'report-issue' 
  | 'profile';

const FieldAgentMainContent: React.FC<FieldAgentPortalLayoutProps> = ({ onSwitchPersona }) => {
  const { language, setLanguage, setIsLogoutModalOpen } = useApp();
  const { 
    activeSection, 
    setActiveSection, 
    tasks, 
    unreadCount, 
    setIsVoiceModalOpen, 
    isOfflineMode, 
    toggleOfflineMode, 
    offlinePendingSyncCount, 
    syncOfflineData,
    rating,
    profile
  } = useAdmin();

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpCallbackSubmitted, setHelpCallbackSubmitted] = useState(false);

  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 1 && t.status === 'Pending').length;

  const navItems: { id: AgentSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard & SLAs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'daily-tasks', 
      label: 'Daily Tasks (Priority 1-3)', 
      icon: <CheckSquare className="w-4 h-4" />,
      badge: highPriorityCount > 0 ? `${highPriorityCount} Urgent` : pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined
    },
    { id: 'farmers', label: 'My Farmers Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'assigned-area', label: 'Assigned Area & Villages', icon: <MapPin className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory & Batches', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'orders', label: 'Order Lifecycle Checkboxes', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 'dispatch', label: 'Company Dispatch & Fleet', icon: <Truck className="w-4 h-4" /> },
    { 
      id: 'rating', 
      label: 'Agent Rating & Review', 
      icon: <Star className="w-4 h-4" />,
      badge: rating.overallScore < 2 ? '⚠️ Low Rating' : undefined 
    },
    { id: 'referrals', label: 'Referral System & Rewards', icon: <Share2 className="w-4 h-4" /> },
    { 
      id: 'notifications', 
      label: 'Notifications & Alerts', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined 
    },
    { id: 'task-history', label: 'Completed Task History', icon: <History className="w-4 h-4" /> },
    { id: 'report-issue', label: 'Help & Issue Escalation', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile & Earnings', icon: <User className="w-4 h-4" /> },
  ];

  const handleHelpCallback = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpCallbackSubmitted(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setHelpCallbackSubmitted(false);
      setIsHelpModalOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* 📴 Offline Mode Alert Banner (Feature 18) */}
      {isOfflineMode && (
        <div className="bg-amber-600 text-slate-950 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-black shadow-md z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-bounce" />
            <span>OFFLINE MODE ACTIVE — Farmer visits, crop weights & receipts recorded locally without internet.</span>
          </div>

          <div className="flex items-center gap-2">
            {offlinePendingSyncCount > 0 && (
              <button
                onClick={syncOfflineData}
                className="py-1 px-3 rounded-lg bg-slate-950 text-amber-300 hover:bg-slate-900 font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync Offline Data ({offlinePendingSyncCount} pending)
              </button>
            )}
            <button
              onClick={toggleOfflineMode}
              className="py-1 px-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold cursor-pointer"
            >
              Go Online
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Logo & Portal Label */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl leading-tight text-white tracking-tight flex items-center gap-2">
                Kisan Jod
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-400/20 text-purple-300 font-bold uppercase tracking-wider border border-purple-400/30">
                  Middleman & Field Agent Portal
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                On-Ground Farmer Aggregation • Weighbridge Verification • Voice Assistant • Offline Sync
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 🎙️ AI Voice Assistant Trigger (Feature 3) */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Launch AI Voice Assistant"
            >
              <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">AI Voice Assistant</span>
            </button>

            {/* 📴 Offline Mode Toggle Button (Feature 18) */}
            <button
              onClick={toggleOfflineMode}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isOfflineMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Toggle Offline Mode"
            >
              {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* 🆘 Help & Support Button (Feature 19) */}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Company Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Helpline</span>
            </button>

            {/* 🌐 Regional Language Selector (Feature 1) */}
            <div className="relative hidden sm:flex items-center">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.slice(0, 2).map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* 🚪 Logout Button (Feature 20) */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold cursor-pointer transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 p-4">
        {/* Persistent Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-3 shrink-0 text-slate-300 rounded-2xl md:rounded-none">
          <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white text-purple-950'
                          : 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Section View */}
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && <AdminDashboard />}
          {activeSection === 'daily-tasks' && <AdminDailyTasks />}
          {activeSection === 'farmers' && <AdminFarmers />}
          
          {/* 📍 Assigned Area / Region (Feature 10) */}
          {activeSection === 'assigned-area' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl space-y-2">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 uppercase tracking-wider border border-purple-400/30">
                  📍 Regional Territory Map & Assigned Villages
                </span>
                <h2 className="text-2xl font-black text-white">Ludhiana Hub Region — Territory Coverage</h2>
                <p className="text-xs text-slate-400">
                  Assigned territory covering 12 rural villages, 4 collection weighbridge points, and 28 registered smallholder farmers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {['Bhatinda Village North', 'Gill Road Sector', 'Samrala Village Hub', 'Khanna Agricultural Zone', 'Jagraon Sector', 'Focal Point Hub B'].map((village, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-purple-400" /> {village}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Active Coverage
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Assigned Farmers: <strong>{4 + idx * 2} Farmers</strong></p>
                    <p className="text-slate-400 font-mono text-[10px]">Pincode: 14100{idx + 1} • Weighbridge Distance: {5 + idx * 3} km</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'inventory' && <AdminInventory />}
          {activeSection === 'orders' && <AdminOrders />}
          {activeSection === 'dispatch' && <AdminDispatch />}
          {activeSection === 'rating' && <AdminRating />}
          {activeSection === 'referrals' && <AdminReferrals />}
          {activeSection === 'notifications' && <AdminNotifications />}
          {activeSection === 'task-history' && <AdminTaskHistory />}
          {activeSection === 'report-issue' && <AdminReportIssue />}
          {activeSection === 'profile' && <AdminProfileView />}
        </main>
      </div>

      {/* Voice Assistant Modals (Feature 3) */}
      <AdminVoiceModal />
      <AdminVoiceConfirmModal />

      {/* 🆘 Help & Support Modal (Feature 19) */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full text-white space-y-4 relative shadow-2xl">
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Company Toll-Free Support Desk</h3>
                <p className="text-xs text-slate-400">24/7 Agent Assistance & Priority Callback Commitment</p>
              </div>
            </div>

            {helpCallbackSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-sm font-extrabold text-white">Callback Request Registered!</p>
                <p className="text-slate-300 font-normal">A senior operations manager will call your registered phone within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleHelpCallback} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Issue Category</label>
                  <select className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:ring-2 focus:ring-blue-500">
                    <option>Weighbridge Scale Discrepancy</option>
                    <option>Farmer Payment Delay Inquiry</option>
                    <option>Logistics Vehicle Delay</option>
                    <option>Quality Rejection Appeal</option>
                    <option>Emergency Field Support</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Callback Phone Number</label>
                  <input
                    type="text"
                    defaultValue={profile.phone}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    Request 15-Min Callback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const FieldAgentPortalLayout: React.FC<FieldAgentPortalLayoutProps> = (props) => {
  return (
    <AdminProvider>
      <FieldAgentMainContent {...props} />
    </AdminProvider>
  );
};
