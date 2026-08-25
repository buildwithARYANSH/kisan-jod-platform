import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  CompanyNavSection, 
  CompanyDemand, 
  FairPriceFactors, 
  QualityBatch, 
  CompanyReceipt, 
  ShipmentOrder, 
  CompanyProfile,
  CompanyNotification,
  CompanyPaymentSubmission,
  CompanyComplaintTicket
} from '../types';
import { 
  INITIAL_COMPANY_DEMANDS, 
  MOCK_FAIR_PRICING, 
  INITIAL_QUALITY_BATCHES, 
  INITIAL_COMPANY_RECEIPTS, 
  INITIAL_SHIPMENT_ORDERS, 
  INITIAL_COMPANY_PROFILE,
  INITIAL_COMPANY_NOTIFICATIONS,
  COMPANY_BANK_ESCROW_DETAILS
} from '../data/mockCompany';
import { fireConfetti } from '../utils/confetti';
import { subscribeToSyncEvents, syncDemandAdded, syncDemandUpdated, syncDemandDeleted } from '../services/unifiedSync';

interface CompanyContextType {
  activeSection: CompanyNavSection;
  setActiveSection: (section: CompanyNavSection) => void;

  demands: CompanyDemand[];
  addDemand: (demand: Omit<CompanyDemand, 'id' | 'matchedQuantity' | 'status' | 'submittedDate'>) => void;
  updateDemandStatus: (id: string, status: CompanyDemand['status']) => void;
  deleteDemand: (id: string) => void;

  fairPricing: Record<string, FairPriceFactors>;

  qualityBatches: QualityBatch[];

  receipts: CompanyReceipt[];
  selectedReceipt: CompanyReceipt | null;
  setSelectedReceipt: (receipt: CompanyReceipt | null) => void;

  orders: ShipmentOrder[];
  selectedOrder: ShipmentOrder | null;
  setSelectedOrder: (order: ShipmentOrder | null) => void;

  profile: CompanyProfile;
  updateProfile: (updated: Partial<CompanyProfile>) => void;
  registerNewCompany: (updated: Partial<CompanyProfile>) => void;
  loginCompany: (phoneOrName: string, fallbackProfile: Partial<CompanyProfile>) => void;

  // Company Notifications
  companyNotifications: CompanyNotification[];
  unreadCompanyNotificationsCount: number;
  isCompanyNotificationModalOpen: boolean;
  setIsCompanyNotificationModalOpen: (open: boolean) => void;
  markAllCompanyNotificationsRead: () => void;

  // Pay Portal & Escrow Settlements
  bankEscrowDetails: typeof COMPANY_BANK_ESCROW_DETAILS;
  paymentSubmissions: CompanyPaymentSubmission[];
  submitPaymentProof: (invoiceId: string, amount: number, paymentMode: CompanyPaymentSubmission['paymentMode'], utrNumber: string) => void;

  // Company Complaints & Help
  isCompanyComplaintModalOpen: boolean;
  setIsCompanyComplaintModalOpen: (open: boolean) => void;
  companyComplaints: CompanyComplaintTicket[];
  submitCompanyComplaint: (complaintData: Omit<CompanyComplaintTicket, 'id' | 'status' | 'submittedDate'>) => CompanyComplaintTicket;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<CompanyNavSection>('dashboard');

