import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, X } from 'lucide-react';

export const TextReaderBanner: React.FC = () => {
  const { textReaderActive, toggleTextReader, t } = useApp();

  if (!textReaderActive) return null;

  return (
    <div className="bg-green-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-2 z-30 relative animate-pulse">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold max-w-4xl mx-auto">
        <Volume2 className="w-5 h-5 shrink-0 animate-bounce" />
        <span>{t.textReaderActive}</span>
      </div>

      <button
        onClick={toggleTextReader}
        className="p-1 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
        title={t.disableTextReader}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
