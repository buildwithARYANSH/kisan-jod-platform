import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, X, Sparkles, ArrowRight, CheckCircle2, Send, Radio, Loader2, Bot } from 'lucide-react';
import { parseFarmerVoiceIntent, type ParsedVoiceIntent, speakText, getLiveAIResponse, stopSpeaking } from '../services/speechService';

export const VoiceAssistantModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    language, 
    setLanguage,
    t, 
    setActiveSection, 
    addCrop,
    speak 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<ParsedVoiceIntent | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processedRef = useRef<boolean>(false);
  const isVoiceModalOpenRef = useRef(isVoiceModalOpen);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const safeTimeout = (callback: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (isVoiceModalOpenRef.current) {
        callback();
      }
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const handleClose = () => {
    clearAllTimeouts();
    stopSpeaking();
    stopListening();
    setIsVoiceModalOpen(false);
  };

  // Web Speech Recognition setup
  useEffect(() => {
    isVoiceModalOpenRef.current = isVoiceModalOpen;
    if (isVoiceModalOpen) {
      stopSpeaking();
      startListening();
    } else {
      clearAllTimeouts();
      stopSpeaking();
      stopListening();
    }
    return () => {
      clearAllTimeouts();
      stopSpeaking();
      stopListening();
    };
  }, [isVoiceModalOpen]);

  const stopListening = () => {
    stopSpeaking();
    setIsListening(false);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
  };

  const startListening = () => {
    stopSpeaking();
    stopListening();
    setIsListening(true);
    setTranscript('');
    setAiResult(null);
    processedRef.current = false;

    // Check browser SpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let liveText = '';
          for (let i = 0; i < event.results.length; ++i) {
            liveText += event.results[i][0].transcript;
          }

          const trimmedText = liveText.trim();
          if (trimmedText) {
            setTranscript(trimmedText);
          }

          // Debounce execution when user stops speaking for 1.1 seconds
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          if (trimmedText && trimmedText.length > 2 && !processedRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              processedRef.current = true;
              processCommand(trimmedText);
              stopListening();
            }, 1100);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          if (err.error !== 'no-speech') {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          if (!processedRef.current && isListening && isVoiceModalOpenRef.current) {
            try {
              recognition.start();
            } catch (e) {
              setIsListening(false);
            }
          }
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  const processCommand = async (cmdText: string) => {
    stopSpeaking();
    if (!isVoiceModalOpenRef.current) return;

    // 1. Initial fast parse
    const syncResult = parseFarmerVoiceIntent(cmdText, language);
    setAiResult(syncResult);

    // Language Change Action (immediate execution)
    if (syncResult.action === 'CHANGE_LANGUAGE' && syncResult.targetLanguage) {
      setLanguage(syncResult.targetLanguage);
      if (isVoiceModalOpenRef.current) {
        speakText(syncResult.aiResponseText, syncResult.targetLanguage);
      }
      safeTimeout(() => {
        handleClose();
      }, 2000);
      return;
    }

    // Auto-fill and register crop if action is REGISTER_CROP
    if (syncResult.action === 'REGISTER_CROP' && syncResult.cropName && syncResult.quantity) {
      addCrop({
        cropName: syncResult.cropName,
        quantity: syncResult.quantity,
        grade: syncResult.grade || 'A',
        harvestDate: '2026-09-01',
        offerPrice: syncResult.cropName.includes('Tomato') ? 18 : syncResult.cropName.includes('Potato') ? 16 : 22,
        status: 'Listed',
      });
      if (isVoiceModalOpenRef.current) {
        speakText(syncResult.aiResponseText, language);
      }
      setActiveSection('crops');
      safeTimeout(() => {
        handleClose();
      }, 1500);
      return;
    }

    // Direct Navigation Intent (e.g. "apne aalu kaise bechu", "mujhe aalui bechne hai , kaise bechu", "waste kaise beche")
    if (syncResult.action === 'NAVIGATE' && syncResult.targetSection) {
      if (isVoiceModalOpenRef.current) {
        speakText(syncResult.aiResponseText, language);
      }
      setActiveSection(syncResult.targetSection!);
      safeTimeout(() => {
        handleClose();
      }, 1500);
      return;
    }

    // Live AI query for questions, guidance, and open-ended dialogue
    setIsGenerating(true);
    try {
      const liveAnswer = await getLiveAIResponse(cmdText, language, syncResult);
      if (!isVoiceModalOpenRef.current) return;

      setAiResult({
        ...syncResult,
        aiResponseText: liveAnswer.text,
        targetSection: liveAnswer.targetSection || syncResult.targetSection,
      });
      speakText(liveAnswer.text, language);

      if (liveAnswer.targetSection && liveAnswer.targetSection !== 'home') {
        safeTimeout(() => {
          setActiveSection(liveAnswer.targetSection!);
          handleClose();
        }, 3600);
      }
    } catch (err) {
      if (!isVoiceModalOpenRef.current) return;
      speakText(syncResult.aiResponseText, language);
      if (syncResult.targetSection) {
        safeTimeout(() => {
          setActiveSection(syncResult.targetSection!);
          handleClose();
        }, 2000);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickSampleClick = (text: string) => {
    stopSpeaking();
    setTranscript(text);
    processCommand(text);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Click outside backdrop to close and immediately stop speaking */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full border border-emerald-200 shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Kisan Jod Voice AI
        </span>

        <h3 className="text-xl font-black text-slate-900 font-fraunces">
          {isListening ? t.micListening : (language === 'hi' ? 'एआई असिस्टेंट से बोलें या लिखें' : 'Speak or Type to AI Assistant')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 mb-4">
          {t.micSubPrompt}
        </p>

        {/* Realtime Microphone Audio Waveform Effect */}
        <div className="relative inline-block my-2">
          {isListening && (
            <>
              <div className="absolute -inset-6 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="absolute -inset-3 rounded-full bg-green-400/30 animate-pulse" />
            </>
          )}
          <button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-transform cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-red-500 to-emerald-600 animate-pulse scale-105'
                : 'bg-gradient-to-tr from-emerald-600 to-green-500 hover:scale-105'
            }`}
          >
            {isListening ? (
              <Radio className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
            <span className="text-[10px] font-black uppercase tracking-wider mt-1">
              {isListening ? 'LIVE DETECTING' : 'TAP TO SPEAK'}
            </span>
          </button>
        </div>

        {/* Real-time Live Spoken Command Display */}
        {transcript ? (
          <div className="my-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-slate-900 font-bold shadow-xs">
            <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
              <Radio className="w-3 h-3 text-red-500 animate-ping" /> Realtime Live Speech:
            </span>
            <p className="text-sm font-extrabold text-emerald-950">"{transcript}"</p>
          </div>
        ) : (
          isListening && (
            <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 font-semibold italic">
              Listening in real time... Speak now (e.g. "I have 50000 kg tomatoes" / "Tamatar ka bhav kya hai?")
            </div>
          )
        )}

        {/* AI Intent Response Box & Live Generating Indicator */}
        {isGenerating ? (
          <div className="my-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-left space-y-1.5 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
              <span>{language === 'hi' ? 'एआई सहायक सोच रहा है (Live AI Thinking)...' : 'AI Assistant is thinking...'}</span>
            </div>
            <p className="text-xs text-slate-600 font-semibold italic">
              {language === 'hi' ? 'कृषि एआई मॉडल से उत्तर तैयार किया जा रहा है...' : 'Generating agricultural response from AI model...'}
            </p>
          </div>
        ) : (
          aiResult && (
            <div className="my-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                  <Bot className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kisan Jod AI Assistant:</span>
                </div>
                {aiResult.targetSection && aiResult.targetSection !== 'home' && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    {aiResult.targetSection}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                {aiResult.aiResponseText}
              </p>
              {aiResult.targetSection && aiResult.targetSection !== 'home' && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 mt-1">
                  Navigating to {aiResult.targetSection.toUpperCase()}...
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              )}
            </div>
          )
        )}

        {/* Type / Text Command Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customInput.trim()) {
              setTranscript(customInput.trim());
              processCommand(customInput.trim());
              setCustomInput('');
            }
          }}
          className="my-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={language === 'hi' ? 'या यहाँ लिखकर पूछें (उदा. मैं अपना वेस्ट कैसे बेचूं)' : 'Or type a question (e.g. mai apna waste kaise baichu)'}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || isGenerating}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shadow-xs"
            title="Send command"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs font-extrabold text-slate-700 mb-2">
            Sample Voice Commands (Click to Test):
          </p>
          <div className="flex flex-col gap-1.5 max-w-sm mx-auto text-left text-xs">
            <button
              onClick={() => handleQuickSampleClick('Mai apna waste kaise baichu?')}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Mai apna waste kaise baichu?" → <span className="text-amber-800 font-black">Explain & Open Waste</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Mere paas 50 hazaar kilo tamatar hain')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Mere paas 50 hazaar kilo tamatar hain" → <span className="text-emerald-700 font-black">Register Crop</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Tamatar ka rate kya hai?')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Tamatar ka rate kya hai?" → <span className="text-blue-700 font-black">Check Rates</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick('Mera payment dikhao')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "Mera payment dikhao" → <span className="text-purple-700 font-black">Open Paycheck</span>
            </button>
            <button
              onClick={() => handleQuickSampleClick(language === 'hi' ? 'Switch language to English' : 'Meri bhasha Hindi kar do')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-slate-900 font-bold transition-colors cursor-pointer"
            >
              🎤 "{language === 'hi' ? 'Switch language to English' : 'Meri bhasha Hindi kar do'}" → <span className="text-emerald-800 font-black">Change Language</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
