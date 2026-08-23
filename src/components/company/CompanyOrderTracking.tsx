import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Truck, CheckCircle2, Clock, Phone, MapPin, User } from 'lucide-react';
import type { ShipmentOrder } from '../../types';

export const CompanyOrderTracking: React.FC = () => {
  const { orders } = useCompany();
  const [selectedOrder, setSelectedOrder] = useState<ShipmentOrder>(orders[0] || orders[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
          <Truck className="w-6 h-6 text-blue-600" />
          Shipment Journey & Logistics Tracking
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Coordinated logistics movement via 3rd-party freight partners (Sample Fleet Partner illustrative integration).
        </p>
      </div>

      {/* Select Order Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {orders.map((ord) => (
          <button
            key={ord.id}
            onClick={() => setSelectedOrder(ord)}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition-all shrink-0 cursor-pointer text-left ${
              selectedOrder.id === ord.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
          >
            <div className="font-mono text-[10px] opacity-90 font-bold">{ord.orderId}</div>
            <div className="text-sm font-black mt-0.5 font-fraunces">{ord.cropName}</div>
            <div className="text-[11px] font-extrabold mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {ord.currentStage}
            </div>
          </button>
        ))}
      </div>

      {/* Shipment Journey Progress Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-fraunces">
              {selectedOrder.cropName} ({selectedOrder.quantity.toLocaleString()} {selectedOrder.unit})
            </h3>
            <p className="text-xs text-slate-500 font-mono font-bold mt-0.5">
              Order ID: {selectedOrder.orderId}
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black border border-blue-300">
            Status: {selectedOrder.currentStage}
          </span>
        </div>

        {/* Visual Horizontal Stage Journey Tracker */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">
            Shipment Journey Progression:
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            {selectedOrder.stages.map((stg, idx) => (
              <div
                key={stg.name}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  stg.completed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1.5 font-bold text-xs">
                  {stg.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className="text-xs font-black block leading-tight">{stg.name}</span>
                {stg.date && <span className="text-[10px] text-slate-500 font-bold block mt-1">{stg.date}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Driver & Vehicle Logistics Info */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-semibold">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-black text-blue-800 uppercase tracking-wider block">
              Logistics Partner & Driver Info:
            </span>
            <p className="font-black text-slate-900 text-base font-fraunces">
              {selectedOrder.logisticsPartner}
            </p>
            <div className="space-y-1.5 text-slate-700 font-semibold">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Driver: <strong className="text-slate-900 font-extrabold">{selectedOrder.driverName}</strong>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Vehicle: <strong className="text-slate-900 font-extrabold">{selectedOrder.vehicleNumber} ({selectedOrder.vehicleType})</strong>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Driver Contact: <strong className="text-slate-900 font-extrabold">{selectedOrder.contact}</strong>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">
                Estimated Delivery ETA:
              </span>
              <p className="text-xl sm:text-2xl font-black text-blue-950 mt-1 font-fraunces">
                {selectedOrder.estimatedArrival}
              </p>
              <p className="text-xs text-blue-900 font-extrabold mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                En route to Destination Hub
              </p>
            </div>

            <div className="pt-2 text-[11px] text-blue-900 font-bold italic border-t border-blue-200">
              * Sample fleet tracking integration mockup. Live GPS telemetry API ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
