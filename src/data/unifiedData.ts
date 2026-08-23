import type { 
  IndustryDemand, 
  FarmerCrop, 
  WasteItem, 
  WomenProduct, 
  WomenResource, 
  PaycheckTransaction, 
  FarmerProfile,
  CompanyDemand,
  FairPriceFactors,
  QualityBatch,
  CompanyReceipt,
  ShipmentOrder,
  CompanyProfile,
  AdminProfile,
  AdminFarmerItem,
  AdminCompanyItem,
  AdminFieldAgentItem,
  WarehouseFacility,
  AdminDisputeTicket,
  RiskAlert,
  AuditLogItem
} from '../types';

// ==========================================
// 1. UNIFIED FARMER DATA (1 Farmer)
// ==========================================
export const UNIFIED_FARMER_PROFILE: FarmerProfile = {
  name: 'Gurdev Singh',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  phone: '+91 98765 43210',
  village: 'Village Sunam',
  district: 'Sangrur',
  state: 'Punjab',
  preferredLanguage: 'hi',
  bankStatus: 'Verified (DBT Linked)',
  bankName: 'State Bank of India',
  accountNumber: 'XXXX-XXXX-4921',
  ifscCode: 'SBIN0001234',
  accountType: 'Savings Account',
  memberSince: 'February 2025',
};

export const UNIFIED_FARMER_CROPS: FarmerCrop[] = [
  {
    id: 'CROP-101',
    cropName: 'Tomato',
    quantity: 50000,
    grade: 'A',
    harvestDate: '2026-08-28',
    registrationDate: '2026-08-15',
    matchedDemandId: 'DEM-BUY-101',
    matchedDemandCrop: 'Tomato (FreshAgro Foods Pool)',
    offerPrice: 18,
    status: 'Verified',
    stepIndex: 2,
  },
];

export const UNIFIED_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'WST-201',
    wasteName: 'Parali Crop Stubble',
    quantity: 15000,
    wasteType: 'Dry',
    registrationDate: '2026-08-10',
    status: 'Allocated',
    expectedPrice: 2.50,
    buyerNote: 'Allocated to GreenEarth BioEnergy Plant #1',
    stepIndex: 2,
  },
];

// ==========================================
// 2. UNIFIED COMPANY DEMANDS (1 Company)
// ==========================================
export const UNIFIED_COMPANY_DEMANDS: CompanyDemand[] = [
  {
    id: 'DEM-BUY-101',
    cropName: 'Tomato',
    category: 'Fresh Produce',
    quantity: 100000,
    unit: 'kg',
    expectedPricePerUnit: 18,
    requiredGrade: 'A',
    deliveryLocation: 'Ludhiana Food Processing Plant #2',
    urgency: 'Urgent',
    matchedQuantity: 50000,
    status: 'Partially Matched',
    submittedDate: '2026-08-15',
  },
];

// ==========================================
// 3. UNIFIED ADMIN FARMERS DIRECTORY (1 Farmer)
// ==========================================
export const UNIFIED_ADMIN_FARMERS: AdminFarmerItem[] = [
  {
    id: 'FAR-1001',
    name: 'Gurdev Singh',
    phone: '+91 98765 43210',
    address: 'Village Sunam, Sangrur District',
    region: 'Ludhiana Hub Region',
    assignedFieldAgent: 'AGT-101 (Ramesh Kumar)',
    registeredDate: '2026-02-10',
    lastActivityDate: '2026-08-22',
    crops: ['Tomato', 'Parali Crop Stubble'],
    bankName: 'State Bank of India',
    accountNumberMasked: 'XXXX-XXXX-4921',
    totalQuantitySupplied: 65000,
    activeOrdersCount: 1,
    completedOrdersCount: 5,
    disputesCount: 0,
    referralSource: 'Direct Agent Onboarding',
  },
];

// ==========================================
// 4. UNIFIED FIELD AGENTS (1 Agent)
// ==========================================
export const UNIFIED_FIELD_AGENTS: AdminFieldAgentItem[] = [
  {
    id: 'AGT-101',
    name: 'Ramesh Kumar',
    region: 'Ludhiana Hub Region',
    assignedInventory: 'Punjab Central Grain & Cold Silo',
    phone: '+91 98100 11223',
    email: 'ramesh.agent@kisanjod.in',
    activeTasks: 1,
    completedTasks: 48,
    rating: 4.8,
    taskCompletionPercent: 98,
    farmersRegisteredCount: 1,
    referralEarnings: 500,
    status: 'Active',
  },
];
