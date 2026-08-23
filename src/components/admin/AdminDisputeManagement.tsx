import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShieldAlert, Eye, X, CheckCircle2, AlertTriangle, Layers, User, Scale } from 'lucide-react';
import type { AdminDisputeTicket } from '../../types';

export const AdminDisputeManagement: React.FC = () => {
  const { disputes, resolveDispute } = useAdmin();

  const [selectedDispute, setSelectedDispute] = useState<AdminDisputeTicket | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [assignedLiability, setAssignedLiability] = useState<AdminDisputeTicket['assignedLiability']>('Logistics Partner');

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute || !resolutionNote.trim()) return;

    resolveDispute(selectedDispute.id, resolutionNote, assignedLiability);
    setSelectedDispute(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-100 text-red-950 uppercase tracking-wider border border-red-200">
          Chain of Custody & Dispute Resolution Desk
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Dispute & Exception Management Module
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Investigate quantity mismatches, quality disputes, damaged goods & transit delays using 4-checkpoint side-by-side evidence comparison.
        </p>
      </div>

      {/* Disputes Queue Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 font-fraunces">
          Unified Dispute Ticket Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Ticket ID / Batch ID</th>
                <th className="p-3.5">Dispute Type</th>
                <th className="p-3.5">Raised By</th>
                <th className="p-3.5">Escalation Level</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold">
                    <strong className="text-slate-900 font-bold block">{d.id}</strong>
                    <span className="text-[10px] text-purple-900 font-mono">Batch: {d.batchId}</span>
                  </td>
                  <td className="p-3.5 text-red-900 font-black">{d.type}</td>
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-bold block">{d.raisedBy}</strong>
                    <span className="text-[10px] text-slate-500 font-semibold">{d.raisedByRole}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-extrabold text-[10px]">
                      {d.escalationLevel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      d.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-red-100 text-red-950 border border-red-300'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedDispute(d)}
                      className="py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Chain of Custody & Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Chain of Custody Evidence Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-red-200 shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDispute(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-red-100 text-red-950 uppercase font-mono">
                {selectedDispute.id} • {selectedDispute.type}
              </span>
              <h3 className="text-xl font-black text-slate-900 font-fraunces mt-1">
                Chain of Custody Evidence Comparison
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">{selectedDispute.description}</p>
            </div>

            {/* 4 Checkpoint Side-by-Side Evidence Cards */}
            <div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-3">
                4 Checkpoint Evidence Trail (Batch ID: {selectedDispute.batchId}):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-semibold">
                {/* 1. Collection */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black text-blue-900 uppercase block">1. Collection Point</span>
                  <strong className="text-slate-900 block">{selectedDispute.chainOfCustody.collectionPoint?.weightKg} kg</strong>
                  <p className="text-[11px] text-slate-600">Grade: <strong>{selectedDispute.chainOfCustody.collectionPoint?.grade}</strong></p>
                  <p className="text-[10px] text-slate-500">{selectedDispute.chainOfCustody.collectionPoint?.timestamp}</p>
                </div>

                {/* 2. Intake */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black text-amber-900 uppercase block">2. Inventory Intake</span>
                  <strong className="text-slate-900 block">{selectedDispute.chainOfCustody.inventoryIntake?.weightKg} kg</strong>
                  <p className="text-[11px] text-slate-600">Grade: <strong>{selectedDispute.chainOfCustody.inventoryIntake?.grade}</strong></p>
                  <p className="text-[10px] text-slate-500">{selectedDispute.chainOfCustody.inventoryIntake?.timestamp}</p>
                </div>

                {/* 3. Logistics */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black text-indigo-900 uppercase block">3. Logistics Pickup</span>
                  <strong className="text-slate-900 block">{selectedDispute.chainOfCustody.logisticsPickup?.weightKg} kg</strong>
                  <p className="text-[11px] text-slate-600">Driver: <strong>{selectedDispute.chainOfCustody.logisticsPickup?.actorName}</strong></p>
                  <p className="text-[10px] text-slate-500">{selectedDispute.chainOfCustody.logisticsPickup?.timestamp}</p>
                </div>

                {/* 4. Delivery */}
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-950 space-y-1">
                  <span className="text-[10px] font-black text-red-900 uppercase block">4. Company Delivery</span>
                  <strong className="text-red-900 font-black block">{selectedDispute.chainOfCustody.companyDelivery?.weightKg} kg (Deficit)</strong>
                  <p className="text-[11px] text-red-800">Condition: {selectedDispute.chainOfCustody.companyDelivery?.condition}</p>
                  <p className="text-[10px] text-red-700">{selectedDispute.chainOfCustody.companyDelivery?.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Dispute Resolution Form */}
            {selectedDispute.status !== 'Resolved' && (
              <form onSubmit={handleResolveSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm font-semibold">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Admin Dispute Adjudication & Liability Assignment:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Assign Liability Party</label>
                    <select
                      value={assignedLiability}
                      onChange={(e) => setAssignedLiability(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                    >
                      <option value="Logistics Partner">Logistics Partner (Transit Deficit)</option>
                      <option value="Field Agent">Field Agent (Collection Discrepancy)</option>
                      <option value="Warehouse">Warehouse Storage Facility</option>
                      <option value="Buyer">Buyer Receiving Dock Issue</option>
                      <option value="Platform Shared">Platform Shared Operating Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Resolution Adjudication Note</label>
                    <input
                      type="text"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Explain resolution decision and settlement adjustment..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Resolve Dispute & Log Audit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
