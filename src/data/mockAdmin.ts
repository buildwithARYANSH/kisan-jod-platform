import type { 
  AdminProfile, 
  AdminFarmerItem, 
  AdminCompanyItem, 
  AdminFieldAgentItem, 
  WarehouseFacility, 
  AdminDisputeTicket, 
  RiskAlert, 
  AuditLogItem 
} from '../types';

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  adminId: 'ADM-2026-001',
  name: 'Vikramaditya Sharma',
  age: 42,
  role: 'Super Admin',
  phone: '+91 98765 00100',
  email: 'admin.operations@kisanjod.gov.in',
  joiningDate: '2025-01-15',
  aadhaarMasked: 'XXXX-XXXX-8821',
  department: 'Platform Operations & Financial Governance',
};

export const INITIAL_ADMIN_FARMERS: AdminFarmerItem[] = [
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

export const INITIAL_ADMIN_COMPANIES: AdminCompanyItem[] = [
  {
    id: 'COMP-7701',
    name: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    branch: 'North India Regional Hub',
    address: 'Focal Point Industrial Zone, Ludhiana, Punjab',
    email: 'procurement@freshagro.co.in',
    phone: '+91 98112 34567',
    executiveHead: 'Vikram Malhotra (VP Procurement)',
    executivePhone: '+91 98112 34567',
    registrationDate: '2026-01-20',
    lastActivityDate: '2026-08-22',
    totalDemandsCount: 1,
    activeDemandsCount: 1,
    completedOrdersCount: 3,
    totalPurchaseValue: 1800000,
  },
];

export const INITIAL_ADMIN_FIELD_AGENTS: AdminFieldAgentItem[] = [
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

export const INITIAL_WAREHOUSES: WarehouseFacility[] = [
  {
    id: 'WH-01',
    facilityName: 'Punjab Central Grain & Cold Silo - Hub A',
    type: 'Cold Storage',
    owner: 'Kisan Jod Infrastructure Trust',
    address: 'GT Road Focal Point, Ludhiana, Punjab',
    managerName: 'Baldev Singh',
    managerContact: '+91 98144 55667',
    capacityTon: 5000,
    currentUtilizationPercent: 40,
    incomingStockTon: 50,
    currentStockTon: 2000,
    reservedStockTon: 500,
    availableStockTon: 1500,
    outgoingStockTon: 50,
    batches: [
      {
        batchId: 'LOT-2026-9920',
        cropName: 'Tomato',
        grade: 'A',
        quantity: 50000,
        unit: 'kg',
        qualityStarRating: 4.8,
        storageLocation: 'Cold Bay C-04',
        intakeDate: '2026-08-19',
        expiryDate: '2026-09-02',
        farmerSource: 'Gurdev Singh (FAR-1001)',
        fieldAgent: 'Ramesh Kumar (AGT-101)',
        relatedOrderId: 'ORD-2026-0819-01',
      },
    ],
  },
];

export const INITIAL_DISPUTES: AdminDisputeTicket[] = [
  {
    id: 'DISP-2026-001',
    batchId: 'LOT-2026-9920',
    orderId: 'ORD-2026-0819-01',
    type: 'Quantity Mismatch',
    raisedBy: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    raisedByRole: 'Company',
    description: 'Minor intake weight verification check at Ludhiana Processing Plant #2.',
    escalationLevel: 'Level 1 (Auto-Resolved)',
    status: 'Resolved',
    chainOfCustody: {
      batchId: 'LOT-2026-9920',
      collectionPoint: {
        timestamp: '2026-08-18 09:30 AM',
        weightKg: 50000,
        grade: 'A',
        gradingChecklist: ['Moisture 8.2%', 'Defect Rate 1.4%'],
        condition: 'Intact & Weighed on Certified Scale',
        actorId: 'AGT-101',
        actorName: 'Ramesh Kumar (Field Agent)',
      },
      inventoryIntake: {
        timestamp: '2026-08-18 03:15 PM',
        weightKg: 50000,
        grade: 'A',
        gradingChecklist: ['Moisture 8.2%'],
        condition: 'Stored in Cold Bay C-04',
        actorId: 'WH-MGR-01',
        actorName: 'Baldev Singh (Warehouse Manager)',
      },
      logisticsPickup: {
        timestamp: '2026-08-19 08:00 AM',
        weightKg: 50000,
        grade: 'A',
        gradingChecklist: ['Loaded on Container Truck PB-10-CZ-4491'],
        condition: 'Sealed Container',
        actorId: 'DRV-101',
        actorName: 'Rajesh Kumar (Driver)',
      },
      companyDelivery: {
        timestamp: '2026-08-20 11:30 AM',
        weightKg: 50000,
        grade: 'A',
        gradingChecklist: ['Unloaded at Ludhiana Dock #2'],
        condition: 'Intact Delivery Verified',
        actorId: 'COMP-7701',
        actorName: 'Vikram Malhotra (Buyer Manager)',
      },
    },
    createdDate: '2026-08-20',
  },
];

export const INITIAL_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'RISK-901',
    riskScore: 35,
    severity: 'Low',
    entityType: 'Price',
    entityId: 'CROP-TOMATO',
    entityName: 'Tomato Price Alignment Check',
    reason: 'Normal regional Mandi benchmark verification.',
    evidence: 'Platform price ₹18/kg aligned with market range ₹17.50 - ₹19.00.',
    createdTime: '1 hour ago',
    status: 'Resolved',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUDIT-501',
    actor: 'Vikramaditya Sharma (Super Admin)',
    action: 'Verified Single Entity Database Reset',
    entity: 'Platform Master Schema',
    previousValue: 'Multi-Tenant Sample Data',
    newValue: '1 Farmer, 1 Company, 1 Agent, 1 Logistics Carrier',
    timestamp: '2026-08-22 07:00 PM',
    reason: 'Executed strict Single-Entity Database alignment order.',
  },
];
