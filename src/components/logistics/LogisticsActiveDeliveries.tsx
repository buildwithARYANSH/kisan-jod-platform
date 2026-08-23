import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { LogisticsDeliveryConfirmationModal } from './LogisticsDeliveryConfirmationModal';
import { Truck, CheckCircle2, AlertTriangle, Clock, MapPin, User, Car, ShieldAlert } from 'lucide-react';
import type { LogisticsShipment } from '../../types';

export const LogisticsActiveDeliveries: React.FC = () => {
  const { shipments, drivers, vehicles, assignDriverAndVehicle, updateShipmentStage, reportDelay } = useLogistics();

  const [selectedShipmentForAssign, setSelectedShipmentForAssign] = useState<LogisticsShipment | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [assignError, setAssignError] = useState<string | null>(null);

  // Delivery confirmation modal target
  const [confirmDeliveryShipment, setConfirmDeliveryShipment] = useState<LogisticsShipment | null>(null);

  // Delay reporting state
  const [delayShipment, setDelayShipment] = useState<LogisticsShipment | null>(null);
  const [delayReason, setDelayReason] = useState('Traffic Congestion');
  const [delayNotes, setDelayNotes] = useState('');

  const activeShipments = shipments.filter((s) => s.status !== 'Pickup Requested');

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentForAssign) return;

    const res = assignDriverAndVehicle(selectedShipmentForAssign.orderId, selectedDriverId, selectedVehicleId);
    if (!res.success) {
      setAssignError(res.message || 'Assignment failed.');
    } else {
      setAssignError(null);
      setSelectedShipmentForAssign(null);
    }
  };

  const handleConfirmDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayShipment) return;
    reportDelay(delayShipment.orderId, delayReason, delayNotes);
    setDelayShipment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-600" />
          Active Deliveries & Fleet Tracking
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Capacity validation fleet assignment, live checkpoint updates, SLA delay alerts & proof-of-delivery signoffs.
        </p>
      </div>

      {/* Active Shipments Cards */}
      <div className="space-y-4">
        {activeShipments.map((s) => (
          <div
            key={s.orderId}
            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{s.orderId} • Batch: {s.batchId}</span>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  {s.cropName} ({s.expectedQuantityKg.toLocaleString()} kg)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  {s.status}
                </span>

                {s.delayReport && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" /> DELAYED: {s.delayReport.reason}
                  </span>
                )}
              </div>
            </div>

            {/* Driver & Vehicle Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Assigned Fleet Driver:</span>
                {s.assignedDriver ? (
                  <div className="space-y-0.5">
                    <strong className="text-gray-900 dark:text-white text-sm block">{s.assignedDriver.name}</strong>
                    <span className="font-mono text-blue-600 block">{s.assignedDriver.phone}</span>
                  </div>
                ) : (
                  <span className="text-amber-600 font-bold block">Driver Assignment Pending</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Assigned Vehicle:</span>
                {s.assignedVehicle ? (
                  <div className="space-y-0.5">
                    <strong className="text-gray-900 dark:text-white text-sm block">{s.assignedVehicle.registrationNumber}</strong>
                    <span className="text-gray-500 block">{s.assignedVehicle.vehicleType} (Cap: {s.assignedVehicle.capacityKg.toLocaleString()} kg)</span>
                  </div>
                ) : (
                  <span className="text-amber-600 font-bold block">Vehicle Assignment Pending</span>
                )}
              </div>
            </div>

            {/* Action Buttons Step-by-Step */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t">
              <button
                onClick={() => setDelayShipment(s)}
                className="py-1.5 px-3 rounded-xl border border-red-300 text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Report Delay
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {!s.assignedDriver && (
                  <button
                    onClick={() => {
                      setSelectedShipmentForAssign(s);
                      setAssignError(null);
                    }}
                    className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Assign Driver & Vehicle
                  </button>
                )}

                {s.status === 'Driver & Vehicle Assigned' && (
                  <button
                    onClick={() => updateShipmentStage(s.orderId, 'Arrived at Pickup')}
                    className="py-2 px-4 rounded-xl bg-indigo-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Arrived at Pickup
                  </button>
                )}

                {s.status === 'Arrived at Pickup' && (
                  <button
                    onClick={() => updateShipmentStage(s.orderId, 'Loading Complete', s.expectedQuantityKg)}
                    className="py-2 px-4 rounded-xl bg-purple-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Confirm Loading Complete ({s.expectedQuantityKg.toLocaleString()} kg)
                  </button>
                )}

                {s.status === 'Loading Complete' && (
                  <button
                    onClick={() => updateShipmentStage(s.orderId, 'Departed / In Transit')}
                    className="py-2 px-4 rounded-xl bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Confirm Departure / In Transit
                  </button>
                )}

                {s.status === 'Departed / In Transit' && (
                  <button
                    onClick={() => updateShipmentStage(s.orderId, 'Arrived at Destination')}
                    className="py-2 px-4 rounded-xl bg-indigo-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Arrived at Destination
                  </button>
                )}

                {s.status === 'Arrived at Destination' && (
                  <button
                    onClick={() => setConfirmDeliveryShipment(s)}
                    className="py-2.5 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold shadow-lg cursor-pointer flex items-center gap-1.5 animate-bounce"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Final Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver + Vehicle Assignment Modal with CAPACITY VALIDATION ENGINE */}
      {selectedShipmentForAssign && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Assign Driver & Vehicle for #{selectedShipmentForAssign.orderId}
            </h3>

            <p className="text-xs text-gray-500 mb-3">
              Shipment Requirement: <strong>{selectedShipmentForAssign.expectedQuantityKg.toLocaleString()} kg</strong> ({selectedShipmentForAssign.cropName})
            </p>

            {assignError && (
              <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                {assignError}
              </div>
            )}

            <form onSubmit={handleConfirmAssignment} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Select Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-bold bg-gray-50 dark:bg-gray-700"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phone}) - {d.availability}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Select Vehicle (Capacity Check)</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-bold bg-gray-50 dark:bg-gray-700"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.vehicleType} - Cap: {v.capacityKg.toLocaleString()} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedShipmentForAssign(null)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Validate & Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delay Reporting Modal */}
      {delayShipment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Report Delivery Delay for #{delayShipment.orderId}
            </h3>

            <form onSubmit={handleConfirmDelay} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Delay Reason</label>
                <select
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-bold bg-gray-50 dark:bg-gray-700"
                >
                  <option value="Traffic Congestion">Traffic Congestion</option>
                  <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                  <option value="Severe Weather">Severe Weather</option>
                  <option value="Loading Delay at Inventory">Loading Delay at Inventory</option>
                  <option value="Destination Receiving Gate Delay">Destination Receiving Gate Delay</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
                <textarea
                  value={delayNotes}
                  onChange={(e) => setDelayNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border font-semibold"
                  placeholder="Provide context..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDelayShipment(null)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                >
                  Submit Delay Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section 54/55 Delivery Confirmation Modal */}
      {confirmDeliveryShipment && (
        <LogisticsDeliveryConfirmationModal
          shipment={confirmDeliveryShipment}
          onClose={() => setConfirmDeliveryShipment(null)}
        />
      )}
    </div>
  );
};
