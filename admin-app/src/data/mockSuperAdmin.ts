import type { 
  MasterFarmer, 
  MasterCompany, 
  MasterFieldAgent, 
  MasterOrder, 
  DisputeTicket, 
  RiskAlert, 
  AuditLogEntry, 
  PlatformFinance 
} from '../types';

export const INITIAL_MASTER_FARMERS: MasterFarmer[] = [
  {
    id: 'FAR-00821',
    name: 'Gurdev Singh',
    phone: '+91 98765 43210',
    address: 'Village Sunam, Sangrur, Punjab',
    region: 'Ludhiana Central Cluster',
    assignedAgentId: 'FA-10234',
    assignedAgentName: 'Ramesh Kumar',
    registeredDate: '2025-02-10',
    lastActivityTimestamp: '2026-08-22',
    crops: ['Tomato (Grade A)', 'Parali Crop Stubble'],
    pastOrdersCount: 5,
    activeOrdersCount: 1,
    totalQuantitySuppliedKg: 65000,
    bankName: 'State Bank of India (Sunam Branch)',
    accountNumberMasked: 'XXXX-XXXX-4921',
    paymentStatus: 'Settled',
  },
];

export const INITIAL_MASTER_COMPANIES: MasterCompany[] = [
  {
    id: 'COM-00102',
    companyName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    address: 'Plot 42, Focal Point Industrial Zone, Ludhiana, Punjab - 141010',
    branch: 'North India Central Processing Hub',
    email: 'procurement@freshagro.co.in',
    phone: '+91 98112 34567',
    executiveHead: 'Vikram Malhotra (Head of Procurement)',
    executiveEmail: 'vikram.m@freshagro.co.in',
    executivePhone: '+91 98112 34568',
    registrationDate: '2025-01-05',
    lastActivityTimestamp: '2026-08-22',
    totalDemandsCount: 1,
    activeDemandsCount: 1,
    completedOrdersCount: 3,
    totalPurchaseValueINR: 960000,
  },
];

export const INITIAL_MASTER_FIELD_AGENTS: MasterFieldAgent[] = [
  {
    id: 'FA-10234',
    name: 'Ramesh Kumar',
    region: 'Ludhiana Central Agri Cluster (Zone 4)',
    assignedInventoryFacility: 'Punjab Central Grain & Cold Silo',
    phone: '+91 98100 11223',
    email: 'ramesh.agent@kisanjod.in',
    activeTasksCount: 1,
    completedTasksCount: 48,
    rating: 4.8,
    taskCompletionPercent: 98,
    farmersRegisteredCount: 1,
    referralEarningsINR: 500,
    status: 'Active',
  },
];

export const INITIAL_MASTER_ORDERS: MasterOrder[] = [
  {
    orderId: 'ORD-BUY-101',
    cropName: 'Tomato (Grade A Bulk)',
    quantityRequestedKg: 100000,
    confirmedQtyKg: 50000,
    grade: 'A',
    pricePerKgINR: 18.00,
    farmerSource: 'Gurdev Singh (Sunam Pool)',
    fieldAgentId: 'FA-10234',
    fieldAgentName: 'Ramesh Kumar',
    inventoryFacility: 'Punjab Central Grain & Cold Silo',
    logisticsPartner: 'Express Agri Transport Ltd',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98721 99881',
    vehicleNumber: 'PB-10-CZ-4491',
    companyName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    createdDate: '2026-08-15',
    currentStatus: 'In Transit',
    paymentStatus: 'Advance Paid',
    completionPercent: 80,
    riskStatus: 'Low Risk',
    custodyCheckpoints: [
      {
        checkpointName: 'Farmer Collection',
        timestamp: '2026-08-17 09:30 AM',
        weightKg: 50000,
        grade: 'Grade A',
        scalePhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        cropPhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        condition: 'Fresh, 8.2% moisture, low defect',
        actorId: 'FA-10234',
        actorName: 'Ramesh Kumar (Field Agent)',
        verified: true,
      },
      {
        checkpointName: 'Inventory Intake',
        timestamp: '2026-08-18 11:15 AM',
        weightKg: 50000,
        grade: 'Grade A',
        scalePhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        cropPhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        condition: 'Cold Bay C-04 Intake Verified',
        actorId: 'INV-402',
        actorName: 'Baldev Singh (Warehouse Manager)',
        verified: true,
      },
      {
        checkpointName: 'Logistics Pickup',
        timestamp: '2026-08-19 02:00 PM',
        weightKg: 50000,
        grade: 'Grade A',
        scalePhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        cropPhotoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
        condition: 'Loaded onto Container Truck #PB-10-CZ-4491',
        actorId: 'DRV-101',
        actorName: 'Rajesh Kumar (Driver)',
        verified: true,
      },
    ],
    financials: {
      companyPayment: 960000,
      farmerPayment: 840000,
      fieldAgentCost: 25000,
      logisticsCost: 4000,
      storageCost: 1500,
      qualityHandlingCost: 1000,
      platformServiceFee: 22500,
      netMargin: 66000,
    },
  },
];

export const INITIAL_DISPUTES: DisputeTicket[] = [
  {
    disputeId: 'DSP-9901',
    batchId: 'LOT-2026-9920',
    orderId: 'ORD-BUY-101',
    type: 'Quantity Mismatch',
    raisedBy: 'FreshAgro Foods Receiving Bay',
    description: 'Minor scale calibration verification check.',
    status: 'Resolved',
    escalationLevel: 'Level 1 (Auto-Resolved)',
    createdAt: '2026-08-19',
    reviewerAdmin: 'Super-Admin Operations',
  },
];

export const INITIAL_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'RSK-301',
    severity: 'Low',
    title: 'Normal Operation Check',
    entityType: 'Price',
    entityId: 'Tomato Grade A',
    reason: 'Platform price ₹18.00/kg aligned with market benchmark.',
    evidence: 'Mandi reference ₹18.20/kg',
    createdTime: '1 hour ago',
    status: 'Resolved',
  },
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'AUD-8801',
    timestamp: '2026-08-22 19:00:00',
    actor: 'Super-Admin',
    action: 'Single-Entity Database Alignment Executed',
    entity: 'Platform Master Schema',
    previousValue: 'Multi-Tenant Sample Data',
    newValue: '1 Farmer, 1 Company, 1 Agent, 1 Logistics Carrier',
    reason: 'Strict Single Entity Reset order.',
  },
];

export const INITIAL_PLATFORM_FINANCE: PlatformFinance = {
  totalRevenueINR: 960000,
  totalExpensesINR: 894000,
  farmerPayoutsINR: 840000,
  agentCostsINR: 25000,
  referralPayoutsINR: 500,
  logisticsCostsINR: 4000,
  storageCostsINR: 1500,
  pendingReceivablesINR: 480000,
  pendingPayablesINR: 0,
  netMarginINR: 66000,
};
