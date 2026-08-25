import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  SuperAdminNavSection, 
  MasterFarmer, 
  MasterCompany, 
  MasterFieldAgent, 
  MasterOrder, 
  DisputeTicket, 
  RiskAlert, 
  AuditLogEntry, 
  PlatformFinance, 
  DisputeType 
} from '../types';
import { 
  INITIAL_MASTER_FARMERS, 
  INITIAL_MASTER_COMPANIES, 
  INITIAL_MASTER_FIELD_AGENTS, 
  INITIAL_MASTER_ORDERS, 
  INITIAL_DISPUTES, 
  INITIAL_RISK_ALERTS, 
  INITIAL_AUDIT_LOG, 
  INITIAL_PLATFORM_FINANCE 
} from '../data/mockSuperAdmin';

interface BusinessRulesConfig {
  inactivityThresholdDays: number; // default 90 days
  agentRatingMinThreshold: number; // default 2.0
  referralRewardINR: number;       // default 500
}

interface SuperAdminContextType {
  activeSection: SuperAdminNavSection;
  setActiveSection: (sec: SuperAdminNavSection) => void;

  config: BusinessRulesConfig;
  updateConfig: (newConfig: Partial<BusinessRulesConfig>) => void;

  farmers: MasterFarmer[];
  isFarmerActive: (farmer: MasterFarmer) => boolean;

  companies: MasterCompany[];
  isCompanyActive: (company: MasterCompany) => boolean;

  fieldAgents: MasterFieldAgent[];
  selectedAgent: MasterFieldAgent | null;
  setSelectedAgent: (agent: MasterFieldAgent | null) => void;

  orders: MasterOrder[];
  selectedOrder: MasterOrder | null;
  setSelectedOrder: (order: MasterOrder | null) => void;
  updateOrderStatus: (orderId: string, status: MasterOrder['currentStatus']) => void;

  disputes: DisputeTicket[];
  selectedDispute: DisputeTicket | null;
  setSelectedDispute: (dispute: DisputeTicket | null) => void;
  resolveDispute: (disputeId: string, resolution: string, liability: string) => void;

