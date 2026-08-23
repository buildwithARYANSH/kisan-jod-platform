import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Warehouse, Phone, MapPin, Snowflake, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { inventory, addInventoryStock, orders, updateConfirmedQuantity } = useAdmin();

  // Stock Add Modal
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState<number>(10000);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const batchId = `LOT-${Date.now().toString().slice(-4)}`;
    addInventoryStock(batchId, cropName, quantity);
    setIsAddStockOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-blue-600" />
            Approved Inventory & Cold Storage Facilities
          </h2>
          <p className="text-xs text-gray-500  mt-1">
            Ground storage capacity management (3rd-Party / Government approved facilities).
          </p>
        </div>

        <button
          onClick={() => setIsAddStockOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Produce Batch to Storage
        </button>
      </div>

      {/* Facility Details Card */}
      <div className="bg-white  p-6 rounded-3xl border border-gray-200  shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100  pb-4">
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100  text-blue-800  uppercase tracking-wider">
              Primary Regional Storage Facility
            </span>
            <h3 className="text-lg font-extrabold text-gray-900  mt-1">
              {inventory.facilityName}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" /> {inventory.address}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50  text-xs space-y-1">
            <span className="text-gray-500 font-semibold block">Facility Operator / Caretaker:</span>
            <strong className="text-gray-900  block">{inventory.caretakerName}</strong>
            <a href={`tel:${inventory.caretakerPhone}`} className="text-blue-600 font-mono font-bold hover:underline block">
              {inventory.caretakerPhone}
            </a>
          </div>
        </div>

        {/* Storage Capacity Gauge & Cold Storage Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50  space-y-2">
            <div className="flex justify-between font-bold">
              <span>Dry Storage Capacity Usage:</span>
              <span className="text-blue-600">
                {inventory.occupiedCapacityKg.toLocaleString()} / {inventory.totalCapacityKg.toLocaleString()} kg
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200  rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                style={{ width: `${Math.round((inventory.occupiedCapacityKg / inventory.totalCapacityKg) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-gray-500 block">
              Remaining Dry Storage: {(inventory.totalCapacityKg - inventory.occupiedCapacityKg).toLocaleString()} kg
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50  border border-purple-200  space-y-2">
            <div className="flex justify-between font-bold text-purple-900 ">
              <span className="flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-purple-600" />
                Cold Storage Available:
              </span>
              <span className="text-purple-600 font-extrabold">Active</span>
            </div>
            <div className="flex justify-between text-purple-800 ">
              <span>Capacity Usage:</span>
              <strong>
                {inventory.coldStorageUsedKg.toLocaleString()} / {inventory.coldStorageCapacityKg.toLocaleString()} kg ({Math.round((inventory.coldStorageUsedKg / inventory.coldStorageCapacityKg) * 100)}%)
              </strong>
            </div>
            <span className="text-[11px] text-purple-700  block">
              Remaining Cold Storage: {(inventory.coldStorageCapacityKg - inventory.coldStorageUsedKg).toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Quantity vs Company Demand Breakdown Section */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md space-y-4">
        <h3 className="text-base font-bold text-gray-900  flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Local Available Supply vs Company Demand Reconciliation
        </h3>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.orderId}
              className="p-4 rounded-2xl bg-gray-50  border border-gray-200  space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-sm text-gray-900  font-extrabold">{ord.cropName}</strong>
                  <span className="text-xs text-gray-500 ml-2 font-mono">({ord.orderId} • Buyer: {ord.buyerName})</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800   text-xs font-bold">
                  Grade {ord.grade}
                </span>
              </div>

              {/* Formula Calculation Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
                <div className="p-2.5 rounded-xl bg-white  border border-gray-200 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Company Demand</span>
                  <span className="text-gray-900  text-sm">{ord.companyDemandQty.toLocaleString()} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white  border border-gray-200 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Available Locally</span>
                  <span className="text-blue-600 text-sm">{ord.availableLocallyQty.toLocaleString()} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50  border border-emerald-200 text-emerald-900 ">
                  <span className="text-[10px] text-emerald-600 block font-normal">Confirmed Quantity</span>
                  <span className="text-emerald-600 text-sm font-black">{ord.confirmedQty.toLocaleString()} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white  border border-gray-200 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Remaining Unfulfilled</span>
                  <span className="text-amber-600 text-sm">{ord.remainingDemandQty.toLocaleString()} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900  mb-4">
              Add Produce Batch to Approved Storage
            </h3>

            <form onSubmit={handleAddStock} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Crop Commodity Name
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                >
                  <option value="Tomato">Tomato (Grade A)</option>
                  <option value="Potato">Potato (Grade B)</option>
                  <option value="Wheat">Wheat (High Grain Density)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Batch Quantity (kg)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Add Batch to Storage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
