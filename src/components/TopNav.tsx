import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Volume2, Globe, Leaf, Building2, Bell, Repeat } from 'lucide-react';
import type { LanguageCode } from '../types';

interface TopNavProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onSwitchPersona }) => {
  const { 
    language, 
    setLanguage, 
    t, 
    textReaderActive, 
    toggleTextReader, 
    setActiveSection,
    unreadNotificationsCount,
    setIsNotificationModalOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Logo & App Title */}
        <button
          onClick={() => setActiveSection('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl leading-tight text-emerald-950 tracking-tight flex items-center gap-1.5 font-fraunces">
              {t.appName}
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                SIH Farmer
              </span>
            </h1>
            <p className="text-[11px] text-emerald-700 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Right Side: Notification Bell, Persona Switcher, Text Reader & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Top-Right Notification Button */}
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="relative p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 transition-all cursor-pointer shadow-xs group"
            title="Farmer Alerts & Notifications"
          >
            <Bell className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>



          {/* Text Reader Toggle */}
          <button
            onClick={toggleTextReader}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              textReaderActive
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400 ring-offset-1 animate-pulse'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={t.textReaderDesc}
          >
            <Volume2 className={`w-4 h-4 ${textReaderActive ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">
              {textReaderActive ? t.disableTextReader : t.textReaderMode}
            </span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-emerald-700 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-950 text-xs font-extrabold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-xs"
              aria-label={t.selectLanguage}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900 font-semibold">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
