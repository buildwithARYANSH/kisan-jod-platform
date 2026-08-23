import type { 
  CompanyDemand, 
  FairPriceFactors, 
  QualityBatch, 
  CompanyReceipt, 
  ShipmentOrder, 
  CompanyProfile,
  CompanyNotification
} from '../types';

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  companyName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
  companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
  contactPerson: 'Vikram Malhotra (Head of Procurement)',
  phone: '+91 98112 34567',
  email: 'procurement@freshagro.co.in',
  registeredAddress: 'Plot 42, Focal Point Industrial Zone, Ludhiana, Punjab - 141010',
  gstin: '03AABCF1234H1Z5',
  procurementHub: 'North India Central Agri Hub',
  memberSince: 'January 2025',
};

export const INITIAL_COMPANY_DEMANDS: CompanyDemand[] = [
  {
    id: 'DEM-BUY-101',
    cropName: 'Tomato',
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

export const MOCK_FAIR_PRICING: Record<string, FairPriceFactors> = {
  Tomato: {
    cropName: 'Tomato',
    grade: 'A',
    buyerDemandLevel: 'High',
    supplyAvailability: 'Medium',
    marketReferencePrice: 18.20,
    qualityScore: 'Grade A (Large Size, Low Moisture Defect)',
    seasonality: 'Peak Harvest Season',
    priceVolatility: 'Low',
    location: 'Ludhiana Procurement Hub',
    buyerExpectedPrice: 18.00,
    operationalCostEstimate: 1.50,
    riskMargin: 0.50,
    recommendedRangeMin: 17.50,
    recommendedRangeMax: 19.00,
  },
};

export const INITIAL_QUALITY_BATCHES: QualityBatch[] = [
  {
    id: 'LOT-2026-9920',
    cropName: 'Tomato (Grade A Bulk)',
    quantity: 50000,
    unit: 'kg',
    grade: 'A',
    starRating: 4.8,
    inspectionDate: '2026-08-19',
    fieldAgentRef: 'Field Agent AGT-101 (Ramesh Kumar - Ludhiana Zone)',
    status: 'In Transit',
    attributes: {
      size: 'Grade A Large (>60mm diameter)',
      freshness: '96% Harvest Freshness Index',
      moisture: '8.2% Optimal Content',
      defectPercent: '1.4% (Below 3% Rejection Limit)',
    },
  },
];

export const INITIAL_COMPANY_RECEIPTS: CompanyReceipt[] = [
  {
    id: 'REC-BUY-8841',
    invoiceId: 'INV-2026-0819-99',
    cropName: 'Tomato (Grade A Industrial Batch)',
    quantity: 50000,
    unit: 'kg',
    agreedUnitPrice: 18,
    productCost: 900000,
    transportCost: 25000,
    handlingCost: 12500,
    platformFee: 22500,
    totalPayable: 960000,
    advancePaid: 480000,
    balanceDue: 480000,
    paymentStatus: 'Advance Paid',
    date: '2026-08-19',
  },
];

export const INITIAL_SHIPMENT_ORDERS: ShipmentOrder[] = [
  {
    id: 'ORD-7740',
    orderId: 'ORD-2026-0819-01',
    cropName: 'Tomato (Grade A Bulk)',
    quantity: 50000,
    unit: 'kg',
    currentStage: 'In Transit',
    stages: [
      { name: 'Confirmed', date: '2026-08-15', completed: true },
      { name: 'Collected', date: '2026-08-17', completed: true },
      { name: 'Quality Checked', date: '2026-08-19', completed: true },
      { name: 'Dispatched', date: '2026-08-19', completed: true },
      { name: 'In Transit', date: '2026-08-20 (Current)', completed: true },
      { name: 'Arrived', completed: false },
    ],
    logisticsPartner: 'Express Agri Transport Ltd',
    driverName: 'Rajesh Kumar',
    vehicleType: 'Container Truck (15-Ton Multi-axle)',
    vehicleNumber: 'PB-10-CZ-4491',
    contact: '+91 98721 99881',
    estimatedArrival: 'Today by 8:30 PM',
  },
];

export const INITIAL_COMPANY_NOTIFICATIONS: CompanyNotification[] = [
  {
    id: 'CNOT-101',
    title: '🛒 Supply Matched: 50,000 kg Tomato',
    message: 'Farmer supply pool matched 50,000 kg Grade A Tomato at ₹18/kg from Gurdev Singh.',
    type: 'demand',
    timestamp: '15 mins ago',
    read: false,
    actionSection: 'demand-entry',
  },
];

export const COMPANY_BANK_ESCROW_DETAILS = {
  bankName: 'HDFC Bank Ltd.',
  accountName: 'Kisan Jod B2B Procurement Escrow Account',
  accountNumber: '50200098765432',
  ifscCode: 'HDFC0000123',
  branch: 'Ludhiana Main Industrial Hub Branch',
  upiId: 'kisanjod.escrow@hdfcbank',
  swiftCode: 'HDFCINBBXXX',
};
