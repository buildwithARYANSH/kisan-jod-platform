import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminRiskAnomalies: React.FC = () => {
  const { riskAlerts, resolveRiskAlert } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-950 uppercase tracking-wider border border-amber-200">
          Pattern Anomaly Detection Engine
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Risk & Anomaly Detection Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Identifies unusual price surges, repeated quality rejections, transit weight losses & inventory adjustments.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-black text-slate-900 font-fraunces mb-3">Active System Risk Alerts</h3>
        <div className="space-y-3">
          {riskAlerts.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs sm:text-sm font-semibold text-amber-950">
              <div className="flex justify-between items-center font-black">
                <span>{r.entityName} ({r.entityType})</span>
                <span className="px-2.5 py-1 rounded bg-amber-200 text-amber-950 text-xs font-mono font-bold">
                  Score: {r.riskScore}/100 • {r.severity}
                </span>
              </div>
              <p>{r.reason}</p>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => resolveRiskAlert(r.id, 'Resolved')}
                  className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                >
                  Mark Alert Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
