import type { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

// Speech Synthesis
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, langCode: LanguageCode = 'hi') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel ongoing speech immediately
  stopSpeaking();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  const speechCode = langObj ? langObj.speechCode : 'hi-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechCode;
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  activeUtterance = utterance;

  utterance.onend = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
  };

  utterance.onerror = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
  };

  // Try to find a matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang.startsWith(speechCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (activeUtterance) {
        activeUtterance.onend = null;
        activeUtterance.onerror = null;
        activeUtterance = null;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Speech cancellation error:', e);
    }
  }
}

// Intent Parsing Result
export interface ParsedVoiceIntent {
  action: 'REGISTER_CROP' | 'NAVIGATE' | 'QUERY_DEMAND' | 'QUERY_PRICE' | 'CALCULATE_PROFIT' | 'CHANGE_LANGUAGE' | 'UNKNOWN';
  targetSection?: 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile' | 'home';
  targetLanguage?: LanguageCode;
  cropName?: string;
  quantity?: number;
  grade?: 'A' | 'B' | 'C';
  aiResponseText: string;
  autoPreFill?: boolean;
}

// Supported Language Definitions for Voice Recognition
const LANGUAGE_DEFINITIONS: {
  code: LanguageCode;
  nameEn: string;
  nameHi: string;
  keywords: string[];
}[] = [
  {
    code: 'hi',
    nameEn: 'Hindi',
    nameHi: 'हिंदी',
    keywords: [
      'hindi', 'hindii', 'हिंदी', 'हिन्दी', 'हिनदी', 'devanagari', 'देवनगरी'
    ]
  },
  {
    code: 'en',
    nameEn: 'English',
    nameHi: 'अंग्रेजी',
    keywords: [
      'english', 'inglish', 'angrezi', 'angreji', 'angrejhi',
      'अंग्रेजी', 'अंग्रेज़ी', 'इंग्लिश', 'इंगलिश', 'अंगरेजी', 'अंग्रेजि'
    ]
  },
  {
    code: 'pa',
    nameEn: 'Punjabi',
    nameHi: 'पंजाबी',
    keywords: ['punjabi', 'panjabi', 'पंजाबी', 'ਪੰਜਾਬੀ']
  },
  {
    code: 'bn',
    nameEn: 'Bengali',
    nameHi: 'बंगाली',
    keywords: ['bengali', 'bangla', 'बंगाली', 'बांग्ला', 'বাংলা']
  },
  {
    code: 'mr',
    nameEn: 'Marathi',
    nameHi: 'मराठी',
    keywords: ['marathi', 'मराठी']
  },
  {
    code: 'gu',
    nameEn: 'Gujarati',
    nameHi: 'गुजराती',
    keywords: ['gujarati', 'gujrati', 'गुजराती', 'ગુજરાતી']
  },
  {
    code: 'ta',
    nameEn: 'Tamil',
    nameHi: 'तमिल',
    keywords: ['tamil', 'तमिल', 'தமிழ்']
  },
  {
    code: 'te',
    nameEn: 'Telugu',
    nameHi: 'तेलुगु',
    keywords: ['telugu', 'तेलुगु', 'తెలుగు']
  },
  {
    code: 'kn',
    nameEn: 'Kannada',
    nameHi: 'कन्नड़',
    keywords: ['kannada', 'कन्नड़', 'ಕನ್ನಡ']
  },
  {
    code: 'ml',
    nameEn: 'Malayalam',
    nameHi: 'मलयालम',
    keywords: ['malayalam', 'मलयालम', 'മലയാളം']
  },
  {
    code: 'or',
    nameEn: 'Odia',
    nameHi: 'उड़िया',
    keywords: ['odia', 'oriya', 'उड़िया', 'ଓଡ଼ିଆ']
  },
  {
    code: 'as',
    nameEn: 'Assamese',
    nameHi: 'असमिया',
    keywords: ['assamese', 'asomiya', 'असमिया', 'অसमীয়া']
  },
];

