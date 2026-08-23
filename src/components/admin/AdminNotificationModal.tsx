import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Bell, X, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminNotificationModal: React.FC = () => {
  const { 
    isAdminNotificationOpen, 
    setIsAdminNotificationOpen, 
    riskAlerts, 
    disputes, 
    setActiveSection 
  } = useAdmin();

  if (!isAdminNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-200 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsAdminNotificationOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 font-fraunces">Admin Operational Alerts</h3>
            <p className="text-xs text-slate-500 font-semibold">Active disputes & system risk alerts</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs font-semibold">
          {riskAlerts.map((r) => (
            <div
              key={r.id}
              onClick={() => {
                setActiveSection('risk');
                setIsAdminNotificationOpen(false);
              }}
              className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 hover:bg-amber-100 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex justify-between font-black">
                <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-600" /> {r.entityName}</span>
                <span className="text-[10px] font-mono font-bold bg-amber-200 px-2 py-0.5 rounded">{r.severity} Risk</span>
              </div>
              <p className="text-xs text-amber-900">{r.reason}</p>
            </div>
          ))}

          {disputes.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                setActiveSection('disputes');
                setIsAdminNotificationOpen(false);
              }}
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-950 hover:bg-red-100 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex justify-between font-black">
                <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-red-600" /> Ticket #{d.id} ({d.type})</span>
                <span className="text-[10px] font-mono font-bold bg-red-200 px-2 py-0.5 rounded">{d.status}</span>
              </div>
              <p className="text-xs text-red-900">{d.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsAdminNotificationOpen(false)}
            className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
