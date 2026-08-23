import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  AdminNavSection, 
  AdminProfile, 
  AdminFarmerItem, 
  AdminCompanyItem, 
  AdminFieldAgentItem, 
  WarehouseFacility, 
  AdminDisputeTicket, 
  RiskAlert, 
  AuditLogItem 
} from '../types';
import { 
  INITIAL_ADMIN_PROFILE, 
  INITIAL_ADMIN_FARMERS, 
  INITIAL_ADMIN_COMPANIES, 
  INITIAL_ADMIN_FIELD_AGENTS, 
  INITIAL_WAREHOUSES, 
  INITIAL_DISPUTES, 
  INITIAL_RISK_ALERTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockAdmin';
import { fireConfetti } from '../utils/confetti';

interface AdminContextType {
  activeSection: AdminNavSection;
  setActiveSection: (section: AdminNavSection) => void;

  profile: AdminProfile;
  updateProfile: (updated: Partial<AdminProfile>) => void;

  farmers: AdminFarmerItem[];
  companies: AdminCompanyItem[];
  fieldAgents: AdminFieldAgentItem[];
  warehouses: WarehouseFacility[];

  disputes: AdminDisputeTicket[];
  resolveDispute: (
    disputeId: string, 
    resolutionNote: string, 
    assignedLiability: AdminDisputeTicket['assignedLiability']
  ) => void;

  riskAlerts: RiskAlert[];
  resolveRiskAlert: (alertId: string, status: RiskAlert['status']) => void;

  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, entity: string, previousValue?: string, newValue?: string, reason?: string) => void;

  // Configurable Business Rules
  inactivityThresholdDays: number;
  setInactivityThresholdDays: (days: number) => void;

  // Global Overlays
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  isAdminNotificationOpen: boolean;
  setIsAdminNotificationOpen: (open: boolean) => void;

  // Crop Price Override & Audit Trail
  priceOverrides: Record<string, { min: number; max: number; reason: string; date: string }>;
  overrideCropPrice: (cropName: string, min: number, max: number, reason: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode; initialSection?: AdminNavSection }> = ({ children, initialSection = 'dashboard' }) => {
  const [activeSection, setActiveSection] = useState<AdminNavSection>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const [profile, setProfile] = useState<AdminProfile>(() => {
    try {
      const saved = localStorage.getItem('kisan_admin_profile');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_PROFILE;
    } catch {
      return INITIAL_ADMIN_PROFILE;
    }
  });

  const [farmers] = useState<AdminFarmerItem[]>(INITIAL_ADMIN_FARMERS);
  const [companies] = useState<AdminCompanyItem[]>(INITIAL_ADMIN_COMPANIES);
  const [fieldAgents] = useState<AdminFieldAgentItem[]>(INITIAL_ADMIN_FIELD_AGENTS);
  const [warehouses] = useState<WarehouseFacility[]>(INITIAL_WAREHOUSES);

  const [disputes, setDisputes] = useState<AdminDisputeTicket[]>(INITIAL_DISPUTES);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(INITIAL_RISK_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [inactivityThresholdDays, setInactivityThresholdDays] = useState<number>(90);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isAdminNotificationOpen, setIsAdminNotificationOpen] = useState(false);

  const [priceOverrides, setPriceOverrides] = useState<Record<string, { min: number; max: number; reason: string; date: string }>>({});

  useEffect(() => {
    try {
      localStorage.setItem('kisan_admin_profile', JSON.stringify(profile));
    } catch (e) { console.warn(e); }
  }, [profile]);

  const updateProfile = (updated: Partial<AdminProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addAuditLog = (action: string, entity: string, previousValue?: string, newValue?: string, reason?: string) => {
    const newLog: AuditLogItem = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      actor: `${profile.name} (${profile.role})`,
      action,
      entity,
      previousValue,
      newValue,
      timestamp: new Date().toLocaleString(),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const resolveDispute = (
    disputeId: string, 
    resolutionNote: string, 
    assignedLiability: AdminDisputeTicket['assignedLiability']
  ) => {
    setDisputes((prev) => prev.map((d) => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: 'Resolved',
          resolutionNote,
          assignedLiability,
          resolvedDate: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    }));
    addAuditLog('Resolved Unified Dispute Ticket', disputeId, 'Investigating', 'Resolved', resolutionNote);
    fireConfetti({ particleCount: 50, spread: 60 });
  };

  const resolveRiskAlert = (alertId: string, status: RiskAlert['status']) => {
    setRiskAlerts((prev) => prev.map((r) => (r.id === alertId ? { ...r, status } : r)));
    addAuditLog('Updated Risk Anomaly Status', alertId, 'Requires Review', status);
  };

  const overrideCropPrice = (cropName: string, min: number, max: number, reason: string) => {
    const date = new Date().toISOString().split('T')[0];
    setPriceOverrides((prev) => ({
      ...prev,
      [cropName]: { min, max, reason, date },
    }));
    addAuditLog('Admin Crop Price Override Approved', cropName, 'AI Suggested Range', `₹${min} - ₹${max}/kg`, reason);
    fireConfetti({ particleCount: 40, spread: 50 });
  };

  return (
    <AdminContext.Provider
      value={{
        activeSection,
        setActiveSection,

        profile,
        updateProfile,

        farmers,
        companies,
        fieldAgents,
        warehouses,

        disputes,
        resolveDispute,

        riskAlerts,
        resolveRiskAlert,

        auditLogs,
        addAuditLog,

        inactivityThresholdDays,
        setInactivityThresholdDays,

        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        isAdminNotificationOpen,
        setIsAdminNotificationOpen,

        priceOverrides,
        overrideCropPrice,
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
