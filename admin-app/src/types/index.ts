export type LanguageCode = 'en' | 'hi' | 'pa' | 'bn' | 'mr' | 'gu' | 'ta' | 'te';

export type TaskPriority = 1 | 2 | 3 | 4 | 5;

export type TaskStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'In Progress' 
  | 'Completed' 
  | 'Unable to Complete' 
  | 'Escalated';

export interface CompletionVerification {
  actualQty: number;
  collectedDate: string;
  grade: 'A' | 'B' | 'C';
  notes: string;
  farmerConfirmed: boolean;
  agentConfirmed: boolean;
}

export interface FieldAgentTask {
  id: string;
  cropName: string;
  farmerName: string;
  farmerPhone: string;
  farmerAddress: string;
  quantity: number;
  unit: string;
  requiredGrade: 'A' | 'B' | 'C';
  pickupDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedDemandId: string;
  notes: string;
  completionVerification?: CompletionVerification;
  failureReason?: string;
  rescheduledDate?: string;
}

export interface AssignedFarmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  crops: string[];
  totalCapacity: string;
  activeOrdersCount: number;
  lastInteraction: string;
  status: 'Active' | 'Pending Verification';
}

export interface StoredBatch {
  batchId: string;
  cropName: string;
  quantity: number;
  unit: string;
  dateStored: string;
}

export interface InventoryFacility {
  facilityName: string;
  facilityType: string;
  address: string;
  caretakerName: string;
  caretakerPhone: string;
  totalCapacityKg: number;
  occupiedCapacityKg: number;
  coldStorageAvailable: boolean;
  coldStorageCapacityKg: number;
  coldStorageUsedKg: number;
  storedBatches: StoredBatch[];
}

export interface LogisticsInfo {
  partnerName: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  vehicleNumber: string;
  eta: string;
}

export interface AdminOrder {
  orderId: string;
  buyerName: string;
  cropName: string;
  companyDemandQty: number;
  availableLocallyQty: number;
  confirmedQty: number;
  remainingDemandQty: number;
  grade: 'A' | 'B' | 'C';
  statusCheckboxes: {
    quantityChecked: boolean;
    qualityChecked: boolean;
    approved: boolean;
    shiftedToInventory: boolean;
    readyForDispatch: boolean;
  };
  logisticsInfo: LogisticsInfo;
}

export interface AgentRating {
  overallRating: number;
  tasksCompletedPercent: number;
  breakdown: {
    taskCompletion: number;
    onTimePerformance: number;
    dataAccuracy: number;
    farmerInteraction: number;
  };
  minimumThreshold: number;
  recentIssues: string[];
}

export interface ReferralRecord {
  id: string;
  farmerName: string;
  phone: string;
  date: string;
  status: 'Registered' | 'Pending Verification' | 'Active' | 'Reward Paid';
  rewardAmount: number;
}

export interface ReferralData {
  referralCode: string;
  totalFarmersRegistered: number;
  activeFarmers: number;
  referralEarnings: number;
  referralHistory: ReferralRecord[];
}

export interface AgentNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'normal';
}

export interface AgentProfile {
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  assignedRegion: string;
  role: string;
  joiningDate: string;
  baseSalary: number;
  referralEarnings: number;
  bonuses: number;
}

export interface ReportedIssue {
  id: string;
  issueType: string;
  relatedTaskOrOrder: string;
  description: string;
  reportedDate: string;
  status: 'Reported' | 'Under Review' | 'Resolved';
}

export type AdminNavSection = 
  | 'dashboard' 
  | 'daily-tasks' 
  | 'farmers' 
  | 'inventory' 
  | 'orders' 
  | 'dispatch' 
  | 'rating' 
  | 'referrals' 
  | 'notifications' 
  | 'task-history'
  | 'report-issue'
  | 'profile';

// ==========================================
// SUPER-ADMIN PLATFORM OPERATIONS TYPES
// ==========================================

