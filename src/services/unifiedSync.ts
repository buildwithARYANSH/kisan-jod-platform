/**
 * Unified Cross-Port Reactive Synchronization & Single-Entity Data Reset Engine.
 * Enforces exactly 1 Farmer, 1 Company, 1 Field Agent, 1 Logistics Carrier across Port 5173 & Port 5174.
 */

import { 
  UNIFIED_FARMER_PROFILE, 
  UNIFIED_FARMER_CROPS, 
  UNIFIED_WASTE_ITEMS, 
  UNIFIED_COMPANY_DEMANDS, 
  UNIFIED_ADMIN_FARMERS, 
  UNIFIED_FIELD_AGENTS 
} from '../data/unifiedData';

import { 
  INITIAL_COMPANY_PROFILE, 
  INITIAL_QUALITY_BATCHES, 
  INITIAL_COMPANY_RECEIPTS, 
  INITIAL_SHIPMENT_ORDERS, 
  INITIAL_COMPANY_NOTIFICATIONS 
} from '../data/mockCompany';

import { 
  INITIAL_ADMIN_PROFILE, 
  INITIAL_ADMIN_COMPANIES, 
  INITIAL_WAREHOUSES, 
  INITIAL_DISPUTES, 
  INITIAL_RISK_ALERTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockAdmin';

import { 
  INITIAL_AGENT_PROFILE, 
  INITIAL_TASKS, 
  INITIAL_ASSIGNED_FARMERS, 
  INITIAL_INVENTORY_FACILITY, 
  INITIAL_ADMIN_ORDERS, 
  INITIAL_RATING, 
  INITIAL_REFERRALS, 
  INITIAL_NOTIFICATIONS as INITIAL_AGENT_NOTIF, 
  INITIAL_REPORTED_ISSUES 
} from '../data/mockAgent';

import { 
  INITIAL_LOGISTICS_DRIVERS, 
  INITIAL_LOGISTICS_VEHICLES, 
  INITIAL_LOGISTICS_SHIPMENTS, 
  INITIAL_LOGISTICS_PAYMENTS 
} from '../data/mockLogistics';

import { INITIAL_DEMANDS, INITIAL_WOMEN_PRODUCTS, INITIAL_WOMEN_RESOURCES, INITIAL_PAYCHECKS, INITIAL_NOTIFICATIONS as INITIAL_FARMER_NOTIF, INITIAL_COMPLAINTS } from '../data/initialData';

export interface SyncEventPayload {
  type: 'DEMAND_ADDED' | 'CROP_ADDED' | 'QUALITY_VERIFIED' | 'DELIVERY_CONFIRMED' | 'DATA_RESET' | 'FARMER_REGISTERED' | 'COMPANY_REGISTERED';
  data?: any;
  timestamp: number;
}

const CHANNEL_NAME = 'kisan_jod_reactive_channel';
const SINGLE_ENTITY_DB_VERSION = 'v_single_entity_2.0';

// Helper to get BroadcastChannel safely
const getChannel = (): BroadcastChannel | null => {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      return new BroadcastChannel(CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return null;
};

// Broadcast an event across ports & tabs
export const broadcastSyncEvent = (type: SyncEventPayload['type'], data?: any) => {
  const payload: SyncEventPayload = {
    type,
    data,
    timestamp: Date.now(),
  };

  const channel = getChannel();
  if (channel) {
    channel.postMessage(payload);
    channel.close();
  }

  try {
    localStorage.setItem('kisan_last_sync_event', JSON.stringify(payload));
  } catch (e) {
    console.warn(e);
  }
};

// Subscribe to cross-port events
export const subscribeToSyncEvents = (callback: (payload: SyncEventPayload) => void) => {
  if (typeof window === 'undefined') return () => {};

  const channel = getChannel();

  const handleMessage = (event: MessageEvent<SyncEventPayload>) => {
    if (event.data && event.data.type) {
      callback(event.data);
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'kisan_last_sync_event' && event.newValue) {
      try {
        const payload: SyncEventPayload = JSON.parse(event.newValue);
        callback(payload);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  if (channel) {
    channel.onmessage = handleMessage;
  }

  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('storage', handleStorage);
  };
};

// Auto-reset database to single entity state if outdated
export const resetToSingleEntityDatabase = () => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('kisan_db_version', SINGLE_ENTITY_DB_VERSION);
    localStorage.removeItem('kisan_auth_logged_in');
    sessionStorage.removeItem('kisan_session_active');

    // 1. Farmer Portal Single Data
    localStorage.setItem('kisan_profile', JSON.stringify(UNIFIED_FARMER_PROFILE));
    localStorage.setItem('kisan_crops', JSON.stringify(UNIFIED_FARMER_CROPS));
    localStorage.setItem('kisan_waste', JSON.stringify(UNIFIED_WASTE_ITEMS));
    localStorage.setItem('kisan_demands', JSON.stringify(INITIAL_DEMANDS));
    localStorage.setItem('kisan_women_products', JSON.stringify(INITIAL_WOMEN_PRODUCTS));
    localStorage.setItem('kisan_women_resources', JSON.stringify(INITIAL_WOMEN_RESOURCES));
    localStorage.setItem('kisan_paychecks', JSON.stringify(INITIAL_PAYCHECKS));
    localStorage.setItem('kisan_notifications', JSON.stringify(INITIAL_FARMER_NOTIF));
    localStorage.setItem('kisan_complaints', JSON.stringify(INITIAL_COMPLAINTS));

    // 2. Company Portal Single Data
    localStorage.setItem('kisan_company_profile', JSON.stringify(INITIAL_COMPANY_PROFILE));
    localStorage.setItem('kisan_company_demands', JSON.stringify(UNIFIED_COMPANY_DEMANDS));
    localStorage.setItem('kisan_quality_batches', JSON.stringify(INITIAL_QUALITY_BATCHES));
    localStorage.setItem('kisan_company_receipts', JSON.stringify(INITIAL_COMPANY_RECEIPTS));
    localStorage.setItem('kisan_shipment_orders', JSON.stringify(INITIAL_SHIPMENT_ORDERS));
    localStorage.setItem('kisan_company_notifications', JSON.stringify(INITIAL_COMPANY_NOTIFICATIONS));

    // 3. Admin Operations Portal Single Data
    localStorage.setItem('kisan_admin_profile', JSON.stringify(INITIAL_ADMIN_PROFILE));
    localStorage.setItem('kisan_admin_farmers_master', JSON.stringify(UNIFIED_ADMIN_FARMERS));
    localStorage.setItem('kisan_admin_companies_master', JSON.stringify(INITIAL_ADMIN_COMPANIES));
    localStorage.setItem('kisan_admin_agents_master', JSON.stringify(UNIFIED_FIELD_AGENTS));
    localStorage.setItem('kisan_warehouses', JSON.stringify(INITIAL_WAREHOUSES));
    localStorage.setItem('kisan_disputes', JSON.stringify(INITIAL_DISPUTES));
    localStorage.setItem('kisan_risk_alerts', JSON.stringify(INITIAL_RISK_ALERTS));
    localStorage.setItem('kisan_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));

    // 4. Field Agent Desk Single Data
    localStorage.setItem('kisan_agent_profile', JSON.stringify(INITIAL_AGENT_PROFILE));
    localStorage.setItem('kisan_admin_tasks', JSON.stringify(INITIAL_TASKS));
    localStorage.setItem('kisan_admin_farmers', JSON.stringify(INITIAL_ASSIGNED_FARMERS));
    localStorage.setItem('kisan_inventory', JSON.stringify(INITIAL_INVENTORY_FACILITY));
    localStorage.setItem('kisan_admin_orders', JSON.stringify(INITIAL_ADMIN_ORDERS));
    localStorage.setItem('kisan_agent_rating', JSON.stringify(INITIAL_RATING));
    localStorage.setItem('kisan_agent_referrals', JSON.stringify(INITIAL_REFERRALS));
    localStorage.setItem('kisan_agent_notifications', JSON.stringify(INITIAL_AGENT_NOTIF));
    localStorage.setItem('kisan_reported_issues', JSON.stringify(INITIAL_REPORTED_ISSUES));

    // 5. Logistics Partner Single Data
    localStorage.setItem('kisan_logistics_drivers', JSON.stringify(INITIAL_LOGISTICS_DRIVERS));
    localStorage.setItem('kisan_logistics_vehicles', JSON.stringify(INITIAL_LOGISTICS_VEHICLES));
    localStorage.setItem('kisan_logistics_shipments', JSON.stringify(INITIAL_LOGISTICS_SHIPMENTS));
    localStorage.setItem('kisan_logistics_payments', JSON.stringify(INITIAL_LOGISTICS_PAYMENTS));

    broadcastSyncEvent('DATA_RESET', { version: SINGLE_ENTITY_DB_VERSION });
  } catch (e) {
    console.warn('Error resetting database to single entity state:', e);
  }
};

// Auto Check DB Version on Load
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('kisan_db_version');
    if (currentVer !== SINGLE_ENTITY_DB_VERSION) {
      resetToSingleEntityDatabase();
    }
  } catch (e) {
    console.warn(e);
  }
}

// Helper: Sync when a Company posts a new Demand
export const syncDemandAdded = (newDemand: any) => {
  try {
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = [newDemand, ...companyDemands.filter((d: any) => d.id !== newDemand.id)];
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    const isWaste = 
      newDemand.category === 'Agri Waste & Biomass' || 
      newDemand.wastePurpose || 
      newDemand.cropName.toLowerCase().includes('parali') || 
      newDemand.cropName.toLowerCase().includes('stubble') || 
      newDemand.cropName.toLowerCase().includes('dung') || 
      newDemand.cropName.toLowerCase().includes('waste');

    // Only add non-waste demands to fresh produce demands ticker
    if (!isWaste) {
      const farmerDemands = JSON.parse(localStorage.getItem('kisan_demands') || '[]');
      const farmerFormatDemand = {
        id: newDemand.id,
        cropName: newDemand.cropName,
        cropNameHi: newDemand.cropName,
        requiredQty: newDemand.quantity,
        registeredQty: newDemand.matchedQuantity || 0,
        pricePerKg: newDemand.expectedPricePerUnit,
        unit: newDemand.unit || 'kg',
        buyersCount: 1,
        urgent: newDemand.urgency === 'Urgent',
        category: newDemand.category || 'Fresh Produce',
        gradeRequirement: newDemand.requiredGrade || 'A',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      };
      const updatedFarmerDemands = [farmerFormatDemand, ...farmerDemands.filter((d: any) => d.id !== newDemand.id)];
      localStorage.setItem('kisan_demands', JSON.stringify(updatedFarmerDemands));
    }

    broadcastSyncEvent('DEMAND_ADDED', newDemand);
  } catch (e) {
    console.warn('Error syncing demand added:', e);
  }
};

// Helper: Sync when a Farmer registers a Crop
export const syncCropAdded = (newCrop: any, farmerProfileName = 'Gurdev Singh') => {
  try {
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.map((d: any) => {
      if (
        d.id === newCrop.matchedDemandId ||
        d.cropName.toLowerCase().includes(newCrop.cropName.toLowerCase()) ||
        newCrop.cropName.toLowerCase().includes(d.cropName.toLowerCase())
      ) {
        const newMatched = (d.matchedQuantity || 0) + (newCrop.quantity || 0);
        const newStatus = newMatched >= d.quantity ? 'Matched' : 'Partially Matched';
        return { ...d, matchedQuantity: newMatched, status: newStatus };
      }
      return d;
    });
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    const agentTasks = JSON.parse(localStorage.getItem('kisan_admin_tasks') || '[]');
    const newTask = {
      id: `TSK-AUTO-${Date.now().toString().slice(-4)}`,
      farmerName: farmerProfileName,
      farmerPhone: '+91 98765 43210',
      village: 'Village Sunam',
      cropName: newCrop.cropName,
      quantityKg: newCrop.quantity,
      grade: newCrop.grade || 'A',
      pickupDate: new Date().toISOString().split('T')[0],
      assignedAgentId: 'AGT-101',
      assignedAgentName: 'Ramesh Kumar',
      status: 'Assigned',
      priority: 1,
      notes: `Auto-generated collection task for registered produce pool (${newCrop.cropName} - ${newCrop.quantity} kg)`,
    };
    localStorage.setItem('kisan_admin_tasks', JSON.stringify([newTask, ...agentTasks]));

    broadcastSyncEvent('CROP_ADDED', { crop: newCrop, task: newTask });
  } catch (e) {
    console.warn('Error syncing crop added:', e);
  }
};

// Helper: Sync when Logistics confirms Delivery
export const syncDeliveryConfirmed = (orderId: string, deliveredQty: number, receiverName: string) => {
  try {
    const paychecks = JSON.parse(localStorage.getItem('kisan_paychecks') || '[]');
    const updatedPaychecks = paychecks.map((p: any) => {
      if (p.txnId === orderId || p.id === orderId) {
        return { ...p, status: 'Completed' };
      }
      return p;
    });
    localStorage.setItem('kisan_paychecks', JSON.stringify(updatedPaychecks));

    broadcastSyncEvent('DELIVERY_CONFIRMED', { orderId, deliveredQty, receiverName });
  } catch (e) {
    console.warn('Error syncing delivery confirmed:', e);
  }
};

/// Helper: Sync when a new Farmer registers
export const syncFarmerRegistered = (farmerData: any) => {
  try {
    const adminFarmers = JSON.parse(localStorage.getItem('kisan_admin_farmers_master') || '[]');
    const farmerId = farmerData.id || `FAR-${Date.now().toString().slice(-4)}`;
    const farmerName = farmerData.name || farmerData.farmerName || 'Registered Farmer';
    const farmerPhone = farmerData.phone || farmerData.farmerPhone || '+91 98000 00000';
    const regDate = farmerData.registeredDate || new Date().toISOString().split('T')[0];

    const newAdminFarmer = {
      id: farmerId,
      farmerId: farmerId,
      name: farmerName,
      phone: farmerPhone,
      address: `${farmerData.village || ''}, ${farmerData.district || ''} ${farmerData.state || ''}`.trim() || 'Local Region',
      region: `${farmerData.district || farmerData.village || 'Local'} Hub Region`,
      assignedFieldAgent: 'AGT-101 (Ramesh Kumar)',
      registeredDate: regDate,
      lastActivityDate: regDate,
      crops: farmerData.crops || ['Fresh Produce'],
      bankName: farmerData.bankName || 'State Bank of India',
      accountNumberMasked: farmerData.accountNumber ? `XXXX-XXXX-${String(farmerData.accountNumber).slice(-4)}` : 'XXXX-XXXX-1234',
      totalQuantitySupplied: 0,
      activeOrdersCount: 0,
      completedOrdersCount: 0,
      disputesCount: 0,
      referralSource: 'Direct Farmer Registration',
      // SuperAdmin fields
      village: farmerData.village || 'Local Village',
      district: farmerData.district || 'Local District',
      state: farmerData.state || 'Punjab',
      registeredCropsCount: 0,
      totalSoldQuantityKg: 0,
      totalEarningsINR: 0,
      registeredDateTimestamp: regDate,
      lastActivityTimestamp: regDate,
    };

    const updatedFarmers = [newAdminFarmer, ...adminFarmers.filter((f: any) => f.id !== farmerId && f.farmerId !== farmerId)];
    localStorage.setItem('kisan_admin_farmers_master', JSON.stringify(updatedFarmers));

    // Also update field agent assigned farmer roster
    const agentFarmers = JSON.parse(localStorage.getItem('kisan_admin_farmers') || '[]');
    const newAgentFarmer = {
      id: farmerId,
      name: farmerName,
      phone: farmerPhone,
      village: farmerData.village || 'Local Village',
      registeredDate: regDate,
      totalCropsListed: 0,
      lastInteraction: 'Directly Registered',
      status: 'Active',
    };
    localStorage.setItem('kisan_admin_farmers', JSON.stringify([newAgentFarmer, ...agentFarmers.filter((f: any) => f.id !== farmerId)]));

    broadcastSyncEvent('FARMER_REGISTERED', newAdminFarmer);
  } catch (e) {
    console.warn('Error syncing farmer registered:', e);
  }
};

// Helper: Sync when a new Company registers
export const syncCompanyRegistered = (companyData: any) => {
  try {
    const adminCompanies = JSON.parse(localStorage.getItem('kisan_admin_companies_master') || '[]');
    const companyId = companyData.id || `COMP-${Date.now().toString().slice(-4)}`;
    const compName = companyData.companyName || companyData.name || 'Registered Company';
    const compPhone = companyData.phone || '+91 98000 00000';
    const regDate = companyData.registeredDate || new Date().toISOString().split('T')[0];

    const newAdminCompany = {
      id: companyId,
      companyId: companyId,
      name: compName,
      companyName: compName,
      branch: companyData.procurementHub || 'Headquarters',
      address: companyData.registeredAddress || 'Main Industry Zone',
      email: companyData.email || 'corporate@kisanjod.in',
      phone: compPhone,
      executiveHead: companyData.contactPerson || 'Authorized Representative',
      executivePhone: compPhone,
      registrationDate: regDate,
      lastActivityDate: regDate,
      totalDemandsCount: 0,
      activeDemandsCount: 0,
      completedOrdersCount: 0,
      totalPurchaseValue: 0,
      // SuperAdmin fields
      gstin: companyData.gstin || '27AAAAA0000A1Z5',
      procurementHub: companyData.procurementHub || 'Regional Hub',
      contactPerson: companyData.contactPerson || 'Authorized Representative',
      totalProcuredKg: 0,
      totalSpentINR: 0,
      registeredDateTimestamp: regDate,
      lastActivityTimestamp: regDate,
    };

    const updatedCompanies = [newAdminCompany, ...adminCompanies.filter((c: any) => c.id !== companyId && c.companyId !== companyId)];
    localStorage.setItem('kisan_admin_companies_master', JSON.stringify(updatedCompanies));

    broadcastSyncEvent('COMPANY_REGISTERED', newAdminCompany);
  } catch (e) {
    console.warn('Error syncing company registered:', e);
  }
};
