import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCompany } from '../../context/CompanyContext';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { Building2, Globe, LogOut, User, Repeat, Bell } from 'lucide-react';
import type { LanguageCode } from '../../types';

interface CompanyTopNavProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void;
}

export const CompanyTopNav: React.FC<CompanyTopNavProps> = ({ onSwitchPersona }) => {
  const { language, setLanguage, setIsLogoutModalOpen } = useApp();
  const { 
    profile, 
    setActiveSection, 
    unreadCompanyNotificationsCount, 
    setIsCompanyNotificationModalOpen 
  } = useCompany();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs px-4 sm:px-6 md:px-8 lg:px-10 py-3.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: App Logo & Portal Label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 flex items-center justify-center text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl leading-tight text-slate-900 tracking-tight flex items-center gap-2 font-fraunces">
              Kisan Jod
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-950 font-black uppercase tracking-wider border border-blue-200">
                Company Portal
              </span>
            </h1>
            <p className="text-[11px] text-blue-900 font-bold hidden sm:block">
              Aggregated Procurement • Multi-Factor Pricing Engine • Verified Quality
            </p>
          </div>
        </div>

        {/* Right Actions: Notifications, Persona Switcher, Language, Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Top-Right Notification Button */}
          <button
            onClick={() => setIsCompanyNotificationModalOpen(true)}
            className="relative p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-all cursor-pointer shadow-xs group"
            title="Corporate Notifications & Demand Alerts"
          >
            <Bell className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
            {unreadCompanyNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {unreadCompanyNotificationsCount}
              </span>
            )}
          </button>



          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-4 h-4 text-blue-800 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 text-blue-950 text-xs font-extrabold focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
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
            title="View Company Profile"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline">{profile.name}</span>
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
