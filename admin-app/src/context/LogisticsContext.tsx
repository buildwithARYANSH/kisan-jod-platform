import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  LogisticsNavSection, 
  LogisticsDriver, 
  LogisticsVehicle, 
  LogisticsShipment, 
  LogisticsPaymentRecord, 
  LogisticsPerformanceMetrics, 
  DeliveryStage 
} from '../types';
import { 
  INITIAL_LOGISTICS_DRIVERS, 
  INITIAL_LOGISTICS_VEHICLES, 
  INITIAL_LOGISTICS_SHIPMENTS, 
  INITIAL_LOGISTICS_PAYMENTS, 
  INITIAL_LOGISTICS_PERFORMANCE 
} from '../data/mockLogistics';

interface LogisticsContextType {
  activeSection: LogisticsNavSection;
  setActiveSection: (sec: LogisticsNavSection) => void;

  drivers: LogisticsDriver[];
  addDriver: (driver: Omit<LogisticsDriver, 'id' | 'completedDeliveries' | 'onTimePercent'>) => void;

  vehicles: LogisticsVehicle[];
  addVehicle: (vehicle: Omit<LogisticsVehicle, 'id'>) => void;

  shipments: LogisticsShipment[];
  selectedShipment: LogisticsShipment | null;
  setSelectedShipment: (shipment: LogisticsShipment | null) => void;

  // Workflow Actions
  acceptPickupRequest: (orderId: string) => void;
  rejectPickupRequest: (orderId: string, reason: string) => void;
  assignDriverAndVehicle: (orderId: string, driverId: string, vehicleId: string) => { success: boolean; message?: string };
  updateShipmentStage: (orderId: string, newStage: DeliveryStage, actualLoadedQty?: number) => void;
  reportDelay: (orderId: string, reason: string, notes?: string) => void;

  // CRITICAL Section 54/55: Instant Delivery Confirmation
  confirmDelivery: (
    orderId: string, 
    deliveredQty: number, 
    receiverName: string, 
    photoUrl: string, 
    notes: string
  ) => void;

  payments: LogisticsPaymentRecord[];
  performance: LogisticsPerformanceMetrics;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<LogisticsNavSection>('dashboard');

  const [drivers, setDrivers] = useState<LogisticsDriver[]>(INITIAL_LOGISTICS_DRIVERS);
  const [vehicles, setVehicles] = useState<LogisticsVehicle[]>(INITIAL_LOGISTICS_VEHICLES);
  const [shipments, setShipments] = useState<LogisticsShipment[]>(INITIAL_LOGISTICS_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState<LogisticsShipment | null>(null);

  const [payments, setPayments] = useState<LogisticsPaymentRecord[]>(INITIAL_LOGISTICS_PAYMENTS);
  const [performance] = useState<LogisticsPerformanceMetrics>(INITIAL_LOGISTICS_PERFORMANCE);

  // BroadcastChannel for Cross-Portal Sync
  const broadcastSync = (eventData: any) => {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('kisan_jod_shared_sync');
      channel.postMessage(eventData);
      channel.close();
    }
  };

