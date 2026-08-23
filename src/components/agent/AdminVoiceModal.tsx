import React from 'react';
import { useAdmin } from '../../context/AgentContext';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react';

export const AdminVoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, voiceTranscript, isListening, startVoiceInput } = useAdmin();

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
            <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce' : ''}`} />
          </div>

          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            AI Operations Voice Assistant
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Speak naturally in your regional language or English
          </p>
        </div>

        {/* Live Transcript Display */}
        <div className="my-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-h-[80px] flex items-center justify-center text-center">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 italic">
            {voiceTranscript || 'Tap button below and speak your operational query...'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={startVoiceInput}
          disabled={isListening}
          className="w-full py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" />
          {isListening ? 'Listening...' : 'Tap to Speak Now'}
        </button>

        {/* Sample Voice Commands */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1 text-[11px] text-gray-500">
          <span className="font-bold text-gray-700 dark:text-gray-300 block">Try saying:</span>
          <p>• "Aaj kitne priority 1 tasks hain?"</p>
          <p>• "Ramesh Kumar ka task dikhao"</p>
          <p>• "Inventory check karo"</p>
          <p>• "Mera rating kya hai?"</p>
        </div>
      </div>
    </div>
  );
};
