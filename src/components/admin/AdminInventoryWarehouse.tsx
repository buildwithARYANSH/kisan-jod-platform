import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Warehouse, Layers, Eye, X, CheckCircle2, Box, Sparkles } from 'lucide-react';
import type { WarehouseFacility } from '../../types';

export const AdminInventoryWarehouse: React.FC = () => {
  const { warehouses } = useAdmin();
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseFacility | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-950 uppercase tracking-wider border border-amber-200">
          Storage Facilities & Batch Intake Lifecycle
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Warehouse Management & Inventory Flow
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Monitor cold storage, dry grain silos & biomass depots. Track incoming, current, reserved, available & outgoing stock states.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {warehouses.map((wh) => (
          <div key={wh.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{wh.id}</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 font-fraunces">{wh.facilityName}</h3>
                <p className="text-xs text-slate-500 font-semibold">{wh.type} • Manager: {wh.managerName}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black">
                {wh.currentUtilizationPercent}% Capacity
              </span>
            </div>

            {/* Stock State Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">Current Stock</span>
                <strong className="text-slate-900 font-black">{wh.currentStockTon} Ton</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="text-amber-800 text-[10px] block font-semibold">Reserved Stock</span>
                <strong className="font-black">{wh.reservedStockTon} Ton</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="text-emerald-800 text-[10px] block font-semibold">Available Stock</span>
                <strong className="font-black">{wh.availableStockTon} Ton</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedWarehouse(wh)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4" /> View Batches ({wh.batches.length}) & Inventory Flow
            </button>
          </div>
        ))}
      </div>

      {/* Warehouse Batches Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-blue-200 shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setSelectedWarehouse(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900 font-fraunces">{selectedWarehouse.facilityName}</h3>
              <p className="text-xs text-slate-500 font-bold">Intake Batches & Storage Locations</p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-semibold max-h-[350px] overflow-y-auto">
              {selectedWarehouse.batches.map((b) => (
                <div key={b.batchId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-black">
                    <span className="text-slate-900 font-fraunces">{b.cropName} (Grade {b.grade})</span>
                    <span className="font-mono text-purple-900 text-xs">{b.batchId}</span>
                  </div>
                  <p className="text-slate-600">Qty: <strong>{b.quantity.toLocaleString()} {b.unit}</strong> • Star Rating: <strong className="text-amber-600">{b.qualityStarRating}/5.0</strong></p>
                  <p className="text-slate-500 text-xs">Location: <strong>{b.storageLocation}</strong> • Intake: {b.intakeDate}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWarehouse(null)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Batches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
