import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { useAdmin } from '../../context/AdminContext';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { Crown, Search, Sun, Moon, Globe, Bell, User, Repeat, LogOut } from 'lucide-react';
import type { LanguageCode } from '../../types';

interface SuperAdminTopNavProps {
  onSwitchPersona: () => void;
}

export const SuperAdminTopNav: React.FC<SuperAdminTopNavProps> = ({ onSwitchPersona }) => {
  const { theme, toggleTheme, language, setLanguage } = useAdmin();
  const { setIsGlobalSearchOpen } = useSuperAdmin();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-amber-200 text-slate-900 shadow-sm px-4 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: App Logo & Admin Portal Label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-white font-black shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-slate-900 tracking-tight flex items-center gap-2 font-fraunces">
              Kisan Jod
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-black uppercase tracking-wider border border-amber-300">
                Super-Admin Operations Portal
              </span>
            </h1>
            <p className="text-[11px] text-slate-600 font-bold hidden sm:block">
              Master Platform Control • Unit Economics • Dispute Resolution • Anomaly Monitoring
            </p>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="hidden md:flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs w-64 cursor-pointer transition-colors shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-700">Search orders, farmers, batches...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-700 font-mono">⌘K</kbd>
        </button>

        {/* Right Actions: Theme, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer shadow-xs"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-4 h-4 text-slate-500 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-extrabold cursor-pointer shadow-xs focus:ring-2 focus:ring-amber-500"
            >
              {SUPPORTED_LANGUAGES.slice(0, 2).map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-semibold">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Super-Admin Profile Icon */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-extrabold text-amber-950 shadow-xs">
            <User className="w-4 h-4 text-amber-600 ml-1" />
            <span className="hidden lg:inline pr-2">SuperAdmin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
