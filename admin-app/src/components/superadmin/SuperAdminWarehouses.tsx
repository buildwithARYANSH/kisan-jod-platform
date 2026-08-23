import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Warehouse, ArrowRight, CheckCircle2, Snowflake } from 'lucide-react';

export const SuperAdminWarehouses: React.FC = () => {
  const { inventory } = useAdmin();

  const inventoryFlow = [
    'Incoming Intake',
    'Quality Check',
    'Accepted / Stored',
    'Reserved for Order',
    'Picked',
    'Outgoing / Dispatched',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-blue-600" />
          Master Warehouse Facilities & Inventory Movement Flow
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Full tracking of stock states: Incoming, Current, Reserved, Available, and Outgoing.
        </p>
      </div>

      {/* Movement Flow Visualizer */}
      <div className="p-5 rounded-3xl bg-white  border border-gray-200  shadow-md space-y-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
          Inventory Movement Flow Checklist:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {inventoryFlow.map((stg, idx) => (
            <div key={stg} className="px-3 py-1.5 rounded-xl bg-blue-50  text-blue-900  font-bold flex items-center gap-2 shrink-0 border border-blue-200 ">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{stg}</span>
              {idx < inventoryFlow.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Facility Details */}
      <div className="p-6 rounded-3xl bg-white  border border-gray-200  shadow-md space-y-3 text-xs">
        <h3 className="text-base font-extrabold text-gray-900 ">{inventory.facilityName}</h3>
        <p className="text-gray-500">{inventory.address} • Caretaker: {inventory.caretakerName} ({inventory.caretakerPhone})</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-bold">
          <div className="p-3 rounded-xl bg-gray-50 ">
            <span className="text-[10px] text-gray-400 block font-normal">Dry Storage Capacity</span>
            <span>{inventory.occupiedCapacityKg.toLocaleString()} / {inventory.totalCapacityKg.toLocaleString()} kg</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50  text-purple-900 ">
            <span className="text-[10px] text-purple-600 block font-normal">Cold Storage Usage</span>
            <span>{inventory.coldStorageUsedKg.toLocaleString()} / {inventory.coldStorageCapacityKg.toLocaleString()} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