  const [demands, setDemands] = useState<CompanyDemand[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_company_demands');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_COMPANY_DEMANDS;
    } catch {
      return INITIAL_COMPANY_DEMANDS;
    }
  });

  const [fairPricing] = useState<Record<string, FairPriceFactors>>(MOCK_FAIR_PRICING);

  const [qualityBatches, setQualityBatches] = useState<QualityBatch[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_quality_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_QUALITY_BATCHES;
    } catch {
      return INITIAL_QUALITY_BATCHES;
    }
  });

  const [receipts, setReceipts] = useState<CompanyReceipt[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_company_receipts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_COMPANY_RECEIPTS;
    } catch {
      return INITIAL_COMPANY_RECEIPTS;
    }
  });
  const [selectedReceipt, setSelectedReceipt] = useState<CompanyReceipt | null>(null);

  const [orders, setOrders] = useState<ShipmentOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_shipment_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SHIPMENT_ORDERS;
    } catch {
      return INITIAL_SHIPMENT_ORDERS;
    }
  });
  const [selectedOrder, setSelectedOrder] = useState<ShipmentOrder | null>(null);

  const [profile, setProfile] = useState<CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem('kisan_company_profile');
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
    } catch {
      return INITIAL_COMPANY_PROFILE;
    }
  });

  // Company Notifications State
  const [companyNotifications, setCompanyNotifications] = useState<CompanyNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_company_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_COMPANY_NOTIFICATIONS;
    } catch {
      return INITIAL_COMPANY_NOTIFICATIONS;
    }
  });
  const [isCompanyNotificationModalOpen, setIsCompanyNotificationModalOpen] = useState(false);

  // Payment Submissions State
  const [paymentSubmissions, setPaymentSubmissions] = useState<CompanyPaymentSubmission[]>([]);

  // Company Complaints State
  const [isCompanyComplaintModalOpen, setIsCompanyComplaintModalOpen] = useState(false);
  const [companyComplaints, setCompanyComplaints] = useState<CompanyComplaintTicket[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_company_demands', JSON.stringify(demands));
    } catch (e) { console.warn(e); }
  }, [demands]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_quality_batches', JSON.stringify(qualityBatches));
    } catch (e) { console.warn(e); }
  }, [qualityBatches]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_company_receipts', JSON.stringify(receipts));
    } catch (e) { console.warn(e); }
  }, [receipts]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_shipment_orders', JSON.stringify(orders));
    } catch (e) { console.warn(e); }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_company_profile', JSON.stringify(profile));
    } catch (e) { console.warn(e); }
  }, [profile]);

  // Reactive Cross-Port & Single Shared DB Listener (< 1ms sync)
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((payload) => {
      if (
        payload.type === 'CROP_ADDED' ||
        payload.type === 'CROP_UPDATED' ||
        payload.type === 'CROP_DELETED' ||
        payload.type === 'DEMAND_ADDED' ||
        payload.type === 'DEMAND_UPDATED' ||
        payload.type === 'DEMAND_DELETED' ||
        payload.type === 'QUALITY_VERIFIED' ||
        payload.type === 'DELIVERY_CONFIRMED' ||
        payload.type === 'DATA_RESET'
      ) {
        try {
          const savedDemands = localStorage.getItem('kisan_company_demands');
          if (savedDemands) {
            setDemands(JSON.parse(savedDemands));
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const unreadCompanyNotificationsCount = companyNotifications.filter((n) => !n.read).length;

  const markAllCompanyNotificationsRead = () => {
    setCompanyNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const submitPaymentProof = (
    invoiceId: string,
    amount: number,
    paymentMode: CompanyPaymentSubmission['paymentMode'],
    utrNumber: string
  ) => {
    const id = `PAY-PROOF-${Date.now().toString().slice(-4)}`;
    const submittedDate = new Date().toISOString().split('T')[0];
    const newSubmission: CompanyPaymentSubmission = {
      id,
      invoiceId,
      amount,
      paymentMode,
      utrNumber,
      submittedDate,
      status: 'Pending Verification',
    };
    setPaymentSubmissions((prev) => [newSubmission, ...prev]);
    fireConfetti({ particleCount: 50, spread: 60 });
  };

  const submitCompanyComplaint = (
    complaintData: Omit<CompanyComplaintTicket, 'id' | 'status' | 'submittedDate'>
  ): CompanyComplaintTicket => {
    const id = `COMP-BUY-${Date.now().toString().slice(-4)}`;
    const submittedDate = new Date().toISOString().split('T')[0];
    const newTicket: CompanyComplaintTicket = {
      ...complaintData,
      id,
      status: 'Open',
      submittedDate,
    };
    setCompanyComplaints((prev) => [newTicket, ...prev]);
    fireConfetti({ particleCount: 40, spread: 50 });
    return newTicket;
  };

  const addDemand = (demandData: Omit<CompanyDemand, 'id' | 'matchedQuantity' | 'status' | 'submittedDate'>) => {
    const id = `DEM-BUY-${Date.now().toString().slice(-4)}`;
    const submittedDate = new Date().toISOString().split('T')[0];
    const newDemand: CompanyDemand = {
      ...demandData,
      id,
      matchedQuantity: 0,
      status: 'Open',
      submittedDate,
    };
    setDemands((prev) => [newDemand, ...prev]);
    fireConfetti({ particleCount: 40, spread: 50 });

    // Trigger Single Database Shared Reactive Synchronization (Port 5173 -> Farmer Portal & Port 5174)
    syncDemandAdded(newDemand);
  };

  const updateDemandStatus = (id: string, status: CompanyDemand['status']) => {
    setDemands((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    syncDemandUpdated(id, { status });
  };

  const deleteDemand = (id: string) => {
    setDemands((prev) => prev.filter((d) => d.id !== id));
    syncDemandDeleted(id);
  };

  const updateProfile = (updated: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Register NEW Company Action (Starts 100% CLEAN: 0 demands, 0 quality batches, 0 receipts, 0 payment proofs)
  const registerNewCompany = (updated: Partial<CompanyProfile>) => {
    const newProfile = { ...INITIAL_COMPANY_PROFILE, ...updated };
    setProfile(newProfile);
    setDemands([]);
    setQualityBatches([]);
    setReceipts([]);
    setOrders([]);
    setPaymentSubmissions([]);
    setCompanyNotifications([]);
    setCompanyComplaints([]);

    const phoneKey = updated.phone || updated.companyName || 'new_company';
    try {
      localStorage.setItem('kisan_company_profile', JSON.stringify(newProfile));
      localStorage.setItem('kisan_company_demands', JSON.stringify([]));
      localStorage.setItem('kisan_quality_batches', JSON.stringify([]));
      localStorage.setItem('kisan_company_receipts', JSON.stringify([]));
      localStorage.setItem('kisan_shipment_orders', JSON.stringify([]));
      localStorage.setItem('kisan_company_notifications', JSON.stringify([]));

      localStorage.setItem(`kisan_company_data_${phoneKey}`, JSON.stringify({
        profile: newProfile,
        demands: [],
        qualityBatches: [],
        receipts: [],
        orders: [],
        paymentSubmissions: [],
        companyNotifications: [],
        companyComplaints: [],
      }));
    } catch (e) {
      console.warn(e);
    }
  };

  // Login EXISTING Company Action (Restores that company's exact saved demands, quality batches, receipts, orders)
  const loginCompany = (phoneOrName: string, fallbackProfile: Partial<CompanyProfile>) => {
    const phoneKey = phoneOrName || fallbackProfile.phone || fallbackProfile.companyName || 'default';
    try {
      const savedData = localStorage.getItem(`kisan_company_data_${phoneKey}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.profile) setProfile(parsed.profile);
        setDemands(parsed.demands || []);
        setQualityBatches(parsed.qualityBatches || []);
        setReceipts(parsed.receipts || []);
        setOrders(parsed.orders || []);
        setPaymentSubmissions(parsed.paymentSubmissions || []);
        setCompanyNotifications(parsed.companyNotifications || []);
        setCompanyComplaints(parsed.companyComplaints || []);

        localStorage.setItem('kisan_company_profile', JSON.stringify(parsed.profile || { ...INITIAL_COMPANY_PROFILE, ...fallbackProfile }));
        localStorage.setItem('kisan_company_demands', JSON.stringify(parsed.demands || []));
        localStorage.setItem('kisan_quality_batches', JSON.stringify(parsed.qualityBatches || []));
        localStorage.setItem('kisan_company_receipts', JSON.stringify(parsed.receipts || []));
        localStorage.setItem('kisan_shipment_orders', JSON.stringify(parsed.orders || []));
        localStorage.setItem('kisan_company_notifications', JSON.stringify(parsed.companyNotifications || []));
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    // Default demo company fallback
    const newProfile = { ...INITIAL_COMPANY_PROFILE, ...fallbackProfile };
    setProfile(newProfile);
    if (phoneKey.includes('98112') || fallbackProfile.companyName?.includes('FreshAgro')) {
      setDemands(INITIAL_COMPANY_DEMANDS);
      setQualityBatches(INITIAL_QUALITY_BATCHES);
      setReceipts(INITIAL_COMPANY_RECEIPTS);
      setOrders(INITIAL_SHIPMENT_ORDERS);
      setCompanyNotifications(INITIAL_COMPANY_NOTIFICATIONS);
    } else {
      setDemands([]);
      setQualityBatches([]);
      setReceipts([]);
      setOrders([]);
      setPaymentSubmissions([]);
      setCompanyNotifications([]);
      setCompanyComplaints([]);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        activeSection,
        setActiveSection,

        demands,
        addDemand,
        updateDemandStatus,
        deleteDemand,

        fairPricing,
        qualityBatches,

        receipts,
        selectedReceipt,
        setSelectedReceipt,

        orders,
        selectedOrder,
        setSelectedOrder,

        profile,
        updateProfile,
        registerNewCompany,
        loginCompany,

        companyNotifications,
        unreadCompanyNotificationsCount,
        isCompanyNotificationModalOpen,
        setIsCompanyNotificationModalOpen,
        markAllCompanyNotificationsRead,

        bankEscrowDetails: COMPANY_BANK_ESCROW_DETAILS,
        paymentSubmissions,
        submitPaymentProof,

        isCompanyComplaintModalOpen,
        setIsCompanyComplaintModalOpen,
        companyComplaints,
        submitCompanyComplaint,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error('useCompany must be used within CompanyProvider');
  return context;
};
