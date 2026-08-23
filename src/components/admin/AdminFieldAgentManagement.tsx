import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { UserCheck, Star, Award, CheckCircle2, Eye, X, Phone, Mail, MapPin, Warehouse } from 'lucide-react';
import type { AdminFieldAgentItem } from '../../types';

export const AdminFieldAgentManagement: React.FC = () => {
  const { fieldAgents } = useAdmin();
  const [selectedAgent, setSelectedAgent] = useState<AdminFieldAgentItem | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-100 text-purple-950 uppercase tracking-wider border border-purple-200">
          Field Agent Operations & Performance Oversight
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Field Agent Management & Operational Profiles
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Shared Field Agent IDs (`AGT-101`), task completion rates, farmer onboarding referral earnings & performance reviews.
        </p>
      </div>

      {/* Field Agents Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Agent Name & ID</th>
                <th className="p-3.5">Region / Contact</th>
                <th className="p-3.5">Assigned Inventory Facility</th>
                <th className="p-3.5">Active / Done Tasks</th>
                <th className="p-3.5">Rating & SLA %</th>
                <th className="p-3.5">Farmers Onboarded</th>
                <th className="p-3.5">Referral Earnings</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fieldAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-black block font-fraunces">{agent.name}</strong>
                    <span className="text-[10px] text-purple-900 font-mono font-bold bg-purple-100 px-2 py-0.5 rounded">
                      {agent.id}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-900 font-bold block">{agent.region}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{agent.phone}</span>
                  </td>
                  <td className="p-3.5 text-slate-700 font-bold">{agent.assignedInventory}</td>
                  <td className="p-3.5">
                    <span className="text-blue-900 font-extrabold block">{agent.activeTasks} Active Tasks</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{agent.completedTasks} Completed</span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1 text-amber-600 font-black">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{agent.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">{agent.taskCompletionPercent}% Task SLA</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{agent.farmersRegisteredCount} Farmers</td>
                  <td className="p-3.5 font-black text-emerald-800 font-fraunces">
                    ₹{agent.referralEarnings.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-xs"
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

      {/* Field Agent Operational Profile Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-purple-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 space-y-4">
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces">{selectedAgent.name}</h3>
                <span className="text-xs text-purple-900 font-mono font-bold">Shared Agent ID: {selectedAgent.id} • {selectedAgent.region}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-semibold">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="flex items-center gap-1.5"><Warehouse className="w-4 h-4 text-purple-600" /> Facility: <strong>{selectedAgent.assignedInventory}</strong></p>
                <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-purple-600" /> {selectedAgent.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-purple-600" /> {selectedAgent.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950">
                  <span className="text-[11px] font-black uppercase block">Farmers Onboarded:</span>
                  <strong className="text-xl font-black font-fraunces">{selectedAgent.farmersRegisteredCount}</strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="text-[11px] font-black uppercase block">Referral Payouts:</span>
                  <strong className="text-xl font-black font-fraunces">₹{selectedAgent.referralEarnings.toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                <span className="font-black text-amber-900 block">Performance & Removal Policy Notice:</span>
                <p className="text-[11px]">
                  Field Agent rating is currently <strong>{selectedAgent.rating}/5.0</strong>. Per platform review policy, agents are evaluated across pattern trends rather than single isolated disputes.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="py-2.5 px-5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Operational Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
