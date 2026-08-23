import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, Headset } from 'lucide-react';

export const TollFreeHelpline: React.FC = () => {
  const { t, speak, textReaderActive } = useApp();

  const handleCallClick = () => {
    if (textReaderActive) {
      speak(t.callUsNow);
    }
  };

  return (
    <section className="my-8 px-4 max-w-4xl mx-auto text-center">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black mb-2 backdrop-blur-xs">
              <Headset className="w-4 h-4 text-emerald-200" />
              {t.needHelp}
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-fraunces text-white">
              {t.tollFreeHelpline}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-1">
              For feature-phone farmers & offline assistance in your local regional language
            </p>
          </div>

          <a
            href="tel:18001234567"
            onClick={handleCallClick}
            className="py-3.5 px-6 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 group focus:outline-hidden cursor-pointer"
          >
            <PhoneCall className="w-5 h-5 text-emerald-600 animate-bounce" />
            <span>1800-123-4567</span>
          </a>
        </div>
      </div>
    </section>
  );
};
