import type { 
  LogisticsDriver, 
  LogisticsVehicle, 
  LogisticsShipment, 
  LogisticsPaymentRecord, 
  LogisticsPerformanceMetrics 
} from '../types';

export const INITIAL_LOGISTICS_DRIVERS: LogisticsDriver[] = [
  {
    id: 'DRV-101',
    name: 'Rajesh Kumar',
    phone: '+91 98721 99881',
    licenseNumber: 'PB-10-2021-00921',
    availability: 'Assigned',
    completedDeliveries: 142,
    onTimePercent: 98,
    currentOrderId: 'ORD-BUY-101',
  },
];

export const INITIAL_LOGISTICS_VEHICLES: LogisticsVehicle[] = [
  {
    id: 'VH-221',
    registrationNumber: 'PB-10-CZ-4491',
    vehicleType: '15-Ton Refrigerated Container',
    capacityKg: 15000,
    assignedDriverId: 'DRV-101',
    assignedDriverName: 'Rajesh Kumar',
    availability: 'Assigned',
  },
];

export const INITIAL_LOGISTICS_SHIPMENTS: LogisticsShipment[] = [
  {
    orderId: 'ORD-BUY-101',
    batchId: 'LOT-2026-9920',
    cropName: 'Tomato (Grade A Bulk)',
    expectedQuantityKg: 50000,
    actualLoadedQuantityKg: 50000,
    grade: 'A',
    pickupInventoryName: 'Punjab Central Grain & Cold Silo',
    pickupAddress: 'G.T. Road, Near Focal Point, Ludhiana, Punjab - 141010',
    destinationCompanyName: 'FreshAgro Foods & Bio-Processing Pvt Ltd',
    destinationAddress: 'Plot 42, Focal Point Industrial Zone, Ludhiana, Punjab - 141010',
    scheduledPickupTime: '2026-08-19 02:00 PM',
    expectedDeliveryETA: '2026-08-20 08:30 PM',
    distanceKm: 18,
    requiredVehicleType: '15-Ton Refrigerated Container',
    estimatedLogisticsFeeINR: 4000,
    status: 'Departed / In Transit',
    assignedDriver: INITIAL_LOGISTICS_DRIVERS[0],
    assignedVehicle: INITIAL_LOGISTICS_VEHICLES[0],
  },
];

export const INITIAL_LOGISTICS_PAYMENTS: LogisticsPaymentRecord[] = [
  {
    id: 'PAY-LOG-901',
    orderId: 'ORD-BUY-101',
    deliveryDate: '2026-08-20',
    distanceKm: 18,
    agreedChargeINR: 4000,
    approvedAdditionalChargesINR: 0,
    totalPayableINR: 4000,
    status: 'Processing',
    paymentReference: 'ESC-LOG-2026-881',
  },
];

export const INITIAL_LOGISTICS_PERFORMANCE: LogisticsPerformanceMetrics = {
  onTimePickupPercent: 98,
  onTimeDeliveryPercent: 98,
  successfulDeliveriesCount: 142,
  quantityAccuracyPercent: 99.5,
  damageIncidentsCount: 0,
  disputeRatePercent: 0.0,
  overallScore: 4.8,
};
