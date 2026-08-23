import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { FileText, ShieldCheck } from 'lucide-react';

export const SuperAdminAuditLog: React.FC = () => {
  const { auditLogs } = useSuperAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Platform Immutable Audit Log & Action Trail
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Complete audit trail recording all administrative overrides, price updates & dispute resolutions.
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Log ID / Timestamp</th>
                <th className="p-3">Actor / Admin</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Previous Value</th>
                <th className="p-3">New Value</th>
                <th className="p-3 text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono">
                    <strong className="text-gray-900  block">{log.id}</strong>
                    <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                  </td>
                  <td className="p-3 font-semibold">{log.actor}</td>
                  <td className="p-3 font-bold text-blue-600">{log.action}</td>
                  <td className="p-3 font-semibold text-gray-900 ">{log.entity}</td>
                  <td className="p-3 font-mono text-gray-400">{log.previousValue}</td>
                  <td className="p-3 font-mono text-green-600 font-bold">{log.newValue}</td>
                  <td className="p-3 text-right text-[11px] text-gray-500 italic max-w-xs truncate">
                    {log.reason || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
