export type LanguageCode = 
  | 'en' // English
  | 'hi' // Hindi
  | 'pa' // Punjabi
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'or' // Odia
  | 'as'; // Assamese

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export type Grade = 'A' | 'B' | 'C';

export interface IndustryDemand {
  id: string;
  cropName: string;
  cropNameHi?: string;
  requiredQty: number; // in kg
  registeredQty: number; // in kg
  pricePerKg: number; // in INR
  unit: string;
  buyersCount: number;
  urgent: boolean;
  category: string;
  gradeRequirement?: Grade;
  image: string;
}

export interface FarmerCrop {
  id: string;
  cropName: string;
  quantity: number; // in kg
  grade: Grade;
  harvestDate: string;
  registrationDate: string;
  matchedDemandId?: string;
  matchedDemandCrop?: string;
  offerPrice: number; // in INR/kg
  status: 'Listed' | 'Verified' | 'In Transit' | 'Sold' | 'Paid';
  stepIndex?: number; // 0: Listed, 1: Agent assigned, 2: Collected & graded, 3: In inventory, 4: Sold, 5: Paid
}

export interface WasteItem {
  id: string;
  wasteName: string;
  quantity: number; // in kg
  wasteType: 'Wet' | 'Dry';
  registrationDate: string;
  status: 'Registered' | 'Inspected' | 'Allocated' | 'Sold' | 'Paid';
  expectedPrice: number; // estimated INR per kg or lot
  buyerNote?: string;
  stepIndex?: number; // 0: Listed, 1: Agent assigned, 2: Collected & graded, 3: In inventory, 4: Sold, 5: Paid
}

export interface WomenProduct {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  description: string;
  category: string;
  image?: string;
  sellerName: string;
  dateAdded: string;
}

export interface WomenResource {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  description: string;
  status: 'Listed' | 'Buyer Contacted' | 'Assigned';
  assignedPrice?: number;
  dateAdded: string;
}

export interface PaycheckTransaction {
  id: string;
  txnId: string;
  date: string;
  cropOrProduct: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grossAmount: number;
  transportDeduction: number;
  handlingDeduction: number;
  platformCommission: number;
  finalAmountReceived: number;
  status: 'Completed' | 'Processing';
  paymentMethod: string;
  bankAccount: string;
  buyerName: string;
}

export interface FarmerProfile {
  name: string;
  photoUrl: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: LanguageCode;
  bankStatus: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  memberSince: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  type: 'demand' | 'pickup' | 'payment' | 'waste' | 'system';
  timestamp: string;
  timestampHi?: string;
  read: boolean;
  actionUrl?: NavSection;
}

export interface ComplaintTicket {
  id: string;
  category: 'Payment Issue' | 'Pickup Delay' | 'Quality Grading Dispute' | 'Agent Behavior' | 'App Issue' | 'Other';
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  submittedDate: string;
  farmerPhone: string;
}

export type NavSection = 'home' | 'crops' | 'waste' | 'women' | 'profit' | 'paycheck' | 'profile';

// ==========================================
// COMPANY PORTAL TYPES (INDUSTRIAL BUYER)
// ==========================================

export type CompanyNavSection = 
  | 'dashboard' 
  | 'demand-entry' 
  | 'fair-price' 
  | 'profit-comparison' 
  | 'incoming-quality' 
  | 'receipts' 
  | 'order-tracking' 
  | 'pay-portal'
  | 'profile';

export type DemandStatus = 'Open' | 'Partially Matched' | 'Matched' | 'Fulfilled' | 'Closed';

export type DemandCategory = 'Fresh Produce' | 'Agri Waste & Biomass';

export interface CompanyDemand {
  id: string;
  cropName: string;
  category?: DemandCategory;
  wastePurpose?: string; // For Biogas, Bio-Fertilizer, Pellet Plants
  quantity: number;
  unit: 'kg' | 'Quintal' | 'Ton';
  expectedPricePerUnit: number;
  requiredGrade: Grade;
  deliveryLocation: string;
  urgency: 'Normal' | 'High' | 'Urgent';
  matchedQuantity: number;
  status: DemandStatus;
  submittedDate: string;
}

