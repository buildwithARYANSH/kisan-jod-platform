import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { ShieldCheck, Search, Bell, Sun, Moon, Globe, LogOut, User, Repeat } from 'lucide-react';
import type { LanguageCode } from '../../types';

interface AdminTopNavProps {
  onSwitchPersona: (persona: 'farmer' | 'company' | 'admin') => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({ onSwitchPersona }) => {
  const { theme, toggleTheme, language, setLanguage, setIsLogoutModalOpen } = useApp();
  const { 
    profile, 
    setActiveSection, 
    setIsGlobalSearchOpen, 
    setIsAdminNotificationOpen,
    riskAlerts,
    disputes 
  } = useAdmin();

  const activeAlertsCount = riskAlerts.filter(r => r.status === 'Requires Review').length + 
                             disputes.filter(d => d.status === 'Investigating' || d.status === 'Admin Review').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-amber-200 text-slate-900 shadow-sm px-4 sm:px-6 md:px-8 lg:px-10 py-3 font-sans">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: App Logo & Enterprise Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl leading-tight text-slate-900 tracking-tight flex items-center gap-2 font-fraunces">
              Kisan Jod
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-black uppercase tracking-wider border border-amber-300">
                Admin Portal
              </span>
            </h1>
            <p className="text-[11px] text-slate-600 font-bold hidden sm:block">
              Platform Governance • Financial Controls • Risk & Dispute Escalation Desk
            </p>
          </div>
        </div>

        {/* Center/Right Actions: Global Search, Persona Selector, Alerts, Theme, Language, Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold cursor-pointer shadow-xs"
            title="Global Search across Farmers, Companies, Orders, Batches"
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Search Platform Entities...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-700 font-mono">⌘K</kbd>
          </button>

          {/* Admin Executive Badge (Isolated Admin Portal) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50 text-amber-950 text-xs font-black shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Admin Control Center</span>
          </div>

          {/* Top Notification Bell */}
          <button
            onClick={() => setIsAdminNotificationOpen(true)}
            className="relative p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 cursor-pointer transition-all shadow-xs"
            title="System Risk Alerts & Dispute Queue Notifications"
          >
            <Bell className="w-4 h-4 text-amber-700" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer shadow-xs"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Language Selector */}
          <div className="relative hidden lg:flex items-center">
            <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-extrabold focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              {SUPPORTED_LANGUAGES.slice(0, 2).map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-semibold">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Profile Trigger */}
          <button
            onClick={() => setActiveSection('profile')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-extrabold text-slate-900 cursor-pointer shadow-xs"
            title="View Admin Profile"
          >
            <User className="w-4 h-4 text-amber-600" />
            <span className="hidden xl:inline">{profile.name.split(' ')[0]} ({profile.role.split(' ')[0]})</span>
          </button>

          {/* Logout Trigger */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