// Language Intent Trigger Words in Latin & Devanagari
const LANGUAGE_INTENT_TRIGGERS = [
  // English & Typo variants
  'language', 'langugae', 'langauge', 'laguage', 'lanuage', 'lang',
  'change', 'switch', 'set', 'want', 'need', 'convert', 'select', 'choose', 'make',
  'turn on', 'speak in', 'talk in', 'show in', 'display in', 'please',
  // Hinglish / Latin Hindi
  'bhasha', 'bhasa', 'bhaasha', 'bhashaa', 'boli', 'zuban', 'zabaan',
  'chahiye', 'chaiye', 'chahie', 'chaahiye', 'mangta',
  'kardo', 'krdo', 'kar do', 'kr do', 'karo', 'kijiye', 'kar dijiye', 'karein',
  'badlo', 'badal', 'badal do', 'badal dijiye', 'badaliye', 'change karo',
  'mein', 'me', 'lao', 'lagao', 'laga do', 'rakho', 'chuno', 'chun lo',
  // Devanagari Hindi
  'भाषा', 'भासा', 'बोली', 'ज़ुबान', 'जुबान',
  'चाहिए', 'चाहिये', 'चाहीए', 'चाहे', 'मांगता',
  'करो', 'कर दो', 'करदो', 'कीजिए', 'कर दीजिए', 'करें',
  'बदलो', 'बदल', 'बदल दो', 'बदल दीजिए', 'बदलिए',
  'में', 'लगाओ', 'लगा दो', 'रखो', 'चुनो', 'चुन लो',
  'चेंज', 'स्विच', 'सेट', 'वांट', 'आई वांट', 'प्लीज',
  'लैंग्वेज', 'लेंग्वेज', 'लैंग्वेज़'
];

