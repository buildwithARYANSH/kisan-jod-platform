import React from 'react';
import { useApp } from '../context/AppContext';
import type { NavSection } from '../types';
import { Sprout, Recycle, HeartHandshake, TrendingUp, ReceiptText, User } from 'lucide-react';

export const FeatureNavigation: React.FC = () => {
  const { activeSection, setActiveSection, t, speak, textReaderActive } = useApp();

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; color: string; badge?: string }[] = [
    {
      id: 'crops',
      label: t.myCrop,
      icon: <Sprout className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-emerald-500 to-green-600',
    },
    {
      id: 'waste',
      label: t.wasteManagement,
      icon: <Recycle className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-amber-500 to-orange-600',
      badge: '2nd Stream',
    },
    {
      id: 'women',
      label: t.womenEnterprises,
      icon: <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 'profit',
      label: t.profit,
      icon: <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'paycheck',
      label: t.paycheck,
      icon: <ReceiptText className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 'profile',
      label: t.myProfile,
      icon: <User className="w-7 h-7 sm:w-8 sm:h-8" />,
      color: 'from-teal-500 to-cyan-600',
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (textReaderActive) {
      speak(item.label);
    }
    setActiveSection(item.id);
  };

  return (
    <section className="my-6 px-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 group cursor-pointer border relative overflow-hidden ${
                isActive
                  ? 'bg-white dark:bg-slate-800 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500 shadow-xl scale-105'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg hover:scale-102'
              }`}
            >
              {/* Optional Badge */}
              {item.badge && (
                <span className="absolute top-1 right-1 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  {item.badge}
                </span>
              )}

              {/* Paytm-style Large Circular Icon Button */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-2`}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span className="text-xs font-bold text-slate-900 dark:text-white text-center leading-snug line-clamp-2">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
