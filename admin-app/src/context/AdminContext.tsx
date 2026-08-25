import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  AdminNavSection, 
  FieldAgentTask, 
  TaskStatus, 
  TaskPriority, 
  CompletionVerification, 
  AssignedFarmer, 
  InventoryFacility, 
  AdminOrder, 
  AgentRating, 
  ReferralData, 
  AgentNotification, 
  AgentProfile, 
  ReportedIssue, 
  LanguageCode 
} from '../types';
import { 
  INITIAL_AGENT_PROFILE, 
  INITIAL_TASKS, 
  INITIAL_ASSIGNED_FARMERS, 
  INITIAL_INVENTORY_FACILITY, 
  INITIAL_ADMIN_ORDERS, 
  INITIAL_RATING, 
  INITIAL_REFERRALS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTED_ISSUES 
} from '../data/mockAdmin';
import { speakText, parseAdminVoiceIntent } from '../services/speechService';
import confetti from 'canvas-confetti';

interface AdminContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;

  activeSection: AdminNavSection;
  setActiveSection: (sec: AdminNavSection) => void;

  tasks: FieldAgentTask[];
  taskPriorityFilter: number | null;
  setTaskPriorityFilter: (p: number | null) => void;
  updateTaskStatus: (id: string, status: TaskStatus, reason?: string) => void;
  completeTaskWithVerification: (id: string, verification: CompletionVerification) => void;
  rescheduleTask: (id: string, newDate: string) => void;

  farmers: AssignedFarmer[];
  addFarmer: (farmer: Omit<AssignedFarmer, 'id' | 'lastInteraction' | 'status'>) => void;

  inventory: InventoryFacility;
  addInventoryStock: (batchId: string, cropName: string, quantity: number) => void;

  orders: AdminOrder[];
  updateOrderCheckbox: (orderId: string, key: keyof AdminOrder['statusCheckboxes'], val: boolean) => void;
  updateConfirmedQuantity: (orderId: string, confirmedQty: number) => void;

  rating: AgentRating;
  referrals: ReferralData;

  notifications: AgentNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  issues: ReportedIssue[];
  submitIssue: (issueType: string, related: string, desc: string) => void;

  profile: AgentProfile;
  updateProfile: (updated: Partial<AgentProfile>) => void;

  // Voice AI
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  voiceTranscript: string;
  isListening: boolean;
  startVoiceInput: () => void;
  confirmVoiceAction: { title: string; message: string; onConfirm: () => void } | null;
  setConfirmVoiceAction: (action: { title: string; message: string; onConfirm: () => void } | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('kisan_admin_theme') as any) || 'light'; } catch { return 'light'; }
  });

  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeSection, setActiveSection] = useState<AdminNavSection>('dashboard');

  const [tasks, setTasks] = useState<FieldAgentTask[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch { return INITIAL_TASKS; }
  });

  const [taskPriorityFilter, setTaskPriorityFilter] = useState<number | null>(null);

  const [farmers, setFarmers] = useState<AssignedFarmer[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_farmers');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNED_FARMERS;
    } catch { return INITIAL_ASSIGNED_FARMERS; }
  });

  const [inventory, setInventory] = useState<InventoryFacility>(INITIAL_INVENTORY_FACILITY);

  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_orders');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_ORDERS;
    } catch { return INITIAL_ADMIN_ORDERS; }
  });

  const [rating] = useState<AgentRating>(INITIAL_RATING);
  const [referrals, setReferrals] = useState<ReferralData>(INITIAL_REFERRALS);
  const [notifications, setNotifications] = useState<AgentNotification[]>(INITIAL_NOTIFICATIONS);
  const [issues, setIssues] = useState<ReportedIssue[]>(INITIAL_REPORTED_ISSUES);
  const [profile, setProfile] = useState<AgentProfile>(INITIAL_AGENT_PROFILE);

  // Voice State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [confirmVoiceAction, setConfirmVoiceAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    try { localStorage.setItem('kisan_admin_theme', 'light'); } catch (e) { console.warn(e); }
    document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('kisan_admin_tasks', JSON.stringify(tasks)); } catch (e) { console.warn(e); }
  }, [tasks]);

  useEffect(() => {
    try { localStorage.setItem('kisan_admin_orders', JSON.stringify(orders)); } catch (e) { console.warn(e); }
  }, [orders]);

  // Subscribe to cross-port sync events for field agent tasks & farmers
  useEffect(() => {
    const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('kisan_jod_reactive_channel') : null;

    const reloadAgentData = () => {
      try {
        const savedTasks = localStorage.getItem('kisan_admin_tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        const savedFarmers = localStorage.getItem('kisan_admin_farmers');
        if (savedFarmers) setFarmers(JSON.parse(savedFarmers));
      } catch (e) {
        console.warn(e);
      }
    };

    reloadAgentData();

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === 'CROP_ADDED' || event.data?.type === 'FARMER_REGISTERED') {
          reloadAgentData();
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kisan_admin_tasks' || e.key === 'kisan_admin_farmers' || e.key === 'kisan_last_sync_event') {
        reloadAgentData();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const updateTaskStatus = (id: string, status: TaskStatus, reason?: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, failureReason: reason } : t))
    );
  };

  const completeTaskWithVerification = (id: string, verification: CompletionVerification) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Completed', completionVerification: verification } : t))
    );
    confetti({ particleCount: 50, spread: 60 });
  };

  const rescheduleTask = (id: string, newDate: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pickupDate: newDate, rescheduledDate: newDate } : t))
    );
  };

  const addFarmer = (farmerData: Omit<AssignedFarmer, 'id' | 'lastInteraction' | 'status'>) => {
    const newId = `FRM-${Date.now().toString().slice(-4)}`;
    const newFarmer: AssignedFarmer = {
      ...farmerData,
      id: newId,
      lastInteraction: 'Just Registered',
      status: 'Active',
    };
    setFarmers((prev) => [newFarmer, ...prev]);

    // Also update referral history
    setReferrals((prev) => ({
      ...prev,
      totalFarmersRegistered: prev.totalFarmersRegistered + 1,
      referralEarnings: prev.referralEarnings + 500,
      referralHistory: [
        {
          id: `REF-${Date.now().toString().slice(-3)}`,
          farmerName: farmerData.name,
          phone: farmerData.phone,
          date: new Date().toISOString().split('T')[0],
          status: 'Reward Paid',
          rewardAmount: 500,
        },
        ...prev.referralHistory,
      ],
    }));

    confetti({ particleCount: 50, spread: 60 });
  };

  const addInventoryStock = (batchId: string, cropName: string, quantity: number) => {
    setInventory((prev) => ({
      ...prev,
      occupiedCapacityKg: prev.occupiedCapacityKg + quantity,
      storedBatches: [
        { batchId, cropName, quantity, unit: 'kg', dateStored: new Date().toISOString().split('T')[0] },
        ...prev.storedBatches,
      ],
    }));
  };

  const updateOrderCheckbox = (orderId: string, key: keyof AdminOrder['statusCheckboxes'], val: boolean) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const updatedCheckboxes = { ...o.statusCheckboxes, [key]: val };
          return { ...o, statusCheckboxes: updatedCheckboxes };
        }
        return o;
      })
    );
  };

  const updateConfirmedQuantity = (orderId: string, confirmedQty: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const remaining = Math.max(0, o.companyDemandQty - confirmedQty);
          return { ...o, confirmedQty, remainingDemandQty: remaining };
        }
        return o;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const submitIssue = (issueType: string, related: string, desc: string) => {
    const newIssue: ReportedIssue = {
      id: `ISS-${Date.now().toString().slice(-3)}`,
      issueType,
      relatedTaskOrOrder: related,
      description: desc,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported',
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const updateProfile = (updated: Partial<AgentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Voice Input simulation
  const startVoiceInput = () => {
    setIsListening(true);
    setVoiceTranscript('Listening... Speak naturally in Hindi or English');

    setTimeout(() => {
      const samples = [
        'Aaj kitne priority 1 tasks hain?',
        'Ramesh Kumar ka task dikhao',
        'Aaj kitna tomato collect hua?',
        'Inventory check karo',
        'Mera rating kya hai?',
      ];
      const selected = samples[Math.floor(Math.random() * samples.length)];
      setVoiceTranscript(`"${selected}"`);
      setIsListening(false);

      const intent = parseAdminVoiceIntent(selected);
      speakText(intent.responseText, language);

      if (intent.action === 'filter_priority') {
        setActiveSection('daily-tasks');
        setTaskPriorityFilter(1);
      } else if (intent.action === 'check_rating') {
        setActiveSection('rating');
      } else if (intent.action === 'check_inventory') {
        setActiveSection('inventory');
      } else if (intent.action === 'find_task') {
        setActiveSection('daily-tasks');
      }
    }, 2000);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,

        activeSection,
        setActiveSection,

        tasks,
        taskPriorityFilter,
        setTaskPriorityFilter,
        updateTaskStatus,
        completeTaskWithVerification,
        rescheduleTask,

        farmers,
        addFarmer,

        inventory,
        addInventoryStock,

        orders,
        updateOrderCheckbox,
        updateConfirmedQuantity,

        rating,
        referrals,

        notifications,
        unreadCount,
        markNotificationRead,
        clearNotifications,

        issues,
        submitIssue,

        profile,
        updateProfile,

        isVoiceModalOpen,
        setIsVoiceModalOpen,
        voiceTranscript,
        isListening,
        startVoiceInput,

        confirmVoiceActionModal: confirmVoiceAction,
        setConfirmVoiceActionModal: setConfirmVoiceAction,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
