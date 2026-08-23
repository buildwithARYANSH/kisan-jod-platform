import type { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  themeToggle: string;
  selectLanguage: string;
  currentDemand: string;
  demandSubtitle: string;
  required: string;
  registered: string;
  offeredPrice: string;
  registerSupplyForThis: string;
  urgentDemand: string;
  buyers: string;
  micPrompt: string;
  micSubPrompt: string;
  micListening: string;
  micProcessing: string;
  trySaying: string;

  // Features
  myCrop: string;
  wasteManagement: string;
  womenEnterprises: string;
  profit: string;
  paycheck: string;
  myProfile: string;

  // Crop section
  registeredCrops: string;
  addCrop: string;
  cropName: string;
  quantityKg: string;
  grade: string;
  harvestDate: string;
  registrationDate: string;
  matchedDemand: string;
  offerPriceLabel: string;
  status: string;
  actions: string;
  edit: string;
  delete: string;
  noCropsYet: string;
  addCropSuccess: string;
  cropGradeExplanation: string;

  // Waste Management
  wasteSectionTitle: string;
  addWaste: string;
  wasteName: string;
  wasteType: string;
  wetWaste: string;
  dryWaste: string;
  expectedPrice: string;
  noWasteYet: string;
  wasteStatus: string;

  // Women Enterprises
  womenSectionTitle: string;
  tabSell: string;
  tabList: string;
  addProduct: string;
  addResource: string;
  productName: string;
  productPrice: string;
  productDescription: string;
  resourceName: string;
  noProductsYet: string;
  noResourcesYet: string;

  // Profit
  profitSectionTitle: string;
  mandiVsPlatform: string;
  mandiRate: string;
  platformRate: string;
  mandiEarnings: string;
  platformEarnings: string;
  extraProfit: string;
  calculateProfit: string;

  // Paycheck
  paycheckSectionTitle: string;
  digitalReceipts: string;
  txnId: string;
  amountReceived: string;
  viewReceipt: string;
  downloadReceipt: string;
  noTransactionsYet: string;

  // Profile
  farmerProfile: string;
  phone: string;
  villageState: string;
  bankStatus: string;
  editProfile: string;

  // Footer & Help
  needHelp: string;
  tollFreeHelpline: string;
  callUsNow: string;
  logout: string;
  confirmLogoutTitle: string;
  confirmLogoutMsg: string;
  cancel: string;
  confirm: string;

  // Accessibility Text Reader
  textReaderMode: string;
  textReaderActive: string;
  textReaderDesc: string;
  disableTextReader: string;
}