export function parseFarmerVoiceIntent(transcript: string, currentLang: LanguageCode = 'hi'): ParsedVoiceIntent {
  const text = transcript.toLowerCase().trim();

  // Normalize phonetic and common STT transcription variants
  const normalizedText = text
    .replace(/langugae|langauge|laguage|lanuage/g, 'language')
    .replace(/bhasa|bhashaa|bhaasha/g, 'bhasha')
    .replace(/chaiye|chahie|chahiye|chaahiye/g, 'chahiye')
    .replace(/krdo|kardo|kar do|kar dijiye|kr do/g, 'kardo')
    .replace(/badal dijiye|badal do|badalo|badliye|badlo/g, 'badlo');

  // =========================================================================
  // 0. Language Switching Intent (e.g. "i want the language hindi", "mujhe bhasha hindi chaiye", "meri bhasha hindi krdo", "bhasha badal dijiye", "मुझे भाषा हिंदी चाहिए")
  // =========================================================================
  const hasLanguageTrigger = LANGUAGE_INTENT_TRIGGERS.some(trigger => 
    normalizedText.includes(trigger.toLowerCase())
  );

  // Check if a specific target language was requested
  let detectedTargetLang: typeof LANGUAGE_DEFINITIONS[0] | null = null;
  for (const langDef of LANGUAGE_DEFINITIONS) {
    if (langDef.keywords.some((k) => normalizedText.includes(k.toLowerCase()))) {
      detectedTargetLang = langDef;
      break;
    }
  }

  // If a specific language is detected AND (language trigger is present OR the phrase is simple/direct)
  if (detectedTargetLang) {
    const isDirectLangMention = 
      hasLanguageTrigger || 
      normalizedText === detectedTargetLang.code || 
      detectedTargetLang.keywords.some(k => normalizedText === k.toLowerCase() || normalizedText.includes(k.toLowerCase()));

    if (isDirectLangMention) {
      const isHindiTarget = detectedTargetLang.code === 'hi';
      const isEnglishTarget = detectedTargetLang.code === 'en';

      let responseMsg = '';
      if (isHindiTarget) {
        responseMsg = 'भाषा बदलकर हिंदी कर दी गई है। अब सभी जानकारी हिंदी में दिखाई जाएगी।';
      } else if (isEnglishTarget) {
        responseMsg = 'Language has been changed to English. All information will now be displayed in English.';
      } else {
        responseMsg = `भाषा बदलकर ${detectedTargetLang.nameHi} (${detectedTargetLang.nameEn}) कर दी गई है।`;
      }

      return {
        action: 'CHANGE_LANGUAGE',
        targetLanguage: detectedTargetLang.code,
        aiResponseText: responseMsg,
      };
    }
  }

  // Generic Language Change Intent without specifying language (e.g. "bhasha badal dijiye", "bhasha badlo", "भाषा बदल दीजिए", "भाषा बदलो", "change language", "switch language")
  const isGenericChangeIntent = 
    normalizedText.includes('bhasha badlo') || 
    normalizedText.includes('bhasha change') || 
    normalizedText.includes('change language') || 
    normalizedText.includes('switch language') || 
    normalizedText.includes('bhasha badal') ||
    normalizedText.includes('भाषा बदलो') ||
    normalizedText.includes('भाषा बदल') ||
    normalizedText.includes('भाषा चेंज') ||
    normalizedText.includes('लैंग्वेज चेंज') ||
    normalizedText.includes('लैंग्वेज बदलो') ||
    normalizedText === 'bhasha' ||
    normalizedText === 'language' ||
    normalizedText === 'भाषा' ||
    normalizedText === 'लैंग्वेज';

  if (isGenericChangeIntent) {
    // Toggle between Hindi and English by default
    const nextLangCode: LanguageCode = currentLang === 'hi' ? 'en' : 'hi';
    const responseMsg = nextLangCode === 'hi'
      ? 'भाषा बदलकर हिंदी कर दी गई है। अब सभी जानकारी हिंदी में दिखाई जाएगी।'
      : 'Language has been switched to English. All information will now be displayed in English.';

    return {
      action: 'CHANGE_LANGUAGE',
      targetLanguage: nextLangCode,
      aiResponseText: responseMsg,
    };
  }

  // =========================================================================
  // 1. Waste & Parali Selling & Management Queries (e.g. "mai apna waste kaise baichu", "kachra kaise beche", "parali kaise beche")
  // =========================================================================
  const isWasteQuery = 
    text.includes('waste') ||
    text.includes('वेस्ट') ||
    text.includes('कचरा') ||
    text.includes('kachra') ||
    text.includes('पराली') ||
    text.includes('parali') ||
    text.includes('stubble') ||
    text.includes('गोबर') ||
    text.includes('gobar') ||
    text.includes('dung') ||
    text.includes('अवशेष') ||
    text.includes('खोई') ||
    text.includes('bagasse');

  if (isWasteQuery) {
    const isAskingHowToSell = 
      text.includes('kaise') ||
      text.includes('bechu') ||
      text.includes('baichu') ||
      text.includes('beche') ||
      text.includes('bechna') ||
      text.includes('sell') ||
      text.includes('खरीदार') ||
      text.includes('दाम') ||
      text.includes('rate') ||
      text.includes('भाव') ||
      text.includes('कैसे') ||
      text.includes('बेचूं') ||
      text.includes('बेचें') ||
      text.includes('बेचना');

    let wasteResponse = '';
    if (isAskingHowToSell) {
      wasteResponse = currentLang === 'hi'
        ? 'किसान जोड़ पर आप अपनी पराली, फसल अवशेष और गाय का गोबर सीधे बायोफ्यूल एवं पेपर मिलों को ₹2 से ₹3 प्रति किलो के भाव पर बेच सकते हैं। नीचे दिए गए "कचरा प्रबंधन" सेक्शन में कचरा दर्ज करें। फील्ड एजेंट आपके खेत पर आकर वजन करेंगे और भुगतान सीधे आपके बैंक खाते में होगा।'
        : 'On Kisan Jod, you can sell crop stubble (parali), biomass residue, and cow dung directly to biofuel and paper plants at ₹2 to ₹3 per kg. Open the Waste Management section, register your waste quantity, and our field agent will collect it directly with digital DBT payment.';
    } else {
      wasteResponse = currentLang === 'hi'
        ? 'कृषि अवशेष एवं कचरा प्रबंधन (कचरा मार्केट) सेक्शन खोल दिया गया है। यहाँ आप पराली, फसल अवशेष या गोबर दर्ज कर सकते हैं।'
        : 'Opening Agri-Waste Management section. Here you can list parali stubble, crop residue, or cow dung for industrial buyers.';
    }

    return {
      action: 'NAVIGATE',
      targetSection: 'waste',
      aiResponseText: wasteResponse,
    };
  }

  // =========================================================================
  // 2. Crop Registration & Selling Intent (e.g. "mere paas 500 kg aalu hai", "mujhe aalui bechne hai , kaise bechu", "aalu kaise bechu")
  // =========================================================================
  const cropKeywords = [
    { name: 'Potato', keywords: ['aaloo', 'aalu', 'aloo', 'alu', 'aalui', 'alun', 'potato', 'potatoes', 'आलू', 'आलुओं'] },
    { name: 'Tomato', keywords: ['tamatar', 'tomato', 'tomatoes', 'tmatar', 'tamaatar', 'टमाटर'] },
    { name: 'Wheat', keywords: ['gehu', 'gehun', 'gheu', 'wheat', 'kanak', 'गेंहू', 'गेहूं', 'गेहूँ', 'कणक'] },
    { name: 'Red Onion', keywords: ['pyaj', 'pyaaz', 'pyaz', 'pyaaj', 'onion', 'onions', 'प्याज'] },
    { name: 'Maize (Corn)', keywords: ['makka', 'makki', 'maize', 'corn', 'मक्का', 'मक्की'] },
    { name: 'Cotton', keywords: ['kapas', 'kapaas', 'cotton', 'कपास'] },
    { name: 'Paddy', keywords: ['dhan', 'dhaan', 'paddy', 'chawal', 'chaawal', 'rice', 'धान', 'चावल'] },
    { name: 'Mustard', keywords: ['sarson', 'sarso', 'mustard', 'rai', 'सरसों', 'राई'] },
    { name: 'Chickpea', keywords: ['chana', 'chanaa', 'chickpea', 'gram', 'चना'] },
  ];

  const CROP_HINDI_NAMES: Record<string, string> = {
    Tomato: 'टमाटर',
    Potato: 'आलू',
    Wheat: 'गेहूं',
    'Red Onion': 'प्याज',
    'Maize (Corn)': 'मक्का',
    Cotton: 'कपास',
    Paddy: 'धान',
    Mustard: 'सरसों',
    Chickpea: 'चना',
  };

  let detectedCrop = '';
  for (const c of cropKeywords) {
    if (c.keywords.some((k) => text.includes(k))) {
      detectedCrop = c.name;
      break;
    }
  }

  // Parse quantity
  let quantity = 0;
  if (text.includes('50 hazaar') || text.includes('50000') || text.includes('50,000') || text.includes('50 हजार')) {
    quantity = 50000;
  } else if (text.includes('20 hazaar') || text.includes('20000') || text.includes('20,000') || text.includes('20 हजार')) {
    quantity = 20000;
  } else if (text.includes('10 hazaar') || text.includes('10000') || text.includes('10,000') || text.includes('10 हजार')) {
    quantity = 10000;
  } else if (text.includes('5 hazaar') || text.includes('5000') || text.includes('5,000') || text.includes('5 हजार')) {
    quantity = 5000;
  } else if (text.includes('1 hazaar') || text.includes('1000') || text.includes('1,000') || text.includes('1 हजार') || text.includes('ek hazaar')) {
    quantity = 1000;
  } else {
    const digitsMatch = text.match(/\b(\d+)\b/);
    if (digitsMatch && digitsMatch[1]) {
      quantity = parseInt(digitsMatch[1], 10);
      if (text.includes('kintal') || text.includes('क्विंटल') || text.includes('quintal')) {
        quantity *= 100; // convert quintal to kg
      }
    }
  }

  const isSellingCrop =
    text.includes('bech') ||
    text.includes('baich') ||
    text.includes('sell') ||
    text.includes('sale') ||
    text.includes('बेच') ||
    text.includes('बिक्री') ||
    text.includes('kha') ||
    text.includes('kaha') ||
    text.includes('kahan') ||
    text.includes('kahaa') ||
    text.includes('kidhar') ||
    text.includes('kaise') ||
    text.includes('kisko') ||
    text.includes('kise') ||
    text.includes('कहाँ') ||
    text.includes('कहा') ||
    text.includes('किधर') ||
    text.includes('कैसे') ||
    text.includes('किसको') ||
    text.includes('किसे') ||
    text.includes('paas') ||
    text.includes('पास') ||
    text.includes('hain') ||
    text.includes('hai') ||
    text.includes('दर्ज') ||
    text.includes('register') ||
    text.includes('daal') ||
    text.includes('dal');

  const isCropGeneral =
    detectedCrop !== '' ||
    text.includes('fasal') ||
    text.includes('crop') ||
    text.includes('मेरी फसल') ||
    text.includes('फसलें') ||
    text.includes('फसल') ||
    text.includes('produce') ||
    text.includes('उपज') ||
    text.includes('sabzi') ||
    text.includes('sabji') ||
    text.includes('अनाज');

  // Case A: Quantity is specified -> Automatically Register Crop and Open My Crops Portal
  if (isCropGeneral && quantity > 0) {
    const cropToUse = detectedCrop || 'Potato';
    const cropNameHi = CROP_HINDI_NAMES[cropToUse] || cropToUse;
    return {
      action: 'REGISTER_CROP',
      targetSection: 'crops',
      cropName: cropToUse,
      quantity: quantity,
      grade: 'A',
      autoPreFill: true,
      aiResponseText: currentLang === 'hi' 
        ? `जी समझ गए! आपके पास ${quantity.toLocaleString()} किलो ${cropNameHi} दर्ज कर दिया गया है और "मेरी फसल" पोर्टल खोल दिया गया है।`
        : `Got it! Registered ${quantity.toLocaleString()} kg of ${cropToUse} and opened My Crops portal.`,
    };
  }

  // Case B: No quantity mentioned -> Open My Crops Portal and Guide on Selling
  if (isCropGeneral && (isSellingCrop || text.includes('kaise') || text.includes('कैसे') || text.includes('kholo') || text.includes('portal') || text.includes('dikhao') || text.includes('dekh'))) {
    const cropNameHi = detectedCrop ? (CROP_HINDI_NAMES[detectedCrop] || detectedCrop) : 'फसल';
    const cropNameEn = detectedCrop || 'crops';
    return {
      action: 'NAVIGATE',
      targetSection: 'crops',
      cropName: detectedCrop || undefined,
      aiResponseText: currentLang === 'hi'
        ? `अपनी ${cropNameHi} बेचने के लिए "मेरी फसल" पोर्टल खोल दिया गया है। यहाँ आप वजन और ग्रेड डालकर अपनी फसल सीधे कंपनियों को अच्छे भाव पर बेच सकते हैं।`
        : `Opening My Crops portal to sell your ${cropNameEn}. Here you can list your produce quantity and grade to match with active buyers.`,
    };
  }

  // =========================================================================
  // 3. Navigation & Other Agricultural Queries
  // =========================================================================
  if (text.includes('fasal') || text.includes('crop') || text.includes('मेरी फसल') || text.includes('फसलें') || text.includes('फसल')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'crops',
      aiResponseText: currentLang === 'hi' 
        ? 'आपकी दर्ज फसलें दिखाई जा रही हैं।' 
        : 'Showing your registered crops.',
    };
  }

  if (text.includes('payment') || text.includes('पेमेंट') || text.includes('रसीद') || text.includes('receipt') || text.includes('paise') || text.includes('पैसे') || text.includes('रुपये')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'paycheck',
      aiResponseText: currentLang === 'hi' 
        ? 'किसान जोड़ पर 30% अग्रिम भुगतान वजन होते ही और 70% डिलीवरी के बाद सीधे बैंक खाते में आता है। आपकी डिजिटल रसीदें खोली जा रही हैं।' 
        : 'Payments are direct DBT transfers (30% on intake weighbridge, 70% post delivery). Opening your paycheck & receipts.',
    };
  }

  if (text.includes('mahila') || text.includes('महिला') || text.includes('women') || text.includes('achar') || text.includes('अचार') || text.includes('पापड़')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'women',
      aiResponseText: currentLang === 'hi' ? 'महिला ग्रामीण उद्योग सेक्शन खोला जा रहा है। यहाँ अचार, पापड़ और हस्तनिर्मित उत्पाद उपलब्ध हैं।' : 'Opening Women Rural Enterprises section.',
    };
  }

  if (text.includes('profit') || text.includes('मुनाफा') || text.includes('mandi') || text.includes('मंडी') || text.includes('fayda') || text.includes('फायदा')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'profit',
      aiResponseText: currentLang === 'hi' ? 'मंडी बनाम किसान जोड़ मुनाफा तुलना दिखाई जा रही है। यहाँ बिचौलियों का कोई कमीशन नहीं कटता।' : 'Showing Mandi vs Platform profit comparison.',
    };
  }

  if (text.includes('profile') || text.includes('प्रोफाइल') || text.includes('खाता') || text.includes('account')) {
    return {
      action: 'NAVIGATE',
      targetSection: 'profile',
      aiResponseText: currentLang === 'hi' ? 'आपकी किसान प्रोफाइल एवं बैंक विवरण खोला जा रहा है।' : 'Opening your profile and verified bank details.',
    };
  }

  // 4. Query Demand
  if (text.includes('demand') || text.includes('मांग') || text.includes('जरूरत') || text.includes('खरीदार')) {
    return {
      action: 'QUERY_DEMAND',
      targetSection: 'home',
      aiResponseText: currentLang === 'hi' 
        ? 'वर्तमान में सबसे अधिक मांग 1,00,000 किलो टमाटर (₹18/किलो), 5,00,000 किलो गेहूं (₹24/किलो) और बायोफ्यूल पराली (₹2.50/किलो) की है।' 
        : 'Top current demand is 100,000 kg Tomatoes at ₹18/kg, 500,000 kg Wheat at ₹24/kg, and Biofuel Parali at ₹2.50/kg.',
    };
  }

  // 5. Query Price
  if (text.includes('rate') || text.includes('रेट') || text.includes('भाव') || text.includes('price') || text.includes('दाम')) {
    return {
      action: 'QUERY_PRICE',
      targetSection: 'home',
      aiResponseText: currentLang === 'hi'
        ? 'आज प्लेटफॉर्म पर Agmarknet लाइव भाव: ग्रेड-A टमाटर ₹18/किलो, गेहूं ₹24/किलो, आलू ₹16/किलो और पराली ₹2.50/किलो चल रहा है।'
        : 'Today live Agmarknet benchmark rates: Grade-A Tomato ₹18/kg, Wheat ₹24/kg, Potato ₹16/kg, and Parali ₹2.50/kg.',
    };
  }

  // 6. Intelligent Contextual Agricultural Answer Fallback
  return {
    action: 'UNKNOWN',
    targetSection: 'home',
    aiResponseText: generateAgriculturalAIAnswer(transcript, currentLang).text,
  };
}

