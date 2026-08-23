import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { PackageCheck, CheckCircle2, XCircle, MapPin, Truck, Calendar } from 'lucide-react';
import type { LogisticsShipment } from '../../types';

export const LogisticsPickupRequests: React.FC = () => {
  const { shipments, acceptPickupRequest, rejectPickupRequest } = useLogistics();
  const [selectedRequest, setSelectedRequest] = useState<LogisticsShipment | null>(null);
  const [rejectReason, setRejectReason] = useState('No vehicle available');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const pickupRequests = shipments.filter((s) => s.status === 'Pickup Requested');

  const handleOpenReject = (shipment: LogisticsShipment) => {
    setSelectedRequest(shipment);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    const finalReason = rejectReason === 'Other' ? otherReasonText : rejectReason;
    rejectPickupRequest(selectedRequest.orderId, finalReason);
    setIsRejectModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-blue-600" />
          Transportation Pickup Requests
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Review transportation assignments from Kisan Jod platform. Accept or provide mandatory rejection reasons.
        </p>
      </div>

      {pickupRequests.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white  border text-center text-xs text-gray-500 space-y-2">
          <PackageCheck className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="font-bold text-gray-700  text-sm">No Pending Pickup Requests</p>
          <p>All assigned transportation orders have been accepted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pickupRequests.map((req) => (
            <div
              key={req.orderId}
              className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 font-bold">{req.orderId} • Batch: {req.batchId}</span>
                  <h3 className="text-base font-extrabold text-gray-900 ">
                    {req.cropName} ({req.expectedQuantityKg.toLocaleString()} kg - Grade {req.grade})
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-semibold">Estimated Freight Fee:</span>
                  <strong className="text-base font-black text-green-600">₹{req.estimatedLogisticsFeeINR.toLocaleString()}</strong>
                </div>
              </div>

              {/* Pickup & Destination Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-blue-50  border border-blue-200  space-y-1">
                  <span className="text-[10px] font-bold text-blue-700  uppercase block">Pickup Storage Location:</span>
                  <p className="font-bold text-gray-900 ">{req.pickupInventoryName}</p>
                  <p className="text-gray-600  flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {req.pickupAddress}
                  </p>
                  <p className="text-gray-500 font-mono flex items-center gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Scheduled: {req.scheduledPickupTime}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50  border border-purple-200  space-y-1">
                  <span className="text-[10px] font-bold text-purple-700  uppercase block">Delivery Destination:</span>
                  <p className="font-bold text-gray-900 ">{req.destinationCompanyName}</p>
                  <p className="text-gray-600  flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" /> {req.destinationAddress}
                  </p>
                  <p className="text-gray-500 font-mono flex items-center gap-1 pt-1">
                    <Truck className="w-3.5 h-3.5 text-purple-600" /> Vehicle Spec: {req.requiredVehicleType} ({req.distanceKm} km)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 text-xs pt-1">
                <button
                  onClick={() => handleOpenReject(req)}
                  className="px-4 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-bold cursor-pointer flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject Request
                </button>
                <button
                  onClick={() => acceptPickupRequest(req.orderId)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Accept Transportation Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/70  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900  mb-2">
              Reject Pickup Request #{selectedRequest.orderId}
            </h3>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Mandatory Rejection Reason
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  font-bold"
                >
                  <option value="No vehicle available">No vehicle available</option>
                  <option value="No driver available">No driver available</option>
                  <option value="Insufficient capacity">Insufficient capacity</option>
                  <option value="Route unavailable">Route unavailable</option>
                  <option value="Timing conflict">Timing conflict</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              {rejectReason === 'Other' && (
                <div>
                  <label className="block font-bold text-gray-700  mb-1">
                    Explanation
                  </label>
                  <textarea
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl border font-semibold"
                    required
                  />
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
