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

  const [farmers, setFarmers] = useState<MasterFarmer[]>(INITIAL_MASTER_FARMERS);
  const [companies, setCompanies] = useState<MasterCompany[]>(INITIAL_MASTER_COMPANIES);
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

  // Cross-App Real-Time Sync Listener (BroadcastChannel)
  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('kisan_jod_shared_sync');

    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_DEMAND_SUBMITTED') {
        const newDemand = event.data.demand;
        // Automatically reflect as order/demand in Super-Admin!
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

    return () => channel.close();
  }, []);

  const updateConfig = (newConfig: Partial<BusinessRulesConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Dynamically calculate 90-day inactivity
  const isFarmerActive = (farmer: MasterFarmer): boolean => {
    const lastActive = new Date(farmer.lastActivityTimestamp).getTime();
    const now = new Date('2026-08-21').getTime();
    const diffDays = (now - lastActive) / (1000 * 3600 * 24);
    return diffDays <= config.inactivityThresholdDays;
  };

  const isCompanyActive = (company: MasterCompany): boolean => {
    const lastActive = new Date(company.lastActivityTimestamp).getTime();
    const now = new Date('2026-08-21').getTime();
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
