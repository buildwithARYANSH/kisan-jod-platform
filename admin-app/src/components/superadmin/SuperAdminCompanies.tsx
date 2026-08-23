import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Building2, Search, Filter, Eye, Phone, Mail } from 'lucide-react';
import type { MasterCompany } from '../../types';

export const SuperAdminCompanies: React.FC = () => {
  const { companies, isCompanyActive } = useSuperAdmin();
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<MasterCompany | null>(null);

  const filtered = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Master Industrial Buyer & Company Registry
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Monitor industrial bulk buyers, branches, executive procurement heads, and total purchase value.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Company ID / Name</th>
                <th className="p-3">Branch / Location</th>
                <th className="p-3">Executive Head</th>
                <th className="p-3">Status</th>
                <th className="p-3">Demands Count</th>
                <th className="p-3">Completed Orders</th>
                <th className="p-3 text-right">Total Purchase Value</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((c) => {
                const active = isCompanyActive(c);

                return (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-3">
                      <strong className="text-gray-900  block">{c.companyName}</strong>
                      <span className="text-[10px] font-mono text-gray-400">{c.id}</span>
                    </td>
                    <td className="p-3">{c.branch}</td>
                    <td className="p-3">
                      <strong className="block">{c.executiveHead}</strong>
                      <span className="text-[10px] text-gray-500">{c.executivePhone}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        active
                          ? 'bg-green-100  text-green-800 '
                          : 'bg-red-100  text-red-800 '
                      }`}>
                        {active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{c.totalDemandsCount} ({c.activeDemandsCount} Active)</td>
                    <td className="p-3 font-semibold">{c.completedOrdersCount}</td>
                    <td className="p-3 text-right font-black text-gray-900  text-sm">
                      ₹{c.totalPurchaseValueINR.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedCompany(c)}
                        className="py-1 px-2.5 rounded-lg bg-blue-50  text-blue-600 text-xs font-bold ml-auto cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-lg w-full border border-gray-200  shadow-2xl space-y-4">
            <div className="border-b pb-3">
              <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedCompany.id}</span>
              <h3 className="text-xl font-extrabold text-gray-900 ">
                {selectedCompany.companyName}
              </h3>
              <p className="text-xs text-gray-500">{selectedCompany.address}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
              <div className="flex justify-between">
                <span>Executive Lead:</span>
                <strong>{selectedCompany.executiveHead}</strong>
              </div>
              <div className="flex justify-between">
                <span>Executive Contact:</span>
                <strong className="font-mono">{selectedCompany.executivePhone} ({selectedCompany.executiveEmail})</strong>
              </div>
              <div className="flex justify-between font-black text-sm text-green-600 pt-1 border-t">
                <span>Total Procurement Purchase Value:</span>
                <span>₹{selectedCompany.totalPurchaseValueINR.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
