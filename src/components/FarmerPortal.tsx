import React, { useEffect, useState, useRef, type ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import type { Grade, IndustryDemand } from '../types';
import { TextReaderBanner } from './TextReaderBanner';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { LogoutModal } from './LogoutModal';
import { NotificationModal } from './NotificationModal';
import { ComplaintModal } from './ComplaintModal';
import { ToastContainer } from './ToastContainer';
import { PayoutCorridorCard } from './PayoutCorridorCard';
import { stopSpeaking } from '../services/speechService';
import { 
  ArrowLeft, Bell, ChevronRight, CircleHelp, CircleUserRound, Coins, CreditCard, HandCoins, 
  Headphones, Languages, Leaf, MapPin, Megaphone, Mic, Phone, Plus, ReceiptIndianRupee, 
  RotateCcw, ShieldCheck, Sparkles, Sprout, Tractor, Volume2, X, ShieldAlert, LogOut, 
  CheckCircle2, AlertCircle, Scale, Tag, Calendar, Eye, Trash2, Recycle, HeartHandshake,
  TrendingUp, RefreshCw, Globe
} from 'lucide-react';

type Language = 'hi' | 'en';
type Screen = 'language' | 'tutorial' | 'home';
type Panel = 'none' | 'notifications' | 'profile' | 'demand' | 'crop' | 'payments' | 'support' | 'complaint' | 'profit' | 'waste' | 'women';

const assets = {
  logo: '/assets/kisan-saathi-logo.png',
  hero: '/assets/kisan-saathi-hero.jpg',
  wheat: '/assets/kisan-saathi-wheat.png',
  chickpea: '/assets/kisan-saathi-chickpea.png',
  corn: '/assets/kisan-saathi-corn.png',
};

const CROP_IMAGES: Record<string, string> = {
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
  'Red Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
  Paddy: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=400&auto=format&fit=crop&q=80',
  Mustard: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80',
};

const CROP_NAME_MAP: Record<string, { hi: string; en: string }> = {
  Tomato: { hi: 'टमाटर', en: 'Tomato' },
  Potato: { hi: 'आलू', en: 'Potato' },
  Wheat: { hi: 'गेहूँ', en: 'Wheat' },
  'Red Onion': { hi: 'प्याज', en: 'Red Onion' },
  Onion: { hi: 'प्याज', en: 'Onion' },
  Maize: { hi: 'मक्का', en: 'Maize' },
  'Maize (Corn)': { hi: 'मक्का', en: 'Maize' },
  Cotton: { hi: 'कपास', en: 'Cotton' },
  Paddy: { hi: 'धान', en: 'Paddy' },
  Mustard: { hi: 'सरसों', en: 'Mustard' },
  Chickpea: { hi: 'चना', en: 'Chickpea' },
};

export function getCropDisplayName(name: string, lang: Language): string {
  if (!name) return name;
  const matchKey = Object.keys(CROP_NAME_MAP).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );
  if (matchKey) {
    return lang === 'hi' ? CROP_NAME_MAP[matchKey].hi : CROP_NAME_MAP[matchKey].en;
  }
  return name;
}

const copy = {
  hi: {
    app: "किसान जोड़ (किसान साथी)",
    welcome: "नमस्ते, किसान भाई",
    ask: "बोलिए, आज आपकी कैसे मदद करूँ?",
    speak: "बोलकर बताइए",
    currentDemand: "अभी की मांग",
    seeAll: "सब देखें",
    whatNext: "आज क्या करना है?",
    myCrops: "मेरी फसल",
    payment: "पैसे",
    profit: "फायदा",
    help: "मदद",
    listen: "सुनें",
    haveCrop: "मेरे पास है",
    registered: "पहले से दर्ज",
    needed: "कुल जरूरत",
    price: "भाव",
    updated: "भाव आज सुबह अपडेट हुए",
    crops: "मेरी दर्ज फसल",
    addCrop: "फसल जोड़ें",
    matched: "खरीदार मिल गया",
    viewPayments: "अपने पैसे देखें",
    paymentReceived: "₹12,500 मिल गए",
    paymentSub: "5 अगस्त 2026 · फसल बिक्री",
    safeSale: "सही दाम, सीधी बिक्री",
    safeSaleText: "हम आपकी फसल को सही खरीदार तक पहुँचाने में मदद करते हैं।",
    callHelp: "मदद चाहिए? मुफ़्त में फोन करें",
    bottomHome: "घर",
    bottomCrops: "मेरी फसल",
    bottomVoice: "बोलें",
    bottomHelp: "मदद",
    bottomProfile: "मेरी जानकारी",
    chooseLanguage: "अपनी भाषा चुनें",
    chooseLanguageSub: "जिस भाषा में आपको सुविधा हो, उसे दबाइए",
    start: "आगे बढ़ें",
    tutorialTitle: "किसान साथी चलाना आसान है",
    tutorialStep: "अगला",
    skip: "अभी छोड़ें",
    startApp: "ऐप शुरू करें",
    tutorial: [
      ["बोलिए, हम सुनेंगे", "माइक दबाकर अपनी बात कहिए"],
      ["फसल दर्ज करें", "बताइए आपके पास कौन-सी फसल है"],
      ["आज का सही भाव देखें", "खरीदार का भाव यहाँ मिलता है"],
      ["अपने पैसे देखें", "भुगतान की जानकारी यहीं मिलेगी"],
      ["अटकें तो फोन करें", "मुफ़्त सहायता हमेशा आपके साथ है"],
    ],
    notifications: "सूचनाएँ",
    noNotifications: "आज कोई नई सूचना नहीं है",
    profile: "मेरी जानकारी",
    village: "गाँव: गाँव सुनाम, संगरूर",
    phone: "मोबाइल: 98••• 43210",
    replay: "फिर से समझें",
    changeLanguage: "भाषा बदलें",
    logout: "बाहर जाएँ",
    demandDetails: "मांग की पूरी जानकारी",
    cropRegister: "फसल दर्ज करें",
    cropHelp: "कौन-सी फसल और कितनी मात्रा है?",
    quantity: "मात्रा (किलो)",
    grade: "फसल की गुणवत्ता (साइज़ ग्रेड)",
    confirm: "ठीक है, दर्ज करें",
    payments: "पैसों की जानकारी",
    support: "मदद और शिकायत",
    complaint: "शिकायत करें",
    complaintHint: "आपकी बात हमारी टीम तक पहुँच जाएगी",
    submitComplaint: "शिकायत भेजें",
    complaintDone: "शिकायत दर्ज हो गई",
    profitTitle: "आपका ज्यादा फायदा",
    mandi: "मंडी / दलाल",
    platform: "किसान जोड़",
    moreEarn: "आप ₹3,000 ज्यादा कमा सकते हैं",
    waste: "कृषि कचरा बेचें",
    women: "महिला उद्यम",
    listening: "सुन रहे हैं...",
    voiceReply: "आपकी बात समझ ली। मैं आपकी मदद कर रहा हूँ।",
  },
  en: {
    app: "Kisan Jod (Kisan Saathi)",
    welcome: "Hello, Farmer Friend",
    ask: "Tell me, how can I help today?",
    speak: "Speak to me",
    currentDemand: "Current demand",
    seeAll: "See all",
    whatNext: "What would you like to do?",
    myCrops: "My crops",
    payment: "Payments",
    profit: "Profit",
    help: "Help",
    listen: "Listen",
    haveCrop: "I have this crop",
    registered: "Already registered",
    needed: "Total needed",
    price: "Price",
    updated: "Rates updated this morning",
    crops: "My registered crops",
    addCrop: "Add crop",
    matched: "Buyer found",
    viewPayments: "See your payments",
    paymentReceived: "₹12,500 received",
    paymentSub: "5 Aug 2026 · Crop sale",
    safeSale: "Fair price, direct sale",
    safeSaleText: "We help take your crop to the right buyer.",
    callHelp: "Need help? Call us free",
    bottomHome: "Home",
    bottomCrops: "My crops",
    bottomVoice: "Speak",
    bottomHelp: "Help",
    bottomProfile: "My profile",
    chooseLanguage: "Choose your language",
    chooseLanguageSub: "Press the language that is easiest for you",
    start: "Continue",
    tutorialTitle: "Kisan Saathi is easy to use",
    tutorialStep: "Next",
    skip: "Skip for now",
    startApp: "Start using app",
    tutorial: [
      ["Speak, we will listen", "Press the microphone and tell us"],
      ["Register your crop", "Tell us which crop you have"],
      ["See today’s fair rate", "Buyer rates are shown here"],
      ["Check your payments", "Payment details are kept here"],
      ["Call us if you are stuck", "Free support is always with you"],
    ],
    notifications: "Notifications",
    noNotifications: "There are no new updates today",
    profile: "My profile",
    village: "Village: Village Sunam, Sangrur",
    phone: "Mobile: 98••• 43210",
    replay: "Learn again",
    changeLanguage: "Change language",
    logout: "Log out",
    demandDetails: "Demand details",
    cropRegister: "Register crop",
    cropHelp: "Which crop do you have and how much?",
    quantity: "Quantity (kg)",
    grade: "Crop quality (Size Grade)",
    confirm: "Yes, register it",
    payments: "Payment details",
    support: "Help and complaints",
    complaint: "Make a complaint",
    complaintHint: "Your concern will reach our team",
    submitComplaint: "Send complaint",
    complaintDone: "Complaint has been registered",
    profitTitle: "Your extra earnings",
    mandi: "Mandi / Middleman",
    platform: "Kisan Jod",
    moreEarn: "You can earn ₹3,000 more",
    waste: "Sell farm waste",
    women: "Women’s enterprise",
    listening: "Listening...",
    voiceReply: "I understood. I’m helping you now.",
  },
} as const;