const HINDI_TRANSLATIONS: Translations = {
  appName: "किसान जोड़",
  tagline: "प्रत्यक्ष कृषि आपूर्ति एवं बी2बी प्लेटफॉर्म",
  themeToggle: "थीम",
  selectLanguage: "भाषा चुनें",
  currentDemand: "वर्तमान उद्योग मांग",
  demandSubtitle: "सत्यापित औद्योगिक खरीदारों की कुल आवश्यकताएं",
  required: "कुल मांग",
  registered: "दर्ज मात्रा",
  offeredPrice: "मिलेगा भाव",
  registerSupplyForThis: "इस मांग के लिए अपनी फसल दर्ज करें",
  urgentDemand: "तुरंत आवश्यकता",
  buyers: "खरीदार",
  micPrompt: "एआई सहायक से बोलकर बात करें",
  micSubPrompt: "फसल दर्ज करें, मंडी भाव जानें, मुनाफा देखें या कचरा बेचें",
  micListening: "सुन रहे हैं... अपनी भाषा में साफ बोलें",
  micProcessing: "आपकी आवाज को समझा जा रहा है...",
  trySaying: "ऐसे बोलें: 'मेरे पास 50,000 किलो टमाटर हैं' या 'टमाटर का क्या रेट है?'",

  myCrop: "मेरी फसल",
  wasteManagement: "कचरा मार्केट",
  womenEnterprises: "महिला उद्योग",
  profit: "मुनाफा तुलना",
  paycheck: "पेमेंट व रसीद",
  myProfile: "मेरी प्रोफाइल",

  registeredCrops: "मेरी दर्ज फसलें",
  addCrop: "नई फसल जोड़ें",
  cropName: "फसल का नाम",
  quantityKg: "मात्रा (किलो में)",
  grade: "ग्रेड (आकार)",
  harvestDate: "कटाई की तारीख",
  registrationDate: "पंजीकरण तारीख",
  matchedDemand: "मैच हुई कंपनी मांग",
  offerPriceLabel: "प्लेटफॉर्म भाव",
  status: "स्थिति",
  actions: "कार्य",
  edit: "बदलें",
  delete: "हटाएं",
  noCropsYet: "अभी कोई फसल दर्ज नहीं है। 'नई फसल जोड़ें' या माइक बटन दबाएं!",
  addCropSuccess: "फसल सफलतापूर्वक दर्ज की गई!",
  cropGradeExplanation: "ग्रेड A = बड़ा साइज | ग्रेड B = मध्यम | ग्रेड C = छोटा (बेबी क्रॉप)",

  wasteSectionTitle: "कृषि अवशेष एवं कचरा से कमाई",
  addWaste: "कृषि कचरा दर्ज करें",
  wasteName: "कचरे का नाम (जैसे पराली, सड़ी सब्जियां, गोबर)",
  wasteType: "कचरे का प्रकार",
  wetWaste: "गीला कचरा",
  dryWaste: "सूखा कचरा",
  expectedPrice: "अनुमानित मूल्य (₹)",
  noWasteYet: "अभी कोई कृषि कचरा दर्ज नहीं है।",
  wasteStatus: "स्थिति",

  womenSectionTitle: "महिला ग्रामीण उद्यम एवं संसाधन",
  tabSell: "तैयार उत्पाद बेचें",
  tabList: "कच्चा माल दर्ज करें",
  addProduct: "नया उत्पाद जोड़ें",
  addResource: "कच्चा माल जोड़ें",
  productName: "उत्पाद का नाम (अचार, हस्तशिल्प, डेयरी)",
  productPrice: "कीमत (₹)",
  productDescription: "विवरण",
  resourceName: "कच्चा माल / संसाधन नाम",
  noProductsYet: "अभी कोई उत्पाद नहीं जोड़ा गया है।",
  noResourcesYet: "अभी कोई कच्चा माल दर्ज नहीं है।",

  profitSectionTitle: "प्लेटफॉर्म बनाम स्थानीय मंडी मुनाफा",
  mandiVsPlatform: "आपकी कमाई का अंतर",
  mandiRate: "स्थानीय मंडी / दलाल का भाव",
  platformRate: "प्लेटफॉर्म डायरेक्ट भाव",
  mandiEarnings: "मंडी से अनुमानित आय",
  platformEarnings: "प्लेटफॉर्म से कुल आय",
  extraProfit: "प्लेटफॉर्म से अतिरिक्त मुनाफा",
  calculateProfit: "मुनाफे की तुलना करें",

  paycheckSectionTitle: "भुगतान इतिहास एवं डिजिटल रसीद",
  digitalReceipts: "सत्यापित भुगतान लेन-देन",
  txnId: "लेन-देन संख्या (Txn ID)",
  amountReceived: "खाते में आई कुल राशि",
  viewReceipt: "रसीद देखें",
  downloadReceipt: "डिजिटल रसीद डाउनलोड करें",
  noTransactionsYet: "कोई भुगतान रसीद नहीं मिली।",

  farmerProfile: "किसान प्रोफाइल",
  phone: "मोबाइल नंबर",
  villageState: "गांव एवं राज्य",
  bankStatus: "बैंक खाता स्थिति",
  editProfile: "प्रोफाइल बदलें",

  needHelp: "सहायता चाहिए?",
  tollFreeHelpline: "टोल-फ्री हेल्पलाइन",
  callUsNow: "1800-123-4567 पर तुरंत कॉल करें (मुफ्त)",
  logout: "लॉगआउट",
  confirmLogoutTitle: "लॉगआउट पुष्टि",
  confirmLogoutMsg: "क्या आप किसान जोड़ ऐप से लॉगआउट करना चाहते हैं?",
  cancel: "रद्द करें",
  confirm: "हाँ, लॉगआउट करें",

  textReaderMode: "आवाज से पढ़कर सुनाने वाला मोड",
  textReaderActive: "टेक्स्ट रीडर चालू है: स्क्रीन पर किसी भी लिखावट को छुएं",
  textReaderDesc: "अपनी भाषा में स्क्रीन की लिखावट सुनें",
  disableTextReader: "रीडर बंद करें",
};

