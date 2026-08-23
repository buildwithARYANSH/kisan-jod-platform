import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AlertTriangle, ShieldCheck, Eye, CheckCircle2, FileText, Camera, ArrowRight, UserCheck } from 'lucide-react';
import type { DisputeTicket } from '../../types';

export const SuperAdminDisputes: React.FC = () => {
  const { disputes, resolveDispute, selectedDispute, setSelectedDispute, orders } = useSuperAdmin();

  // Resolve Modal State
  const [resolutionText, setResolutionText] = useState('Logistics leg discrepancy verified. Driver scale error resolved with partial insurance credit.');
  const [liability, setLiability] = useState('Sample Logistics Partner (3rd-Party Freight)');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const activeDisputes = disputes.filter((d) => d.status !== 'Resolved');

  const handleOpenResolve = (dispute: DisputeTicket) => {
    setSelectedDispute(dispute);
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    resolveDispute(selectedDispute.disputeId, resolutionText, liability);
    setIsResolveModalOpen(false);
  };

  // Find related order custody checkpoints if available
  const relatedOrder = selectedDispute ? orders.find((o) => o.orderId === selectedDispute.orderId) : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600/10 via-amber-600/10 to-blue-600/10   p-5 rounded-2xl border border-red-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Dispute & Exception Center — 4-Checkpoint Chain of Custody
          </h2>
          <p className="text-xs text-gray-600  mt-1">
            Resolve disputes based on empirical evidence trails across Collection, Inventory, Logistics & Delivery checkpoints.
          </p>
        </div>

        <div className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-xl border border-red-200">
          {activeDisputes.length} Open Disputes Under Review
        </div>
      </div>

      {/* Disputes Queue Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h3 className="text-sm font-bold text-gray-900  mb-4">
          Active Dispute Tickets Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Ticket ID / Date</th>
                <th className="p-3">Dispute Type</th>
                <th className="p-3">Raised By</th>
                <th className="p-3">Escalation Level</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {disputes.map((dsp) => (
                <tr key={dsp.disputeId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">
                    <strong className="text-gray-900  block">{dsp.disputeId}</strong>
                    <span className="text-[10px] text-gray-400 font-mono">Order: {dsp.orderId} • {dsp.createdAt}</span>
                  </td>
                  <td className="p-3 font-bold text-red-600 ">{dsp.type}</td>
                  <td className="p-3 font-semibold">{dsp.raisedBy}</td>
                  <td className="p-3 font-bold text-amber-600">{dsp.escalationLevel}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      dsp.status === 'Resolved'
                        ? 'bg-green-100  text-green-800 '
                        : 'bg-red-100  text-red-800 '
                    }`}>
                      {dsp.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedDispute(dsp)}
                        className="py-1 px-2.5 rounded-lg bg-blue-50  text-blue-600 text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chain of Custody
                      </button>
                      {dsp.status !== 'Resolved' && (
                        <button
                          onClick={() => handleOpenResolve(dsp)}
                          className="py-1 px-2.5 rounded-lg bg-green-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Resolve Ticket
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chain-of-Custody Side-by-Side Evidence Viewer Modal */}
      {selectedDispute && !isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-5xl w-full border border-gray-200  shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedDispute.disputeId}</span>
                <h3 className="text-xl font-extrabold text-gray-900 ">
                  Dispute Type: {selectedDispute.type} (Order #{selectedDispute.orderId})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Raised By: {selectedDispute.raisedBy} • {selectedDispute.createdAt}</p>
              </div>

              <button
                onClick={() => setSelectedDispute(null)}
                className="px-3 py-1 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-red-50  border border-red-200 text-xs text-red-900 ">
              <strong>Issue Description:</strong> {selectedDispute.description}
            </div>

            {/* 4-Checkpoint Chain of Custody Side-by-Side Comparison */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Side-by-Side Checkpoint Evidence Comparison:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {relatedOrder?.custodyCheckpoints.map((cp, idx) => (
                  <div
                    key={cp.checkpointName}
                    className={`p-4 rounded-2xl border ${
                      cp.verified
                        ? 'bg-gray-50  border-gray-200 '
                        : 'bg-red-50  border-red-300 '
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-blue-600">
                        {idx + 1}. {cp.checkpointName}
                      </span>
                      {cp.verified ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>

                    <div className="space-y-1 text-gray-700 ">
                      <p>Weight: <strong className="text-gray-900 ">{cp.weightKg.toLocaleString()} kg</strong></p>
                      <p>Grade: <strong>{cp.grade}</strong></p>
                      <p>Timestamp: <span className="text-gray-500 font-mono text-[10px]">{cp.timestamp}</span></p>
                      <p>Verified By: <strong>{cp.actorName}</strong></p>
                      <p className="text-[11px] italic text-gray-500 mt-1">{cp.condition}</p>
                    </div>
                  </div>
                )) || (
                  <div className="p-4 rounded-2xl bg-gray-50 text-xs text-gray-500 col-span-4">
                    Sample chain-of-custody evidence checkpoint log active.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              {selectedDispute.status !== 'Resolved' && (
                <button
                  onClick={() => handleOpenResolve(selectedDispute)}
                  className="py-2.5 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md"
                >
                  Resolve Dispute Ticket Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Dispute Modal */}
      {isResolveModalOpen && selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/70  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900  mb-2">
              Resolve Dispute #{selectedDispute.disputeId}
            </h3>

            <form onSubmit={handleConfirmResolve} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Assign Liability To:
                </label>
                <select
                  value={liability}
                  onChange={(e) => setLiability(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  font-bold"
                >
                  <option value="Sample Logistics Partner (3rd-Party Freight)">Sample Logistics Partner (3rd-Party Freight)</option>
                  <option value="Field Agent Ground Inspection">Field Agent Ground Inspection</option>
                  <option value="Inventory Storage Facility Operator">Inventory Storage Facility Operator</option>
                  <option value="Company Buyer Scale Claim">Company Buyer Scale Claim</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Official Admin Resolution Notes:
                </label>
                <textarea
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  font-semibold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
                >
                  Save Resolution & Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