interface FarmerPortalProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void;
}

function Pressable({
  children,
  onClick,
  reader,
  readText,
  className = '',
  label,
  speakFn,
  lang,
}: {
  children: ReactNode;
  onClick?: () => void;
  reader: boolean;
  readText: string;
  className?: string;
  label?: string;
  speakFn: (text: string, lang: Language) => void;
  lang: Language;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHoldTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      speakFn(readText, lang);
    }, 450); // 450ms hold to read aloud
  };

  const clearHoldTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <button
      className={`focus-visible:ring-4 focus-visible:ring-[#E3A848]/50 active:scale-98 transition-transform cursor-pointer ${className}`}
      aria-label={label || readText}
      onMouseDown={startHoldTimer}
      onMouseUp={clearHoldTimer}
      onMouseLeave={clearHoldTimer}
      onTouchStart={startHoldTimer}
      onTouchEnd={clearHoldTimer}
      onClick={() => {
        if (reader) speakFn(readText, lang);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#182219]/40 p-0 backdrop-blur-xs sm:items-center sm:p-6">
      <section className="sheet-enter max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[#FFFEF8] px-5 pb-8 pt-4 shadow-[0_-18px_60px_rgba(27,48,31,0.18)] sm:rounded-[2rem]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#D8D3C2] sm:hidden" />
        <div className="mb-5 flex items-center justify-between border-b border-[#E9E2D4] pb-4">
          <h2 className="font-display text-2xl font-bold text-[#1E3424]">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-full bg-[#F0EEE5] p-2 text-[#536257] transition active:scale-95 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({ onSwitchPersona }) => {
  const {
    language: appLanguage,
    setLanguage: setAppLanguage,
    t: appT,
    crops,
    addCrop,
    deleteCrop,
    demands,
    wasteItems,
    addWaste,
    deleteWaste,
    womenProducts,
    addWomenProduct,
    deleteWomenProduct,
    womenResources,
    addWomenResource,
    paychecks,
    profile,
    notifications,
    unreadNotificationsCount,
    setIsNotificationModalOpen,
    addComplaint,
    setIsComplaintModalOpen,
    setIsLogoutModalOpen,
    setIsVoiceModalOpen,
    textReaderActive,
    toggleTextReader,
    speak: contextSpeak,
    showToast,
    activeSection,
    setActiveSection,
    navigationTrigger,
  } = useApp();

  const [language, setLanguageState] = useState<Language>(appLanguage === 'en' ? 'en' : 'hi');
  const [screen, setScreen] = useState<Screen>('tutorial');
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [panel, setPanel] = useState<Panel>('none');
  const [reader, setReader] = useState(textReaderActive);
  const [listening, setListening] = useState(false);
  const [selectedDemandIndex, setSelectedDemandIndex] = useState(0);

  const [showAddCropForm, setShowAddCropForm] = useState(false);
  const [showAddWasteForm, setShowAddWasteForm] = useState(false);
  const [showAddWomenForm, setShowAddWomenForm] = useState(false);

  // Sync AI Voice intent targetSection navigation with sheet panels
  useEffect(() => {
    if (activeSection === 'crops') {
      setScreen('home');
      setPanel('crop');
    } else if (activeSection === 'waste') {
      setScreen('home');
      setPanel('waste');
    } else if (activeSection === 'women') {
      setScreen('home');
      setPanel('women');
    } else if (activeSection === 'profit') {
      setScreen('home');
      setPanel('profit');
    } else if (activeSection === 'paycheck') {
      setScreen('home');
      setPanel('payments');
    } else if (activeSection === 'profile') {
      setScreen('home');
      setPanel('profile');
    } else if (activeSection === 'home') {
      setScreen('home');
      setPanel('none');
    }
  }, [activeSection, navigationTrigger]);

  // Form states inside sheets
  const [cropName, setCropName] = useState('Tomato');
  const [cropQuantity, setCropQuantity] = useState('50000');
  const [cropGrade, setCropGrade] = useState<Grade>('A');
  const [complaintChoice, setComplaintChoice] = useState('');
  const [wasteName, setWasteName] = useState('Crop Residue / Parali Stubble (पराली)');
  const [wasteQty, setWasteQty] = useState('20000');
  const [womenProdName, setWomenProdName] = useState('Handmade Cow Dung Diya (गोबर के दीपक)');
  const [womenProdPrice, setWomenProdPrice] = useState('250');

  const t = (language && copy[language as keyof typeof copy]) ? copy[language as keyof typeof copy] : copy['hi'];

  useEffect(() => {
    setLanguageState(appLanguage === 'en' ? 'en' : 'hi');
  }, [appLanguage]);

  useEffect(() => {
    setReader(textReaderActive);
  }, [textReaderActive]);

  const speakFn = (text: string, lang: Language) => {
    stopSpeaking();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (screen === 'tutorial') {
      speakFn(t.tutorial[tutorialIndex][1], language);
    }
  }, [screen, tutorialIndex, language]);

  // Global Text Selection Reader Effect (reads selected text aloud in active language)
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 1) {
        speakFn(selection, language);
      }
    };
    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [language]);

  const openPanel = (next: Panel) => {
    setPanel(next);
    if (next !== 'crop') setShowAddCropForm(false);
    if (next !== 'waste') setShowAddWasteForm(false);
    if (next !== 'women') setShowAddWomenForm(false);
  };

  const startListening = () => {
    stopSpeaking();
    setIsVoiceModalOpen(true);
  };

  const selectLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    setAppLanguage(nextLanguage);
    speakFn(
      nextLanguage === 'hi'
        ? 'आपने हिंदी चुनी है। आगे बढ़ें दबाइए।'
        : 'You selected English. Press continue.',
      nextLanguage
    );
  };

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(cropQuantity) || 50000;
    const allocatedPrice = cropName.includes('Tomato') ? 18 : cropName.includes('Potato') ? 16 : 22;
    addCrop({
      cropName,
      quantity: qty,
      grade: cropGrade,
      harvestDate: new Date().toISOString().split('T')[0],
      offerPrice: allocatedPrice,
      status: 'Listed',
    });
    setShowAddCropForm(false);
    showToast(`${cropName} ${qty} kg registered successfully!`, 'success');
    speakFn(`${cropName} ${qty} किलो दर्ज हो गया`, language);
  };

  const handleComplaintSubmit = () => {
    if (!complaintChoice) {
      showToast('Please select a complaint category', 'warning');
      return;
    }
    addComplaint('Other', complaintChoice);
    setPanel('none');
    showToast(t.complaintDone, 'success');
    speakFn(t.complaintDone, language);
  };

  const handleWasteSubmit = () => {
    addWaste({
      wasteType: wasteName,
      quantityKg: Number(wasteQty) || 20000,
      askingPriceINR: 3000,
      description: 'Organic Agri Waste Feedstock',
    });
    setPanel('none');
    showToast('Agri Waste listed for buyers successfully!', 'success');
  };

  const handleWomenSubmit = () => {
    addWomenProduct({
      productName: womenProdName,
      craftGroupName: 'Sangrur Self Help Group',
      priceINR: Number(womenProdPrice) || 250,
      category: 'Organic Handicraft',
    });
    setPanel('none');
    showToast('Product added to Women Enterprise market!', 'success');
  };

  // 1. LANGUAGE SELECTION SCREEN
  if (screen === 'language') {
    return (
      <main className="language-screen min-h-screen bg-[#FBF8EE] px-4 py-6 text-[#223124] sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-between overflow-hidden rounded-[2rem] border border-[#E9E0CD] bg-[#FFFEF8] shadow-[0_18px_60px_rgba(104,85,45,0.12)] md:flex-row">
          <section className="courtyard-welcome relative flex flex-1 flex-col justify-between overflow-hidden bg-[#C56E4E] p-6 text-[#FFF9ED] sm:p-10">
            <div className="absolute -right-12 top-10 h-44 w-44 rounded-full border-[18px] border-[#F7D886]/45" />
            <div className="courtyard-contour courtyard-contour-one" />
            <div className="courtyard-contour courtyard-contour-two" />
            <div className="relative flex items-center gap-3">
              <img
                src={assets.logo}
                alt="Logo"
                className="h-14 w-14 rounded-2xl bg-white/90 p-2 shadow-md"
              />
              <div>
                <p className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {t.app}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white/80">
                  {language === 'hi' ? 'आपका भरोसेमंद साथी' : 'Your trusted farm companion'}
                </p>
              </div>
            </div>
            <div className="relative mt-8 max-w-md md:mb-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="voice-ripple relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F4CB68] text-[#2B5D75] shadow-md">
                  <Mic size={28} />
                </span>
                <div>
                  <p className="inline-flex items-center rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-[#FFF0C2]">
                    <Volume2 size={13} className="mr-1.5" /> Voice-First
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white/90">
                    {language === 'hi' ? 'बस बोलिए, हम मदद करेंगे' : 'Just speak, we will help'}
                  </p>
                </div>
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {t.chooseLanguage}
              </h1>
              <p className="mt-3 max-w-sm text-sm sm:text-base leading-relaxed text-white/90">
                {t.chooseLanguageSub}
              </p>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <ShieldCheck size={18} className="text-[#F1C95C]" />
              {language === 'hi' ? 'हर कदम पर आसान मदद' : 'Simple help at every step'}
            </div>
          </section>

          <section className="relative flex flex-1 flex-col justify-center overflow-hidden bg-[#FFF9EF] p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full border-[18px] border-[#D8E8F3]" />
            <div className="relative z-10 mb-6 flex items-center gap-3 rounded-2xl border border-[#D5E3ED] bg-[#EAF3F9] p-4 text-[#2C5976]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2B6EAE] shadow-xs">
                <Volume2 size={20} />
              </span>
              <div>
                <b className="block font-display text-base sm:text-lg">
                  {language === 'hi' ? 'पहले भाषा चुनिए' : 'First, choose a language'}
                </b>
                <small className="font-semibold text-[#5E7F96] text-xs">
                  {language === 'hi'
                    ? 'हम आगे की हर बात इसी भाषा में समझाएँगे'
                    : 'We will explain every next step in this language'}
                </small>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ['hi', 'हिंदी', 'Hindi', 'अ'],
                ['en', 'English', 'English', 'A'],
              ].map(([key, primary, secondary, mark]) => (
                <button
                  key={key}
                  onClick={() => selectLanguage(key as Language)}
                  className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                    language === key
                      ? 'border-[#146B3A] bg-[#F1F8EA] shadow-md'
                      : 'border-[#ECE6D9] bg-white hover:border-[#C7DCE9]'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display text-2xl font-bold ${
                      language === key ? 'bg-[#146B3A] text-white' : 'bg-[#F5F0E4] text-[#80643D]'
                    }`}
                  >
                    {mark}
                  </span>
                  <span className="flex-1">
                    <strong className="block font-display text-lg">{primary}</strong>
                    <small className="text-xs text-[#718073]">{secondary}</small>
                  </span>
                  <span
                    className={`h-5 w-5 rounded-full border-2 ${
                      language === key ? 'border-[6px] border-[#146B3A]' : 'border-[#C7C2B7]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => setScreen('tutorial')}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] px-5 font-display text-lg font-bold text-white shadow-lg hover:bg-[#0E5530] active:scale-98 cursor-pointer"
            >
              <Volume2 size={20} /> {t.start} <ChevronRight size={20} />
            </button>
          </section>
        </div>
      </main>
    );
  }

  // 2. VOICE ONBOARDING TUTORIAL SCREEN
  if (screen === 'tutorial') {
    const [title, description] = t.tutorial[tutorialIndex];
    const TutorialIcon = [Mic, Sprout, HandCoins, ReceiptIndianRupee, Phone][tutorialIndex];

    return (
      <main className="min-h-screen bg-[#FBF8EE] p-4 sm:p-8">
        <section className="tutorial-shell mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#E7DDCA] bg-[#FFFEF8] shadow-xl sm:min-h-[640px]">
          <div className="flex items-center justify-between p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <img src={assets.logo} alt="Logo" className="h-10 w-10 rounded-xl bg-[#EAF6E4] p-1" />
              <span className="font-display text-lg font-bold text-[#1F3A28]">{t.app}</span>
            </div>
            <button
              onClick={() => setScreen('home')}
              className="text-xs font-bold text-[#59705F] underline cursor-pointer"
            >
              {t.skip}
            </button>
          </div>

          <div className="flex-1 px-6 pb-5 pt-4 sm:px-16 sm:pt-8 text-center">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-[#E7F0F7] shadow-inner sm:h-56 sm:w-56">
              <TutorialIcon size={80} strokeWidth={1.4} className="text-[#2B6EAE]" />
            </div>
            <div className="mx-auto mt-6 max-w-lg">
              <p className="mb-2 text-xs font-semibold text-[#B9791B]">
                {tutorialIndex + 1} / {t.tutorial.length}
              </p>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight text-[#243E2A]">
                {title}
              </h1>
              <p className="mt-3 text-sm sm:text-lg leading-relaxed text-[#5C6A5F]">{description}</p>
              <button
                onClick={() => speakFn(`${title}. ${description}`, language)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F7EDCF] px-4 py-2 text-xs font-bold text-[#6E5121] cursor-pointer"
              >
                <Volume2 size={16} /> {t.listen}
              </button>
            </div>
          </div>

          <div className="px-6 pb-6 sm:px-12">
            <div className="mb-4 flex gap-2">
              {t.tutorial.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= tutorialIndex ? 'bg-[#1A6B3D]' : 'bg-[#E9E3D5]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                tutorialIndex === t.tutorial.length - 1
                  ? setScreen('home')
                  : setTutorialIndex((val) => val + 1)
              }
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-lg font-bold text-white shadow-md active:scale-98 cursor-pointer"
            >
              {tutorialIndex === t.tutorial.length - 1 ? <Sprout size={20} /> : null}
              {tutorialIndex === t.tutorial.length - 1 ? t.startApp : t.tutorialStep}
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </main>
    );
  }

  const displayDemands = (demands && Array.isArray(demands)) ? demands : [];
  const activeCropList = (crops && Array.isArray(crops)) ? crops : [];
  const recentPaycheck = (paychecks && Array.isArray(paychecks) && paychecks.length > 0) ? paychecks[0] : null;
  const currentProfile = profile || { name: 'Gurdev Singh', village: 'Sunam', phone: '+91 98765 43210' };

  return (
    <main className="min-h-screen bg-[#FBF8EE] pb-28 text-[#223124] selection:bg-[#146B3A] selection:text-white">
      {/* Top Banner Notice */}
      <TextReaderBanner />

      <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        {/* App Header */}
        <header className="mb-4 sm:mb-6 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={assets.logo}
              alt="Kisan Jod"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#EAF6E4] p-1.5 shadow-xs shrink-0 border border-[#D5E8CE]"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-lg sm:text-2xl font-black text-[#146B3A] tracking-tight leading-tight truncate">
                  {language === 'hi' ? 'किसान जोड़' : 'Kisan Jod'}
                </h1>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#677769] truncate">
                {language === 'hi' ? '🇮🇳 डायरेक्ट कृषि व्यापार' : '🇮🇳 Direct Farmer Trade'}
              </p>
            </div>
          </div>

          {/* Action Controls Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Text Reader Button */}
            <button
              onClick={() => {
                if (reader) {
                  stopSpeaking();
                  setReader(false);
                  toggleTextReader();
                  showToast(language === 'hi' ? 'आवाज़ रीडर बंद किया गया' : 'Text Reader turned OFF');
                } else {
                  setReader(true);
                  toggleTextReader();
                  speakFn(
                    language === 'hi'
                      ? 'आवाज़ रीडर चालू है। किसी भी टेक्स्ट को दबाकर रखें या चुनें, वह बोलकर सुनाया जाएगा।'
                      : 'Text Reader active. Press & hold or select any text to read aloud.',
                    language
                  );
                  showToast(language === 'hi' ? 'आवाज़ रीडर चालू है' : 'Text Reader turned ON');
                }
              }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-extrabold cursor-pointer shadow-xs transition-all ${
                reader
                  ? 'bg-[#146B3A] text-white border-[#146B3A] animate-pulse'
                  : 'bg-white text-[#146B3A] border-[#E7E0D2] hover:bg-[#EFF7E9]'
              }`}
              title="Text Reader Toggle"
            >
              <Volume2 size={16} />
              <span>
                {reader
                  ? (language === 'hi' ? '🛑 बंद करें' : '🛑 Stop Reader')
                  : (language === 'hi' ? '🔊 आवाज़ रीडर' : '🔊 Text Reader')}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#146B3A] absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => {
                  const val = e.target.value as Language;
                  setLanguageState(val);
                  setAppLanguage(val);
                }}
                className="pl-6 sm:pl-7 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-2xl border border-[#E7E0D2] bg-white text-[#1E3B27] text-xs font-extrabold focus:ring-2 focus:ring-[#146B3A] cursor-pointer shadow-xs"
                title="Change Language"
              >
                <option value="hi">HI</option>
                <option value="en">EN</option>
              </select>
            </div>

            {/* Mobile Text Reader Icon Toggle */}
            <button
              onClick={() => {
                if (reader) {
                  stopSpeaking();
                  setReader(false);
                  toggleTextReader();
                  showToast(language === 'hi' ? 'आवाज़ रीडर बंद किया गया' : 'Text Reader turned OFF');
                } else {
                  setReader(true);
                  toggleTextReader();
                  speakFn(
                    language === 'hi'
                      ? 'आवाज़ रीडर चालू है। किसी भी टेक्स्ट को दबाकर रखें या चुनें, वह बोलकर सुनाया जाएगा।'
                      : 'Text Reader active. Press & hold or select any text to read aloud.',
                    language
                  );
                  showToast(language === 'hi' ? 'आवाज़ रीडर चालू है' : 'Text Reader turned ON');
                }
              }}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-2xl border shadow-xs cursor-pointer transition-all ${
                reader
                  ? 'bg-[#146B3A] text-white border-[#146B3A] animate-pulse'
                  : 'bg-white text-[#146B3A] border-[#E7E0D2] hover:bg-[#EFF7E9]'
              }`}
              title={reader ? 'Stop Text Reader' : 'Start Text Reader'}
            >
              <Volume2 size={16} />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => openPanel('notifications')}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-[#E7E0D2] bg-white text-[#31513A] shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
              title={language === 'hi' ? 'सूचनाएं' : 'Notifications'}
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-[#D85536] px-1 text-[10px] font-bold leading-4 text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => openPanel('profile')}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-2xl border border-[#E1D7C6] bg-[#F3E5C9] text-[#71522B] shadow-xs cursor-pointer hover:bg-[#ebd9b7] transition-colors"
              title={language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}
            >
              <CircleUserRound size={19} />
            </button>

            {/* Direct Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 shadow-xs cursor-pointer hover:bg-red-100 transition-colors"
              title={language === 'hi' ? 'लॉगआउट' : 'Logout'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Hero Voice Assistance Card */}
        <section className="hero-panel relative mb-7 overflow-hidden rounded-[1.75rem] bg-[#F2DEAF] text-[#3D3828] shadow-md">
          <div className="relative z-10 max-w-xl p-5 sm:p-8">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-0.5 text-xs font-semibold text-[#99651F]">
              <Sparkles size={14} /> आपका आवाज़ वाला साथी
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
              {currentProfile?.name ? `नमस्ते, ${currentProfile.name}` : t.welcome}
              <br />
              {t.ask}
            </h1>
            <button
              onClick={startListening}
              className={`mt-5 flex min-h-14 items-center gap-3 rounded-2xl px-5 font-display text-lg font-extrabold shadow-md transition active:scale-98 cursor-pointer ${
                listening ? 'bg-[#F1C95C] text-[#40320F]' : 'bg-[#146B3A] text-white'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  listening ? 'bg-[#FFF0B6]' : 'bg-[#E8F1FA] text-[#2B6EAE]'
                }`}
              >
                <Mic size={20} />
              </span>
              {listening ? t.listening : t.speak}
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[45%] overflow-hidden md:block">
            <img
              src={assets.hero}
              alt="Farmer using phone"
              className="h-full w-full object-cover object-right opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2DEAF] via-[#F2DEAF]/30 to-transparent" />
          </div>
          <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full border-[18px] border-[#C56E4E]/20" />
        </section>

        {/* Current Demand Carousel */}
        <section className="mb-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="eyebrow">बाज़ार से सीधा</p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#26452E]">
                {t.currentDemand}
              </h2>
            </div>
            <button
              onClick={() => openPanel('demand')}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#166138] hover:bg-[#EFF7E8] cursor-pointer"
            >
              {t.seeAll} <ChevronRight size={16} />
            </button>
          </div>

          <div className="hide-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {displayDemands.map((item, index) => {
              const matchPercent = Math.min(
                100,
                Math.round((item.registeredQty / item.requiredQty) * 100)
              );
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedDemandIndex(index);
                    setCropName(item.cropName);
                    setPanel('demand');
                  }}
                  className="demand-card min-w-[255px] snap-start rounded-[1.45rem] border border-[#E8E2D5] bg-[#FFFEFB] p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer sm:min-w-[285px]"
                >
                  <div className="flex items-start justify-between">
                    <img
                      src={item.image || assets.wheat}
                      alt={item.cropName}
                      className="h-12 w-12 rounded-2xl bg-[#F8F3E4] object-cover"
                    />
                    <span className="rounded-full bg-[#F8E5AF] px-2.5 py-0.5 text-xs font-bold text-[#855313]">
                      ₹{item.pricePerKg}/kg
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-extrabold text-[#284330]">
                    {getCropDisplayName(item.cropName, language)}
                  </h3>
                  <div className="mt-2 flex justify-between text-xs font-semibold text-[#68776B]">
                    <span>{t.registered}</span>
                    <span>{(item.registeredQty ?? 0).toLocaleString()} kg</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#E8E5DA]">
                    <div
                      className="h-full rounded-full bg-[#22904D]"
                      style={{ width: `${matchPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#56665A]">
                    <b className="text-[#253F2C]">{(item.requiredQty ?? 0).toLocaleString()} kg</b> {t.needed}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6 Quick Action Cards */}
        <section className="mb-8">
          <div className="mb-3">
            <p className="eyebrow">आसान काम</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#26452E]">
              {t.whatNext}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[
              [Sprout, t.myCrops, '#E5F4DF', '#1B6B3B', 'crop'],
              [Tractor, t.waste, '#F7E9DA', '#AD6433', 'waste'],
              [HandCoins, t.women, '#F4E7F3', '#895078', 'women'],
              [Coins, t.profit, '#FBF0D7', '#9A6518', 'profit'],
              [CreditCard, t.payment, '#E8F1FA', '#2B6EAE', 'payments'],
              [CircleHelp, t.help, '#F8E8DF', '#AD5439', 'support'],
            ].map(([Icon, title, bg, color, destination]) => (
              <button
                key={title as string}
                onClick={() => openPanel(destination as Panel)}
                className="group flex flex-col items-start rounded-[1.35rem] border border-[#E7E1D5] bg-white p-3.5 text-left shadow-xs transition hover:-translate-y-0.5 active:scale-98 cursor-pointer"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: bg as string, color: color as string }}
                >
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="mt-2.5 font-display text-base font-extrabold text-[#2B4331]">
                  {title as string}
                </span>
                <ChevronRight
                  className="ml-auto mt-1 text-[#9AAB9E] transition group-hover:translate-x-1"
                  size={16}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Registered Crops & Payments Dual Grid */}
        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Registered Crops Summary */}
          <div className="rounded-[1.55rem] border border-[#E8E2D6] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="eyebrow">{language === 'hi' ? 'घर की फसल' : 'Home Crops'}</p>
                <h2 className="font-display text-xl font-extrabold text-[#26452E]">{t.crops}</h2>
              </div>
              <button
                onClick={() => openPanel('crop')}
                className="flex items-center gap-1 rounded-xl bg-[#EAF6E4] px-3 py-1.5 text-xs font-bold text-[#17663A] cursor-pointer"
              >
                <Plus size={16} />
                {t.addCrop}
              </button>
            </div>

            {activeCropList.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-slate-500 bg-[#FBF8EE] rounded-2xl border border-dashed border-[#E7E0D2]">
                <p>
                  {language === 'hi'
                    ? '0 फसलें दर्ज हैं। अपनी फसल दर्ज करने के लिए ऊपर "+ फसल जोड़ें" पर दबाएँ।'
                    : '0 crops registered. Press "+ Add crop" above to register your crop.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#ECE6D9]">
                {activeCropList.map((crop) => {
                  const cropImage = CROP_IMAGES[crop.cropName] || CROP_IMAGES['Tomato'];
                  const listedDateStr = crop.registrationDate || crop.harvestDate || '15 Aug 2026';

                  return (
                    <div key={crop.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cropImage}
                          alt={crop.cropName}
                          className="h-14 w-14 rounded-2xl object-cover border border-[#E5DFD2] shadow-xs shrink-0"
                        />
                        <div>
                          <b className="block font-display text-base text-[#2B4331]">{getCropDisplayName(crop.cropName, language)}</b>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs font-semibold text-[#647467]">
                            <span>⚖️ {(crop.quantity ?? 0).toLocaleString()} kg</span>
                            <span>•</span>
                            <span className="rounded-md bg-[#EFF7E9] px-2 py-0.5 font-extrabold text-[#146B3A] border border-[#D4E8C9]">
                              {language === 'hi' ? `ग्रेड ${crop.grade}` : `Grade ${crop.grade}`}
                            </span>
                            <span>•</span>
                            <span className="text-[#819083]">📅 {language === 'hi' ? 'दर्ज' : 'Listed'}: {listedDateStr}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full bg-[#EAF6E4] px-2.5 py-0.5 text-xs font-bold text-[#2B743F]">
                          {crop.status || t.matched}
                        </span>
                        <button
                          onClick={() => deleteCrop(crop.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Delete Crop"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Card */}
          <button
            onClick={() => openPanel('payments')}
            className="relative overflow-hidden rounded-[1.55rem] bg-[#386C9E] p-5 text-left text-white shadow-md cursor-pointer transition hover:bg-[#2F5F8C]"
          >
            <div className="absolute -right-5 -top-7 h-32 w-32 rounded-full border-[16px] border-white/10" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[#F7CF66]">
              <ReceiptIndianRupee size={24} />
            </span>
            <p className="relative mt-4 text-xs font-bold text-[#DDECF7]">{t.viewPayments}</p>
            <h3 className="relative mt-1 font-display text-2xl sm:text-3xl font-extrabold">
              {recentPaycheck
                ? `₹${((recentPaycheck.finalAmountReceived ?? (recentPaycheck as any).totalAmount) ?? 840000).toLocaleString()}`
                : t.paymentReceived}
            </h3>
            <p className="relative mt-1 text-xs text-white/80">
              {recentPaycheck 
                ? `${recentPaycheck.date} · ${recentPaycheck.cropOrProduct || (recentPaycheck as any).cropName || 'Tomato'}` 
                : t.paymentSub}
            </p>
            <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#F9D982]">
              {t.seeAll} <ChevronRight size={16} />
            </span>
          </button>
        </section>

        {/* Toll-Free Help Banner */}
        <section className="mt-6 overflow-hidden rounded-[1.55rem] border border-[#E7DFD0] bg-[#F3E7C9] shadow-xs">
          <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#9B6822]">
              <Phone size={24} />
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#4E3B1F]">{t.safeSale}</h2>
              <p className="mt-0.5 text-xs sm:text-sm font-medium leading-relaxed text-[#6A5635]">
                {t.safeSaleText}
              </p>
            </div>
            <a
              href="tel:18001234567"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-display text-base font-extrabold text-[#265D36] shadow-xs hover:bg-[#FFFDF8] cursor-pointer"
            >
              <Headphones size={18} /> {t.callHelp}
            </a>
          </div>
        </section>
      </div>

      {/* Floating Text Reader Toggle Button */}
      <button
        onClick={toggleTextReader}
        className={`fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-2xl border-2 shadow-lg transition active:scale-95 cursor-pointer ${
          textReaderActive
            ? 'border-[#F1C95C] bg-[#F1C95C] text-[#49380D] animate-bounce'
            : 'border-white bg-[#155F36] text-white'
        }`}
        title="Toggle Voice Text Reader Mode"
      >
        <Volume2 size={22} />
      </button>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E3DED0] bg-[#FFFEFA]/95 px-3 py-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-end justify-between">
          <button
            onClick={() => setPanel('none')}
            className={`nav-item ${panel === 'none' ? 'active' : ''}`}
          >
            <Tractor size={20} />
            <span>{t.bottomHome}</span>
          </button>
          <button
            onClick={() => openPanel('crop')}
            className={`nav-item ${panel === 'crop' ? 'active' : ''}`}
          >
            <Leaf size={20} />
            <span>{t.bottomCrops}</span>
          </button>
          <button
            onClick={startListening}
            className="relative -top-5 flex h-14 w-14 flex-col items-center justify-center rounded-full border-[4px] border-[#FBF8EE] bg-[#1A7740] text-white shadow-lg cursor-pointer"
          >
            <Mic size={24} />
            <span className="text-[9px] font-bold">{t.bottomVoice}</span>
          </button>
          <button
            onClick={() => openPanel('support')}
            className={`nav-item ${panel === 'support' || panel === 'complaint' ? 'active' : ''}`}
          >
            <CircleHelp size={20} />
            <span>{t.bottomHelp}</span>
          </button>
          <button
            onClick={() => openPanel('profile')}
            className={`nav-item ${panel === 'profile' ? 'active' : ''}`}
          >
            <CircleUserRound size={20} />
            <span>{t.bottomProfile}</span>
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* INTERACTIVE BOTTOM SHEETS (PANELS)                        */}
      {/* ======================================================== */}

      {/* 1. NOTIFICATIONS SHEET */}
      {panel === 'notifications' && (
        <Sheet title={t.notifications} onClose={() => setPanel('none')}>
          <div className="space-y-3">
            {(notifications && notifications.length > 0
              ? notifications.map((n) => ({
                  icon: n.type === 'demand' ? HandCoins : n.type === 'payment' ? CreditCard : Megaphone,
                  text: language === 'hi' ? (n.titleHi || n.title) : n.title,
                  subText: language === 'hi' ? (n.messageHi || n.message) : n.message,
                  time: language === 'hi' ? (n.timestampHi || n.timestamp) : n.timestamp,
                  dest: (n.actionUrl === 'crops' ? 'crop' : n.actionUrl === 'paycheck' ? 'payments' : 'demand') as Panel,
                  id: n.id,
                }))
              : (language === 'hi'
                  ? [
                      { icon: HandCoins, text: 'नई मांग आई है — गेहूँ ₹18 प्रति किलो', subText: 'इंडस्ट्रियल खरीदार द्वारा मांग', time: '2 घंटे पहले', dest: 'demand', id: '1' },
                      { icon: CreditCard, text: 'आपको ₹12,500 मिले हैं', subText: 'SBI बैंक खाते में ट्रांसफर', time: '5 अगस्त', dest: 'payments', id: '2' },
                      { icon: Megaphone, text: 'आपकी शिकायत पर काम शुरू हो गया', subText: 'सपोर्ट टीम द्वारा समीक्षा', time: 'कल', dest: 'complaint', id: '3' },
                    ]
                  : [
                      { icon: HandCoins, text: 'New Demand Surge — Wheat at ₹18/kg', subText: 'Requested by Industrial Buyer', time: '2 hours ago', dest: 'demand', id: '1' },
                      { icon: CreditCard, text: 'Payment Received ₹12,500', subText: 'Transferred to SBI Account', time: '5 Aug', dest: 'payments', id: '2' },
                      { icon: Megaphone, text: 'Ticket Under Review', subText: 'Support team is investigating', time: 'Yesterday', dest: 'complaint', id: '3' },
                    ]
                )
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => openPanel(item.dest as Panel)}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#EAE4D8] bg-white p-3.5 text-left cursor-pointer hover:bg-[#F9F8F3]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF7E9] text-[#1C6C3D]">
                  <item.icon size={20} />
                </span>
                <span className="flex-1">
                  <b className="block text-xs sm:text-sm font-semibold text-[#2B4431]">
                    {item.text}
                  </b>
                  <p className="text-xs text-[#5D6D60]">{item.subText}</p>
                  <small className="text-[10px] text-[#7B887D]">{item.time}</small>
                </span>
                <ChevronRight size={18} className="text-[#9FAAA0]" />
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {/* 2. PROFILE SHEET */}
      {panel === 'profile' && (
        <Sheet title={t.profile} onClose={() => setPanel('none')}>
          <div className="rounded-2xl bg-[#EFF7E9] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6C17B] text-[#64431A]">
                <CircleUserRound size={28} />
              </span>
              <div>
                <h3 className="font-display text-xl font-extrabold text-[#284631]">
                  {currentProfile?.name || 'गुरदेव सिंह (Farmer)'}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#5F7464]">
                  {currentProfile?.village ? `गाँव: ${currentProfile.village}` : t.village}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs font-semibold text-[#56715B]">
              {currentProfile?.phone ? `मोबाइल: ${currentProfile.phone}` : t.phone}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {[
              [
                RotateCcw,
                t.replay,
                () => {
                  setPanel('none');
                  setTutorialIndex(0);
                  setScreen('tutorial');
                },
              ],
              [
                Languages,
                t.changeLanguage,
                () => {
                  setPanel('none');
                  setScreen('language');
                },
              ],
              [MapPin, 'मेरी फसल और गाँव', () => openPanel('crop')],
              [
                LogOut,
                t.logout,
                () => {
                  setPanel('none');
                  setIsLogoutModalOpen(true);
                },
              ],
            ].map(([Icon, text, action]) => (
              <button
                key={text as string}
                onClick={action as () => void}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F5F4EC] cursor-pointer text-xs sm:text-sm font-semibold text-[#354A3B]"
              >
                <Icon size={18} className="text-[#296540]" />
                <span className="flex-1">{text as string}</span>
                <ChevronRight size={16} className="text-[#A5AFA6]" />
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {/* 3. CROP DEMAND DETAILS SHEET */}
      {panel === 'demand' && (
        <Sheet title={t.demandDetails} onClose={() => setPanel('none')}>
          {displayDemands[selectedDemandIndex] ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-[#F5F8EF] p-4">
                <img
                  src={displayDemands[selectedDemandIndex].image || assets.wheat}
                  alt={displayDemands[selectedDemandIndex].cropName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#27452F]">
                    {getCropDisplayName(displayDemands[selectedDemandIndex].cropName, language)}
                  </h3>
                  <p className="mt-0.5 font-bold text-[#206A3E]">
                    ₹{displayDemands[selectedDemandIndex].pricePerKg}/kg
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-[#637464]">
                    {(displayDemands[selectedDemandIndex]?.registeredQty ?? 0).toLocaleString()} /{' '}
                    {(displayDemands[selectedDemandIndex]?.requiredQty ?? 0).toLocaleString()} kg
                  </p>
                </div>
              </div>

              <p className="rounded-xl border border-[#E8E1D1] bg-white p-3.5 text-xs text-[#5E6B60] leading-relaxed">
                Agri Foods Pvt. Ltd. इस फसल के लिए मुख्य खरीदार है। फसल की गुणवत्ता Grade A होने पर 100% तुरंत एडवांस भुगतान मिलता है।
              </p>

              <button
                onClick={() => openPanel('crop')}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-lg font-extrabold text-white cursor-pointer active:scale-98"
              >
                <Sprout size={20} />
                {t.haveCrop}
              </button>
            </div>
          ) : null}
        </Sheet>
      )}

      {/* 4. MY CROPS & REGISTER CROP SHEET */}
      {panel === 'crop' && (
        <Sheet
          title={showAddCropForm ? t.cropRegister : t.myCrops}
          onClose={() => {
            setPanel('none');
            setShowAddCropForm(false);
          }}
        >
          {!showAddCropForm ? (
            <div className="space-y-4">
              {/* Top Action Button to List New Crop */}
              <button
                onClick={() => setShowAddCropForm(true)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-base sm:text-lg font-extrabold text-white shadow-md hover:bg-[#0E5530] transition-colors cursor-pointer"
              >
                <Plus size={20} />
                {language === 'hi' ? '+ नई फसल दर्ज करें' : '+ Register New Crop'}
              </button>

              {/* Already Listed Crops Section */}
              <div>
                <h3 className="font-display text-lg font-extrabold text-[#26452E] mb-3">
                  {language === 'hi' ? 'आपकी दर्ज फसलें' : 'Your Listed Crops'}
                </h3>
                {activeCropList.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-500 bg-[#FBF8EE] rounded-2xl border border-dashed border-[#E7E0D2]">
                    <Sprout size={32} className="mx-auto mb-2 text-[#146B3A] opacity-60" />
                    <p>
                      {language === 'hi'
                        ? 'अभी कोई फसल दर्ज नहीं है। ऊपर दिए गए बटन को दबाकर फसल दर्ज करें।'
                        : 'No crops registered yet. Press the button above to register your crop.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeCropList.map((crop) => {
                      const cropImage = CROP_IMAGES[crop.cropName] || CROP_IMAGES['Tomato'];
                      const listedDateStr = crop.registrationDate || crop.harvestDate || '15 Aug 2026';

                      return (
                        <div
                          key={crop.id}
                          className="p-4 rounded-2xl border border-[#E9E4DA] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={cropImage}
                              alt={crop.cropName}
                              className="h-16 w-16 rounded-2xl object-cover border border-[#E5DFD2] shadow-xs shrink-0"
                            />
                            <div className="space-y-1">
                              <b className="block font-display text-lg text-[#2B4331]">{getCropDisplayName(crop.cropName, language)}</b>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#526455]">
                                <span className="bg-[#F6F4EB] px-2.5 py-1 rounded-lg border border-[#E6E0D2] font-bold text-[#1E3B27]">
                                  ⚖️ {language === 'hi' ? 'मात्रा' : 'Quantity'}: {(crop.quantity ?? 0).toLocaleString()} kg
                                </span>
                                <span className="bg-[#EFF7E9] px-2.5 py-1 rounded-lg border border-[#D4E8C9] font-extrabold text-[#146B3A]">
                                  ⭐ {language === 'hi' ? 'ग्रेड' : 'Grade'}: {language === 'hi' ? `ग्रेड ${crop.grade}` : `Grade ${crop.grade}`}
                                </span>
                              </div>
                              <div className="text-[11px] font-bold text-[#718073] pt-0.5">
                                📅 {language === 'hi' ? 'दर्ज करने की तारीख' : 'Date Listed'}: {listedDateStr}
                              </div>
                              <div className="text-xs text-[#206A3E] font-extrabold">
                                {language === 'hi' ? 'भाव' : 'Price'}: ₹{crop.offerPrice || 18} / {language === 'hi' ? 'किलो' : 'kg'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE0]">
                            <span className="rounded-full bg-[#EAF6E4] px-3 py-1 text-xs font-bold text-[#2B743F]">
                              {crop.status || t.matched}
                            </span>
                            <button
                              onClick={() => deleteCrop(crop.id)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete Crop"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setShowAddCropForm(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#146B3A] hover:underline cursor-pointer"
              >
                <ArrowLeft size={16} />
                {language === 'hi' ? 'वापस दर्ज फसलों की सूची पर जाएँ' : 'Back to Listed Crops'}
              </button>

              <p className="text-xs font-medium text-[#647266]">{t.cropHelp}</p>
              <form onSubmit={handleAddCropSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">{language === 'hi' ? 'फसल चुनें' : 'Select Crop'}</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] text-[#27452F] font-bold cursor-pointer"
                  >
                    <option value="Tomato">{language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}</option>
                    <option value="Potato">{language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
                    <option value="Wheat">{language === 'hi' ? 'गेहूँ (Wheat)' : 'Wheat'}</option>
                    <option value="Red Onion">{language === 'hi' ? 'प्याज (Red Onion)' : 'Red Onion'}</option>
                    <option value="Basmati Rice">{language === 'hi' ? 'बासमती चावल (Basmati Rice)' : 'Basmati Rice'}</option>
                    <option value="Maize">{language === 'hi' ? 'मक्का (Maize)' : 'Maize'}</option>
                    <option value="Cotton">{language === 'hi' ? 'कपास (Cotton)' : 'Cotton'}</option>
                    <option value="Mustard">{language === 'hi' ? 'सरसों (Mustard)' : 'Mustard'}</option>
                    <option value="Sugarcane">{language === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane'}</option>
                    <option value="Soybean">{language === 'hi' ? 'सोयाबीन (Soybean)' : 'Soybean'}</option>
                    <option value="Green Chilli">{language === 'hi' ? 'हरी मिर्च (Green Chilli)' : 'Green Chilli'}</option>
                    {demands
                      .filter((d) => {
                        const std = ['tomato', 'potato', 'wheat', 'red onion', 'basmati rice', 'maize', 'cotton', 'mustard', 'sugarcane', 'soybean', 'green chilli'];
                        return !std.some((s) => d.cropName.toLowerCase().includes(s));
                      })
                      .map((d) => (
                        <option key={d.id} value={d.cropName}>
                          {d.cropName} {d.cropNameHi ? `(${d.cropNameHi})` : ''} — ₹{d.pricePerKg}/kg
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">{t.quantity}</label>
                  <input
                    type="number"
                    value={cropQuantity}
                    onChange={(e) => setCropQuantity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] text-[#27452F] font-bold text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">{t.grade}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['A', 'Grade A (बड़ा)'],
                      ['B', 'Grade B (मध्यम)'],
                      ['C', 'Grade C (छोटा)'],
                    ].map(([gVal, gLabel]) => (
                      <button
                        key={gVal}
                        type="button"
                        onClick={() => setCropGrade(gVal as Grade)}
                        className={`p-2.5 rounded-xl border-2 font-bold text-xs cursor-pointer ${
                          cropGrade === gVal
                            ? 'border-[#278144] bg-[#EFF8E9] text-[#26713D]'
                            : 'border-[#E8E1D5] text-[#6A776C]'
                        }`}
                      >
                        {gLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-lg font-extrabold text-white cursor-pointer"
                >
                  <ShieldCheck size={20} />
                  {t.confirm}
                </button>
              </form>
            </div>
          )}
        </Sheet>
      )}

      {/* 5. PAYMENTS SHEET */}
      {panel === 'payments' && (
        <Sheet title={t.payments} onClose={() => setPanel('none')}>
          <div className="rounded-2xl bg-[#EAF6E4] p-4">
            <p className="text-xs font-bold text-[#52805B]">{language === 'hi' ? 'भुगतान विवरण' : 'Payment Details (Total Paid)'}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-[#1B6B3B]">
              {recentPaycheck
                ? `₹${((recentPaycheck.finalAmountReceived ?? (recentPaycheck as any).totalAmount) ?? 840000).toLocaleString()}`
                : '₹12,500'}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#54705A]">
              {recentPaycheck ? `${getCropDisplayName(recentPaycheck.cropOrProduct || (recentPaycheck as any).cropName || 'Tomato', language)} · ${recentPaycheck.date}` : t.paymentSub}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[#E9E4DA] bg-white p-4 space-y-2 text-xs">
            <div className="flex justify-between border-b border-[#EEE9DF] pb-2">
              <span className="font-semibold text-[#667568]">{language === 'hi' ? 'लेन-देन ID' : 'Transaction ID'}</span>
              <b className="text-[#2B4331]">
                {recentPaycheck ? (recentPaycheck.txnId || (recentPaycheck as any).transactionId || 'KS-524184') : 'KS-524184'}
              </b>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold text-[#667568]">{language === 'hi' ? 'भाव' : 'Price Rate'}</span>
              <b className="text-[#2B4331]">
                {recentPaycheck ? `₹${recentPaycheck.pricePerUnit || (recentPaycheck as any).pricePerKg || 18}/kg` : (language === 'hi' ? '₹18 / किलो' : '₹18 / kg')}
              </b>
            </div>
            <button
              onClick={() =>
                speakFn(
                  language === 'hi'
                    ? 'आपको फसल बेचने पर किसान जोड़ की तरफ से पूरा भुगतान बैंक खाते में प्राप्त हो गया है।'
                    : 'You have received full payment in your bank account from Kisan Jod for your crop sale.',
                  language
                )
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2F1E9] py-2.5 font-bold text-[#35513D] cursor-pointer"
            >
              <Volume2 size={16} />
              {t.listen}
            </button>
          </div>
        </Sheet>
      )}

      {/* 6. PROFIT COMPARISON SHEET */}
      {panel === 'profit' && (
        <Sheet title={t.profitTitle} onClose={() => setPanel('none')}>
          <div className="space-y-4">
            <PayoutCorridorCard />

            <p className="mb-3 text-xs font-medium text-[#657366]">{language === 'hi' ? 'फसल बिक्री दर तुलना (मंडी vs किसान जोड़)' : 'Crop Sale Rate Comparison (Mandi vs Kisan Jod)'}</p>
            <div className="space-y-3">
              {[
                [t.mandi, '₹15/kg', '₹10,500', '#E9E6DB', '#6B7169'],
                [t.platform, '₹18/kg', '₹12,600', '#EAF6E4', '#216C3C'],
              ].map(([lbl, rate, tot, bg, color]) => (
                <div
                  key={lbl as string}
                  className="flex items-center justify-between rounded-2xl p-3.5"
                  style={{ background: bg as string }}
                >
                  <div>
                    <p className="font-bold text-xs sm:text-sm" style={{ color: color as string }}>
                      {lbl as string}
                    </p>
                    <p className="text-xs font-semibold text-[#68776B]">{rate as string}</p>
                  </div>
                  <b className="font-display text-xl sm:text-2xl" style={{ color: color as string }}>
                    {tot as string}
                  </b>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-[#176A3B] p-4 text-white">
              <p className="font-display text-xl font-extrabold">{t.moreEarn}</p>
              <button
                onClick={() =>
                  speakFn(
                    'मंडी की तुलना में किसान जोड़ पर आपको तीन हजार रुपये ज्यादा मिल सकते हैं।',
                    language
                  )
                }
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-bold text-[#FFF1B8] cursor-pointer"
              >
                <Volume2 size={16} />
                {t.listen}
              </button>
            </div>
          </div>
        </Sheet>
      )}

      {/* 7. SUPPORT & COMPLAINT SHEET */}
      {(panel === 'support' || panel === 'complaint') && (
        <Sheet title={panel === 'support' ? t.support : t.complaint} onClose={() => setPanel('none')}>
          <div className="space-y-3 text-xs sm:text-sm">
            {panel === 'support' && (
              <>
                <a
                  href="tel:18001234567"
                  className="flex items-center gap-3.5 rounded-2xl bg-[#EAF6E4] p-4"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1A6B3D] text-white">
                    <Phone size={22} />
                  </span>
                  <div>
                    <b className="block font-display text-lg text-[#284630]">{t.callHelp}</b>
                    <small className="font-semibold text-[#55735E]">1800-123-4567 (Toll Free)</small>
                  </div>
                </a>

                <button
                  onClick={() => openPanel('complaint')}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-[#ECDDD2] bg-[#FFF9F4] p-4 text-left cursor-pointer"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E66C46] text-white">
                    <Megaphone size={22} />
                  </span>
                  <div>
                    <b className="block font-display text-lg text-[#5A3A2D]">{t.complaint}</b>
                    <small className="font-semibold text-[#89695D]">{t.complaintHint}</small>
                  </div>
                </button>
              </>
            )}

            {panel === 'complaint' && (
              <>
                <p className="font-medium text-[#677468] mb-2">{t.complaintHint}</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(language === 'hi'
                    ? [
                        [CreditCard, 'पैसे नहीं मिले'],
                        [Coins, 'गलत भाव'],
                        [Tractor, 'खरीदार की बात'],
                        [CircleHelp, 'ऐप की परेशानी'],
                      ]
                    : [
                        [CreditCard, 'Payment Not Received'],
                        [Coins, 'Incorrect Rate'],
                        [Tractor, 'Buyer Issue'],
                        [CircleHelp, 'App Problem'],
                      ]
                  ).map(([Icon, label]) => (
                    <button
                      key={label as string}
                      onClick={() => setComplaintChoice(label as string)}
                      className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 p-3 text-center cursor-pointer ${
                        complaintChoice === label
                          ? 'border-[#D65C3A] bg-[#FFF0E9] text-[#A6482E]'
                          : 'border-[#E9E3D8] bg-white text-[#56665A]'
                      }`}
                    >
                      <Icon size={22} />
                      <b className="mt-1.5 font-semibold text-xs">{label as string}</b>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleComplaintSubmit}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#C95839] font-display text-lg font-extrabold text-white cursor-pointer"
                >
                  <Megaphone size={20} />
                  {t.submitComplaint}
                </button>
              </>
            )}
          </div>
        </Sheet>
      )}

      {/* 8. AGRI WASTE SHEET */}
      {panel === 'waste' && (
        <Sheet title={t.waste} onClose={() => setPanel('none')}>
          <div className="space-y-4">
            {/* Action button to list new waste item */}
            <button
              onClick={() => setShowAddWasteForm(!showAddWasteForm)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-base font-extrabold text-white shadow-md hover:bg-[#0E5530] transition-colors cursor-pointer"
            >
              <Plus size={20} />
              {showAddWasteForm
                ? (language === 'hi' ? 'वापस दर्ज कचरे की सूची पर जाएँ' : 'Back to Listed Waste Items')
                : (language === 'hi' ? '+ नया कचरा/पराली दर्ज करें' : '+ List New Agri Waste')}
            </button>

            {/* List of previously registered waste items */}
            <div>
              <h4 className="font-display text-base font-extrabold text-[#26452E] mb-2.5">
                {language === 'hi' ? 'आपकी दर्ज कृषि कचरा सूची' : 'Your Listed Agri Waste Items'}
              </h4>
              {wasteItems.length === 0 ? (
                <div className="p-6 text-center text-xs font-bold text-slate-500 bg-[#FBF8EE] rounded-2xl border border-dashed border-[#E7E0D2]">
                  <Recycle size={28} className="mx-auto mb-1 text-[#146B3A] opacity-60" />
                  <p>
                    {language === 'hi'
                      ? 'अभी कोई कचरा दर्ज नहीं है। ऊपर दिए गए बटन को दबाकर कचरा दर्ज करें।'
                      : 'No agri waste registered yet. Press the button above to list waste.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {wasteItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-[#E9E4DA] bg-white shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <b className="block font-display text-sm text-[#2B4331]">{item.wasteName}</b>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#526455]">
                          <span className="bg-[#F6F4EB] px-2 py-0.5 rounded-md font-bold text-[#1E3B27]">
                            ⚖️ {(item.quantity ?? 0).toLocaleString()} kg
                          </span>
                          {item.expectedPrice && (
                            <span className="bg-[#EFF7E9] px-2 py-0.5 rounded-md font-extrabold text-[#146B3A]">
                              ₹{item.expectedPrice} / kg
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-[#718073]">
                          📅 {language === 'hi' ? 'दर्ज तारीख' : 'Listed'}: {item.registrationDate || '10 Aug 2026'}
                        </div>
                        {item.buyerNote && (
                          <div className="text-[11px] font-bold text-[#17663A] bg-[#F2F9EE] px-2 py-0.5 rounded-lg border border-[#D5ECCB]">
                            {item.buyerNote}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full bg-[#EAF6E4] px-2.5 py-0.5 text-xs font-bold text-[#2B743F]">
                          {item.status || (language === 'hi' ? 'आवंटित' : 'Allocated')}
                        </span>
                        <button
                          onClick={() => {
                            if (deleteWaste) deleteWaste(item.id);
                            showToast(language === 'hi' ? 'कचरा हटाया गया' : 'Waste item deleted');
                          }}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Waste Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Form */}
            {showAddWasteForm && (
              <div className="pt-3 border-t border-[#EAE4D8] space-y-3 text-xs sm:text-sm">
                <p className="font-medium text-xs text-[#677468]">
                  {language === 'hi'
                    ? 'पराली (Crop Stubble), भूसा या गोबर की बिक्री के लिए विवरण दर्ज करें।'
                    : 'Enter details to sell crop residue (stubble/parali), straw, or organic cow dung.'}
                </p>
                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">
                    {language === 'hi' ? 'कचरा प्रकार' : 'Waste Category'}
                  </label>
                  <select
                    value={wasteName}
                    onChange={(e) => setWasteName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] font-bold text-[#27452F]"
                  >
                    <option value="Crop Residue / Parali Stubble (पराली)">
                      {language === 'hi' ? 'पराली (Crop Stubble)' : 'Crop Residue / Parali Stubble'}
                    </option>
                    <option value="Organic Cow Dung (गोबर)">
                      {language === 'hi' ? 'जैविक गोबर (Organic Cow Dung)' : 'Organic Cow Dung'}
                    </option>
                    <option value="Spoiled Farm Residue (Biogas)">
                      {language === 'hi' ? 'बायोगैस कृषि कचरा' : 'Spoiled Farm Residue (Biogas)'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">
                    {language === 'hi' ? 'अनुमानित मात्रा (किलो)' : 'Estimated Quantity (kg)'}
                  </label>
                  <input
                    type="number"
                    value={wasteQty}
                    onChange={(e) => setWasteQty(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] font-bold text-[#27452F]"
                  />
                </div>
                <button
                  onClick={() => {
                    handleWasteSubmit();
                    setShowAddWasteForm(false);
                  }}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-lg font-extrabold text-white cursor-pointer"
                >
                  <Recycle size={20} />
                  {language === 'hi' ? 'दर्ज करें' : 'Register Agri Waste'}
                </button>
              </div>
            )}
          </div>
        </Sheet>
      )}

      {/* 9. WOMEN ENTERPRISE SHEET */}
      {panel === 'women' && (
        <Sheet title={t.women} onClose={() => setPanel('none')}>
          <div className="space-y-4">
            {/* Action button to add new product */}
            <button
              onClick={() => setShowAddWomenForm(!showAddWomenForm)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#895078] font-display text-base font-extrabold text-white shadow-md hover:bg-[#6D3D5F] transition-colors cursor-pointer"
            >
              <Plus size={20} />
              {showAddWomenForm
                ? (language === 'hi' ? 'वापस दर्ज उत्पादों की सूची पर जाएँ' : 'Back to Listed Products')
                : (language === 'hi' ? '+ नया महिला उत्पाद जोड़ें' : '+ Add Women Enterprise Product')}
            </button>

            {/* List of previously registered women enterprise products */}
            <div>
              <h4 className="font-display text-base font-extrabold text-[#4A2B42] mb-2.5">
                {language === 'hi' ? 'आपके दर्ज महिला उद्यम उत्पाद' : 'Your Listed Women Enterprise Products'}
              </h4>
              {womenProducts.length === 0 ? (
                <div className="p-6 text-center text-xs font-bold text-slate-500 bg-[#FDF7FB] rounded-2xl border border-dashed border-[#F3DBEC]">
                  <HeartHandshake size={28} className="mx-auto mb-1 text-[#895078] opacity-60" />
                  <p>
                    {language === 'hi'
                      ? 'अभी कोई उत्पाद दर्ज नहीं है। ऊपर दिए गए बटन को दबाकर उत्पाद जोड़ें।'
                      : 'No products listed yet. Press the button above to add product.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {womenProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl border border-[#F2DFED] bg-[#FFFCFE] shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <b className="block font-display text-sm text-[#3E2337]">{prod.productName}</b>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6A4662]">
                          <span className="bg-[#F9EFF7] px-2 py-0.5 rounded-md font-bold text-[#55274B]">
                            ⚖️ {(prod.quantity ?? 0).toLocaleString()} {prod.unit || 'units'}
                          </span>
                          <span className="bg-[#EAF6E4] px-2 py-0.5 rounded-md font-extrabold text-[#146B3A]">
                            💰 ₹{(prod.expectedPrice ?? 0).toLocaleString()}
                          </span>
                        </div>
                        {prod.sellerName && (
                          <div className="text-[11px] font-semibold text-[#845277]">
                            👩‍🌾 {prod.sellerName}
                          </div>
                        )}
                        <div className="text-[11px] font-semibold text-[#8C7687]">
                          📅 {language === 'hi' ? 'दर्ज तारीख' : 'Date Added'}: {prod.dateAdded || '14 Aug 2026'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-full bg-[#F5E6F2] px-2.5 py-1 text-xs font-bold text-[#895078]">
                          {language === 'hi' ? 'सक्रिय उत्पाद' : 'Active Listing'}
                        </span>
                        <button
                          onClick={() => {
                            if (deleteWomenProduct) deleteWomenProduct(prod.id);
                            showToast(language === 'hi' ? 'उत्पाद हटाया गया' : 'Product deleted');
                          }}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Form */}
            {showAddWomenForm && (
              <div className="pt-3 border-t border-[#F0DFEC] space-y-3 text-xs sm:text-sm">
                <p className="font-medium text-xs text-[#677468]">
                  {language === 'hi'
                    ? 'महिला स्व-सहायता समूह (SHG) द्वारा निर्मित जैविक उत्पाद बाज़ार में जोड़ें।'
                    : 'Add organic products created by Women Self Help Groups (SHG) to the marketplace.'}
                </p>
                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">
                    {language === 'hi' ? 'उत्पाद का नाम' : 'Product Name'}
                  </label>
                  <input
                    type="text"
                    value={womenProdName}
                    onChange={(e) => setWomenProdName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] font-bold text-[#27452F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#3D5142] mb-1">
                    {language === 'hi' ? 'मूल्य (₹)' : 'Price (₹)'}
                  </label>
                  <input
                    type="number"
                    value={womenProdPrice}
                    onChange={(e) => setWomenProdPrice(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E5DFD2] bg-[#FFFEFA] font-bold text-[#27452F]"
                  />
                </div>
                <button
                  onClick={() => {
                    handleWomenSubmit();
                    setShowAddWomenForm(false);
                  }}
                  className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#895078] font-display text-lg font-extrabold text-white cursor-pointer"
                >
                  <HeartHandshake size={20} />
                  {language === 'hi' ? 'उत्पाद जोड़ें' : 'Add Product'}
                </button>
              </div>
            )}
          </div>
        </Sheet>
      )}

      {/* Global Modals */}
      <VoiceAssistantModal />
      <DigitalReceiptModal />
      <NotificationModal />
      <ComplaintModal />
      <LogoutModal />
      <ToastContainer />
    </main>
  );
};