export interface FairPriceFactors {
  cropName: string;
  grade: Grade;
  buyerDemandLevel: 'High' | 'Medium' | 'Low';
  supplyAvailability: 'High' | 'Medium' | 'Low' | 'Surplus';
  marketReferencePrice: number; // ₹/kg
  qualityScore: string;
  seasonality: string;
  priceVolatility: string;
  location: string;
  buyerExpectedPrice: number; // ₹/kg
  operationalCostEstimate: number; // ₹/kg
  riskMargin: number; // ₹/kg
  recommendedRangeMin: number; // ₹/kg
  recommendedRangeMax: number; // ₹/kg
}

export interface QualityBatch {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  grade: Grade;
  starRating: number; // 1-5
  inspectionDate: string;
  fieldAgentRef: string;
  status: 'Quality Verified' | 'In Transit' | 'Received';
  attributes: {
    size: string;
    freshness: string;
    moisture: string;
    defectPercent: string;
  };
}

export interface CompanyReceipt {
  id: string;
  invoiceId: string;
  cropName: string;
  quantity: number;
  unit: string;
  agreedUnitPrice: number;
  productCost: number;
  transportCost: number; // pass-through
  handlingCost: number;
  platformFee: number; // transparent fee line item
  totalPayable: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending';
  date: string;
}

export type OrderStageName = 'Confirmed' | 'Collected' | 'Quality Checked' | 'Dispatched' | 'In Transit' | 'Arrived';

export interface ShipmentOrder {
  id: string;
  orderId: string;
  cropName: string;
  quantity: number;
  unit: string;
  currentStage: OrderStageName;
  stages: { name: OrderStageName; date?: string; completed: boolean }[];
  logisticsPartner: string;
  driverName: string;
  vehicleType: string;
  vehicleNumber: string;
  contact: string;
  estimatedArrival: string;
}

export interface CompanyProfile {
  companyName: string;
  companyLogo: string;
  contactPerson: string;
  phone: string;
  email: string;
  registeredAddress: string;
  gstin: string;
  procurementHub: string;
  memberSince: string;
}

export interface CompanyNotification {
  id: string;
  title: string;
  message: string;
  type: 'demand' | 'shipment' | 'quality' | 'receipt' | 'waste';
  timestamp: string;
  read: boolean;
  actionSection?: CompanyNavSection;
}

export interface CompanyPaymentSubmission {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMode: 'NEFT/RTGS' | 'IMPS' | 'UPI Direct' | 'Corporate NetBanking';
  utrNumber: string;
  submittedDate: string;
  status: 'Pending Verification' | 'Confirmed & Escrow Released';
}

export interface CompanyComplaintTicket {
  id: string;
  category: 
    | 'Payment & Settlement Dispute'
    | 'Produce Quality Mismatch'
    | 'Logistics & Delivery Delay'
    | 'Field Agent Behavior'
    | 'Invoice & Tax Discrepancy'
    | 'App & Platform Technical Issue'
    | 'Other Complaint';
  orderReference?: string;
  contactPerson: string;
  phone: string;
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  submittedDate: string;
}

// ==========================================
// ADMIN PORTAL TYPES (INTERNAL OPERATIONS)
// ==========================================

export type AdminNavSection =
  | 'dashboard'
  | 'farmers'
  | 'companies'
  | 'field-agents'
  | 'orders'
  | 'inventory'
  | 'crop-availability'
  | 'demand'
  | 'price-intelligence'
  | 'ai-predictions'
  | 'logistics'
  | 'finance'
  | 'disputes'
  | 'risk'
  | 'matching'
  | 'forecasting'
  | 'reports'
  | 'profile';

export interface AdminProfile {
  adminId: string;
  name: string;
  age: number;
  role: 'Super Admin' | 'Finance Admin' | 'Operations Admin' | 'Dispute Reviewer';
  phone: string;
  email: string;
  joiningDate: string;
  aadhaarMasked: string;
  department: string;
}

