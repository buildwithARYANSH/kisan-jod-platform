import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, X, CheckCircle2, ShieldAlert, PhoneCall } from 'lucide-react';
import type { ComplaintTicket } from '../types';

export const ComplaintModal: React.FC = () => {
  const { 
    isComplaintModalOpen, 
    setIsComplaintModalOpen, 
    addComplaint, 
    profile, 
    complaints 
  } = useApp();

  const [category, setCategory] = useState<ComplaintTicket['category']>('Payment Issue');
  const [description, setDescription] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isComplaintModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addComplaint(category, description);
    setSubmittedRef(`CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
  };

  const handleClose = () => {
    setSubmittedRef(null);
    setIsComplaintModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-red-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-fraunces leading-tight">
                Register Complaint / Issue (शिकायत दर्ज करें)
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Direct helpdesk resolution & emergency callback support
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {submittedRef ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 font-fraunces">
                Complaint Ticket Submitted!
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                Your Ticket Reference ID: <strong className="text-emerald-800 font-mono text-sm">{submittedRef}</strong>
              </p>
              <p className="text-xs text-slate-500 font-medium mt-2 max-w-sm mx-auto">
                Our support team will call you back on <strong className="text-slate-900">{profile.phone}</strong> within 2 hours.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Select Problem Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="Payment Issue">Payment Issue (भुगतान संबंधित समस्या)</option>
                <option value="Pickup Delay">Pickup Delay (पिकअप में देरी)</option>
                <option value="Quality Grading Dispute">Quality Grading Dispute (ग्रेडिंग विवाद)</option>
                <option value="Agent Behavior">Field Agent Behavior (एजेंट व्यवहार)</option>
                <option value="App Issue">App / Technical Problem (ऐप समस्या)</option>
                <option value="Other">Other Problem (अन्य समस्या)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Describe your Problem / Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem in detail or write your concern..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center justify-between">
              <span>Registered Phone: <strong className="text-slate-900 font-bold">{profile.phone}</strong></span>
              <span className="flex items-center gap-1 text-amber-800 font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                2-Hour Callback
              </span>
            </div>

            {/* Previous Tickets List */}
            {complaints.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 mb-1">Recent Submitted Complaints:</p>
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  {complaints.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-2 rounded-xl bg-slate-100 flex justify-between items-center text-[11px]">
                      <span className="font-mono font-bold text-slate-800">{c.id} - {c.category}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-bold">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2">
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
                <AlertCircle className="w-4 h-4" />
                Submit Complaint
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