  riskAlerts: RiskAlert[];
  resolveRiskAlert: (id: string) => void;

  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, entity: string, prevVal: string, newVal: string, reason?: string) => void;

  finance: PlatformFinance;

  // Global Search Overlay
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Reference Price Override
  approvedReferencePrices: Record<string, number>;
  setApprovedReferencePrice: (cropName: string, price: number, reason: string) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SuperAdminNavSection>('dashboard');

  const [config, setConfig] = useState<BusinessRulesConfig>({
    inactivityThresholdDays: 90,
    agentRatingMinThreshold: 2.0,
    referralRewardINR: 500,
  });

  const [farmers, setFarmers] = useState<MasterFarmer[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_farmers_master');
      return saved ? JSON.parse(saved) : INITIAL_MASTER_FARMERS;
    } catch {
      return INITIAL_MASTER_FARMERS;
    }
  });

  const [companies, setCompanies] = useState<MasterCompany[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_companies_master');
      return saved ? JSON.parse(saved) : INITIAL_MASTER_COMPANIES;
    } catch {
      return INITIAL_MASTER_COMPANIES;
    }
  });

  const [fieldAgents] = useState<MasterFieldAgent[]>(INITIAL_MASTER_FIELD_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<MasterFieldAgent | null>(null);

  // Master Orders sorted in ascending order by orderId
  const [orders, setOrders] = useState<MasterOrder[]>(() => {
    return [...INITIAL_MASTER_ORDERS].sort((a, b) => a.orderId.localeCompare(b.orderId));
  });
  const [selectedOrder, setSelectedOrder] = useState<MasterOrder | null>(null);

  const [disputes, setDisputes] = useState<DisputeTicket[]>(INITIAL_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<DisputeTicket | null>(null);

  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(INITIAL_RISK_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [finance] = useState<PlatformFinance>(INITIAL_PLATFORM_FINANCE);

  // Global Search State
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Approved Price Reference State
  const [approvedReferencePrices, setApprovedReferencePrices] = useState<Record<string, number>>({
    Tomato: 18.20,
    Potato: 16.00,
    Wheat: 24.00,
  });

  // Cross-App Real-Time Sync Listener (BroadcastChannel & localStorage)
  useEffect(() => {
    const reloadMasterData = () => {
      try {
        const savedFarmers = localStorage.getItem('kisan_admin_farmers_master');
        const registeredFarmers = localStorage.getItem('kisan_registered_farmers');
        let masterFarmers: MasterFarmer[] = savedFarmers ? JSON.parse(savedFarmers) : [...INITIAL_MASTER_FARMERS];
        
        if (registeredFarmers) {
          const extra: any[] = JSON.parse(registeredFarmers);
          extra.forEach((ef) => {
            const efId = ef.id || `FAR-${Date.now()}`;
            if (!masterFarmers.some((mf) => mf.id === efId || mf.farmerId === efId)) {
              masterFarmers.unshift({
                id: efId,
                farmerId: efId,
                name: ef.name || 'Registered Farmer',
                phone: ef.phone || '+91 98000 00000',
                address: `${ef.village || ''}, ${ef.district || ''} ${ef.state || ''}`.trim() || 'Local Region',
                region: `${ef.district || ef.village || 'Local'} Hub Region`,
                assignedAgentId: 'FA-10234',
                assignedAgentName: 'Ramesh Kumar',
                assignedFieldAgent: 'AGT-101 (Ramesh Kumar)',
                registeredDate: ef.registeredDate || new Date().toISOString().split('T')[0],
                lastActivityDate: ef.registeredDate || new Date().toISOString().split('T')[0],
                lastActivityTimestamp: ef.registeredDate || new Date().toISOString().split('T')[0],
                crops: ['Fresh Produce'],
                bankName: ef.bankName || 'State Bank of India',
                accountNumberMasked: ef.accountNumber ? `XXXX-XXXX-${String(ef.accountNumber).slice(-4)}` : 'XXXX-XXXX-1234',
                totalQuantitySupplied: 0,
                totalQuantitySuppliedKg: 0,
                pastOrdersCount: 0,
                activeOrdersCount: 0,
                completedOrdersCount: 0,
                disputesCount: 0,
                paymentStatus: 'Settled',
                referralSource: 'Direct Farmer Registration',
                village: ef.village || 'Local Village',
                district: ef.district || 'Local District',
                state: ef.state || 'Punjab',
                registeredCropsCount: 0,
                totalSoldQuantityKg: 0,
                totalEarningsINR: 0,
                registeredDateTimestamp: ef.registeredDate || new Date().toISOString().split('T')[0],
              } as any);
            }
          });
        }
        setFarmers(masterFarmers);

        const savedCompanies = localStorage.getItem('kisan_admin_companies_master');
        const registeredCompanies = localStorage.getItem('kisan_registered_companies');
        let masterCompanies: MasterCompany[] = savedCompanies ? JSON.parse(savedCompanies) : [...INITIAL_MASTER_COMPANIES];

        if (registeredCompanies) {
          const extraC: any[] = JSON.parse(registeredCompanies);
          extraC.forEach((ec) => {
            const ecId = ec.id || `COMP-${Date.now()}`;
            if (!masterCompanies.some((mc) => mc.id === ecId || mc.companyId === ecId)) {
              masterCompanies.unshift({
                id: ecId,
                companyId: ecId,
                name: ec.companyName || ec.name || 'Registered Company',
                companyName: ec.companyName || ec.name || 'Registered Company',
                branch: ec.procurementHub || 'Headquarters',
                address: ec.registeredAddress || 'Main Industry Zone',
                email: ec.email || 'corporate@kisanjod.in',
                phone: ec.phone || '+91 98000 00000',
                executiveHead: ec.contactPerson || 'Authorized Representative',
                executivePhone: ec.phone || '+91 98000 00000',
                executiveEmail: ec.email || 'corporate@kisanjod.in',
                registrationDate: ec.registeredDate || new Date().toISOString().split('T')[0],
                lastActivityDate: ec.registeredDate || new Date().toISOString().split('T')[0],
                lastActivityTimestamp: ec.registeredDate || new Date().toISOString().split('T')[0],
                totalDemandsCount: 0,
                activeDemandsCount: 0,
                completedOrdersCount: 0,
                totalPurchaseValue: 0,
                totalPurchaseValueINR: 0,
                gstin: ec.gstin || '27AAAAA0000A1Z5',
                procurementHub: ec.procurementHub || 'Regional Hub',
                contactPerson: ec.contactPerson || 'Authorized Representative',
                totalProcuredKg: 0,
                totalSpentINR: 0,
                registeredDateTimestamp: ec.registeredDate || new Date().toISOString().split('T')[0],
              } as any);
            }
          });
        }
        setCompanies(masterCompanies);
      } catch (e) {
        console.warn(e);
      }
    };

    reloadMasterData();

    const channel1 = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('kisan_jod_shared_sync') : null;
    const channel2 = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('kisan_jod_reactive_channel') : null;

    if (channel1) {
      channel1.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_DEMAND_SUBMITTED') {
          const newDemand = event.data.demand;
          const newOrder: MasterOrder = {
            orderId: `ORD-BUY-${Date.now().toString().slice(-3)}`,
            cropName: newDemand.cropName,
            quantityRequestedKg: newDemand.quantity,
            confirmedQtyKg: 0,
            grade: newDemand.requiredGrade || 'A',
            pricePerKgINR: newDemand.expectedPricePerUnit || 18,
            farmerSource: 'Aggregated Local Farmers Pool',
            fieldAgentId: 'FA-10234',
            fieldAgentName: 'Gurpreet Singh',
            inventoryFacility: 'Ludhiana Approved Storage Facility #4',
            logisticsPartner: 'Sample Fleet Partner',
            driverName: 'Raj Kumar',
            driverPhone: '+91 98765 12345',
            vehicleNumber: 'PB-10-CZ-4921',
            companyName: 'FreshAgro Foods Pvt Ltd',
            createdDate: new Date().toISOString().split('T')[0],
            currentStatus: 'Demand Created',
            paymentStatus: 'Pending',
            completionPercent: 10,
            riskStatus: 'Low Risk',
            custodyCheckpoints: [],
            financials: {
              companyPayment: newDemand.quantity * (newDemand.expectedPricePerUnit || 18),
              farmerPayment: newDemand.quantity * 16,
              fieldAgentCost: newDemand.quantity * 0.5,
              logisticsCost: 4000,
              storageCost: 1500,
              qualityHandlingCost: 1000,
              platformServiceFee: 2500,
              netMargin: 0,
            },
          };
          setOrders((prev) => [...prev, newOrder].sort((a, b) => a.orderId.localeCompare(b.orderId)));
        }
      };
    }

    if (channel2) {
      channel2.onmessage = (event) => {
        if (event.data?.type === 'FARMER_REGISTERED' || event.data?.type === 'COMPANY_REGISTERED') {
          reloadMasterData();
        }
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kisan_admin_farmers_master' || e.key === 'kisan_admin_companies_master' || e.key === 'kisan_last_sync_event') {
        reloadMasterData();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (channel1) channel1.close();
      if (channel2) channel2.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateConfig = (newConfig: Partial<BusinessRulesConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Dynamically calculate inactivity threshold
  const isFarmerActive = (farmer: MasterFarmer): boolean => {
    if (!farmer) return false;
    const ts = farmer.lastActivityTimestamp || farmer.lastActivityDate || farmer.registeredDate || new Date().toISOString().split('T')[0];
    const lastActive = new Date(ts).getTime();
    if (isNaN(lastActive)) return true;
    const now = Date.now();
    const diffDays = (now - lastActive) / (1000 * 3600 * 24);
    return diffDays <= config.inactivityThresholdDays;
  };

  const isCompanyActive = (company: MasterCompany): boolean => {
    if (!company) return false;
    const ts = company.lastActivityTimestamp || company.lastActivityDate || company.registrationDate || new Date().toISOString().split('T')[0];
    const lastActive = new Date(ts).getTime();
    if (isNaN(lastActive)) return true;
    const now = Date.now();
    const diffDays = (now - lastActive) / (1000 * 3600 * 24);
    return diffDays <= config.inactivityThresholdDays;
  };

  const addAuditLog = (action: string, entity: string, prevVal: string, newVal: string, reason?: string) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Super-Admin Operations',
      action,
      entity,
      previousValue: prevVal,
      newValue: newVal,
      reason,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: MasterOrder['currentStatus']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          addAuditLog('Order Status Update', `Order #${orderId}`, o.currentStatus, status);
          return { ...o, currentStatus: status };
        }
        return o;
      })
    );
  };

  const resolveDispute = (disputeId: string, resolution: string, liability: string) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.disputeId === disputeId) {
          addAuditLog('Dispute Resolved', `Dispute #${disputeId}`, d.status, 'Resolved', resolution);
          return {
            ...d,
            status: 'Resolved',
            resolution,
            liabilityAssignedTo: liability,
            resolvedAt: new Date().toISOString().split('T')[0],
          };
        }
        return d;
      })
    );
  };

  const resolveRiskAlert = (id: string) => {
    setRiskAlerts((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)));
  };

  const setApprovedReferencePrice = (cropName: string, price: number, reason: string) => {
    const prevPrice = approvedReferencePrices[cropName] || 18;
    setApprovedReferencePrices((prev) => ({ ...prev, [cropName]: price }));
    addAuditLog('Crop Reference Price Override', `${cropName} Procurement Price`, `₹${prevPrice}/kg`, `₹${price}/kg`, reason);
  };

  return (
    <SuperAdminContext.Provider
      value={{
        activeSection,
        setActiveSection,

        config,
        updateConfig,

        farmers,
        isFarmerActive,

        companies,
        isCompanyActive,

        fieldAgents,
        selectedAgent,
        setSelectedAgent,

        orders,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,

        disputes,
        selectedDispute,
        setSelectedDispute,
        resolveDispute,

        riskAlerts,
        resolveRiskAlert,

        auditLogs,
        addAuditLog,

        finance,

        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        searchQuery,
        setSearchQuery,

        approvedReferencePrices,
        setApprovedReferencePrice,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  return context;
};
