/**
 * Unified Cross-Port Reactive Synchronization & Single-Entity Data Reset Engine.
 * Enforces a single shared database between Company Portal and Farmer Portal across Port 5173 & Port 5174.
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

import { 
  INITIAL_DEMANDS, 
  INITIAL_WOMEN_PRODUCTS, 
  INITIAL_WOMEN_RESOURCES, 
  INITIAL_PAYCHECKS, 
  INITIAL_NOTIFICATIONS as INITIAL_FARMER_NOTIF, 
  INITIAL_COMPLAINTS 
} from '../data/initialData';

export interface SyncEventPayload {
  type: 
    | 'DEMAND_ADDED' 
    | 'DEMAND_UPDATED' 
    | 'DEMAND_DELETED' 
    | 'CROP_ADDED' 
    | 'CROP_UPDATED' 
    | 'CROP_DELETED' 
    | 'QUALITY_VERIFIED' 
    | 'DELIVERY_CONFIRMED' 
    | 'DATA_RESET' 
    | 'FARMER_REGISTERED' 
    | 'COMPANY_REGISTERED';
  data?: any;
  timestamp: number;
}

const CHANNEL_NAME = 'kisan_jod_reactive_channel';
const SINGLE_ENTITY_DB_VERSION = 'v_single_entity_2.0';

// Global In-Memory Listeners for Instant Same-Window Reactivity (< 1ms)
const inMemoryListeners = new Set<(payload: SyncEventPayload) => void>();

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

// Crop metadata dictionary for authentic imagery and translations
export const CROP_METADATA_MAP: Record<string, { hi: string; image: string; category: string }> = {
  tomato: {
    hi: 'टमाटर',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    category: 'Vegetables',
  },
  potato: {
    hi: 'आलू',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
    category: 'Vegetables',
  },
  wheat: {
    hi: 'गेहूं',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  rice: {
    hi: 'चावल (धान)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  basmati: {
    hi: 'बासमती चावल',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  paddy: {
    hi: 'धान',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  onion: {
    hi: 'प्याज',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
    category: 'Vegetables',
  },
  mustard: {
    hi: 'सरसों',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80',
    category: 'Oilseeds',
  },
  cotton: {
    hi: 'कपास',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80',
    category: 'Cash Crops',
  },
  maize: {
    hi: 'मक्का',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  corn: {
    hi: 'मक्का',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
    category: 'Grains',
  },
  sugarcane: {
    hi: 'गन्ना',
    image: 'https://images.unsplash.com/photo-1589135398307-775c754d924d?w=400&auto=format&fit=crop&q=80',
    category: 'Cash Crops',
  },
  soybean: {
    hi: 'सोयाबीन',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80',
    category: 'Oilseeds',
  },
  chilli: {
    hi: 'हरी मिर्च',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
    category: 'Spices',
  },
  parali: {
    hi: 'पराली (फसल अवशेष)',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    category: 'Agri Waste',
  },
  dung: {
    hi: 'गोबर (बायोगैस)',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=400&auto=format&fit=crop&q=80',
    category: 'Agri Waste',
  },
};

export const getCropMetadata = (cropName: string) => {
  const lower = cropName.toLowerCase();
  for (const [key, val] of Object.entries(CROP_METADATA_MAP)) {
    if (lower.includes(key)) {
      return val;
    }
  }
  return {
    hi: cropName,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
    category: 'Fresh Produce',
  };
};

// Helper to safely extract crop name from any demand or crop object
export const getSafeCropName = (obj: any): string => {
  if (!obj) return '';
  return obj.cropName || obj.crop || obj.name || '';
};

// Safe case-insensitive substring/equality matcher
export const isCropNameMatch = (name1?: string, name2?: string): boolean => {
  if (!name1 || !name2) return false;
  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();
  return n1.includes(n2) || n2.includes(n1);
};

// Format a CompanyDemand into an IndustryDemand for the Farmer Portal
export const formatCompanyDemandToFarmerDemand = (compDemand: any): any => {
  const cropName = getSafeCropName(compDemand) || 'Fresh Produce';
  const meta = getCropMetadata(cropName);
  
  // Calculate quantity in kg
  let qtyInKg = 10000;
  if (compDemand.requiredKg) {
    qtyInKg = compDemand.requiredKg;
  } else if (compDemand.requiredMT) {
    qtyInKg = compDemand.requiredMT * 1000;
  } else if (compDemand.quantity) {
    if (compDemand.unit === 'Ton' || compDemand.unit === 'MT') {
      qtyInKg = compDemand.quantity * 1000;
    } else if (compDemand.unit === 'Quintal') {
      qtyInKg = compDemand.quantity * 100;
    } else {
      qtyInKg = compDemand.quantity;
    }
  }

  let matchedInKg = 0;
  if (compDemand.matchedKg) {
    matchedInKg = compDemand.matchedKg;
  } else if (compDemand.matchedMT !== undefined) {
    matchedInKg = compDemand.matchedMT * 1000;
  } else if (compDemand.matchedQuantity !== undefined) {
    if ((compDemand.unit === 'Ton' || compDemand.unit === 'MT') && compDemand.matchedQuantity < 1000) {
      matchedInKg = compDemand.matchedQuantity * 1000;
    } else if (compDemand.unit === 'Quintal' && compDemand.matchedQuantity < 100) {
      matchedInKg = compDemand.matchedQuantity * 100;
    } else {
      matchedInKg = compDemand.matchedQuantity;
    }
  }

  let pricePerKg = 20;
  if (compDemand.expectedPricePerUnit) {
    pricePerKg = compDemand.expectedPricePerUnit;
  } else if (compDemand.targetPricePerKg) {
    pricePerKg = compDemand.targetPricePerKg;
  } else if (compDemand.targetPricePerMT) {
    pricePerKg = Math.round(compDemand.targetPricePerMT / 1000);
  }

  return {
    id: compDemand.id || `DEM-${Date.now().toString().slice(-4)}`,
    cropName: cropName,
    cropNameHi: compDemand.cropNameHi || meta.hi,
    requiredQty: qtyInKg,
    registeredQty: matchedInKg,
    pricePerKg: pricePerKg,
    unit: 'kg',
    buyersCount: compDemand.buyersCount || 1,
    urgent: compDemand.urgency === 'Urgent' || compDemand.priority === 'CRITICAL' || compDemand.priority === 'HIGH' || compDemand.urgent === true,
    category: compDemand.category || meta.category,
    gradeRequirement: compDemand.requiredGrade || compDemand.grade || 'A',
    image: compDemand.image || meta.image,
  };
};

// Unified Master Demands Loader for the Farmer Portal
export const loadAllUnifiedFarmerDemands = (): any[] => {
  if (typeof window === 'undefined') return INITIAL_DEMANDS;

  try {
    const crops = JSON.parse(localStorage.getItem('kisan_crops') || '[]');
    
    const rawFarmerDemands: any[] = JSON.parse(localStorage.getItem('kisan_demands') || '[]');
    const rawCompanyDemands: any[] = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const rawAgricoreDemands: any[] = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const deletedIds: string[] = JSON.parse(localStorage.getItem('kisan_deleted_demands') || '[]');
    const deletedSet = new Set(deletedIds);

    const allRaw = [...INITIAL_DEMANDS, ...rawFarmerDemands, ...rawCompanyDemands, ...rawAgricoreDemands]
      .filter((item) => item && !deletedSet.has(item.id));

    const demandMap = new Map<string, any>();

    allRaw.forEach((item) => {
      if (!item) return;
      const formatted = formatCompanyDemandToFarmerDemand(item);
      if (formatted && formatted.cropName && !deletedSet.has(formatted.id)) {
        demandMap.set(formatted.id, formatted);
      }
    });

    const result = Array.from(demandMap.values()).map((demand) => {
      // Calculate live matched registered quantity from kisan_crops
      let liveRegisteredQty = 0;
      crops.forEach((c: any) => {
        const cropName = getSafeCropName(c);
        const demandCropName = getSafeCropName(demand);
        const isMatch =
          c.matchedDemandId === demand.id ||
          isCropNameMatch(cropName, demandCropName);
        if (isMatch) {
          liveRegisteredQty += (Number(c.quantity) || 0);
        }
      });

      const finalRegistered = Math.max(demand.registeredQty || 0, liveRegisteredQty);
      const meta = getCropMetadata(demand.cropName);

      return {
        ...demand,
        registeredQty: finalRegistered,
        cropNameHi: demand.cropNameHi || meta.hi,
        image: demand.image || meta.image,
      };
    });

    localStorage.setItem('kisan_demands', JSON.stringify(result));
    return result;
  } catch (e) {
    console.warn('Error loading unified demands:', e);
    return INITIAL_DEMANDS;
  }
};

// Broadcast an event across ports, tabs & in-memory listeners
export const broadcastSyncEvent = (type: SyncEventPayload['type'], data?: any) => {
  const payload: SyncEventPayload = {
    type,
    data,
    timestamp: Date.now(),
  };

  // 1. In-memory local subscribers (instant < 1ms update in the same window)
  inMemoryListeners.forEach((fn) => {
    try {
      fn(payload);
    } catch (e) {
      console.warn('Error invoking in-memory listener:', e);
    }
  });

  // 2. Window CustomEvent (same-document event propagation)
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('kisan_sync_event', { detail: payload }));
    } catch (e) {
      console.warn(e);
    }
  }

  // 3. BroadcastChannel (cross-tab & cross-port communication)
  const channel = getChannel();
  if (channel) {
    try {
      channel.postMessage(payload);
      channel.close();
    } catch (e) {
      console.warn(e);
    }
  }

  // 4. LocalStorage trigger for cross-tab storage listeners
  try {
    localStorage.setItem('kisan_last_sync_event', JSON.stringify(payload));
  } catch (e) {
    console.warn(e);
  }
};

// Subscribe to cross-port & in-memory events
export const subscribeToSyncEvents = (callback: (payload: SyncEventPayload) => void) => {
  if (typeof window === 'undefined') return () => {};

  // Register in-memory listener
  inMemoryListeners.add(callback);

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

  const handleCustomEvent = (event: Event) => {
    const custom = event as CustomEvent<SyncEventPayload>;
    if (custom.detail && custom.detail.type) {
      callback(custom.detail);
    }
  };

  if (channel) {
    channel.onmessage = handleMessage;
  }

  window.addEventListener('storage', handleStorage);
  window.addEventListener('kisan_sync_event', handleCustomEvent);

  return () => {
    inMemoryListeners.delete(callback);
    if (channel) channel.close();
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('kisan_sync_event', handleCustomEvent);
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

// =========================================================================
// SINGLE DATABASE REPAIR & SYNC ENGINES (COMPANY & FARMER BIDIRECTIONAL)
// =========================================================================

// Helper: Sync when a Company posts a new Demand
export const syncDemandAdded = (newDemand: any) => {
  try {
    const demandId = newDemand.id || `DEM-BUY-${Date.now().toString().slice(-4)}`;
    const cropName = getSafeCropName(newDemand);
    const demandObj = { ...newDemand, id: demandId, cropName, crop: cropName };

    // 1. Update kisan_company_demands
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = [demandObj, ...companyDemands.filter((d: any) => d.id !== demandId)];
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    // 2. Update kisan_agricore_demands
    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = [demandObj, ...agricoreDemands.filter((d: any) => d.id !== demandId)];
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    // 3. Format & Update Farmer Demands
    loadAllUnifiedFarmerDemands();

    broadcastSyncEvent('DEMAND_ADDED', demandObj);
  } catch (e) {
    console.warn('Error syncing demand added:', e);
  }
};

// Helper: Sync when a Company updates a Demand (e.g. status)
export const syncDemandUpdated = (demandId: string, updatedFields: any) => {
  try {
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.map((d: any) => (d.id === demandId ? { ...d, ...updatedFields } : d));
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = agricoreDemands.map((d: any) => (d.id === demandId ? { ...d, ...updatedFields } : d));
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    loadAllUnifiedFarmerDemands();

    broadcastSyncEvent('DEMAND_UPDATED', { id: demandId, ...updatedFields });
  } catch (e) {
    console.warn('Error syncing demand updated:', e);
  }
};

// Helper: Sync when a Company deletes a Demand
export const syncDemandDeleted = (demandId: string) => {
  try {
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.filter((d: any) => d.id !== demandId);
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = agricoreDemands.filter((d: any) => d.id !== demandId);
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    // Maintain blacklist of deleted IDs so initial demands don't re-seed
    const deletedList: string[] = JSON.parse(localStorage.getItem('kisan_deleted_demands') || '[]');
    if (!deletedList.includes(demandId)) {
      deletedList.push(demandId);
      localStorage.setItem('kisan_deleted_demands', JSON.stringify(deletedList));
    }

    const farmerDemands = JSON.parse(localStorage.getItem('kisan_demands') || '[]');
    const updatedFarmerDemands = farmerDemands.filter((d: any) => d.id !== demandId);
    localStorage.setItem('kisan_demands', JSON.stringify(updatedFarmerDemands));

    loadAllUnifiedFarmerDemands();

    broadcastSyncEvent('DEMAND_DELETED', { id: demandId });
  } catch (e) {
    console.warn('Error syncing demand deleted:', e);
  }
};

// Helper: Sync when a Farmer registers a Crop -> Updates Company Demand Load Bar
export const syncCropAdded = (newCrop: any, farmerProfileName = 'Gurdev Singh') => {
  try {
    const cropName = getSafeCropName(newCrop);
    const addedQty = Number(newCrop.quantity) || 0;

    // 1. Update Company Demands Matched Quantity & Load Bar
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === newCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const newMatched = (Number(d.matchedQuantity) || 0) + addedQty;
        const totalReq = Number(d.quantity) || 100000;
        const newStatus = newMatched >= totalReq ? 'Matched' : 'Partially Matched';
        return { ...d, matchedQuantity: newMatched, status: newStatus };
      }
      return d;
    });
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    // 2. Update AgriCore Demands Matched MT & Coverage %
    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = agricoreDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === newCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const addedMT = addedQty / 1000;
        const newMatchedMT = (Number(d.matchedMT) || 0) + addedMT;
        const reqMT = Number(d.requiredMT) || 100;
        const newCoveragePct = Math.min(100, Math.round((newMatchedMT / reqMT) * 100));
        const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : 'Partially Matched';
        return {
          ...d,
          matchedMT: newMatchedMT,
          coveragePct: newCoveragePct,
          gapMT: Math.max(0, reqMT - newMatchedMT),
          status: newStatus,
        };
      }
      return d;
    });
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    // 3. Update Farmer Demands
    loadAllUnifiedFarmerDemands();

    // 4. Auto-generate Field Agent Task
    const agentTasks = JSON.parse(localStorage.getItem('kisan_admin_tasks') || '[]');
    const taskId = `TSK-AUTO-${Date.now().toString().slice(-4)}`;
    const newTask = {
      id: taskId,
      cropName: cropName,
      farmerName: farmerProfileName,
      farmerPhone: farmerProfileName === 'Gurdev Singh' ? '+91 98765 43210' : '+91 98000 12345',
      farmerAddress: 'Village Sunam, Sangrur, Punjab',
      village: 'Village Sunam',
      quantity: addedQty,
      quantityKg: addedQty,
      unit: 'kg',
      requiredGrade: newCrop.grade || 'A',
      grade: newCrop.grade || 'A',
      pickupDate: new Date().toISOString().split('T')[0],
      priority: 1,
      status: 'Pending',
      relatedDemandId: newCrop.matchedDemandId || 'DEM-AUTO',
      assignedAgentId: 'AGT-101',
      assignedAgentName: 'Ramesh Kumar',
      notes: `Auto-generated collection task for registered produce pool (${cropName} - ${addedQty} kg)`,
    };
    localStorage.setItem('kisan_admin_tasks', JSON.stringify([newTask, ...agentTasks.filter((t: any) => t.id !== taskId)]));

    broadcastSyncEvent('CROP_ADDED', { crop: newCrop, task: newTask });
  } catch (e) {
    console.warn('Error syncing crop added:', e);
  }
};

// Helper: Sync when a Farmer updates a Crop
export const syncCropUpdated = (updatedCrop: any, previousQuantity: number) => {
  try {
    const cropName = getSafeCropName(updatedCrop);
    const delta = (Number(updatedCrop.quantity) || 0) - (Number(previousQuantity) || 0);
    if (delta === 0) return;

    // Update Company Demands
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === updatedCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const newMatched = Math.max(0, (Number(d.matchedQuantity) || 0) + delta);
        const totalReq = Number(d.quantity) || 100000;
        const newStatus = newMatched >= totalReq ? 'Matched' : newMatched > 0 ? 'Partially Matched' : 'Open';
        return { ...d, matchedQuantity: newMatched, status: newStatus };
      }
      return d;
    });
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    // Update AgriCore Demands
    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = agricoreDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === updatedCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const deltaMT = delta / 1000;
        const newMatchedMT = Math.max(0, (Number(d.matchedMT) || 0) + deltaMT);
        const reqMT = Number(d.requiredMT) || 100;
        const newCoveragePct = Math.min(100, Math.round((newMatchedMT / reqMT) * 100));
        const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : newCoveragePct > 0 ? 'Partially Matched' : 'Active (Open)';
        return {
          ...d,
          matchedMT: newMatchedMT,
          coveragePct: newCoveragePct,
          gapMT: Math.max(0, reqMT - newMatchedMT),
          status: newStatus,
        };
      }
      return d;
    });
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    loadAllUnifiedFarmerDemands();

    broadcastSyncEvent('CROP_UPDATED', { crop: updatedCrop, delta });
  } catch (e) {
    console.warn('Error syncing crop updated:', e);
  }
};

// Helper: Sync when a Farmer deletes a Crop
export const syncCropDeleted = (deletedCrop: any) => {
  try {
    const cropName = getSafeCropName(deletedCrop);
    const qty = Number(deletedCrop.quantity) || 0;

    // Update Company Demands
    const companyDemands = JSON.parse(localStorage.getItem('kisan_company_demands') || '[]');
    const updatedCompanyDemands = companyDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === deletedCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const newMatched = Math.max(0, (Number(d.matchedQuantity) || 0) - qty);
        const totalReq = Number(d.quantity) || 100000;
        const newStatus = newMatched >= totalReq ? 'Matched' : newMatched > 0 ? 'Partially Matched' : 'Open';
        return { ...d, matchedQuantity: newMatched, status: newStatus };
      }
      return d;
    });
    localStorage.setItem('kisan_company_demands', JSON.stringify(updatedCompanyDemands));

    // Update AgriCore Demands
    const agricoreDemands = JSON.parse(localStorage.getItem('kisan_agricore_demands') || '[]');
    const updatedAgricore = agricoreDemands.map((d: any) => {
      const dCrop = getSafeCropName(d);
      const isMatch = d.id === deletedCrop.matchedDemandId || isCropNameMatch(dCrop, cropName);

      if (isMatch) {
        const subMT = qty / 1000;
        const newMatchedMT = Math.max(0, (Number(d.matchedMT) || 0) - subMT);
        const reqMT = Number(d.requiredMT) || 100;
        const newCoveragePct = Math.min(100, Math.round((newMatchedMT / reqMT) * 100));
        const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : newCoveragePct > 0 ? 'Partially Matched' : 'Active (Open)';
        return {
          ...d,
          matchedMT: newMatchedMT,
          coveragePct: newCoveragePct,
          gapMT: Math.max(0, reqMT - newMatchedMT),
          status: newStatus,
        };
      }
      return d;
    });
    localStorage.setItem('kisan_agricore_demands', JSON.stringify(updatedAgricore));

    loadAllUnifiedFarmerDemands();

    broadcastSyncEvent('CROP_DELETED', { crop: deletedCrop });
  } catch (e) {
    console.warn('Error syncing crop deleted:', e);
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

// Helper: Sync when a new Farmer registers
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
      assignedAgentId: 'AGT-101',
      assignedAgentName: 'Ramesh Kumar',
      registeredDate: regDate,
      lastActivityDate: regDate,
      lastActivityTimestamp: regDate,
      crops: farmerData.crops || ['Fresh Produce'],
      bankName: farmerData.bankName || 'State Bank of India',
      accountNumberMasked: farmerData.accountNumber ? `XXXX-XXXX-${String(farmerData.accountNumber).slice(-4)}` : 'XXXX-XXXX-1234',
      totalQuantitySupplied: 0,
      totalQuantitySuppliedKg: 0,
      pastOrdersCount: 0,
      activeOrdersCount: 0,
      completedOrdersCount: 0,
      disputesCount: 0,
      paymentStatus: 'Settled',
      referralSource: 'Direct Farmer Registration',
      village: farmerData.village || 'Local Village',
      district: farmerData.district || 'Local District',
      state: farmerData.state || 'Punjab',
      registeredCropsCount: 0,
      totalSoldQuantityKg: 0,
      totalEarningsINR: 0,
      registeredDateTimestamp: regDate,
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
      executiveEmail: companyData.email || 'executive@kisanjod.in',
      registrationDate: regDate,
      lastActivityDate: regDate,
      lastActivityTimestamp: regDate,
      totalDemandsCount: 0,
      activeDemandsCount: 0,
      completedOrdersCount: 0,
      totalPurchaseValue: 0,
      totalPurchaseValueINR: 0,
      gstin: companyData.gstin || '27AAAAA0000A1Z5',
      procurementHub: companyData.procurementHub || 'Regional Hub',
      contactPerson: companyData.contactPerson || 'Authorized Representative',
      totalProcuredKg: 0,
      totalSpentINR: 0,
      registeredDateTimestamp: regDate,
    };

    const updatedCompanies = [newAdminCompany, ...adminCompanies.filter((c: any) => c.id !== companyId && c.companyId !== companyId)];
    localStorage.setItem('kisan_admin_companies_master', JSON.stringify(updatedCompanies));

    broadcastSyncEvent('COMPANY_REGISTERED', newAdminCompany);
  } catch (e) {
    console.warn('Error syncing company registered:', e);
  }
};