export type SuperAdminNavSection = 
  | 'dashboard'
  | 'farmers-master'
  | 'companies-master'
  | 'field-agents-master'
  | 'orders-master'
  | 'unit-economics'
  | 'crop-availability'
  | 'price-intelligence'
  | 'ai-predictions'
  | 'total-demand'
  | 'demand-matching'
  | 'demand-forecasting'
  | 'logistics-payments'
  | 'warehouses-master'
  | 'finance-portal'
  | 'disputes-center'
  | 'risk-anomalies'
  | 'reports-analytics'
  | 'audit-log'
  | 'profile';

export interface MasterFarmer {
  id: string;
  name: string;
  phone: string;
  address: string;
  region: string;
  assignedAgentId: string;
  assignedAgentName: string;
  registeredDate: string;
  lastActivityTimestamp: string;
  crops: string[];
  pastOrdersCount: number;
  activeOrdersCount: number;
  totalQuantitySuppliedKg: number;
  bankName: string;
  accountNumberMasked: string;
  paymentStatus: 'Settled' | 'Pending Settlement' | 'Verification Required';
}

export interface MasterCompany {
  id: string;
  companyName: string;
  address: string;
  branch: string;
  email: string;
  phone: string;
  executiveHead: string;
  executiveEmail: string;
  executivePhone: string;
  registrationDate: string;
  lastActivityTimestamp: string;
  totalDemandsCount: number;
  activeDemandsCount: number;
  completedOrdersCount: number;
  totalPurchaseValueINR: number;
}

export interface MasterFieldAgent {
  id: string;
  name: string;
  region: string;
  assignedInventoryFacility: string;
  phone: string;
  email: string;
  activeTasksCount: number;
  completedTasksCount: number;
  rating: number;
  taskCompletionPercent: number;
  farmersRegisteredCount: number;
  referralEarningsINR: number;
  status: 'Active' | 'Under Review' | 'Inactive';
}

export interface CustodyCheckpoint {
  checkpointName: 'Farmer Collection' | 'Inventory Intake' | 'Logistics Pickup' | 'Company Delivery';
  timestamp: string;
  weightKg: number;
  grade: string;
  scalePhotoUrl: string;
  cropPhotoUrl: string;
  condition: string;
  actorId: string;
  actorName: string;
  verified: boolean;
}

export interface MasterOrder {
  orderId: string;
  cropName: string;
  quantityRequestedKg: number;
  confirmedQtyKg: number;
  grade: 'A' | 'B' | 'C';
  pricePerKgINR: number;
  farmerSource: string;
  fieldAgentId: string;
  fieldAgentName: string;
  inventoryFacility: string;
  logisticsPartner: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  companyName: string;
  createdDate: string;
  currentStatus: 'Demand Created' | 'Supply Matched' | 'Collection' | 'Inventory Intake' | 'Quality Check' | 'In Transit' | 'Delivered' | 'Final Settlement' | 'Completed';
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending';
  completionPercent: number;
  riskStatus: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Disputed';
  custodyCheckpoints: CustodyCheckpoint[];
  financials: {
    companyPayment: number;
    farmerPayment: number;
    fieldAgentCost: number;
    logisticsCost: number;
    storageCost: number;
    qualityHandlingCost: number;
    platformServiceFee: number;
    netMargin: number;
  };
}

export type DisputeType = 
  | 'Quantity Mismatch' 
  | 'Quality Dispute' 
  | 'Damaged Goods' 
  | 'Late Delivery' 
  | 'Payment Issue' 
  | 'Wrong Product' 
  | 'Buyer Rejection';

export interface DisputeTicket {
  disputeId: string;
  batchId: string;
  orderId: string;
  type: DisputeType;
  raisedBy: string;
  description: string;
  status: 'Open' | 'Investigating' | 'Awaiting Evidence' | 'Admin Review' | 'Resolved' | 'Escalated';
  escalationLevel: 'Level 1 (Auto)' | 'Level 2 (Admin Review)' | 'Level 3 (Pattern Review)';
  resolution?: string;
  liabilityAssignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  reviewerAdmin: string;
}

