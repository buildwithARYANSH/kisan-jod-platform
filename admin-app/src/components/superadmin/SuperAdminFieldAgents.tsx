import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { ShieldCheck, Star, Eye, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import type { MasterFieldAgent } from '../../types';

export const SuperAdminFieldAgents: React.FC = () => {
  const { fieldAgents, setSelectedAgent, selectedAgent } = useSuperAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Master Field Agent & Middleman Registry
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Monitor ground procurement officers, assigned cluster regions, operational ratings, and referral performance.
        </p>
      </div>

      {/* Agents Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Agent ID / Name</th>
                <th className="p-3">Assigned Region</th>
                <th className="p-3">Assigned Storage</th>
                <th className="p-3">Tasks</th>
                <th className="p-3">Rating Score</th>
                <th className="p-3">Farmers Registered</th>
                <th className="p-3">Referral Earnings</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {fieldAgents.map((fa) => (
                <tr key={fa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">
                    <strong className="text-gray-900  block">{fa.name}</strong>
                    <span className="text-[10px] font-mono text-gray-400">{fa.id}</span>
                  </td>
                  <td className="p-3 font-semibold">{fa.region}</td>
                  <td className="p-3 text-gray-500">{fa.assignedInventoryFacility}</td>
                  <td className="p-3 font-semibold">{fa.completedTasksCount} Completed ({fa.activeTasksCount} Active)</td>
                  <td className="p-3 font-bold text-purple-600">
                    <span className="flex items-center gap-1">
                      {fa.rating.toFixed(1)} <Star className="w-3.5 h-3.5 fill-purple-600 inline" /> ({fa.taskCompletionPercent}%)
                    </span>
                  </td>
                  <td className="p-3 font-bold text-green-600">{fa.farmersRegisteredCount} Farmers</td>
                  <td className="p-3 font-black text-gray-900 ">₹{fa.referralEarningsINR.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedAgent(fa)}
                      className="py-1 px-2.5 rounded-lg bg-blue-50  text-blue-600 text-xs font-bold ml-auto cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Operational Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Full Operational Profile Drawer/Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-lg w-full border border-gray-200  shadow-2xl space-y-4">
            <div className="border-b pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedAgent.id}</span>
                <h3 className="text-xl font-extrabold text-gray-900 ">
                  {selectedAgent.name}
                </h3>
                <p className="text-xs text-gray-500">{selectedAgent.region}</p>
              </div>

              <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-xl font-bold text-xs">
                <Star className="w-4 h-4 fill-purple-600" />
                {selectedAgent.rating.toFixed(1)} / 5.0
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
              <div className="flex justify-between">
                <span>Phone / Contact:</span>
                <strong className="font-mono">{selectedAgent.phone} ({selectedAgent.email})</strong>
              </div>
              <div className="flex justify-between">
                <span>Assigned Storage Facility:</span>
                <strong>{selectedAgent.assignedInventoryFacility}</strong>
              </div>
              <div className="flex justify-between">
                <span>Task Completion Success Rate:</span>
                <strong className="text-green-600 font-bold">{selectedAgent.taskCompletionPercent}%</strong>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span>Referral Onboarding Earnings:</span>
                <strong className="text-purple-600">₹{selectedAgent.referralEarningsINR.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
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
