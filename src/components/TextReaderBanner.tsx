import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, X } from 'lucide-react';

export const TextReaderBanner: React.FC = () => {
  const { textReaderActive, toggleTextReader, t } = useApp();

  if (!textReaderActive) return null;

  return (
    <div className="bg-emerald-700 text-white px-3 sm:px-4 py-2 shadow-xs flex items-center justify-between gap-2 z-20 relative border-b border-emerald-600">
      <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold max-w-4xl mx-auto truncate">
        <Volume2 className="w-4 h-4 shrink-0 text-emerald-200 animate-pulse" />
        <span className="truncate">{t.textReaderActive}</span>
      </div>

      <button
        onClick={toggleTextReader}
        className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white shrink-0 cursor-pointer transition-colors"
        title={t.disableTextReader}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
