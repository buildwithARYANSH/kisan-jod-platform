import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { ShieldAlert, Sun, Moon, Globe, Bell, User, Mic } from 'lucide-react';
import type { LanguageCode } from '../types';

export const AdminTopNav: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    unreadCount, 
    setActiveSection, 
    profile, 
    setIsVoiceModalOpen 
  } = useAdmin();

  return (
    <header className="sticky top-0 z-40 bg-white   border-b border-gray-200  transition-colors shadow-xs px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: App Logo & Role Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-gray-900  tracking-tight flex items-center gap-2">
              Kisan Jod
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800   font-bold uppercase tracking-wider">
                Field Agent Portal
              </span>
            </h1>
            <p className="text-[10px] text-gray-500  font-medium hidden sm:block">
              Operations Control • Onboarding • Quality Verification • Inventory & Dispatch
            </p>
          </div>
        </div>

        {/* Right Actions: Voice Mic, Theme, Language, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Voice Assistant Trigger */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
            title="Open AI Voice Assistant"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="hidden md:inline">Voice Assistant</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-gray-200  bg-gray-50  text-gray-700  hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Language Selector */}
          <div className="relative hidden sm:flex items-center">
            <Globe className="w-4 h-4 text-gray-500  absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  text-xs font-semibold focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveSection('notifications')}
            className="p-2 rounded-xl border border-gray-200  bg-gray-50  text-gray-700  hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => setActiveSection('profile')}
            className="p-1.5 rounded-xl border border-gray-200  hover:bg-gray-100 dark:hover:bg-slate-50 flex items-center gap-1.5 text-xs font-bold text-gray-800  cursor-pointer"
            title="My Profile"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="hidden lg:inline">{profile.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
