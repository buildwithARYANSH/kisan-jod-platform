import type { 
  FieldAgentTask, 
  AssignedFarmer, 
  InventoryFacility, 
  AdminOrder, 
  AgentRating, 
  ReferralData, 
  AgentNotification, 
  AgentProfile, 
  ReportedIssue 
} from '../types';

export const INITIAL_AGENT_PROFILE: AgentProfile = {
  employeeId: 'AGT-101',
  name: 'Ramesh Kumar',
  phone: '+91 98100 11223',
  email: 'ramesh.agent@kisanjod.in',
  address: 'H.No 14, Focal Point Road, Ludhiana, Punjab',
  assignedRegion: 'Ludhiana Central Agri Cluster (Zone 4)',
  role: 'Senior Field Agent / Procurement Officer',
  joiningDate: '15 March 2024',
  baseSalary: 28000,
  referralEarnings: 500,
  bonuses: 1500,
};

export const INITIAL_TASKS: FieldAgentTask[] = [
  {
    id: 'TSK-101',
    cropName: 'Tomato',
    farmerName: 'Gurdev Singh',
    farmerPhone: '+91 98765 43210',
    farmerAddress: 'Village Sunam, District Sangrur, Punjab',
    quantity: 50000,
    unit: 'kg',
    requiredGrade: 'A',
    pickupDate: '2026-08-28',
    priority: 1,
    status: 'In Progress',
    relatedDemandId: 'DEM-BUY-101',
    notes: 'Verify moisture levels and size (>60mm). Certified weighbridge scale required.',
  },
];

export const INITIAL_ASSIGNED_FARMERS: AssignedFarmer[] = [
  {
    id: 'FAR-1001',
    name: 'Gurdev Singh',
    phone: '+91 98765 43210',
    village: 'Village Sunam',
    district: 'Sangrur',
    crops: ['Tomato', 'Parali Crop Stubble'],
    totalCapacity: '65,000 kg/season',
    activeOrdersCount: 1,
    lastInteraction: 'Today 10:30 AM',
    status: 'Active',
  },
];

export const INITIAL_INVENTORY_FACILITY: InventoryFacility = {
  facilityName: 'Punjab Central Grain & Cold Silo - Hub A',
  facilityType: 'Government Approved Multi-Crop & Cold Storage',
  address: 'GT Road Focal Point, Ludhiana, Punjab',
  caretakerName: 'Baldev Singh',
  caretakerPhone: '+91 98144 55667',
  totalCapacityKg: 5000000,
  occupiedCapacityKg: 2000000,
  coldStorageAvailable: true,
  coldStorageCapacityKg: 1000000,
  coldStorageUsedKg: 500000,
  storedBatches: [
    {
      batchId: 'LOT-2026-9920',
      cropName: 'Tomato (Grade A Bulk)',
      quantity: 50000,
      unit: 'kg',
      dateStored: '2026-08-19',
    },
  ],
};

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    orderId: 'ORD-BUY-101',
    buyerName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    cropName: 'Tomato (Grade A)',
    companyDemandQty: 100000,
    availableLocallyQty: 50000,
    confirmedQty: 50000,
    remainingDemandQty: 50000,
    grade: 'A',
    statusCheckboxes: {
      quantityChecked: true,
      qualityChecked: true,
      approved: true,
      shiftedToInventory: true,
      readyForDispatch: true,
    },
    logisticsInfo: {
      partnerName: 'Express Agri Transport Ltd',
      driverName: 'Rajesh Kumar',
      driverPhone: '+91 98721 99881',
      vehicleType: 'Container Truck (15-Ton Multi-axle)',
      vehicleNumber: 'PB-10-CZ-4491',
      eta: 'Today by 8:30 PM',
    },
  },
];

export const INITIAL_RATING: AgentRating = {
  overallRating: 4.8,
  tasksCompletedPercent: 98,
  breakdown: {
    taskCompletion: 4.9,
    onTimePerformance: 4.7,
    dataAccuracy: 4.8,
    farmerInteraction: 4.9,
  },
  minimumThreshold: 2.0,
  recentIssues: [
    'Intake weighbridge scale calibration verified on 2026-08-20.',
  ],
};

export const INITIAL_REFERRALS: ReferralData = {
  referralCode: 'AGT-101',
  totalFarmersRegistered: 1,
  activeFarmers: 1,
  referralEarnings: 500,
  referralHistory: [
    {
      id: 'REF-101',
      farmerName: 'Gurdev Singh',
      phone: '+91 98765 43210',
      date: '2026-02-10',
      status: 'Reward Paid',
      rewardAmount: 500,
    },
  ],
};

export const INITIAL_NOTIFICATIONS: AgentNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'High Priority Task Assigned',
    message: 'New Priority 1 Tomato Collection assigned for Gurdev Singh (50,000 kg).',
    timestamp: '10 mins ago',
    read: false,
    priority: 'high',
  },
];

export const INITIAL_REPORTED_ISSUES: ReportedIssue[] = [
  {
    id: 'ISS-401',
    issueType: 'Quantity Verification',
    relatedTaskOrOrder: 'Task #TSK-101 (Gurdev Singh)',
    description: 'Weighbridge intake scale verification check completed.',
    reportedDate: '2026-08-20',
    status: 'Resolved',
  },
];
