/**
 * Courtyard Companion: a calm, Hindi-first, voice-led farmer interface.
 * Every control combines a recognisable icon, clear wording, and generous touch space.
 */
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bell,
  Bot,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Coins,
  CreditCard,
  HandCoins,
  Headphones,
  Languages,
  Leaf,
  MapPin,
  Megaphone,
  Mic,
  Phone,
  Plus,
  ReceiptIndianRupee,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  Volume2,
  Wheat,
  X,
} from "lucide-react";

type Language = "hi" | "en";
type Screen = "language" | "tutorial" | "home";
type Panel = "none" | "notifications" | "profile" | "demand" | "crop" | "payments" | "support" | "complaint" | "profit" | "waste" | "women";

const assets = {
  logo: "/assets/kisan-saathi-logo.png",
  hero: "/assets/kisan-saathi-hero.jpg",
  wheat: "/assets/kisan-saathi-wheat.png",
  chickpea: "/assets/kisan-saathi-chickpea.png",
  corn: "/assets/kisan-saathi-corn.png",
};

const copy = {
  hi: {
    app: "किसान साथी",
    welcome: "नमस्ते, रमेश जी",
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
    paymentSub: "5 जून 2024 · गेहूँ की बिक्री",
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
    village: "गाँव: सोनपुर, हरदोई",
    phone: "मोबाइल: 98••• 21084",
    replay: "फिर से समझें",
    changeLanguage: "भाषा बदलें",
    logout: "बाहर जाएँ",
    demandDetails: "मांग की पूरी जानकारी",
    cropRegister: "फसल दर्ज करें",
    cropHelp: "कौन-सी फसल और कितनी मात्रा है?",
    quantity: "मात्रा (किलो)",
    grade: "फसल की गुणवत्ता",
    confirm: "ठीक है, दर्ज करें",
    payments: "पैसों की जानकारी",
    support: "मदद और शिकायत",
    complaint: "शिकायत करें",
    complaintHint: "आपकी बात हमारी टीम तक पहुँच जाएगी",
    submitComplaint: "शिकायत भेजें",
    complaintDone: "शिकायत क्रमांक 23451 दर्ज हो गया",
    profitTitle: "आपका ज्यादा फायदा",
    mandi: "मंडी / दलाल",
    platform: "किसान साथी",
    moreEarn: "आप ₹3,000 ज्यादा कमा सकते हैं",
    waste: "कृषि कचरा बेचें",
    women: "महिला उद्यम",
    listening: "सुन रहे हैं...",
    voiceReply: "आपकी बात समझ ली। मैं आपकी मदद कर रहा हूँ।",
  },
  en: {
    app: "Kisan Saathi",
    welcome: "Hello, Ramesh ji",
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
    paymentSub: "5 Jun 2024 · Wheat sale",
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
    village: "Village: Sonpur, Hardoi",
    phone: "Mobile: 98••• 21084",
    replay: "Learn again",
    changeLanguage: "Change language",
    logout: "Log out",
    demandDetails: "Demand details",
    cropRegister: "Register crop",
    cropHelp: "Which crop do you have and how much?",
    quantity: "Quantity (kg)",
    grade: "Crop quality",
    confirm: "Yes, register it",
    payments: "Payment details",
    support: "Help and complaints",
    complaint: "Make a complaint",
    complaintHint: "Your concern will reach our team",
    submitComplaint: "Send complaint",
    complaintDone: "Complaint number 23451 is registered",
    profitTitle: "Your extra earnings",
    mandi: "Mandi / middleman",
    platform: "Kisan Saathi",
    moreEarn: "You can earn ₹3,000 more",
    waste: "Sell farm waste",
    women: "Women’s enterprise",
    listening: "Listening...",
    voiceReply: "I understood. I’m helping you now.",
  },
} as const;

const demandItems = [
  { name: { hi: "गेहूँ", en: "Wheat" }, image: assets.wheat, quantity: "1,00,000 kg", filled: "50,000 kg", price: "₹18/kg", percent: 50, tone: "wheat" },
  { name: { hi: "चना", en: "Chickpea" }, image: assets.chickpea, quantity: "80,000 kg", filled: "20,000 kg", price: "₹22/kg", percent: 25, tone: "chickpea" },
  { name: { hi: "मक्का", en: "Corn" }, image: assets.corn, quantity: "1,20,000 kg", filled: "60,000 kg", price: "₹16/kg", percent: 50, tone: "corn" },
];

