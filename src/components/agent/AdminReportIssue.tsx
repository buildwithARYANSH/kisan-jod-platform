import React, { useState } from 'react';
import { useAdmin } from '../../context/AgentContext';
import { AlertTriangle, PlusCircle, CheckCircle2 } from 'lucide-react';

export const AdminReportIssue: React.FC = () => {
  const { issues, submitIssue } = useAdmin();

  const [issueType, setIssueType] = useState('Quantity Mismatch');
  const [related, setRelated] = useState('Task #TSK-1092');
  const [description, setDescription] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    submitIssue(issueType, related, description);
    setDescription('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Report Operational Issue & Escalation
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Escalate ground problems (quantity mismatches, farmer unavailability, storage delays) without falsifying task logs.
        </p>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Issue submitted and escalated to central operations team.
        </div>
      )}

      {/* Report Issue Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Issue Classification Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
              >
                <option value="Quantity Mismatch">Quantity Mismatch</option>
                <option value="Farmer Unavailable">Farmer Unavailable</option>
                <option value="Produce Quality / Crop Damage">Produce Quality / Crop Damage</option>
                <option value="Inventory Storage Problem">Inventory Storage Problem</option>
                <option value="Logistics Fleet Delay">Logistics Fleet Delay</option>
                <option value="Incorrect Order Details">Incorrect Order Details</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Related Task / Order ID
              </label>
              <input
                type="text"
                value={related}
                onChange={(e) => setRelated(e.target.value)}
                placeholder="e.g. Task #TSK-1092"
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Issue Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe ground situation..."
              className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Submit Issue Escalation
            </button>
          </div>
        </form>
      </div>

      {/* Escalation History */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Reported Issues Escalation Log
        </h3>

        <div className="space-y-3 text-xs">
          {issues.map((iss) => (
            <div key={iss.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white text-sm">{iss.issueType}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                  {iss.status}
                </span>
              </div>
              <p className="text-gray-500 font-mono text-[11px]">{iss.relatedTaskOrOrder} • {iss.reportedDate}</p>
              <p className="text-gray-700 dark:text-gray-300 pt-1">{iss.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
