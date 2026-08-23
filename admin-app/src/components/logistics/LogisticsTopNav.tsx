import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { Truck, Search, Sun, Moon, Globe, Bell, User, Repeat } from 'lucide-react';
import type { LanguageCode } from '../../types';

interface LogisticsTopNavProps {
  onSwitchPersona: (persona: 'super-admin' | 'field-agent' | 'logistics') => void;
}

export const LogisticsTopNav: React.FC<LogisticsTopNavProps> = ({ onSwitchPersona }) => {
  const { theme, toggleTheme, language, setLanguage } = useAdmin();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-white tracking-tight flex items-center gap-2">
              Kisan Jod
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-400/20 text-blue-300 font-bold uppercase tracking-wider border border-blue-400/30">
                Logistics Partner Portal
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Sample Fleet Logistics Ltd • Operations Control • Fleet & Driver Assignments
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs w-60">
          <Search className="w-3.5 h-3.5 mr-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, driver, vehicle..."
            className="bg-transparent text-white focus:outline-none w-full font-semibold placeholder:text-slate-500"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <div className="relative hidden sm:flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold"
            >
              {SUPPORTED_LANGUAGES.slice(0, 2).map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
            <User className="w-4 h-4 text-blue-400 ml-1" />
            <span className="hidden lg:inline pr-2">Sample Fleet Logistics</span>
          </div>
        </div>
      </div>
    </header>
  );
};
