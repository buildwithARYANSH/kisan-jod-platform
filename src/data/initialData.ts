import type { IndustryDemand, FarmerCrop, WasteItem, WomenProduct, WomenResource, PaycheckTransaction, FarmerProfile, NotificationItem, ComplaintTicket } from '../types';

export const INITIAL_DEMANDS: IndustryDemand[] = [
  {
    id: 'DEM-001',
    cropName: 'Tomato',
    cropNameHi: 'टमाटर',
    requiredQty: 100000,
    registeredQty: 50000,
    pricePerKg: 18,
    unit: 'kg',
    buyersCount: 1,
    urgent: true,
    category: 'Vegetables',
    gradeRequirement: 'A',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_CROPS: FarmerCrop[] = [
  {
    id: 'CROP-101',
    cropName: 'Tomato',
    quantity: 50000,
    grade: 'A',
    harvestDate: '2026-08-28',
    registrationDate: '2026-08-15',
    matchedDemandId: 'DEM-001',
    matchedDemandCrop: 'Tomato (FreshAgro Foods Pool)',
    offerPrice: 18,
    status: 'Verified',
    stepIndex: 2,
  },
];

export const INITIAL_WASTE: WasteItem[] = [
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

export const INITIAL_WOMEN_PRODUCTS: WomenProduct[] = [
  {
    id: 'WOM-P-301',
    productName: 'Homemade Organic Mango Pickle (5 kg Jars)',
    quantity: 40,
    unit: 'jars',
    expectedPrice: 450,
    description: 'Traditional Punjabi style wood-pressed mustard oil mango pickle.',
    category: 'Processed Food',
    sellerName: 'Sunita Devi (Self Help Group)',
    dateAdded: '2026-08-14',
    image: 'https://images.unsplash.com/photo-1589135398307-775c754d924d?w=400&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_WOMEN_RESOURCES: WomenResource[] = [
  {
    id: 'WOM-R-401',
    itemName: 'Organic Dried Cow Dung Cakes (Upla)',
    quantity: 1500,
    unit: 'pcs',
    description: 'Dried bio-energy fuel cakes ready for bio-fertilizer or energy buyers.',
    status: 'Buyer Contacted',
    assignedPrice: 5,
    dateAdded: '2026-08-11',
  },
];

export const INITIAL_PAYCHECKS: PaycheckTransaction[] = [
  {
    id: 'PAY-501',
    txnId: 'TXN-2026-0814-8891',
    date: '2026-08-14',
    cropOrProduct: 'Tomato (Grade A Bulk)',
    quantity: 50000,
    unit: 'kg',
    pricePerUnit: 18,
    grossAmount: 900000,
    transportDeduction: 25000,
    handlingDeduction: 12500,
    platformCommission: 22500,
    finalAmountReceived: 840000,
    status: 'Completed',
    paymentMethod: 'Direct NEFT Bank Transfer',
    bankAccount: 'State Bank of India (A/c *****4921)',
    buyerName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
  },
];

export const INITIAL_PROFILE: FarmerProfile = {
  name: 'Gurdev Singh',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  phone: '+91 98765 43210',
  village: 'Village Sunam',
  district: 'Sangrur',
  state: 'Punjab',
  preferredLanguage: 'hi',
  bankStatus: 'Verified (DBT Linked)',
  bankName: 'State Bank of India',
  accountNumber: '**** **** 4921',
  ifscCode: 'SBIN0001234',
  accountType: 'Savings Account',
  memberSince: 'February 2025',
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-101',
    title: '🛒 Urgent Tomato Demand Surge',
    message: 'Industrial buyer FreshAgro increased Tomato requirement to 100,000 kg at ₹18/kg. Register your crop now!',
    type: 'demand',
    timestamp: '10 mins ago',
    read: false,
    actionUrl: 'crops',
  },
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'CMP-2026-9812',
    category: 'Payment Issue',
    description: 'Minor delay in receiving digital receipt for Tomato transaction TXN-2026-0814-8891.',
    status: 'Resolved',
    submittedDate: '2026-08-05',
    farmerPhone: '+91 98765 43210',
  },
];
