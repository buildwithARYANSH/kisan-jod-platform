import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Users, Search, Filter, ShieldCheck, Eye, Sliders } from 'lucide-react';
import type { MasterFarmer } from '../../types';

export const SuperAdminFarmers: React.FC = () => {
  const { farmers, isFarmerActive, config, updateConfig } = useSuperAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedFarmer, setSelectedFarmer] = useState<MasterFarmer | null>(null);

  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase()) || f.region.toLowerCase().includes(search.toLowerCase());
    const active = isFarmerActive(f);
    if (statusFilter === 'Active') return matchesSearch && active;
    if (statusFilter === 'Inactive') return matchesSearch && !active;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Master Farmer Registry & Activity Control
          </h2>
          <p className="text-xs text-gray-500  mt-1">
            Dynamic activity calculation: Farmer is marked inactive if no activity recorded within {config.inactivityThresholdDays} days.
          </p>
        </div>

        {/* Configurable Threshold Setting */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50  border border-gray-200  text-xs font-bold shrink-0">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Inactivity Threshold:</span>
          <input
            type="number"
            value={config.inactivityThresholdDays}
            onChange={(e) => updateConfig({ inactivityThresholdDays: Number(e.target.value) })}
            className="w-16 p-1 rounded-lg border bg-white  text-center font-bold"
          />
          <span>Days</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white  p-4 rounded-2xl border border-gray-200  shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search farmer name, ID, region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-300  bg-gray-50  w-full font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-bold">Status Filter:</span>
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100  text-gray-700 '}`}
          >
            All ({farmers.length})
          </button>
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${statusFilter === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-100  text-gray-700 '}`}
          >
            Active ({farmers.filter(isFarmerActive).length})
          </button>
          <button
            onClick={() => setStatusFilter('Inactive')}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${statusFilter === 'Inactive' ? 'bg-red-600 text-white' : 'bg-gray-100  text-gray-700 '}`}
          >
            Inactive ({farmers.filter((f) => !isFarmerActive(f)).length})
          </button>
        </div>
      </div>

      {/* Master Farmers Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Farmer ID / Name</th>
                <th className="p-3">Contact / Region</th>
                <th className="p-3">Assigned Agent</th>
                <th className="p-3">Crops Supplied</th>
                <th className="p-3">Status (Calculated)</th>
                <th className="p-3">Total Qty Supplied</th>
                <th className="p-3">Bank Details (Masked)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredFarmers.map((f) => {
                const active = isFarmerActive(f);

                return (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3">
                      <strong className="text-gray-900  block">{f.name}</strong>
                      <span className="text-[10px] font-mono text-gray-400">{f.id}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-blue-600 block">{f.phone}</span>
                      <span className="text-[10px] text-gray-500">{f.region}</span>
                    </td>
                    <td className="p-3 font-semibold">{f.assignedAgentName} ({f.assignedAgentId})</td>
                    <td className="p-3 font-semibold">{f.crops.join(', ')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        active
                          ? 'bg-green-100  text-green-800 '
                          : 'bg-red-100  text-red-800 '
                      }`}>
                        {active ? 'Active' : 'Inactive (>90 days)'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-gray-900 ">
                      {f.totalQuantitySuppliedKg.toLocaleString()} kg
                    </td>
                    <td className="p-3 text-gray-500 font-mono">
                      {f.bankName} • {f.accountNumberMasked}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedFarmer(f)}
                        className="py-1 px-2.5 rounded-lg bg-blue-50  text-blue-600  text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Farmer Profile Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-lg w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="flex justify-between items-start border-b border-gray-100  pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedFarmer.id}</span>
                <h3 className="text-xl font-extrabold text-gray-900 ">
                  {selectedFarmer.name}
                </h3>
                <p className="text-xs text-gray-500">{selectedFarmer.address}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                {isFarmerActive(selectedFarmer) ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
              <div className="flex justify-between">
                <span>Assigned Field Agent:</span>
                <strong>{selectedFarmer.assignedAgentName} ({selectedFarmer.assignedAgentId})</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity Supplied:</span>
                <strong className="text-green-600 text-sm font-black">{selectedFarmer.totalQuantitySuppliedKg.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Bank Account:</span>
                <strong className="font-mono">{selectedFarmer.bankName} ({selectedFarmer.accountNumberMasked})</strong>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
