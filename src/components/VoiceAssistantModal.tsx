import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { parseFarmerVoiceIntent, type ParsedVoiceIntent } from '../services/speechService';

export const VoiceAssistantModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    language, 
    t, 
    setActiveSection, 
    addCrop,
    speak 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResult, setAiResult] = useState<ParsedVoiceIntent | null>(null);

  // Web Speech Recognition setup
  useEffect(() => {
    if (isVoiceModalOpen) {
      startListening();
    } else {
      setIsListening(false);
    }
  }, [isVoiceModalOpen]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setAiResult(null);

    // Check browser SpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setTranscript(spokenText);
          processCommand(spokenText);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const processCommand = (cmdText: string) => {
    const result = parseFarmerVoiceIntent(cmdText, language);
    setAiResult(result);
    speak(result.aiResponseText);

    // Auto-fill crop if action is REGISTER_CROP
    if (result.action === 'REGISTER_CROP' && result.cropName && result.quantity) {
      addCrop({
        cropName: result.cropName,
        quantity: result.quantity,
        grade: result.grade || 'A',
        harvestDate: '2026-09-01',
        offerPrice: 18,
        status: 'Listed',
      });
    }

    // Auto-navigate if requested
    if (result.targetSection) {
      setTimeout(() => {
        setActiveSection(result.targetSection!);
      }, 1500);
    }
  };

  const handleQuickSampleClick = (text: string) => {
    setTranscript(text);
    processCommand(text);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Kisan Jod Voice AI
        </span>

        <h3 className="text-xl font-black text-slate-900 font-fraunces">
          {isListening ? t.micListening : 'Speak to AI Assistant'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 mb-6">
          {t.micSubPrompt}
        </p>

        {/* Microphone Audio Waveform Effect */}
        <div className="relative inline-block my-4">
          <div className={`absolute -inset-6 rounded-full bg-emerald-500/20 ${isListening ? 'animate-ping' : ''}`} />
          <button
            onClick={startListening}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-transform cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-red-500 to-orange-400 animate-pulse scale-105'
                : 'bg-gradient-to-tr from-emerald-600 to-green-500 hover:scale-105'
            }`}
          >
            <Mic className="w-10 h-10" />
            <span className="text-[10px] font-black uppercase tracking-wider mt-1">
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* Live Spoken Transcript Display */}
        {transcript && (
          <div className="my-4 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 font-bold">
            <span className="text-[10px] text-slate-500 block mb-0.5 font-bold uppercase">Spoken Command:</span>
            "{transcript}"
          </div>
        )}

        {/* AI Intent Response Box */}
        {aiResult && (
          <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              AI Result:
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 font-bold">
              {aiResult.aiResponseText}
            </p>
            {aiResult.targetSection && (
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 mt-1">
                Auto-navigating to {aiResult.targetSection.toUpperCase()}...
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            )}
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-extrabold text-slate-700 mb-2">
            Quick Voice Commands (Click to Test):
          </p>
          <div className="flex flex-col gap-2 max-w-sm mx-auto text-left text-xs">
            <button
              onClick={() => handleQuickSampleClick('Mere paas 50 hazaar kilo tamatar hain')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Mere paas 50 hazaar kilo tamatar hain" → <span className="text-emerald-700 font-black">Auto Pre-fill Crop</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Tamatar ka rate kya hai?')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Tamatar ka rate kya hai?" → <span className="text-blue-700 font-black">Check Platform Rates</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Mera payment dikhao')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Mera payment dikhao" → <span className="text-purple-700 font-black">Open Paycheck</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Mere paas geela kachra hai, ise kaise bech sakta hoon?')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Waste kaise bechna hai?" → <span className="text-amber-700 font-black">Open Waste Mgmt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