  const acceptPickupRequest = (orderId: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.orderId === orderId ? { ...s, status: 'Accepted by Logistics' } : s))
    );
  };

  const rejectPickupRequest = (orderId: string, reason: string) => {
    setShipments((prev) => prev.filter((s) => s.orderId !== orderId));
  };

  // Section 12: Capacity Validation Engine
  const assignDriverAndVehicle = (orderId: string, driverId: string, vehicleId: string) => {
    const shipment = shipments.find((s) => s.orderId === orderId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const driver = drivers.find((d) => d.id === driverId);

    if (!shipment || !vehicle || !driver) {
      return { success: false, message: 'Invalid shipment, driver, or vehicle selection.' };
    }

    if (vehicle.capacityKg < shipment.expectedQuantityKg) {
      return {
        success: false,
        message: `Vehicle capacity (${vehicle.capacityKg.toLocaleString()} kg) is insufficient for this shipment requirement (${shipment.expectedQuantityKg.toLocaleString()} kg). Select a larger vehicle.`,
      };
    }

    // Update state
    setShipments((prev) =>
      prev.map((s) =>
        s.orderId === orderId
          ? {
              ...s,
              status: 'Driver & Vehicle Assigned',
              assignedDriver: driver,
              assignedVehicle: vehicle,
            }
          : s
      )
    );

    // Update driver & vehicle availability
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, availability: 'Assigned', currentOrderId: orderId } : d))
    );
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, availability: 'Assigned', assignedDriverId: driverId, assignedDriverName: driver.name } : v))
    );

    return { success: true };
  };

  const updateShipmentStage = (orderId: string, newStage: DeliveryStage, actualLoadedQty?: number) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.orderId === orderId) {
          const updated = {
            ...s,
            status: newStage,
            actualLoadedQuantityKg: actualLoadedQty !== undefined ? actualLoadedQty : s.actualLoadedQuantityKg,
          };
          return updated;
        }
        return s;
      })
    );
  };

  const reportDelay = (orderId: string, reason: string, notes?: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.orderId === orderId
          ? {
              ...s,
              delayReport: {
                reason,
                reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                notes,
              },
            }
          : s
      )
    );
  };

  // Section 54/55/58: Instant Delivery Confirmation
  const confirmDelivery = (
    orderId: string,
    deliveredQty: number,
    receiverName: string,
    photoUrl: string,
    notes: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    setShipments((prev) =>
      prev.map((s) => {
        if (s.orderId === orderId) {
          return {
            ...s,
            status: 'Delivered',
            actualDeliveredQuantityKg: deliveredQty,
            proofOfDelivery: {
              deliveredTimestamp: `${dateStr} ${timestamp}`,
              receiverName,
              deliveredQuantityKg: deliveredQty,
              photoUrl,
              notes,
            },
          };
        }
        return s;
      })
    );

    // Create payment record
    const newPay: LogisticsPaymentRecord = {
      id: `PAY-LOG-${Date.now().toString().slice(-4)}`,
      orderId,
      deliveryDate: dateStr,
      distanceKm: 18,
      agreedChargeINR: 4000,
      approvedAdditionalChargesINR: 0,
      totalPayableINR: 4000,
      status: 'Processing',
      paymentReference: `ESC-LOG-${Date.now().toString().slice(-4)}`,
    };
    setPayments((prev) => [newPay, ...prev]);

    // Broadcast Single Canonical Event across all portals (Company & Admin)
    broadcastSync({
      type: 'DELIVERY_CONFIRMED',
      orderId,
      deliveredQuantityKg: deliveredQty,
      receiverName,
      deliveredTimestamp: `${dateStr} ${timestamp}`,
    });
  };

  const addDriver = (driver: Omit<LogisticsDriver, 'id' | 'completedDeliveries' | 'onTimePercent'>) => {
    const newDrv: LogisticsDriver = {
      ...driver,
      id: `DRV-${Date.now().toString().slice(-3)}`,
      completedDeliveries: 0,
      onTimePercent: 100,
    };
    setDrivers((prev) => [...prev, newDrv]);
  };

  const addVehicle = (vehicle: Omit<LogisticsVehicle, 'id'>) => {
    const newVh: LogisticsVehicle = {
      ...vehicle,
      id: `VH-${Date.now().toString().slice(-3)}`,
    };
    setVehicles((prev) => [...prev, newVh]);
  };

  return (
    <LogisticsContext.Provider
      value={{
        activeSection,
        setActiveSection,

        drivers,
        addDriver,

        vehicles,
        addVehicle,

        shipments,
        selectedShipment,
        setSelectedShipment,

        acceptPickupRequest,
        rejectPickupRequest,
        assignDriverAndVehicle,
        updateShipmentStage,
        reportDelay,

        confirmDelivery,

        payments,
        performance,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) throw new Error('useLogistics must be used within LogisticsProvider');
  return context;
};
