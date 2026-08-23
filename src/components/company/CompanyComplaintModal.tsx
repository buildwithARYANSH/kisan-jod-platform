import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { LifeBuoy, X, CheckCircle2, ShieldAlert, PhoneCall } from 'lucide-react';
import type { CompanyComplaintTicket } from '../../types';

export const CompanyComplaintModal: React.FC = () => {
  const { 
    isCompanyComplaintModalOpen, 
    setIsCompanyComplaintModalOpen, 
    submitCompanyComplaint,
    profile,
    orders 
  } = useCompany();

  const [category, setCategory] = useState<CompanyComplaintTicket['category']>('Payment & Settlement Dispute');
  const [orderReference, setOrderReference] = useState<string>(orders[0]?.orderId || '');
  const [contactPerson, setContactPerson] = useState(profile.contactPerson || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [description, setDescription] = useState('');

  const [submittedTicket, setSubmittedTicket] = useState<CompanyComplaintTicket | null>(null);

  if (!isCompanyComplaintModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const ticket = submitCompanyComplaint({
      category,
      orderReference,
      contactPerson,
      phone,
      description,
    });

    setSubmittedTicket(ticket);
  };

  const handleClose = () => {
    setIsCompanyComplaintModalOpen(false);
    setSubmittedTicket(null);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-red-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedTicket ? (
          /* Confirmation State */
          <div className="text-center space-y-4 py-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <span className="text-[11px] font-black px-3 py-1 rounded-md bg-emerald-100 text-emerald-950 font-mono border border-emerald-300">
                Ticket ID: {submittedTicket.id}
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-fraunces mt-2">
                Corporate Complaint Registered!
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                Category: <strong>{submittedTicket.category}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-semibold space-y-1 text-left">
              <div className="flex items-center gap-2 font-black text-emerald-900">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                2-Hour Account Manager Call-Back Commitment
              </div>
              <p className="text-xs text-emerald-800">
                Our Dedicated B2B Escalations Desk will review ticket <strong>#{submittedTicket.id}</strong> and call contact <strong>{submittedTicket.contactPerson} ({submittedTicket.phone})</strong> within 2 hours.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          /* Complaint Form */
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold shrink-0 shadow-xs">
                <LifeBuoy className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces leading-tight">
                  Register Support Complaint
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Direct escalation desk for disputes, quality mismatch, transport delays & billing issues
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm font-semibold">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Complaint Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-red-500"
                >
                  <option value="Payment & Settlement Dispute">Payment & Settlement Dispute</option>
                  <option value="Produce Quality Mismatch">Produce Quality / Star Rating Mismatch</option>
                  <option value="Logistics & Delivery Delay">Logistics & Freight Delivery Delay</option>
                  <option value="Field Agent Behavior">Field Agent Inspection Dispute</option>
                  <option value="Invoice & Tax Discrepancy">Invoice & GST Tax Discrepancy</option>
                  <option value="App & Platform Technical Issue">App & Platform Technical Issue</option>
                  <option value="Other Complaint">Other Corporate Inquiry / Complaint</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Order / Demand Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={orderReference}
                  onChange={(e) => setOrderReference(e.target.value)}
                  placeholder="e.g. ORD-2026-0819-01 or Invoice ID"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Describe Your Complaint / Concern in Detail
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Please describe the issue faced (e.g., quality parameters discrepancy, driver delay, billing line item discrepancy)..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Submit Official Complaint
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
