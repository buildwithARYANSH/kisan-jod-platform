import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Users, Search, Filter, Eye, X, CheckCircle2, Clock, Phone, MapPin, Building2, UserCheck } from 'lucide-react';
import type { AdminFarmerItem } from '../../types';

export const AdminFarmerManagement: React.FC = () => {
  const { farmers, inactivityThresholdDays, setInactivityThresholdDays } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedFarmer, setSelectedFarmer] = useState<AdminFarmerItem | null>(null);

  const nowMs = new Date().getTime();
  const thresholdMs = inactivityThresholdDays * 24 * 60 * 60 * 1000;

  // Compute Active/Inactive status dynamically per farmer
  const filteredFarmers = farmers.filter((farmer) => {
    const lastActiveMs = new Date(farmer.lastActivityDate).getTime();
    const isActive = nowMs - lastActiveMs <= thresholdMs;

    const matchesSearch = 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm);

    const matchesRegion = selectedRegion === 'All' || farmer.region === selectedRegion;
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Active' && isActive) || 
      (statusFilter === 'Inactive' && !isActive);

    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
            Farmer Directory & Operational Status
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
            Farmer Management Module
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Dynamic 90-day inactivity evaluation, assigned Field Agents, crop pools & direct bank payout records.
          </p>
        </div>

        {/* Configurable Inactivity Window Threshold */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold shrink-0">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Inactivity Threshold:</span>
          <select
            value={inactivityThresholdDays}
            onChange={(e) => setInactivityThresholdDays(Number(e.target.value))}
            className="p-1.5 rounded-lg border border-slate-300 bg-white font-extrabold text-blue-900 cursor-pointer"
          >
            <option value={30}>30 Days</option>
            <option value={60}>60 Days</option>
            <option value={90}>90 Days (Standard)</option>
            <option value={120}>120 Days</option>
          </select>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Farmer Name, ID, or Phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-extrabold cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="Ludhiana Hub Region">Ludhiana Hub Region</option>
              <option value="Kanpur Hub Region">Kanpur Hub Region</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['All', 'Active', 'Inactive'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Farmer Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Farmer Name & ID</th>
                <th className="p-3.5">Region / Phone</th>
                <th className="p-3.5">Assigned Field Agent</th>
                <th className="p-3.5">Registered / Last Active</th>
                <th className="p-3.5">Status ({inactivityThresholdDays}d Rule)</th>
                <th className="p-3.5">Crops Supplied</th>
                <th className="p-3.5">Total Qty (kg)</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFarmers.map((farmer) => {
                const lastActiveMs = new Date(farmer.lastActivityDate).getTime();
                const isActive = nowMs - lastActiveMs <= thresholdMs;

                return (
                  <tr key={farmer.id} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <strong className="text-slate-900 font-black block font-fraunces">{farmer.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{farmer.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-900 font-bold block">{farmer.region}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{farmer.phone}</span>
                    </td>
                    <td className="p-3.5 text-purple-900 font-extrabold">{farmer.assignedFieldAgent}</td>
                    <td className="p-3.5 text-slate-600">
                      <span className="block font-bold">Reg: {farmer.registeredDate}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Last Active: {farmer.lastActivityDate}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}>
                        {isActive ? 'Active' : 'Inactive (>90d)'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded bg-blue-100 text-blue-950 text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-black text-slate-900 font-fraunces">
                      {farmer.totalQuantitySupplied.toLocaleString()} kg
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedFarmer(farmer)}
                        className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-xs"
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

      {/* Farmer Detail Drawer / Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setSelectedFarmer(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces">{selectedFarmer.name}</h3>
                <span className="text-xs text-slate-500 font-mono font-bold">ID: {selectedFarmer.id} • {selectedFarmer.region}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-semibold">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> {selectedFarmer.address}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-600" /> {selectedFarmer.phone}</p>
                <p className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-purple-600" /> Assigned Agent: <strong>{selectedFarmer.assignedFieldAgent}</strong></p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Banking Payout Details:</span>
                <p>Bank: <strong>{selectedFarmer.bankName}</strong></p>
                <p>Account: <strong className="font-mono">{selectedFarmer.accountNumberMasked}</strong></p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex justify-between items-center text-blue-950 font-bold">
                <span>Total Quantity Supplied:</span>
                <strong className="text-lg font-black font-fraunces">{selectedFarmer.totalQuantitySupplied.toLocaleString()} kg</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
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