function generateLanguageFallback(code: LanguageCode, nativeLangName: string, nativeAppName: string): Translations {
  return {
    ...HINDI_TRANSLATIONS,
    appName: nativeAppName,
    selectLanguage: `भाषा / Language (${nativeLangName})`,
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appName: "KISAN JOD",
    tagline: "Direct Aggregation & B2B Procurement Platform",
    themeToggle: "Theme",
    selectLanguage: "Language",
    currentDemand: "Current Industry Demand",
    demandSubtitle: "Aggregated bulk requirements from verified buyers",
    required: "Required",
    registered: "Registered",
    offeredPrice: "Price Offered",
    registerSupplyForThis: "Register Supply for this Demand",
    urgentDemand: "Urgent Demand",
    buyers: "Buyers",
    micPrompt: "Tap to Speak with AI Assistant",
    micSubPrompt: "Ask about crops, market prices, profit, payments, or sell waste",
    micListening: "Listening... Speak naturally in your language",
    micProcessing: "Understanding your voice command...",
    trySaying: "Try saying: 'Mere paas 50,000 kg tamatar hain' or 'Tamatar ka rate kya hai?'",

    myCrop: "My Crop",
    wasteManagement: "Waste Market",
    womenEnterprises: "Women Enterprise",
    profit: "Profit Comparison",
    paycheck: "Paycheck & Receipts",
    myProfile: "My Profile",

    registeredCrops: "My Registered Crops",
    addCrop: "Add New Crop",
    cropName: "Crop Name",
    quantityKg: "Quantity (kg)",
    grade: "Grade (Size)",
    harvestDate: "Harvest Date",
    registrationDate: "Registration Date",
    matchedDemand: "Matched Buyer Demand",
    offerPriceLabel: "Offer Price",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noCropsYet: "No crops registered yet. Tap 'Add New Crop' or use the AI Voice Assistant!",
    addCropSuccess: "Crop registered successfully!",
    cropGradeExplanation: "Grade A = Large | Grade B = Medium | Grade C = Small (Baby)",

    wasteSectionTitle: "Agricultural Waste & Value Recovery",
    addWaste: "Register Agri Waste",
    wasteName: "Waste Name (e.g. Cow dung, Husk, Stubble)",
    wasteType: "Waste Type",
    wetWaste: "Wet Waste",
    dryWaste: "Dry Waste",
    expectedPrice: "Expected Value (₹)",
    noWasteYet: "No agricultural waste registered yet.",
    wasteStatus: "Status",

    womenSectionTitle: "Women Rural Enterprises & Resources",
    tabSell: "Sell Products",
    tabList: "List Raw Resources",
    addProduct: "Add Product to Sell",
    addResource: "List Raw Material",
    productName: "Product Name (Pickles, Handicrafts, Dairy)",
    productPrice: "Expected Price (₹)",
    productDescription: "Description",
    resourceName: "Resource / Material Name",
    noProductsYet: "No products listed yet.",
    noResourcesYet: "No raw materials listed yet.",

    profitSectionTitle: "Platform vs Local Mandi Earnings",
    mandiVsPlatform: "Earnings Realization Comparison",
    mandiRate: "Local Mandi / Dalal Rate",
    platformRate: "Platform Direct Buyer Rate",
    mandiEarnings: "Estimated Mandi Income",
    platformEarnings: "Platform Direct Income",
    extraProfit: "Extra Profit with Platform",
    calculateProfit: "Calculate Profit Comparison",

    paycheckSectionTitle: "Paycheck History & Digital Receipts",
    digitalReceipts: "Verified Payment Transactions",
    txnId: "Transaction ID",
    amountReceived: "Final Amount Received",
    viewReceipt: "View Receipt",
    downloadReceipt: "Download Digital Receipt",
    noTransactionsYet: "No payment receipts found.",

    farmerProfile: "Farmer Profile",
    phone: "Mobile Number",
    villageState: "Village & Location",
    bankStatus: "Bank Settlement Account",
    editProfile: "Edit Profile Info",

    needHelp: "Need Assistance?",
    tollFreeHelpline: "Toll-Free Helpline",
    callUsNow: "Call 1800-123-4567 (Free Call)",
    logout: "Logout",
    confirmLogoutTitle: "Logout Confirmation",
    confirmLogoutMsg: "Are you sure you want to logout from Kisan Jod?",
    cancel: "Cancel",
    confirm: "Yes, Logout",

    textReaderMode: "Text Reader Mode",
    textReaderActive: "Text Reader Active: Click/Touch any text to hear it read out",
    textReaderDesc: "Listen to text aloud in your language",
    disableTextReader: "Turn Off Reader",
  },
  hi: HINDI_TRANSLATIONS,
  pa: {
    appName: "ਕਿਸਾਨ ਜੋੜ",
    tagline: "ਸਿੱਧੀ ਖੇਤੀਬਾੜੀ ਸਪਲਾਈ ਅਤੇ ਬੀ2ਬੀ ਪਲੇਟਫਾਰਮ",
    themeToggle: "ਥੀਮ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    currentDemand: "ਮੌਜੂਦਾ ਉਦਯੋਗਿਕ ਮੰਗ",
    demandSubtitle: "ਸਤਿਆਪਿਤ ਖਰੀਦਦਾਰਾਂ ਦੀਆਂ ਕੁੱਲ ਜ਼ਰੂਰਤਾਂ",
    required: "ਕੁੱਲ ਮੰਗ",
    registered: "ਦਰਜ ਮਾਤਰਾ",
    offeredPrice: "ਮਿਲੇਗਾ ਭਾਅ",
    registerSupplyForThis: "ਇਸ ਮੰਗ ਲਈ ਆਪਣੀ ਫਸਲ ਦਰਜ ਕਰੋ",
    urgentDemand: "ਤੁਰੰਤ ਜ਼ਰੂਰਤ",
    buyers: "ਖਰੀਦਦਾਰ",
    micPrompt: "ਏਆਈ ਸਹਾਇਕ ਨਾਲ ਬੋਲ ਕੇ ਗੱਲ ਕਰੋ",
    micSubPrompt: "ਫਸਲ ਦਰਜ ਕਰੋ, ਮਾਰਕੀਟ ਭਾਅ ਜਾਣੋ, ਮੁਨਾਫਾ ਵੇਖੋ",
    micListening: "ਸੁਣ ਰਹੇ ਹਾਂ... ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ",
    micProcessing: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਨੂੰ ਸਮਝਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    trySaying: "ਬੋਲੋ: 'ਮੇਰੇ ਕੋਲ 50,000 ਕਿਲੋ ਟਮਾਟਰ ਹਨ'",

    myCrop: "ਮੇਰੀ ਫਸਲ",
    wasteManagement: "ਕਚਰਾ ਪ੍ਰਬੰਧਨ",
    womenEnterprises: "ਮਹਿਲਾ ਉਦਯੋਗ",
    profit: "ਮੁਨਾਫਾ ਤੁਲਨਾ",
    paycheck: "ਪੇਮੈਂਟ ਅਤੇ ਰਸੀਦ",
    myProfile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",

    registeredCrops: "ਮੇਰੀਆਂ ਦਰਜ ਫਸਲਾਂ",
    addCrop: "ਨਵੀਂ ਫਸਲ ਜੋੜੋ",
    cropName: "ਫਸਲ ਦਾ ਨਾਮ",
    quantityKg: "ਮਾਤਰਾ (ਕਿਲੋ)",
    grade: "ਗ੍ਰੇਡ (ਸਾਈਜ਼)",
    harvestDate: "ਕਟਾਈ ਦੀ ਤਾਰੀਖ",
    registrationDate: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਤਾਰੀਖ",
    matchedDemand: "ਮੈਚ ਹੋਈ ਕੰਪਨੀ ਮੰਗ",
    offerPriceLabel: "ਪਲੇਟਫਾਰਮ ਰੇਟ",
    status: "ਸਥਿਤੀ",
    actions: "ਕਾਰਵਾਈ",
    edit: "ਬਦਲੋ",
    delete: "ਹਟਾਓ",
    noCropsYet: "ਅਜੇ ਕੋਈ ਫਸਲ ਦਰਜ ਨਹੀਂ ਹੈ।",
    addCropSuccess: "ਫਸਲ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤੀ ਗਈ!",
    cropGradeExplanation: "ਗ੍ਰੇਡ A = ਵੱਡਾ | ਗ੍ਰੇਡ B = ਮੱਧਮ | ਗ੍ਰੇਡ C = ਛੋਟਾ",

    wasteSectionTitle: "ਖੇਤੀਬਾੜੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਤੋਂ ਕਮਾਈ",
    addWaste: "ਖੇਤੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਦਰਜ ਕਰੋ",
    wasteName: "ਰਹਿੰਦ-ਖੂੰਹਦ ਦਾ ਨਾਮ (ਪਰਾਲੀ, ਗੋਹਾ)",
    wasteType: "ਕਿਸਮ",
    wetWaste: "ਗਿੱਲਾ ਕਚਰਾ",
    dryWaste: "ਸੁੱਕਾ ਕਚਰਾ",
    expectedPrice: "ਅਨੁਮਾਨਿਤ ਮੁੱਲ (₹)",
    noWasteYet: "ਕੋਈ ਰਹਿੰਦ-ਖੂੰਹਦ ਦਰਜ ਨਹੀਂ ਹੈ।",
    wasteStatus: "ਸਥਿਤੀ",

    womenSectionTitle: "ਮਹਿਲਾ ਗ੍ਰਾਮੀਣ ਉਦਯੋਗ",
    tabSell: "ਉਤਪਾਦ ਵੇਚੋ",
    tabList: "ਕੱਚਾ ਮਾਲ ਦਰਜ ਕਰੋ",
    addProduct: "ਨਵਾਂ ਉਤਪਾਦ ਜੋੜੋ",
    addResource: "ਕੱਚਾ ਮਾਲ ਜੋੜੋ",
    productName: "ਉਤਪਾਦ ਨਾਮ (ਅਚਾਰ, ਡੇਅਰੀ)",
    productPrice: "ਕੀਮਤ (₹)",
    productDescription: "ਵੇਰਵਾ",
    resourceName: "ਕੱਚਾ ਮਾਲ ਨਾਮ",
    noProductsYet: "ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਹੈ।",
    noResourcesYet: "ਕੋਈ ਕੱਚਾ ਮਾਲ ਨਹੀਂ ਹੈ।",

    profitSectionTitle: "ਪਲੇਟਫਾਰਮ ਬਨਾਮ ਮੰਡੀ ਮੁਨਾਫਾ",
    mandiVsPlatform: "ਕਮਾਈ ਦਾ ਫਰਕ",
    mandiRate: "ਮੰਡੀ ਰੇਟ",
    platformRate: "ਪਲੇਟਫਾਰਮ ਰੇਟ",
    mandiEarnings: "ਮੰਡੀ ਤੋਂ ਆਮਦਨ",
    platformEarnings: "ਪਲੇਟਫਾਰਮ ਆਮਦਨ",
    extraProfit: "ਵਾਧੂ ਮੁਨਾਫਾ",
    calculateProfit: "ਮੁਨਾਫੇ ਦੀ ਤੁਲਨਾ ਕਰੋ",

    paycheckSectionTitle: "ਭੁਗਤਾਨ ਇਤਿਹਾਸ ਅਤੇ ਰਸੀਦ",
    digitalReceipts: "ਸਤਿਆਪਿਤ ਰਸੀਦਾਂ",
    txnId: "ਟ੍ਰਾਂਜੈਕਸ਼ਨ ਨੰਬਰ",
    amountReceived: "ਕੁੱਲ ਮਿਲੀ ਰਕਮ",
    viewReceipt: "ਰਸੀਦ ਵੇਖੋ",
    downloadReceipt: "ਡਾਊਨਲੋਡ ਰਸੀਦ",
    noTransactionsYet: "ਕੋਈ ਰਸੀਦ ਨਹੀਂ ਹੈ।",

    farmerProfile: "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
    phone: "ਮੋਬਾਈਲ ਨੰਬਰ",
    villageState: "ਪਿੰਡ ਅਤੇ ਰਾਜ",
    bankStatus: "ਬੈਂਕ ਖਾਤਾ",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਬਦਲੋ",

    needHelp: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    tollFreeHelpline: "ਟੋਲ-ਫ੍ਰੀ ਹੈਲਪਲਾਈਨ",
    callUsNow: "1800-123-4567 'ਤੇ ਕਾਲ ਕਰੋ",
    logout: "ਲੌਗਆਉਟ",
    confirmLogoutTitle: "ਲੌਗਆਉਟ ਪੁਸ਼ਟੀ",
    confirmLogoutMsg: "ਕੀ ਤੁਸੀਂ ਲੌਗਆਉਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    cancel: "ਰੱਦ ਕਰੋ",
    confirm: "ਹਾਂ, ਲੌਗਆਉਟ ਕਰੋ",

    textReaderMode: "ਟੈਕਸਟ ਰੀਡਰ ਮੋਡ",
    textReaderActive: "ਟੈਕਸਟ ਰੀਡਰ ਚਾਲੂ ਹੈ",
    textReaderDesc: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖਤ ਸੁਣੋ",
    disableTextReader: "ਰੀਡਰ ਬੰਦ ਕਰੋ",
  },
  bn: generateLanguageFallback('bn', 'বাংলা', 'কৃষক জোড়'),
  mr: generateLanguageFallback('mr', 'मराठी', 'किसान जोड'),
  gu: generateLanguageFallback('gu', 'ગુજરાતી', 'કિસਾਨ જોડ'),
  ta: generateLanguageFallback('ta', 'தமிழ்', 'கிசான் ஜோட்'),
  te: generateLanguageFallback('te', 'తెలుగు', 'కిసాన్ జోడ్'),
  kn: generateLanguageFallback('kn', 'ಕನ್ನಡ', 'ಕਿਸਾਨ ಜೋಡ್'),
  ml: generateLanguageFallback('ml', 'മലയാളം', 'കിസਾਨ ജോഡ്'),
  or: generateLanguageFallback('or', 'ଓଡ଼ିଆ', 'କିସାନ ଯୋଡ'),
  as: generateLanguageFallback('as', 'অসমীয়া', 'কিষাণ জোৰ'),
};
