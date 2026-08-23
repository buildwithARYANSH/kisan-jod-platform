import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Truck, Phone, CheckCircle2, Clock, MapPin, User, ShieldCheck } from 'lucide-react';
import type { AdminOrder } from '../types';

export const AdminDispatch: React.FC = () => {
  const { orders, updateOrderCheckbox } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const handleConfirmDispatch = (order: AdminOrder) => {
    updateOrderCheckbox(order.orderId, 'readyForDispatch', true);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Truck className="w-6 h-6 text-blue-600" />
          Company Dispatch & Logistics Operations
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Coordinate produce handoff to assigned 3rd-party logistics fleet drivers and confirm dispatch quantities.
        </p>
      </div>

      {/* Orders Ready for Dispatch Grid */}
      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.orderId}
            className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100  pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{ord.orderId}</span>
                <h3 className="text-base font-extrabold text-gray-900 ">
                  {ord.cropName} — Buyer: {ord.buyerName}
                </h3>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                ord.statusCheckboxes.readyForDispatch
                  ? 'bg-green-100 text-green-800  '
                  : 'bg-amber-100 text-amber-800  '
              }`}>
                {ord.statusCheckboxes.readyForDispatch ? 'Dispatched / In Transit' : 'Pending Dispatch Signoff'}
              </span>
            </div>

            {/* Quantity Breakdown Box */}
            <div className="p-4 rounded-xl bg-gray-50  grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
              <div>
                <span className="text-[10px] text-gray-400 block font-normal">Company Demand</span>
                <span>{ord.companyDemandQty.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-normal">Available Locally</span>
                <span>{ord.availableLocallyQty.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-green-600 block font-normal">Confirmed Qty for Dispatch</span>
                <span className="text-green-600 font-black text-sm">{ord.confirmedQty.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-normal">Remaining Unfulfilled</span>
                <span>{ord.remainingDemandQty.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Assigned Driver Details */}
            <div className="p-4 rounded-2xl bg-blue-50/70  border border-blue-200  grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-700  uppercase tracking-wider block">
                  Assigned Logistics Fleet Driver:
                </span>
                <p className="font-bold text-gray-900  text-sm">
                  {ord.logisticsInfo.partnerName}
                </p>
                <p className="flex items-center gap-1 text-gray-700 ">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Driver Name: <strong>{ord.logisticsInfo.driverName}</strong>
                </p>
                <p className="flex items-center gap-1 text-gray-700 ">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Contact: <a href={`tel:${ord.logisticsInfo.driverPhone}`} className="font-mono text-blue-600 font-bold hover:underline">{ord.logisticsInfo.driverPhone}</a>
                </p>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold text-blue-700  uppercase tracking-wider block">
                  Vehicle & Delivery ETA:
                </span>
                <p className="font-bold text-gray-900 ">
                  {ord.logisticsInfo.vehicleNumber} ({ord.logisticsInfo.vehicleType})
                </p>
                <p className="flex items-center gap-1 sm:justify-end text-blue-700  font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  ETA: {ord.logisticsInfo.eta}
                </p>
              </div>
            </div>

            {/* Action */}
            {!ord.statusCheckboxes.readyForDispatch && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedOrder(ord)}
                  className="py-2.5 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  Confirm Dispatch ({ord.confirmedQty.toLocaleString()} kg)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-extrabold text-gray-900  mb-3">
              Confirm Produce Dispatch
            </h3>

            <div className="p-4 rounded-xl bg-gray-50  space-y-1.5 text-xs text-gray-700  mb-4">
              <div className="flex justify-between">
                <span>Company Demand:</span>
                <strong>{selectedOrder.companyDemandQty.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Available Locally:</span>
                <strong>{selectedOrder.availableLocallyQty.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between font-extrabold text-green-600 text-sm pt-1 border-t">
                <span>Confirmed Dispatch Qty:</span>
                <span>{selectedOrder.confirmedQty.toLocaleString()} kg</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to mark <strong>{selectedOrder.confirmedQty.toLocaleString()} kg</strong> of {selectedOrder.cropName} as dispatched to driver {selectedOrder.logisticsInfo.driverName}?
            </p>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDispatch(selectedOrder)}
                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
              >
                Confirm Dispatch Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
