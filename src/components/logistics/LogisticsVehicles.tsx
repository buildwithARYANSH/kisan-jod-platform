import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Car, PlusCircle } from 'lucide-react';

export const LogisticsVehicles: React.FC = () => {
  const { vehicles, addVehicle } = useLogistics();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [regNo, setRegNo] = useState('');
  const [vType, setVType] = useState<any>('14-Ton Refrigerated Container');
  const [capacity, setCapacity] = useState<number>(14000);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo) return;
    addVehicle({ registrationNumber: regNo, vehicleType: vType, capacityKg: capacity, availability: 'Available' });
    setRegNo('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Vehicle Fleet Registry & Capacity Specs
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Registered trucks, payload weight capacities (kg) & assigned drivers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Vehicle ID / Reg Number</th>
                <th className="p-3">Vehicle Type Specification</th>
                <th className="p-3">Max Payload Capacity</th>
                <th className="p-3">Assigned Driver</th>
                <th className="p-3 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">
                    <strong className="text-gray-900 dark:text-white font-mono text-sm block">{v.registrationNumber}</strong>
                    <span className="text-[10px] font-mono text-gray-400">{v.id}</span>
                  </td>
                  <td className="p-3 font-semibold">{v.vehicleType}</td>
                  <td className="p-3 font-black text-blue-600 dark:text-blue-400">{v.capacityKg.toLocaleString()} kg</td>
                  <td className="p-3 font-semibold">{v.assignedDriverName || 'Unassigned'}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      v.availability === 'Available'
                        ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {v.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Add Vehicle to Fleet</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. PB-10-CZ-4921"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Vehicle Type Specification</label>
                <select
                  value={vType}
                  onChange={(e) => setVType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold"
                >
                  <option value="Small Truck (3-Ton)">Small Truck (3-Ton)</option>
                  <option value="Medium Truck (7-Ton)">Medium Truck (7-Ton)</option>
                  <option value="Large Truck (14-Ton)">Large Truck (14-Ton)</option>
                  <option value="14-Ton Refrigerated Container">14-Ton Refrigerated Container</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Max Payload Capacity (kg)</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold text-blue-600"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