function speak(text: string, language: Language) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function Pressable({ children, onClick, reader, readText, className = "", label }: { children: ReactNode; onClick?: () => void; reader: boolean; readText: string; className?: string; label?: string }) {
  return (
    <button
      className={`focus-visible:ring-4 focus-visible:ring-[#E3A848]/50 ${className}`}
      aria-label={label || readText}
      onClick={() => {
        if (reader) speak(readText, /[\u0900-\u097F]/.test(readText) ? "hi" : "en");
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#182219]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <section className="sheet-enter max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[#FFFEF8] px-5 pb-8 pt-4 shadow-[0_-18px_60px_rgba(27,48,31,0.18)] sm:rounded-[2rem]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#D8D3C2] sm:hidden" />
        <div className="mb-5 flex items-center justify-between border-b border-[#E9E2D4] pb-4">
          <h2 className="font-display text-2xl font-bold text-[#1E3424]">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="rounded-full bg-[#F0EEE5] p-2 text-[#536257] transition active:scale-95"><X size={22} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("hi");
  const [screen, setScreen] = useState<Screen>("language");
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [panel, setPanel] = useState<Panel>("none");
  const [reader, setReader] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState(0);
  const [cropQuantity, setCropQuantity] = useState("50,000");
  const [complaintChoice, setComplaintChoice] = useState("");
  const t = copy[language];

  useEffect(() => {
    if (screen === "tutorial") speak(t.tutorial[tutorialIndex][1], language);
  }, [screen, tutorialIndex, language, t]);

  const openPanel = (next: Panel) => setPanel(next);
  const describe = (text: string) => reader && speak(text, language);

  const startListening = () => {
    setListening(true);
    speak(t.listening, language);
    const recognitionConstructor = (window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!recognitionConstructor) {
      window.setTimeout(() => {
        setListening(false);
        speak(t.voiceReply, language);
        toast.success(t.voiceReply);
      }, 1800);
      return;
    }
    const recognition = new recognitionConstructor();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      if (/payment|पैस|भुगतान/i.test(heard)) openPanel("payments");
      else if (/फसल|crop|गेहूँ|wheat/i.test(heard)) openPanel("crop");
      else if (/शिकायत|complaint/i.test(heard)) openPanel("complaint");
      else if (/मंडी|profit|फायदा|rate|भाव/i.test(heard)) openPanel("profit");
      else openPanel("demand");
      speak(t.voiceReply, language);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    speak(nextLanguage === "hi" ? "आपने हिंदी चुनी है। आगे बढ़ें दबाइए।" : "You selected English. Press continue.", nextLanguage);
  };

  if (screen === "language") {
    return (
      <main className="language-screen min-h-screen bg-[#FBF8EE] px-5 py-7 text-[#223124] sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col justify-between overflow-hidden rounded-[2rem] border border-[#E9E0CD] bg-[#FFFEF8] shadow-[0_18px_60px_rgba(104,85,45,0.12)] md:flex-row">
          <section className="courtyard-welcome relative flex flex-1 flex-col justify-between overflow-hidden bg-[#C56E4E] p-7 text-[#FFF9ED] sm:p-10">
            <div className="absolute -right-12 top-10 h-44 w-44 rounded-full border-[18px] border-[#F7D886]/45" />
            <div className="courtyard-contour courtyard-contour-one" /><div className="courtyard-contour courtyard-contour-two" />
            <div className="relative flex items-center gap-3"><img src={assets.logo} alt="" className="h-16 w-16 rounded-[1.15rem] bg-white/90 p-2 shadow-[0_6px_16px_rgba(83,43,29,0.16)]" /><div><p className="font-display text-3xl font-extrabold tracking-tight">{t.app}</p><p className="text-sm font-semibold text-white/80">{language === "hi" ? "आपका भरोसेमंद साथी" : "Your trusted farm companion"}</p></div></div>
            <div className="relative mt-10 max-w-md md:mb-10"><div className="mb-5 flex items-center gap-4"><span className="voice-ripple relative flex h-16 w-16 items-center justify-center rounded-full bg-[#F4CB68] text-[#2B5D75] shadow-[0_0_0_8px_rgba(247,216,134,0.22)]"><Mic size={31} /></span><span><p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-[#FFF0C2]"><Volume2 size={15} className="mr-2" /> Voice-first</p><p className="mt-1 text-sm font-semibold text-white/85">{language === "hi" ? "बस बोलिए, हम मदद करेंगे" : "Just speak, we will help"}</p></span></div><h1 className="font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl">{t.chooseLanguage}</h1><p className="mt-4 max-w-sm text-lg leading-relaxed text-white/90">{t.chooseLanguageSub}</p><div className="mt-6 inline-flex items-center gap-3 rounded-[1.35rem] border border-[#F9E8BE]/40 bg-[#A6533B]/20 p-2 pr-4"><img src={assets.wheat} alt="" className="h-12 w-12 rounded-xl bg-[#FFF5DD] object-cover" /><span><b className="block text-sm text-[#FFF5D7]">{language === "hi" ? "फसल का सही भाव" : "Fair crop price"}</b><small className="text-xs font-semibold text-white/75">{language === "hi" ? "बोलकर पूछिए" : "Ask by speaking"}</small></span></div></div>
            <div className="relative mt-8 flex items-center gap-3 text-sm text-white/80"><ShieldCheck size={20} className="text-[#F1C95C]" /> {language === "hi" ? "हर कदम पर आसान मदद" : "Simple help at every step"}</div>
          </section>
          <section className="relative flex flex-1 flex-col justify-center overflow-hidden bg-[#FFF9EF] p-6 sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full border-[18px] border-[#D8E8F3]" />
            <div className="relative z-10 mb-6 flex items-center gap-3 rounded-[1.3rem] border border-[#D5E3ED] bg-[#EAF3F9] p-4 text-[#2C5976]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2B6EAE] shadow-sm"><Volume2 size={21} /></span><span><b className="block font-display text-lg">{language === "hi" ? "पहले भाषा चुनिए" : "First, choose a language"}</b><small className="font-semibold text-[#5E7F96]">{language === "hi" ? "हम आगे की हर बात इसी भाषा में समझाएँगे" : "We will explain every next step in this language"}</small></span></div>
            <div className="space-y-3">
              {([
                ["hi", "हिंदी", "Hindi", "अ"],
                ["en", "English", "English", "A"],
              ] as const).map(([key, primary, secondary, mark]) => (
                <Pressable key={key} reader={false} readText={primary} onClick={() => selectLanguage(key)} className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${language === key ? "border-[#146B3A] bg-[#F1F8EA] shadow-[0_8px_22px_rgba(20,107,58,0.10)]" : "border-[#ECE6D9] bg-white hover:border-[#C7DCE9]"}`}>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-3xl font-bold ${language === key ? "bg-[#146B3A] text-white" : "bg-[#F5F0E4] text-[#80643D]"}`}>{mark}</span>
                  <span className="flex-1"><strong className="block font-display text-xl">{primary}</strong><small className="text-sm text-[#718073]">{secondary}</small></span>
                  <span className={`h-6 w-6 rounded-full border-2 ${language === key ? "border-[7px] border-[#146B3A]" : "border-[#C7C2B7]"}`} />
                </Pressable>
              ))}
            </div>
            <Pressable reader={false} readText={t.start} onClick={() => setScreen("tutorial")} className="mt-7 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#146B3A] px-5 font-display text-xl font-bold text-white shadow-[0_10px_20px_rgba(20,107,58,0.22)] transition hover:bg-[#0E5530] active:scale-[0.98]"><Volume2 size={22} /> {t.start}<ChevronRight size={22} /></Pressable>
          </section>
        </div>
      </main>
    );
  }

  if (screen === "tutorial") {
    const [title, description] = t.tutorial[tutorialIndex];
    const TutorialIcon = [Mic, Sprout, HandCoins, ReceiptIndianRupee, Phone][tutorialIndex];
    return (
      <main className="min-h-screen bg-[#FBF8EE] p-4 sm:p-8">
        <section className="tutorial-shell mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[#E7DDCA] bg-[#FFFEF8] shadow-[0_20px_60px_rgba(104,85,45,0.12)] sm:min-h-[680px]">
          <div className="flex items-center justify-between p-5 sm:p-7"><div className="flex items-center gap-3"><img src={assets.logo} alt="" className="h-11 w-11 rounded-xl bg-[#EAF6E4] p-1.5" /><span className="font-display text-xl font-bold text-[#1F3A28]">{t.app}</span></div><Pressable reader={false} readText={t.skip} onClick={() => setScreen("home")} className="text-sm font-bold text-[#59705F] underline-offset-4 hover:underline">{t.skip}</Pressable></div>
          <div className="flex-1 px-6 pb-5 pt-5 sm:px-16 sm:pt-10">
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full bg-[#E7F0F7] shadow-[inset_0_0_0_15px_#FAF2DE] sm:h-60 sm:w-60"><TutorialIcon size={104} strokeWidth={1.3} className="text-[#2B6EAE]" /></div>
            <div className="mx-auto mt-9 max-w-lg text-center"><p className="mb-3 font-semibold text-[#B9791B]">{tutorialIndex + 1} / {t.tutorial.length}</p><h1 className="font-display text-4xl font-extrabold leading-tight text-[#243E2A] sm:text-5xl">{title}</h1><p className="mt-4 text-xl leading-relaxed text-[#5C6A5F]">{description}</p><Pressable reader={false} readText={t.listen} onClick={() => speak(`${title}. ${description}`, language)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F7EDCF] px-5 py-3 font-bold text-[#6E5121]"><Volume2 size={18} /> {t.listen}</Pressable></div>
          </div>
          <div className="px-6 pb-7 sm:px-12"><div className="mb-5 flex gap-2">{t.tutorial.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index <= tutorialIndex ? "bg-[#1A6B3D]" : "bg-[#E9E3D5]"}`} />)}</div><Pressable reader={false} readText={tutorialIndex === t.tutorial.length - 1 ? t.startApp : t.tutorialStep} onClick={() => tutorialIndex === t.tutorial.length - 1 ? setScreen("home") : setTutorialIndex((value) => value + 1)} className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-xl font-bold text-white shadow-[0_10px_20px_rgba(20,107,58,0.22)] active:scale-[0.98]">{tutorialIndex === t.tutorial.length - 1 ? <Sprout size={23} /> : null}{tutorialIndex === t.tutorial.length - 1 ? t.startApp : t.tutorialStep}<ChevronRight size={21} /></Pressable></div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF8EE] pb-28 text-[#223124]">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3"><img src={assets.logo} alt="Kisan Saathi" className="h-12 w-12 rounded-2xl bg-[#EAF6E4] p-1.5 shadow-sm" /><div><p className="font-display text-xl font-extrabold text-[#1E3B27]">{t.app}</p><p className="text-xs font-semibold text-[#7F8A7D]">{t.updated}</p></div></div>
          <div className="flex items-center gap-2"><Pressable reader={reader} readText={t.notifications} onClick={() => openPanel("notifications")} className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7E0D2] bg-white text-[#31513A] shadow-sm"><Bell size={22} /><span className="absolute right-2 top-2 h-4 min-w-4 rounded-full bg-[#D85536] px-1 text-[10px] font-bold leading-4 text-white">3</span></Pressable><Pressable reader={reader} readText={t.profile} onClick={() => openPanel("profile")} className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#E1D7C6] bg-[#F3E5C9] text-[#71522B] shadow-sm"><CircleUserRound size={25} /></Pressable></div>
        </header>

        <section className="hero-panel relative mb-7 overflow-hidden rounded-[1.75rem] bg-[#F2DEAF] text-[#3D3828] shadow-[0_15px_40px_rgba(129,95,40,0.14)]">
          <div className="relative z-10 max-w-xl p-6 sm:p-8"><p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-1 text-sm font-semibold text-[#99651F]"><Sparkles size={16} /> आपका आवाज़ वाला साथी</p><h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.welcome}<br />{t.ask}</h1><Pressable reader={reader} readText={t.speak} onClick={startListening} className={`mt-6 flex min-h-16 items-center gap-3 rounded-2xl px-5 font-display text-xl font-extrabold shadow-[0_8px_18px_rgba(98,74,30,0.15)] transition active:scale-[0.98] ${listening ? "bg-[#F1C95C] text-[#40320F]" : "bg-[#146B3A] text-white"}`}><span className={`flex h-10 w-10 items-center justify-center rounded-full ${listening ? "bg-[#FFF0B6]" : "bg-[#E8F1FA] text-[#2B6EAE]"}`}><Mic size={23} /></span>{listening ? t.listening : t.speak}</Pressable></div>
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[48%] overflow-hidden md:block"><img src={assets.hero} alt="Farmer using a phone in a crop field" className="h-full w-full object-cover object-right opacity-90" /><div className="absolute inset-0 bg-gradient-to-r from-[#F2DEAF] via-[#F2DEAF]/25 to-transparent" /></div>
          <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full border-[18px] border-[#C56E4E]/20" />
        </section>

        <section className="mb-8"><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow">बाज़ार से सीधा</p><h2 className="font-display text-2xl font-extrabold text-[#26452E]">{t.currentDemand}</h2></div><Pressable reader={reader} readText={t.seeAll} onClick={() => openPanel("demand")} className="flex items-center gap-1 rounded-lg px-2 py-2 font-bold text-[#166138] hover:bg-[#EFF7E8]">{t.seeAll}<ChevronRight size={18} /></Pressable></div>
          <div className="hide-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">{demandItems.map((item, index) => <Pressable key={item.tone} reader={reader} readText={`${item.name[language]}, ${item.price}`} onClick={() => { setSelectedDemand(index); openPanel("demand"); }} className="demand-card min-w-[255px] snap-start rounded-[1.45rem] border border-[#E8E2D5] bg-[#FFFEFB] p-4 text-left shadow-[0_7px_20px_rgba(71,79,54,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(71,79,54,0.11)] sm:min-w-[285px]"><div className="flex items-start justify-between"><img src={item.image} alt="" className="h-14 w-14 rounded-2xl bg-[#F8F3E4] object-cover" /><span className="rounded-full bg-[#F8E5AF] px-2.5 py-1 text-xs font-bold text-[#855313]">{item.price}</span></div><h3 className="mt-3 font-display text-2xl font-extrabold text-[#284330]">{item.name[language]}</h3><div className="mt-3 flex justify-between text-xs font-semibold text-[#68776B]"><span>{t.registered}</span><span>{item.filled}</span></div><div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[#E8E5DA]"><div className="h-full rounded-full bg-[#22904D]" style={{ width: `${item.percent}%` }} /></div><p className="mt-2 text-sm font-semibold text-[#56665A]"><b className="text-[#253F2C]">{item.quantity}</b> {t.needed}</p></Pressable>)}</div>
        </section>

        <section className="mb-8"><div className="mb-3"><p className="eyebrow">आसान काम</p><h2 className="font-display text-2xl font-extrabold text-[#26452E]">{t.whatNext}</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[
          [Sprout, t.myCrops, "#E5F4DF", "#1B6B3B", "crop"],
          [Tractor, t.waste, "#F7E9DA", "#AD6433", "waste"],
          [HandCoins, t.women, "#F4E7F3", "#895078", "women"],
          [Coins, t.profit, "#FBF0D7", "#9A6518", "profit"],
          [CreditCard, t.payment, "#E8F1FA", "#2B6EAE", "payments"],
          [CircleHelp, t.help, "#F8E8DF", "#AD5439", "support"],
        ].map(([Icon, title, bg, color, destination]) => <Pressable key={title as string} reader={reader} readText={title as string} onClick={() => openPanel(destination as Panel)} className="group flex min-h-32 flex-col items-start rounded-[1.35rem] border border-[#E7E1D5] bg-white p-4 text-left shadow-[0_5px_16px_rgba(71,79,54,0.06)] transition hover:-translate-y-0.5 active:scale-[0.98]"><span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: bg as string, color: color as string }}><Icon size={25} strokeWidth={1.8} /></span><span className="mt-3 font-display text-lg font-extrabold text-[#2B4331]">{title as string}</span><ChevronRight className="ml-auto mt-auto text-[#9AAB9E] transition group-hover:translate-x-1" size={19} /></Pressable>)}</div></section>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[1.55rem] border border-[#E8E2D6] bg-white p-5 shadow-[0_8px_24px_rgba(71,79,54,0.06)]"><div className="flex items-center justify-between"><div><p className="eyebrow">घर की फसल</p><h2 className="font-display text-2xl font-extrabold text-[#26452E]">{t.crops}</h2></div><Pressable reader={reader} readText={t.addCrop} onClick={() => openPanel("crop")} className="flex items-center gap-1 rounded-xl bg-[#EAF6E4] px-3 py-2 font-bold text-[#17663A]"><Plus size={17} />{t.addCrop}</Pressable></div><div className="mt-4 divide-y divide-[#ECE6D9]">{demandItems.slice(0, 2).map((item, index) => <Pressable key={item.tone} reader={reader} readText={`${item.name[language]} ${item.filled}, ${t.matched}`} onClick={() => { setSelectedDemand(index); openPanel("demand"); }} className="flex w-full items-center gap-3 py-3 text-left"><img src={item.image} alt="" className="h-12 w-12 rounded-xl bg-[#F7F1E3] object-cover" /><span className="flex-1"><b className="block font-display text-lg text-[#2B4331]">{item.name[language]}</b><small className="font-semibold text-[#718073]">{item.filled} · Grade A</small></span><span className="rounded-full bg-[#EAF6E4] px-2.5 py-1 text-xs font-bold text-[#2B743F]">{t.matched}</span><ChevronRight size={18} className="text-[#9FA99F]" /></Pressable>)}</div></div>
          <Pressable reader={reader} readText={t.viewPayments} onClick={() => openPanel("payments")} className="relative overflow-hidden rounded-[1.55rem] bg-[#386C9E] p-5 text-left text-white shadow-[0_12px_28px_rgba(47,89,130,0.18)]"><div className="absolute -right-5 -top-7 h-32 w-32 rounded-full border-[16px] border-white/14" /><span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-[#F7CF66]"><ReceiptIndianRupee size={27} /></span><p className="relative mt-5 text-sm font-bold text-[#DDECF7]">{t.viewPayments}</p><h3 className="relative mt-1 font-display text-3xl font-extrabold">{t.paymentReceived}</h3><p className="relative mt-2 text-sm text-white/80">{t.paymentSub}</p><span className="relative mt-5 inline-flex items-center gap-1 font-bold text-[#F9D982]">{t.seeAll} <ChevronRight size={18} /></span></Pressable>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.55rem] border border-[#E7DFD0] bg-[#F3E7C9] shadow-[0_8px_22px_rgba(99,75,31,0.07)]"><div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#9B6822]"><Phone size={27} /></span><div><h2 className="font-display text-2xl font-extrabold text-[#4E3B1F]">{t.safeSale}</h2><p className="mt-1 font-medium leading-relaxed text-[#6A5635]">{t.safeSaleText}</p></div><a href="tel:18001234567" onClick={() => describe(t.callHelp)} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFFFFF] px-5 font-display text-lg font-extrabold text-[#265D36] shadow-sm transition hover:bg-[#FFFDF8] active:scale-[0.98]"><Headphones size={21} />{t.callHelp}</a></div></section>
      </div>

      <Pressable reader={false} readText={reader ? "रीडर बंद करें" : "रीडर चालू करें"} onClick={() => { setReader((value) => !value); toast.success(reader ? "Text Reader off" : "Text Reader on"); }} className={`fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl border-2 shadow-[0_10px_22px_rgba(46,73,47,0.18)] transition active:scale-95 ${reader ? "border-[#F1C95C] bg-[#F1C95C] text-[#49380D]" : "border-white bg-[#155F36] text-white"}`}><Volume2 size={24} /></Pressable>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#E3DED0] bg-[#FFFEFA]/95 px-3 py-2 backdrop-blur-md"><div className="mx-auto flex max-w-2xl items-end justify-between"><Pressable reader={reader} readText={t.bottomHome} className="nav-item active"><Tractor size={21} /><span>{t.bottomHome}</span></Pressable><Pressable reader={reader} readText={t.bottomCrops} onClick={() => openPanel("crop")} className="nav-item"><Leaf size={21} /><span>{t.bottomCrops}</span></Pressable><Pressable reader={reader} readText={t.bottomVoice} onClick={startListening} className="relative -top-6 flex h-16 w-16 flex-col items-center justify-center rounded-full border-[5px] border-[#FBF8EE] bg-[#1A7740] text-white shadow-[0_8px_16px_rgba(20,107,58,0.25)]"><Mic size={26} /><span className="mt-0.5 text-[10px] font-bold">{t.bottomVoice}</span></Pressable><Pressable reader={reader} readText={t.bottomHelp} onClick={() => openPanel("support")} className="nav-item"><CircleHelp size={21} /><span>{t.bottomHelp}</span></Pressable><Pressable reader={reader} readText={t.bottomProfile} onClick={() => openPanel("profile")} className="nav-item"><CircleUserRound size={21} /><span>{t.bottomProfile}</span></Pressable></div></nav>

      {panel === "notifications" && <Sheet title={t.notifications} onClose={() => setPanel("none")}><div className="space-y-3">{([[HandCoins, "नई मांग आई है — गेहूँ ₹18 प्रति किलो", "2 घंटे पहले", "demand"], [CreditCard, "आपको ₹12,500 मिले हैं", "5 जून", "payments"], [Megaphone, "आपकी शिकायत पर काम शुरू हो गया", "कल", "complaint"]] as const).map(([Icon, text, time, destination]) => <Pressable key={text} reader={reader} readText={text} onClick={() => openPanel(destination)} className="flex w-full items-center gap-4 rounded-2xl border border-[#EAE4D8] bg-white p-4 text-left"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFF7E9] text-[#1C6C3D]"><Icon size={21} /></span><span className="flex-1"><b className="block font-semibold text-[#2B4431]">{text}</b><small className="mt-1 block text-[#7B887D]">{time}</small></span><ChevronRight size={19} className="text-[#9FAAA0]" /></Pressable>)}</div></Sheet>}
      {panel === "profile" && <Sheet title={t.profile} onClose={() => setPanel("none")}><div className="rounded-2xl bg-[#EFF7E9] p-4"><div className="flex items-center gap-3"><span className="flex h-15 w-15 h-14 w-14 items-center justify-center rounded-2xl bg-[#E6C17B] text-[#64431A]"><CircleUserRound size={30} /></span><div><h3 className="font-display text-xl font-extrabold text-[#284631]">रमेश कुमार</h3><p className="mt-1 text-sm font-medium text-[#5F7464]">{t.village}</p></div></div><p className="mt-3 text-sm font-semibold text-[#56715B]">{t.phone}</p></div><div className="mt-4 space-y-2">{([[RotateCcw, t.replay, () => { setPanel("none"); setTutorialIndex(0); setScreen("tutorial"); }], [Languages, t.changeLanguage, () => { setPanel("none"); setScreen("language"); }], [MapPin, "मेरी फसल और गाँव", () => openPanel("crop")], [ArrowLeft, t.logout, () => toast.message("आपको सुरक्षित रूप से बाहर किया गया")]] as const).map(([Icon, text, action]) => <Pressable key={text as string} reader={reader} readText={text as string} onClick={action as () => void} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#F5F4EC]"><Icon size={20} className="text-[#296540]" /><span className="flex-1 font-semibold text-[#354A3B]">{text as string}</span><ChevronRight size={18} className="text-[#A5AFA6]" /></Pressable>)}</div></Sheet>}
      {panel === "demand" && <Sheet title={t.demandDetails} onClose={() => setPanel("none")}><div className="flex items-center gap-4 rounded-2xl bg-[#F5F8EF] p-4"><img src={demandItems[selectedDemand].image} alt="" className="h-20 w-20 rounded-2xl object-cover" /><div><h3 className="font-display text-2xl font-extrabold text-[#27452F]">{demandItems[selectedDemand].name[language]}</h3><p className="mt-1 font-bold text-[#206A3E]">{demandItems[selectedDemand].price}</p><p className="mt-1 text-sm font-semibold text-[#637464]">{demandItems[selectedDemand].filled} / {demandItems[selectedDemand].quantity}</p></div></div><div className="mt-5 space-y-4"><div><div className="mb-1 flex justify-between text-sm font-semibold text-[#526556]"><span>{t.registered}</span><span>{demandItems[selectedDemand].percent}%</span></div><div className="h-3 overflow-hidden rounded-full bg-[#E4E6DA]"><div className="h-full rounded-full bg-[#22904D]" style={{ width: `${demandItems[selectedDemand].percent}%` }} /></div></div><p className="rounded-xl border border-[#E8E1D1] bg-white p-4 font-medium leading-relaxed text-[#5E6B60]">Agri Foods Pvt. Ltd. इस फसल के लिए खरीदार है। फसल की गुणवत्ता Grade A होने पर जल्दी मिलान होगा।</p><Pressable reader={reader} readText={t.haveCrop} onClick={() => openPanel("crop")} className="flex min-h-15 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-xl font-extrabold text-white active:scale-[0.98]"><Sprout size={22} />{t.haveCrop}</Pressable></div></Sheet>}
      {panel === "crop" && <Sheet title={t.cropRegister} onClose={() => setPanel("none")}><p className="mb-5 font-medium text-[#647266]">{t.cropHelp}</p><div className="grid grid-cols-3 gap-3">{demandItems.map((item, index) => <Pressable key={item.tone} reader={reader} readText={item.name[language]} onClick={() => setSelectedDemand(index)} className={`rounded-2xl border-2 p-3 text-center ${index === selectedDemand ? "border-[#1C6C3D] bg-[#EFF8E9]" : "border-[#E9E4D9] bg-white"}`}><img src={item.image} alt="" className="mx-auto h-12 w-12 rounded-xl object-cover" /><b className="mt-2 block font-display text-base text-[#29432F]">{item.name[language]}</b></Pressable>)}</div><label className="mt-6 block"><span className="mb-2 block font-bold text-[#3D5142]">{t.quantity}</span><input value={cropQuantity} onChange={(event) => setCropQuantity(event.target.value)} inputMode="numeric" className="min-h-14 w-full rounded-xl border-2 border-[#E5DFD2] bg-[#FFFEFA] px-4 text-xl font-bold text-[#27452F] outline-none focus:border-[#2B7A43]" /></label><p className="mt-5 font-bold text-[#3D5142]">{t.grade}</p><div className="mt-2 grid grid-cols-3 gap-2">{["Grade A", "Grade B", "Grade C"].map((value, index) => <Pressable key={value} reader={reader} readText={value} className={`rounded-xl border-2 p-3 font-bold ${index === 0 ? "border-[#278144] bg-[#EFF8E9] text-[#26713D]" : "border-[#E8E1D5] text-[#6A776C]"}`}>{value}</Pressable>)}</div><Pressable reader={reader} readText={t.confirm} onClick={() => { setPanel("none"); toast.success(`${demandItems[selectedDemand].name[language]} ${cropQuantity} kg दर्ज हो गया`); speak(`${demandItems[selectedDemand].name[language]} ${cropQuantity} किलो दर्ज हो गया`, language); }} className="mt-6 flex min-h-15 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-xl font-extrabold text-white"><ShieldCheck size={22} />{t.confirm}</Pressable></Sheet>}
      {panel === "payments" && <Sheet title={t.payments} onClose={() => setPanel("none")}><div className="rounded-2xl bg-[#EAF6E4] p-5"><p className="text-sm font-bold text-[#52805B]">भुगतान हो गया</p><p className="mt-1 font-display text-4xl font-extrabold text-[#1B6B3B]">₹12,500</p><p className="mt-2 font-semibold text-[#54705A]">गेहूँ · 700 किलो · 5 जून 2024</p></div><div className="mt-4 rounded-2xl border border-[#E9E4DA] bg-white p-4"><div className="flex justify-between border-b border-[#EEE9DF] pb-3"><span className="font-semibold text-[#667568]">लेन-देन नंबर</span><b className="text-[#2B4331]">KS-524184</b></div><div className="flex justify-between py-3"><span className="font-semibold text-[#667568]">भाव</span><b className="text-[#2B4331]">₹18 / किलो</b></div><Pressable reader={reader} readText={t.listen} onClick={() => speak("आपको पाँच जून को गेहूँ बेचने पर बारह हज़ार पाँच सौ रुपये मिले।", language)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2F1E9] py-3 font-bold text-[#35513D]"><Volume2 size={18} />{t.listen}</Pressable></div></Sheet>}
      {panel === "profit" && <Sheet title={t.profitTitle} onClose={() => setPanel("none")}><p className="mb-4 font-medium text-[#657366]">700 किलो गेहूँ की तुलना</p><div className="space-y-3">{[[t.mandi, "₹15/kg", "₹10,500", "#E9E6DB", "#6B7169"], [t.platform, "₹18/kg", "₹12,600", "#EAF6E4", "#216C3C"]].map(([label, rate, total, bg, color]) => <div key={label} className="flex items-center justify-between rounded-2xl p-4" style={{ background: bg }}><div><p className="font-bold" style={{ color }}>{label}</p><p className="mt-1 text-sm font-semibold text-[#68776B]">{rate}</p></div><b className="font-display text-2xl" style={{ color }}>{total}</b></div>)}</div><div className="mt-5 rounded-2xl bg-[#176A3B] p-5 text-white"><p className="font-display text-2xl font-extrabold">{t.moreEarn}</p><Pressable reader={false} readText={t.listen} onClick={() => speak("मंडी की तुलना में किसान साथी पर आपको तीन हजार रुपये ज्यादा मिल सकते हैं।", language)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 font-bold text-[#FFF1B8]"><Volume2 size={18} />{t.listen}</Pressable></div></Sheet>}
      {(panel === "support" || panel === "complaint") && <Sheet title={panel === "support" ? t.support : t.complaint} onClose={() => setPanel("none")}><div className="space-y-3">{panel === "support" && <><a href="tel:18001234567" className="flex items-center gap-4 rounded-2xl bg-[#EAF6E4] p-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A6B3D] text-white"><Phone size={23} /></span><span><b className="block font-display text-xl text-[#284630]">{t.callHelp}</b><small className="font-semibold text-[#55735E]">1800-123-4567</small></span></a><Pressable reader={reader} readText={t.complaint} onClick={() => openPanel("complaint")} className="flex w-full items-center gap-4 rounded-2xl border border-[#ECDDD2] bg-[#FFF9F4] p-4 text-left"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E66C46] text-white"><Megaphone size={23} /></span><span><b className="block font-display text-xl text-[#5A3A2D]">{t.complaint}</b><small className="font-semibold text-[#89695D]">{t.complaintHint}</small></span></Pressable></>}{panel === "complaint" && <><p className="font-medium text-[#677468]">{t.complaintHint}</p><div className="grid grid-cols-2 gap-3">{[[CreditCard, "पैसे नहीं मिले"], [Coins, "गलत भाव"], [Tractor, "खरीदार की बात"], [CircleHelp, "ऐप की परेशानी"]].map(([Icon, label]) => <Pressable key={label as string} reader={reader} readText={label as string} onClick={() => setComplaintChoice(label as string)} className={`flex min-h-28 flex-col items-center justify-center rounded-2xl border-2 p-3 text-center ${complaintChoice === label ? "border-[#D65C3A] bg-[#FFF0E9] text-[#A6482E]" : "border-[#E9E3D8] bg-white text-[#56665A]"}`}><Icon size={25} /><b className="mt-2 font-semibold">{label as string}</b></Pressable>)}</div><Pressable reader={reader} readText={t.submitComplaint} onClick={() => { setPanel("none"); toast.success(t.complaintDone); speak(t.complaintDone, language); }} className="flex min-h-15 w-full items-center justify-center gap-2 rounded-2xl bg-[#C95839] font-display text-xl font-extrabold text-white"><Megaphone size={21} />{t.submitComplaint}</Pressable></>}</div></Sheet>}
      {panel === "waste" && <Sheet title={t.waste} onClose={() => setPanel("none")}><p className="font-medium text-[#677468]">पराली, भूसा या गीला कचरा बेचने के लिए हमें बोलकर बताइए।</p><Pressable reader={reader} readText={t.speak} onClick={startListening} className="mt-5 flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-xl font-bold text-white"><Mic size={22} />{t.speak}</Pressable></Sheet>}
      {panel === "women" && <Sheet title={t.women} onClose={() => setPanel("none")}><p className="font-medium text-[#677468]">घर के बने सामान, गोबर के उत्पाद या कृषि सामग्री की बिक्री में मदद मिलेगी।</p><Pressable reader={reader} readText={t.speak} onClick={startListening} className="mt-5 flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#146B3A] font-display text-xl font-bold text-white"><Mic size={22} />{t.speak}</Pressable></Sheet>}
    </main>
  );
}
