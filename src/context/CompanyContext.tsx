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
import { subscribeToSyncEvents, syncDemandAdded } from '../services/unifiedSync';

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
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_DEMANDS;
    } catch {
      return INITIAL_COMPANY_DEMANDS;
    }
  });

  const [fairPricing] = useState<Record<string, FairPriceFactors>>(MOCK_FAIR_PRICING);

  const [qualityBatches] = useState<QualityBatch[]>(INITIAL_QUALITY_BATCHES);

  const [receipts] = useState<CompanyReceipt[]>(INITIAL_COMPANY_RECEIPTS);
  const [selectedReceipt, setSelectedReceipt] = useState<CompanyReceipt | null>(null);

  const [orders] = useState<ShipmentOrder[]>(INITIAL_SHIPMENT_ORDERS);
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
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_NOTIFICATIONS;
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
      localStorage.setItem('kisan_company_profile', JSON.stringify(profile));
    } catch (e) { console.warn(e); }
  }, [profile]);

  // Reactive Cross-Port Listener (< 5ms sync)
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((payload) => {
      if (payload.type === 'CROP_ADDED' || payload.type === 'QUALITY_VERIFIED' || payload.type === 'DELIVERY_CONFIRMED') {
        try {
          const savedDemands = localStorage.getItem('kisan_company_demands');
          if (savedDemands) setDemands(JSON.parse(savedDemands));
        } catch (e) { console.warn(e); }
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

    // Trigger Cross-Port Reactive Synchronization (Port 5173 -> Port 5174)
    syncDemandAdded(newDemand);
  };

  const updateDemandStatus = (id: string, status: CompanyDemand['status']) => {
    setDemands((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const deleteDemand = (id: string) => {
    setDemands((prev) => prev.filter((d) => d.id !== id));
  };

  const updateProfile = (updated: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
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