// =========================================================================
// Built-in Agricultural & Conversational Intelligence Engine
// =========================================================================
export function generateAgriculturalAIAnswer(
  query: string, 
  lang: LanguageCode = 'hi'
): { text: string; targetSection?: 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile' | 'home' } {
  const q = query.toLowerCase();

  // 1. Waste selling & parali
  if (q.includes('waste') || q.includes('कचरा') || q.includes('वेस्ट') || q.includes('पराली') || q.includes('stubble') || q.includes('गोबर') || q.includes('dung')) {
    return {
      text: lang === 'hi'
        ? 'किसान जोड़ पर आप अपनी पराली (crop stubble), धान के अवशेष और गोबर सीधे बायोफ्यूल एवं पेपर मिलों को ₹2 से ₹3 प्रति किलो के भाव पर बेच सकते हैं। बस "कचरा प्रबंधन" सेक्शन में जाकर मात्रा दर्ज करें।'
        : 'On Kisan Jod, you can sell parali, crop residue, and cow dung directly to biofuel plants at ₹2 to ₹3/kg. Enter the Waste Management section to list your quantity.',
      targetSection: 'waste'
    };
  }

  // 2. Crop selling
  if (q.includes('fasal') || q.includes('crop') || q.includes('bechna') || q.includes('bechu') || q.includes('फसल') || q.includes('बेच')) {
    return {
      text: lang === 'hi'
        ? 'फसल बेचने के लिए "मेरी फसल" सेक्शन में जाकर फसल का नाम, ग्रेड और वजन दर्ज करें। पास की फूड प्रोसेसिंग कंपनियां तुरंत मांग के अनुसार खरीदारी करेंगी।'
        : 'To sell your crops, go to "My Crops" section and enter your crop name, grade, and quantity. Industrial buyers will match your produce directly.',
      targetSection: 'crops'
    };
  }

  // 3. Weather & irrigation
  if (q.includes('mausam') || q.includes('weather') || q.includes('barish') || q.includes('rain') || q.includes('sinchai') || q.includes('पानी') || q.includes('मौसम') || q.includes('बारिश')) {
    return {
      text: lang === 'hi'
        ? 'मौसम अभी सामान्य है। हल्की धूप और मध्यम हवा रहेगी। फसलों में पानी शाम के समय लगाएं ताकि नमी बनी रहे और पानी की बचत हो।'
        : 'Current weather is clear and favorable. Water your fields during late evenings for optimum moisture retention.',
      targetSection: 'home'
    };
  }

  // 4. Fertilizer & Pesticides
  if (q.includes('khad') || q.includes('fertilizer') || q.includes('keetnashak') || q.includes('pesticide') || q.includes('खाद') || q.includes('कीटनाशक') || q.includes('यूरिया')) {
    return {
      text: lang === 'hi'
        ? 'फसल की अच्छी पैदावार के लिए संतुलित NPK खाद और नीम-आधारित जैविक कीटनाशक का प्रयोग करें। मिट्टी जांच के अनुसार ही यूरिया डालें।'
        : 'Use balanced NPK fertilizers and neem-based organic pest control. Follow soil health card guidelines for urea application.',
      targetSection: 'home'
    };
  }

  // 5. Government Schemes & Subsidies
  if (q.includes('yojana') || q.includes('subsidy') || q.includes('pm kisan') || q.includes('बीमा') || q.includes('योजना') || q.includes('सब्सिडी')) {
    return {
      text: lang === 'hi'
        ? 'पीएम-किसान सम्मान निधि (PM-Kisan) के तहत सालाना ₹6,000 की वित्तीय मदद और फसल बीमा योजना से नुकसान पर सुरक्षा मिलती है। निकटतम CSC केंद्र से आवेदन करें।'
        : 'Under PM-Kisan scheme, farmers get ₹6,000 annual support, and PMFBY covers crop loss insurance. Apply at your nearest CSC center.',
      targetSection: 'home'
    };
  }

  // Default Polite & Informative AI Answer
  return {
    text: lang === 'hi'
      ? `नमस्ते किसान भाई! आपके सवाल "${query}" के संदर्भ में - किसान जोड़ पर आप बिना बिचौलियों के सीधे कंपनियों को अपनी फसल और पराली सही दाम पर बेच सकते हैं। किसी भी सहायता के लिए हमारे टोल-फ्री नंबर 1800-120-KISAN पर कॉल कर सकते हैं।`
      : `Hello! Regarding your query "${query}" - on Kisan Jod, you can sell crops and agri-waste directly to verified industrial buyers at fair benchmark prices. For support, call our toll-free line 1800-120-KISAN.`,
    targetSection: 'home'
  };
}

