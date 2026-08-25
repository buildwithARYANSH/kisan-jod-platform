import React from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Sparkles, MessageSquare } from 'lucide-react';
import { stopSpeaking } from '../services/speechService';

export const CentralMicButton: React.FC = () => {
  const { t, setIsVoiceModalOpen, speak, textReaderActive } = useApp();

  const handleMicClick = () => {
    stopSpeaking();
    setIsVoiceModalOpen(true);
  };

  return (
    <section className="my-8 px-4 max-w-2xl mx-auto text-center">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 shadow-md relative overflow-hidden">
        {/* Background Subtle Sparkle Effect */}
        <div className="absolute top-2 right-4 text-emerald-500/20 pointer-events-none">
          <Sparkles className="w-16 h-16 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          AI Voice Assistant (एआई आवाज सहायक)
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-fraunces">
          {t.micPrompt}
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mb-6 max-w-lg mx-auto">
          {t.micSubPrompt}
        </p>

        {/* Central Prominent Microphone Button */}
        <div className="relative inline-block my-2">
          {/* Animated Pulse Ring */}
          <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          <button
            onClick={handleMicClick}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1 mx-auto focus:ring-4 focus:ring-emerald-400 focus:outline-hidden cursor-pointer"
            aria-label={t.micPrompt}
          >
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              {t.micPrompt.split(' ')[0]}
            </span>
          </button>
        </div>

        {/* Example Commands Quick Suggestions */}
        <div className="mt-6 pt-4 border-t border-emerald-100">
          <p className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            {t.trySaying}:
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto text-[11px]">
            <button
              onClick={handleMicClick}
              className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-colors shadow-xs text-left cursor-pointer"
            >
              🎤 "मेरे पास 50 हजार किलो टमाटर हैं"
            </button>
            <button
              onClick={handleMicClick}
              className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-colors shadow-xs text-left cursor-pointer"
            >
              🎤 "टमाटर का क्या रेट है?"
            </button>
            <button
              onClick={handleMicClick}
              className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-colors shadow-xs text-left cursor-pointer"
            >
              🎤 "मेरा पेमेंट दिखाओ"
            </button>
            <button
              onClick={handleMicClick}
              className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-colors shadow-xs text-left cursor-pointer"
            >
              🎤 "भाषा बदलकर हिंदी कर दीजिए"
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