export interface AdminFarmerItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  region: string;
  assignedFieldAgent: string;
  registeredDate: string;
  lastActivityDate: string;
  crops: string[];
  bankName: string;
  accountNumberMasked: string;
  totalQuantitySupplied: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  disputesCount: number;
  referralSource: string;
}

export interface AdminCompanyItem {
  id: string;
  name: string;
  branch: string;
  address: string;
  email: string;
  phone: string;
  executiveHead: string;
  executivePhone: string;
  registrationDate: string;
  lastActivityDate: string;
  totalDemandsCount: number;
  activeDemandsCount: number;
  completedOrdersCount: number;
  totalPurchaseValue: number;
}

export interface AdminFieldAgentItem {
  id: string; // Same ID used in Field Agent portal
  name: string;
  region: string;
  assignedInventory: string;
  phone: string;
  email: string;
  activeTasks: number;
  completedTasks: number;
  rating: number; // 1-5
  taskCompletionPercent: number;
  farmersRegisteredCount: number;
  referralEarnings: number;
  status: 'Active' | 'Under Review' | 'Inactive';
}

export interface WarehouseBatch {
  batchId: string;
  cropName: string;
  grade: Grade;
  quantity: number;
  unit: string;
  qualityStarRating: number;
  storageLocation: string;
  intakeDate: string;
  expiryDate?: string;
  farmerSource: string;
  fieldAgent: string;
  relatedOrderId?: string;
}

export interface WarehouseFacility {
  id: string;
  facilityName: string;
  type: 'Cold Storage' | 'Dry Grains Silo' | 'Biomass Processing Depot';
  owner: string;
  address: string;
  managerName: string;
  managerContact: string;
  capacityTon: number;
  currentUtilizationPercent: number;
  incomingStockTon: number;
  currentStockTon: number;
  reservedStockTon: number;
  availableStockTon: number;
  outgoingStockTon: number;
  batches: WarehouseBatch[];
}

export interface CheckpointEvidence {
  timestamp: string;
  weightKg: number;
  scalePhotoUrl?: string;
  cropPhotoUrl?: string;
  grade: Grade;
  gradingChecklist: string[];
  condition: string;
  actorId: string; // Farmer, Agent, Warehouse Manager, Driver
  actorName: string;
  notes?: string;
}

export interface ChainOfCustody {
  batchId: string;
  collectionPoint?: CheckpointEvidence;
  inventoryIntake?: CheckpointEvidence;
  logisticsPickup?: CheckpointEvidence;
  companyDelivery?: CheckpointEvidence;
}

export interface AdminDisputeTicket {
  id: string;
  batchId: string;
  orderId: string;
  type: 
    | 'Quantity Mismatch'
    | 'Quality Dispute'
    | 'Damaged Goods'
    | 'Late Delivery'
    | 'Payment Issue'
    | 'Wrong Product'
    | 'Buyer Rejection';
  raisedBy: string;
  raisedByRole: 'Farmer' | 'Company' | 'Field Agent' | 'Logistics Partner';
  description: string;
  escalationLevel: 'Level 1 (Auto-Resolved)' | 'Level 2 (Admin Review)' | 'Level 3 (Pattern Review)';
  status: 'Open' | 'Investigating' | 'Awaiting Evidence' | 'Admin Review' | 'Resolved' | 'Escalated';
  resolutionNote?: string;
  assignedLiability?: 'Field Agent' | 'Logistics Partner' | 'Warehouse' | 'Buyer' | 'Platform Shared';
  chainOfCustody: ChainOfCustody;
  createdDate: string;
  resolvedDate?: string;
}

export interface RiskAlert {
  id: string;
  riskScore: number; // 0-100
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  entityType: 'Farmer' | 'Company' | 'Field Agent' | 'Order' | 'Inventory' | 'Price';
  entityId: string;
  entityName: string;
  reason: string;
  evidence: string;
  createdTime: string;
  status: 'Requires Review' | 'Assigned' | 'Resolved' | 'Dismissed';
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  reason?: string;
}
