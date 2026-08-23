import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, PlusCircle } from 'lucide-react';

export const LogisticsIssues: React.FC = () => {
  const [issueType, setIssueType] = useState('Vehicle Breakdown');
  const [orderId, setOrderId] = useState('ORD-BUY-101');
  const [description, setDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setSubmittedMessage(true);
    setDescription('');
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Logistics Issues & Support Escalation
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Report transportation incidents (breakdowns, inventory delays, gate rejection) directly into the shared dispute system.
        </p>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Issue ticket created and submitted to platform operations team.
        </div>
      )}

      {/* Form */}
      <div className="bg-white  p-6 rounded-3xl border border-gray-200  shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700  mb-1">Incident Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-bold bg-gray-50 "
              >
                <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                <option value="Driver Unavailable">Driver Unavailable</option>
                <option value="Pickup Location Gate Closed">Pickup Location Gate Closed</option>
                <option value="Destination Receiving Delayed">Destination Receiving Delayed</option>
                <option value="Quantity Mismatch at Pickup">Quantity Mismatch at Pickup</option>
                <option value="Cargo Moisture / Damage Issue">Cargo Moisture / Damage Issue</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700  mb-1">Order ID / Batch ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-2.5 rounded-xl border font-bold bg-gray-50 "
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700  mb-1">Detailed Description & Evidence Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe situation..."
              className="w-full p-2.5 rounded-xl border font-semibold"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md cursor-pointer"
            >
              Submit Support Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