export interface RiskAlert {
  id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  entityType: 'Price' | 'Quality' | 'Inventory' | 'Logistics' | 'Referral';
  entityId: string;
  reason: string;
  evidence: string;
  createdTime: string;
  status: 'Requires Review' | 'Investigating' | 'Resolved' | 'Dismissed';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  previousValue: string;
  newValue: string;
  reason?: string;
}

export interface PlatformFinance {
  totalRevenueINR: number;
  totalExpensesINR: number;
  farmerPayoutsINR: number;
  agentCostsINR: number;
  referralPayoutsINR: number;
  logisticsCostsINR: number;
  storageCostsINR: number;
  pendingReceivablesINR: number;
  pendingPayablesINR: number;
  netMarginINR: number;
}

// ==========================================
// LOGISTICS PARTNER PORTAL TYPES
// ==========================================

export type LogisticsNavSection = 
  | 'dashboard'
  | 'pickup-requests'
  | 'active-deliveries'
  | 'delivery-history'
  | 'drivers'
  | 'vehicles'
  | 'payments'
  | 'performance'
  | 'issues'
  | 'profile';

export interface LogisticsDriver {
  id: string; // DRV-110
  name: string;
  phone: string;
  licenseNumber: string;
  availability: 'Available' | 'Assigned' | 'On Route' | 'Unavailable';
  completedDeliveries: number;
  onTimePercent: number;
  currentOrderId?: string;
}

export interface LogisticsVehicle {
  id: string; // VH-221
  registrationNumber: string; // PB-10-CZ-4921
  vehicleType: 'Small Truck (3-Ton)' | 'Medium Truck (7-Ton)' | 'Large Truck (14-Ton)' | '14-Ton Refrigerated Container';
  capacityKg: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  availability: 'Available' | 'Assigned' | 'On Route' | 'Maintenance';
}

export type DeliveryStage = 
  | 'Pickup Requested'
  | 'Accepted by Logistics'
  | 'Driver & Vehicle Assigned'
  | 'Arrived at Pickup'
  | 'Loading Complete'
  | 'Departed / In Transit'
  | 'Arrived at Destination'
  | 'Unloading'
  | 'Delivered';

export interface LogisticsShipment {
  orderId: string; // ORD-BUY-101
  batchId: string; // LOT-2026-9920
  cropName: string;
  expectedQuantityKg: number;
  actualLoadedQuantityKg?: number;
  actualDeliveredQuantityKg?: number;
  grade: 'A' | 'B' | 'C';
  pickupInventoryName: string;
  pickupAddress: string;
  destinationCompanyName: string;
  destinationAddress: string;
  scheduledPickupTime: string;
  expectedDeliveryETA: string;
  distanceKm: number;
  requiredVehicleType: string;
  estimatedLogisticsFeeINR: number;
  status: DeliveryStage;
  assignedDriver?: LogisticsDriver;
  assignedVehicle?: LogisticsVehicle;
  delayReport?: {
    reason: string;
    reportedTime: string;
    notes?: string;
  };
  proofOfDelivery?: {
    deliveredTimestamp: string;
    receiverName: string;
    deliveredQuantityKg: number;
    photoUrl: string;
    notes: string;
  };
}

export interface LogisticsPaymentRecord {
  id: string;
  orderId: string;
  deliveryDate: string;
  distanceKm: number;
  agreedChargeINR: number;
  approvedAdditionalChargesINR: number;
  totalPayableINR: number;
  status: 'Estimated' | 'Pending' | 'Processing' | 'Paid' | 'Disputed';
  paymentReference?: string;
}

export interface LogisticsPerformanceMetrics {
  onTimePickupPercent: number;
  onTimeDeliveryPercent: number;
  successfulDeliveriesCount: number;
  quantityAccuracyPercent: number;
  damageIncidentsCount: number;
  disputeRatePercent: number;
  overallScore: number; // 4.5 / 5.0
}