// =========================================================================
// Live AI Model Integration (Ollama / Local LLM / Smart Fallback)
// =========================================================================
export async function getLiveAIResponse(
  userQuery: string,
  lang: LanguageCode = 'hi',
  fallbackResult?: ParsedVoiceIntent
): Promise<{ text: string; targetSection?: 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile' | 'home' }> {
  // Try Live Ollama API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const systemPrompt = lang === 'hi'
      ? 'आप किसान जोड़ (Kisan Jod) के स्मार्ट कृषि एआई सहायक हैं। किसान भाइयों को सरल, मधुर, व्यावहारिक और संक्षिप्त हिंदी में 2 वाक्यों में उत्तर दें। अगर सवाल पराली/कचरा बेचने का है तो बताएं कि किसान जोड़ के वेस्ट मार्केट में पराली ₹2-3/किलो बिकती है। फसल बिक्री, मंडी भाव और खेती से जुड़े सवालों का सही मार्गदर्शन करें।'
      : 'You are the Kisan Jod agricultural AI assistant. Answer the farmer concisely in 2 friendly, helpful sentences. Guide them on selling crops, managing agri-waste/parali, or mandi rates.';

    const payload = {
      model: 'llama3.2',
      prompt: `${systemPrompt}\n\nकिसान का सवाल: "${userQuery}"\nउत्तर:`,
      stream: false,
      options: {
        temperature: 0.6,
        num_predict: 80,
      },
    };

    // Try Vite proxy first, fallback to direct localhost port
    let response = await fetch('/api/ollama/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch(async () => {
      return await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      if (data && data.response && data.response.trim()) {
        const text = data.response.trim();
        const q = userQuery.toLowerCase();
        let targetSection: 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile' | 'home' = fallbackResult?.targetSection || 'home';
        if (q.includes('waste') || q.includes('कचरा') || q.includes('पराली') || q.includes('गोबर') || q.includes('वेस्ट')) {
          targetSection = 'waste';
        } else if (q.includes('crop') || q.includes('fasal') || q.includes('फसल')) {
          targetSection = 'crops';
        }
        return { text, targetSection };
      }
    }
  } catch (e) {
    // Fallback to local intelligent agricultural engine
  }

  // Instant fallback to Smart Agricultural Intelligence Engine
  return generateAgriculturalAIAnswer(userQuery, lang);
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
