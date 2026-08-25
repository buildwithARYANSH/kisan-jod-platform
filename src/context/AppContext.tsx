import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  LanguageCode, 
  NavSection, 
  IndustryDemand, 
  FarmerCrop, 
  WasteItem, 
  WomenProduct, 
  WomenResource, 
  PaycheckTransaction, 
  FarmerProfile,
  NotificationItem,
  ComplaintTicket
} from '../types';
import { 
  INITIAL_DEMANDS, 
  INITIAL_CROPS, 
  INITIAL_WASTE, 
  INITIAL_WOMEN_PRODUCTS, 
  INITIAL_WOMEN_RESOURCES, 
  INITIAL_PAYCHECKS, 
  INITIAL_PROFILE,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS
} from '../data/initialData';
import { TRANSLATIONS, type Translations } from '../i18n/translations';
import { speakText, stopSpeaking } from '../services/speechService';
import { fireConfetti } from '../utils/confetti';
import { subscribeToSyncEvents, syncCropAdded, syncCropUpdated, syncCropDeleted, loadAllUnifiedFarmerDemands } from '../services/unifiedSync';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  
  // Accessibility Text Reader
  textReaderActive: boolean;
  toggleTextReader: () => void;
  speak: (text: string) => void;
  
  // Navigation
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  navigationTrigger: number;

  // Data Collections
  demands: IndustryDemand[];
  crops: FarmerCrop[];
  addCrop: (crop: Omit<FarmerCrop, 'id' | 'registrationDate'>) => void;
  updateCrop: (id: string, updated: Partial<FarmerCrop>) => void;
  deleteCrop: (id: string) => void;

  wasteItems: WasteItem[];
  addWaste: (item: Omit<WasteItem, 'id' | 'registrationDate' | 'status'>) => void;
  updateWaste: (id: string, updated: Partial<WasteItem>) => void;
  deleteWaste: (id: string) => void;

  womenProducts: WomenProduct[];
  addWomenProduct: (prod: Omit<WomenProduct, 'id' | 'dateAdded'>) => void;
  deleteWomenProduct: (id: string) => void;
  
  womenResources: WomenResource[];
  addWomenResource: (res: Omit<WomenResource, 'id' | 'dateAdded' | 'status'>) => void;

  paychecks: PaycheckTransaction[];
  selectedReceipt: PaycheckTransaction | null;
  setSelectedReceipt: (receipt: PaycheckTransaction | null) => void;

  profile: FarmerProfile;
  updateProfile: (updated: Partial<FarmerProfile>) => void;
  registerNewFarmer: (updated: Partial<FarmerProfile>) => void;
  loginFarmer: (phone: string, fallbackProfile: Partial<FarmerProfile>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  markAllNotificationsRead: () => void;

  // Complaints / Help Tickets
  complaints: ComplaintTicket[];
  isComplaintModalOpen: boolean;
  setIsComplaintModalOpen: (open: boolean) => void;
  addComplaint: (category: ComplaintTicket['category'], description: string) => void;

  // Modals & Overlays
  selectedCropForAdd: IndustryDemand | null;
  setSelectedCropForAdd: (demand: IndustryDemand | null) => void;
  isAddCropModalOpen: boolean;
  setIsAddCropModalOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  
  // Toast
  toasts: Toast[];
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('kisan_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      return (localStorage.getItem('kisan_lang') as LanguageCode) || 'hi';
    } catch {
      return 'hi';
    }
  });

  // Active navigation section
  const [activeSection, setActiveSectionState] = useState<NavSection>('home');
  const [navigationTrigger, setNavigationTrigger] = useState<number>(0);

  const setActiveSection = (sec: NavSection) => {
    setActiveSectionState(sec);
    setNavigationTrigger((prev) => prev + 1);
  };

  // Accessibility Text Reader Mode
  const [textReaderActive, setTextReaderActive] = useState<boolean>(false);

  // Data Collections with LocalStorage Persistence
  const [demands, setDemands] = useState<IndustryDemand[]>(() => {
    return loadAllUnifiedFarmerDemands();
  });

  const [crops, setCrops] = useState<FarmerCrop[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_crops');
      return saved ? JSON.parse(saved) : INITIAL_CROPS;
    } catch {
      return INITIAL_CROPS;
    }
  });

  const [wasteItems, setWasteItems] = useState<WasteItem[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_waste');
      return saved ? JSON.parse(saved) : INITIAL_WASTE;
    } catch {
      return INITIAL_WASTE;
    }
  });

  const [womenProducts, setWomenProducts] = useState<WomenProduct[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_women_products');
      return saved ? JSON.parse(saved) : INITIAL_WOMEN_PRODUCTS;
    } catch {
      return INITIAL_WOMEN_PRODUCTS;
    }
  });

  const [womenResources, setWomenResources] = useState<WomenResource[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_women_resources');
      return saved ? JSON.parse(saved) : INITIAL_WOMEN_RESOURCES;
    } catch {
      return INITIAL_WOMEN_RESOURCES;
    }
  });

  const [paychecks, setPaychecks] = useState<PaycheckTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_paychecks');
      return saved ? JSON.parse(saved) : INITIAL_PAYCHECKS;
    } catch {
      return INITIAL_PAYCHECKS;
    }
  });

  const [profile, setProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('kisan_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_notifications');
      const parsed = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
      return parsed.map((n: NotificationItem) => {
        const initial = INITIAL_NOTIFICATIONS.find((init) => init.id === n.id);
        return {
          ...n,
          titleHi: n.titleHi || (initial ? initial.titleHi : '🛒 किसान सूचना'),
          messageHi: n.messageHi || (initial ? initial.messageHi : n.message),
          timestampHi: n.timestampHi || (initial ? initial.timestampHi : n.timestamp),
        };
      });
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Complaints State
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_complaints');
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Modals & UI States
  const [selectedReceipt, setSelectedReceipt] = useState<PaycheckTransaction | null>(null);
  const [selectedCropForAdd, setSelectedCropForAdd] = useState<IndustryDemand | null>(null);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync Theme to HTML class
  useEffect(() => {
    try {
      localStorage.setItem('kisan_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  // Sync Data to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kisan_crops', JSON.stringify(crops));
    } catch (e) { console.warn(e); }
  }, [crops]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_waste', JSON.stringify(wasteItems));
    } catch (e) { console.warn(e); }
  }, [wasteItems]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_women_products', JSON.stringify(womenProducts));
    } catch (e) { console.warn(e); }
  }, [womenProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_women_resources', JSON.stringify(womenResources));
    } catch (e) { console.warn(e); }
  }, [womenResources]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_profile', JSON.stringify(profile));
    } catch (e) { console.warn(e); }
  }, [profile]);

  // Reactive Cross-Port & Single Shared DB Listener (< 1ms sync)
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((payload) => {
      if (
        payload.type === 'DEMAND_ADDED' ||
        payload.type === 'DEMAND_UPDATED' ||
        payload.type === 'DEMAND_DELETED' ||
        payload.type === 'CROP_ADDED' ||
        payload.type === 'CROP_UPDATED' ||
        payload.type === 'CROP_DELETED' ||
        payload.type === 'DATA_RESET'
      ) {
        try {
          const synced = loadAllUnifiedFarmerDemands();
          setDemands(synced);
        } catch (e) {
          console.warn(e);
        }
      } else if (payload.type === 'DELIVERY_CONFIRMED') {
        try {
          const savedPaychecks = localStorage.getItem('kisan_paychecks');
          if (savedPaychecks) setPaychecks(JSON.parse(savedPaychecks));
        } catch (e) {
          console.warn(e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Set Language
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kisan_lang', lang);
    } catch (e) { console.warn(e); }
    showToast(`Language changed`, 'info');
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Speak helper for text reader
  const speak = (text: string) => {
    speakText(text, language);
  };

  const toggleTextReader = () => {
    const nextState = !textReaderActive;
    setTextReaderActive(nextState);
    if (nextState) {
      speak(t.textReaderActive);
      showToast(t.textReaderMode, 'info');
    } else {
      stopSpeaking();
      showToast('Text Reader Disabled', 'info');
    }
  };

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Crop Management Actions
  const addCrop = (cropData: Omit<FarmerCrop, 'id' | 'registrationDate'>) => {
    const id = `CROP-${Date.now().toString().slice(-4)}`;
    const registrationDate = new Date().toISOString().split('T')[0];

    // Find matching demand if applicable
    const matchedDemand = demands.find(
      (d) =>
        (selectedCropForAdd && d.id === selectedCropForAdd.id) ||
        d.cropName.toLowerCase().includes(cropData.cropName.toLowerCase()) ||
        cropData.cropName.toLowerCase().includes(d.cropName.toLowerCase())
    );

    const allocatedPrice = matchedDemand ? matchedDemand.pricePerKg : cropData.offerPrice || 18;

    const newCrop: FarmerCrop = {
      ...cropData,
      id,
      registrationDate,
      offerPrice: allocatedPrice,
      matchedDemandId: matchedDemand ? matchedDemand.id : undefined,
      matchedDemandCrop: matchedDemand ? `${matchedDemand.cropName} (Industrial Pool)` : undefined,
      status: 'Listed',
      stepIndex: 0,
    };

    setCrops((prev) => [newCrop, ...prev]);

    // Update industry demand registered quantity dynamically!
    if (matchedDemand) {
      setDemands((prevDemands) =>
        prevDemands.map((d) =>
          d.id === matchedDemand.id
            ? { ...d, registeredQty: (d.registeredQty || 0) + cropData.quantity }
            : d
        )
      );
    }

    fireConfetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    showToast(t.addCropSuccess, 'success');

    // Trigger Single Database Shared Reactive Synchronization (Port 5173 -> Company Portal & Port 5174)
    syncCropAdded(newCrop, profile.name);
  };

  const updateCrop = (id: string, updated: Partial<FarmerCrop>) => {
    const previousCrop = crops.find((c) => c.id === id);
    const previousQty = previousCrop ? previousCrop.quantity : 0;
    
    const updatedCrop = previousCrop ? { ...previousCrop, ...updated } : null;
    
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Crop details updated', 'info');

    if (updatedCrop) {
      syncCropUpdated(updatedCrop, previousQty);
    }
  };

  const deleteCrop = (id: string) => {
    const targetCrop = crops.find((c) => c.id === id);
    if (targetCrop && targetCrop.matchedDemandId) {
      setDemands((prevDemands) =>
        prevDemands.map((d) =>
          d.id === targetCrop.matchedDemandId
            ? { ...d, registeredQty: Math.max(0, d.registeredQty - targetCrop.quantity) }
            : d
        )
      );
    }
    setCrops((prev) => prev.filter((c) => c.id !== id));
    showToast('Crop removed', 'info');

    if (targetCrop) {
      syncCropDeleted(targetCrop);
    }
  };

  // Waste Management Actions
  const addWaste = (item: Omit<WasteItem, 'id' | 'registrationDate' | 'status'>) => {
    const id = `WST-${Date.now().toString().slice(-4)}`;
    const registrationDate = new Date().toISOString().split('T')[0];
    const newItem: WasteItem = {
      ...item,
      id,
      registrationDate,
      status: 'Registered',
      stepIndex: 0,
    };
    setWasteItems((prev) => [newItem, ...prev]);
    showToast('Agri waste registered successfully!', 'success');
  };

  const updateWaste = (id: string, updated: Partial<WasteItem>) => {
    setWasteItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
    showToast('Waste details updated', 'info');
  };

  const deleteWaste = (id: string) => {
    setWasteItems((prev) => prev.filter((w) => w.id !== id));
    showToast('Waste item deleted', 'info');
  };

  // Women Enterprise Actions
  const addWomenProduct = (prod: Omit<WomenProduct, 'id' | 'dateAdded'>) => {
    const id = `WOM-P-${Date.now().toString().slice(-4)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const newProd: WomenProduct = { ...prod, id, dateAdded };
    setWomenProducts((prev) => [newProd, ...prev]);
    showToast('Product added to Women Enterprise marketplace!', 'success');
  };

  const deleteWomenProduct = (id: string) => {
    setWomenProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Women Enterprise product deleted', 'info');
  };

  const addWomenResource = (res: Omit<WomenResource, 'id' | 'dateAdded' | 'status'>) => {
    const id = `WOM-R-${Date.now().toString().slice(-4)}`;
    const dateAdded = new Date().toISOString().split('T')[0];
    const newRes: WomenResource = { ...res, id, dateAdded, status: 'Listed' };
    setWomenResources((prev) => [newRes, ...prev]);
    showToast('Raw material listed successfully!', 'success');
  };

  // Notifications Actions
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Complaint Actions
  const addComplaint = (category: ComplaintTicket['category'], description: string) => {
    const id = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const submittedDate = new Date().toISOString().split('T')[0];
    const newComplaint: ComplaintTicket = {
      id,
      category,
      description,
      status: 'Open',
      submittedDate,
      farmerPhone: profile.phone,
    };
    setComplaints(prev => [newComplaint, ...prev]);
    showToast(`Complaint registered successfully! Reference ID: ${id}`, 'success');
  };

  // Profile Action
  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast('Profile updated', 'success');
  };

  // Register NEW Farmer Action (Starts 100% CLEAN: 0 crops, 0 waste, 0 women products/resources, 0 paychecks)
  const registerNewFarmer = (updated: Partial<FarmerProfile>) => {
    const newProfile = { ...INITIAL_PROFILE, ...updated };
    setProfile(newProfile);
    setCrops([]);
    setWasteItems([]);
    setWomenProducts([]);
    setWomenResources([]);
    setPaychecks([]);
    setComplaints([]);

    const phoneKey = updated.phone || 'new_farmer';
    try {
      localStorage.setItem('kisan_profile', JSON.stringify(newProfile));
      localStorage.setItem('kisan_crops', JSON.stringify([]));
      localStorage.setItem('kisan_waste', JSON.stringify([]));
      localStorage.setItem('kisan_women_products', JSON.stringify([]));
      localStorage.setItem('kisan_women_resources', JSON.stringify([]));
      localStorage.setItem('kisan_paychecks', JSON.stringify([]));
      localStorage.setItem('kisan_complaints', JSON.stringify([]));
      
      // Persist per-farmer data isolated store
      localStorage.setItem(`kisan_farmer_data_${phoneKey}`, JSON.stringify({
        profile: newProfile,
        crops: [],
        wasteItems: [],
        womenProducts: [],
        womenResources: [],
        paychecks: [],
        complaints: [],
      }));
    } catch (e) {
      console.warn(e);
    }
  };

  // Login EXISTING Farmer Action (Restores that farmer's exact saved crops, waste, women products, and paychecks)
  const loginFarmer = (phone: string, fallbackProfile: Partial<FarmerProfile>) => {
    const phoneKey = phone || fallbackProfile.phone || 'default';
    try {
      const savedData = localStorage.getItem(`kisan_farmer_data_${phoneKey}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.profile) setProfile(parsed.profile);
        setCrops(parsed.crops || []);
        setWasteItems(parsed.wasteItems || []);
        setWomenProducts(parsed.womenProducts || []);
        setWomenResources(parsed.womenResources || []);
        setPaychecks(parsed.paychecks || []);
        setComplaints(parsed.complaints || []);

        localStorage.setItem('kisan_profile', JSON.stringify(parsed.profile || { ...INITIAL_PROFILE, ...fallbackProfile }));
        localStorage.setItem('kisan_crops', JSON.stringify(parsed.crops || []));
        localStorage.setItem('kisan_waste', JSON.stringify(parsed.wasteItems || []));
        localStorage.setItem('kisan_women_products', JSON.stringify(parsed.womenProducts || []));
        localStorage.setItem('kisan_women_resources', JSON.stringify(parsed.womenResources || []));
        localStorage.setItem('kisan_paychecks', JSON.stringify(parsed.paychecks || []));
        localStorage.setItem('kisan_complaints', JSON.stringify(parsed.complaints || []));
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    // Default demo farmer (Gurdev Singh) fallback
    const newProfile = { ...INITIAL_PROFILE, ...fallbackProfile };
    setProfile(newProfile);
    if (phoneKey === '+91 98765 43210' || fallbackProfile.name === 'Gurdev Singh') {
      setCrops(INITIAL_CROPS);
      setWasteItems(INITIAL_WASTE);
      setWomenProducts(INITIAL_WOMEN_PRODUCTS);
      setWomenResources(INITIAL_WOMEN_RESOURCES);
      setPaychecks(INITIAL_PAYCHECKS);
    } else {
      setCrops([]);
      setWasteItems([]);
      setWomenProducts([]);
      setWomenResources([]);
      setPaychecks([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,

        textReaderActive,
        toggleTextReader,
        speak,

        activeSection,
        setActiveSection,
        navigationTrigger,

        demands,
        crops,
        addCrop,
        updateCrop,
        deleteCrop,

        wasteItems,
        addWaste,
        updateWaste,
        deleteWaste,

        womenProducts,
        addWomenProduct,
        deleteWomenProduct,

        womenResources,
        addWomenResource,

        paychecks,
        selectedReceipt,
        setSelectedReceipt,

        profile,
        updateProfile,
        registerNewFarmer,
        loginFarmer,

        notifications,
        unreadNotificationsCount,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        markAllNotificationsRead,

        complaints,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        addComplaint,

        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isLogoutModalOpen,
        setIsLogoutModalOpen,

        selectedCropForAdd,
        setSelectedCropForAdd,
        isAddCropModalOpen,
        setIsAddCropModalOpen,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
