import type { LanguageCode } from '../types';

export interface VoiceIntent {
  action: 'filter_priority' | 'find_task' | 'check_collection' | 'check_inventory' | 'check_rating' | 'read_tasks' | 'unknown';
  targetPriority?: number;
  farmerSearchQuery?: string;
  responseText: string;
}

export const speakText = (text: string, langCode: LanguageCode = 'en') => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const speechLangMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    pa: 'pa-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ta: 'ta-IN',
    te: 'te-IN',
  };

  utterance.lang = speechLangMap[langCode] || 'hi-IN';
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const parseAdminVoiceIntent = (transcript: string): VoiceIntent => {
  const lower = transcript.toLowerCase();

  if (lower.includes('priority') || lower.includes('1') || lower.includes('urgent') || lower.includes('जरूरी')) {
    return {
      action: 'filter_priority',
      targetPriority: 1,
      responseText: 'Showing your Priority 1 highest urgency tasks.',
    };
  }

  if (lower.includes('ramesh') || lower.includes('kumar')) {
    return {
      action: 'find_task',
      farmerSearchQuery: 'Ramesh',
      responseText: 'Opening Ramesh Kumar collection task details.',
    };
  }

  if (lower.includes('collect') || lower.includes('collected') || lower.includes('कटाई') || lower.includes('मात्रा')) {
    return {
      action: 'check_collection',
      responseText: 'Today 7,000 kg total produce has been collected across assigned farmers.',
    };
  }

  if (lower.includes('inventory') || lower.includes('storage') || lower.includes('कोल्ड स्टोरेज') || lower.includes('स्टॉक')) {
    return {
      action: 'check_inventory',
      responseText: 'Approved Storage has 180,000 kg remaining capacity. Cold Storage usage is at 65%.',
    };
  }

  if (lower.includes('rating') || lower.includes('score') || lower.includes('रेटिंग')) {
    return {
      action: 'check_rating',
      responseText: 'Your current operational agent rating is 4.3 out of 5. Tasks completion rate is 94%.',
    };
  }

  return {
    action: 'read_tasks',
    responseText: 'You have 5 total tasks assigned for today. 2 Priority 1 tasks are pending.',
  };
};
