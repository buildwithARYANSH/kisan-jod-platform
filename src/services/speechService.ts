import type { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

// Speech Synthesis
export function speakText(text: string, langCode: LanguageCode = 'hi') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  const speechCode = langObj ? langObj.speechCode : 'hi-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechCode;
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try to find a matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang.startsWith(speechCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Intent Parsing Result
export interface ParsedVoiceIntent {
  action: 'REGISTER_CROP' | 'NAVIGATE' | 'QUERY_DEMAND' | 'QUERY_PRICE' | 'CALCULATE_PROFIT' | 'UNKNOWN';
  targetSection?: 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile' | 'home';
  cropName?: string;
  quantity?: number;
  grade?: 'A' | 'B' | 'C';
  aiResponseText: string;
  autoPreFill?: boolean;
}

export function parseFarmerVoiceIntent(transcript: string, currentLang: LanguageCode = 'hi'): ParsedVoiceIntent {
  const text = transcript.toLowerCase().trim();

  // 1. Check Crop Registration Intent (e.g. "Mere paas 50 hazaar kilo tamatar hain", "50000 kg tomato")
  const containsNumber = text.match(/\d+|ha?zaar|thousand|lakh/i);
  const cropKeywords = [
    { name: 'Tomato', keywords: ['tamatar', 'tomato', 'टमाटर'] },
    { name: 'Potato', keywords: ['aalu', 'alu', 'potato', 'आलू'] },
    { name: 'Wheat', keywords: ['gehu', 'gehun', 'wheat', 'गेहूं', 'ਕਣਕ'] },
    { name: 'Red Onion', keywords: ['pyaj', 'pyaaz', 'onion', 'प्याज'] },
    { name: 'Maize (Corn)', keywords: ['makka', 'maize', 'corn', 'मक्का'] },
    { name: 'Cotton', keywords: ['kapas', 'cotton', 'कपास'] },
  ];

  let detectedCrop = '';
  for (const c of cropKeywords) {
    if (c.keywords.some((k) => text.includes(k))) {
      detectedCrop = c.name;
      break;
    }
  }

  // Parse quantity
  let quantity = 0;
  if (text.includes('50 hazaar') || text.includes('50000') || text.includes('50,000')) {
    quantity = 50000;
  } else if (text.includes('20 hazaar') || text.includes('20000') || text.includes('20,000')) {
    quantity = 20000;
  } else if (text.includes('10 hazaar') || text.includes('10000') || text.includes('10,000')) {
    quantity = 10000;
  } else {
    const digitsMatch = text.match(/(\d+)\s*(kg|kilo|क्विंटल|kintal)?/);
    if (digitsMatch && digitsMatch[1]) {
      quantity = parseInt(digitsMatch[1], 10);
      if (text.includes('kintal') || text.includes('क्विंटल')) {
        quantity *= 100; // convert quintal to kg
      }
    }
  }

  if (detectedCrop || (containsNumber && (text.includes('kilo') || text.includes('kg') || text.includes('paas')))) {
    const cropToUse = detectedCrop || 'Tomato';
    const qtyToUse = quantity || 50000;
    return {
      action: 'REGISTER_CROP',
      targetSection: 'crops',
      cropName: cropToUse,
      quantity: qtyToUse,
      grade: 'A',
      autoPreFill: true,
      aiResponseText: currentLang === 'hi' 
        ? `जी समझ गए! आपके पास ${qtyToUse.toLocaleString()} किलो ${cropToUse} दर्ज करने के लिए फॉर्म खोल दिया गया है।`
        : `Got it! Opening your crops section to pre-fill ${qtyToUse.toLocaleString()} kg of ${cropToUse}.`,
    };
  }

  // 2. Navigation Intent
  if (text.includes('fasal') || text.includes('crop') || text.includes('मेरी फसल') || text.includes('फसलें')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'crops',
      aiResponseText: currentLang === 'hi' ? 'आपकी दर्ज फसलें दिखाई जा रही हैं।' : 'Showing your registered crops.',
    };
  }

  if (text.includes('payment') || text.includes('पेमेंट') || text.includes('रसीद') || text.includes('receipt') || text.includes('paise')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'paycheck',
      aiResponseText: currentLang === 'hi' ? 'आपका भुगतान इतिहास एवं डिजिटल रसीदें खोली जा रही हैं।' : 'Opening your payment history & digital receipts.',
    };
  }

  if (text.includes('waste') || text.includes('कचरा') || text.includes('पराली') || text.includes('गोबर') || text.includes('kachra')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'waste',
      aiResponseText: currentLang === 'hi' ? 'कृषि अवशेष एवं कचरा प्रबंधन सेक्शन खोल दिया गया है। आप गीला या सूखा कचरा दर्ज कर सकते हैं।' : 'Opening Waste Management section.',
    };
  }

  if (text.includes('mahila') || text.includes('महिला') || text.includes('women') || text.includes('achar') || text.includes('अचार')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'women',
      aiResponseText: currentLang === 'hi' ? 'महिला ग्रामीण उद्योग सेक्शन खोला जा रहा है।' : 'Opening Women Rural Enterprises section.',
    };
  }

  if (text.includes('profit') || text.includes('मुनाफा') || text.includes('mandi') || text.includes('मंडी') || text.includes('fayda')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'profit',
      aiResponseText: currentLang === 'hi' ? 'मंडी बनाम प्लेटफॉर्म मुनाफा तुलना दिखाई जा रही है।' : 'Showing Mandi vs Platform profit comparison.',
    };
  }

  if (text.includes('profile') || text.includes('प्रोफाइल') || text.includes('खाता') || text.includes('account')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'profile',
      aiResponseText: currentLang === 'hi' ? 'आपकी प्रोफाइल खोली जा रही है।' : 'Opening your profile.',
    };
  }

  // 3. Query Demand
  if (text.includes('demand') || text.includes('मांग') || text.includes('जरूरत') || text.includes('खरीदार')) {
    return {
      action: 'QUERY_DEMAND',
      targetSection: 'home',
      aiResponseText: currentLang === 'hi' 
        ? 'वर्तमान में सबसे अधिक मांग 1,00,000 किलो टमाटर (₹18/किलो) और 5,00,000 किलो गेहूं (₹24/किलो) की है।' 
        : 'Top current demand is 100,000 kg Tomatoes at ₹18/kg and 500,000 kg Wheat at ₹24/kg.',
    };
  }

  // 4. Query Price
  if (text.includes('rate') || text.includes('रेट') || text.includes('भाव') || text.includes('price')) {
    return {
      action: 'QUERY_PRICE',
      targetSection: 'home',
      aiResponseText: currentLang === 'hi'
        ? 'आज प्लेटफॉर्म पर ग्रेड-A टमाटर का भाव ₹18/किलो, गेहूं का भाव ₹24/किलो और आलू का भाव ₹16/किलो चल रहा है।'
        : 'Today platform rates: Grade-A Tomato ₹18/kg, Wheat ₹24/kg, Potato ₹16/kg.',
    };
  }

  // Default fallback AI answer
  return {
    action: 'UNKNOWN',
    targetSection: 'home',
    aiResponseText: currentLang === 'hi'
      ? `मैंने सुना: "${transcript}"। मैं आपकी फसल जोड़ने, मंडी भाव बताने, पेमेंट दिखाने या कचरा बेचने में मदद कर सकता हूँ।`
      : `I heard: "${transcript}". I can help you register crops, check rates, view payments, or manage waste.`,
  };
}

export interface VoiceIntent {
  action: 'filter_priority' | 'find_task' | 'check_collection' | 'check_inventory' | 'check_rating' | 'read_tasks' | 'unknown';
  targetPriority?: number;
  farmerSearchQuery?: string;
  responseText: string;
}

export function parseAdminVoiceIntent(transcript: string): VoiceIntent {
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
}
