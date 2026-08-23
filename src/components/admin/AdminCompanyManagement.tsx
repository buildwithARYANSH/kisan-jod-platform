import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useAdmin } from '../../context/AdminContext';
import { Building2, Search, Eye, X, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import type { AdminCompanyItem } from '../../types';

export const AdminCompanyManagement: React.FC = () => {
  const { companies, inactivityThresholdDays } = useAdmin();
  const { demands, receipts } = useCompany();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<AdminCompanyItem | null>(null);

  const nowMs = new Date().getTime();
  const thresholdMs = inactivityThresholdDays * 24 * 60 * 60 * 1000;

  const filteredCompanies = companies.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 uppercase tracking-wider border border-emerald-200">
            Industrial Buyer Directory
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
            Company & Buyer Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Registered industrial procurement buyers, executive heads, branches, demands & settlement ledgers.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Company Name, ID, or Branch..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Company Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Company Name & ID</th>
                <th className="p-3.5">Branch / Address</th>
                <th className="p-3.5">Executive Head</th>
                <th className="p-3.5">Reg / Last Activity</th>
                <th className="p-3.5">Status ({inactivityThresholdDays}d Rule)</th>
                <th className="p-3.5">Active Demands</th>
                <th className="p-3.5">Total Purchase Value</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map((comp) => {
                const lastActiveMs = new Date(comp.lastActivityDate).getTime();
                const isActive = nowMs - lastActiveMs <= thresholdMs;

                return (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <strong className="text-slate-900 font-black block font-fraunces">{comp.name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{comp.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-900 font-bold block">{comp.branch}</span>
                      <span className="text-[11px] text-slate-500 font-semibold">{comp.address}</span>
                    </td>
                    <td className="p-3.5">
                      <strong className="text-slate-900 font-bold block">{comp.executiveHead}</strong>
                      <span className="text-[10px] text-slate-500 font-semibold">{comp.executivePhone}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <span className="block font-bold">Reg: {comp.registrationDate}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Last Active: {comp.lastActivityDate}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-blue-900">{comp.activeDemandsCount} Active Demands</td>
                    <td className="p-3.5 font-black text-slate-900 font-fraunces">
                      ₹{comp.totalPurchaseValue.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedCompany(comp)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Detail Drawer */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces">{selectedCompany.name}</h3>
                <span className="text-xs text-slate-500 font-mono font-bold">ID: {selectedCompany.id} • {selectedCompany.branch}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-semibold">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-600" /> {selectedCompany.address}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-emerald-600" /> {selectedCompany.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-600" /> {selectedCompany.phone}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Executive Information:</span>
                <p><Briefcase className="w-4 h-4 text-purple-600 inline mr-1" /> Executive Head: <strong>{selectedCompany.executiveHead}</strong></p>
                <p>Phone: <strong>{selectedCompany.executivePhone}</strong></p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-emerald-950 font-bold">
                <span>Total Cumulative Purchase Value:</span>
                <strong className="text-lg font-black font-fraunces">₹{selectedCompany.totalPurchaseValue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Company Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
