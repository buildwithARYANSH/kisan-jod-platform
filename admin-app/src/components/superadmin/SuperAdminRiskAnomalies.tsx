import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SuperAdminRiskAnomalies: React.FC = () => {
  const { riskAlerts, resolveRiskAlert } = useSuperAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          Risk & Anomaly Detection Center
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Automated flagging of price anomalies, quality rejection patterns, inventory loss & suspicious transactions.
        </p>
      </div>

      {/* Risk Alerts List */}
      <div className="space-y-3">
        {riskAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  alert.severity === 'High' || alert.severity === 'Critical'
                    ? 'bg-red-100 text-red-700  '
                    : 'bg-amber-100 text-amber-800  '
                }`}>
                  {alert.severity} Risk
                </span>
                <span className="text-xs text-gray-400 font-mono">{alert.id}</span>
                <strong className="text-sm text-gray-900  font-extrabold">{alert.title}</strong>
              </div>
              <p className="text-xs text-gray-600 ">{alert.reason}</p>
              <p className="text-[11px] text-gray-500 italic">Evidence: {alert.evidence}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 font-semibold">{alert.status}</span>
              {alert.status !== 'Resolved' && (
                <button
                  onClick={() => resolveRiskAlert(alert.id)}
                  className="py-1.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Resolve Alert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
