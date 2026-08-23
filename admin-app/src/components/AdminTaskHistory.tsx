import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { History, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminTaskHistory: React.FC = () => {
  const { tasks } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          Task History & Ground Activity Audit Log
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Complete operational log of completed, rescheduled, and reported tasks.
        </p>
      </div>

      {/* Task Audit Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Task ID / Date</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Farmer</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status / Outcome</th>
                <th className="p-3 text-right">Verification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono">
                    <strong className="text-gray-900  block">{task.id}</strong>
                    <span className="text-[10px] text-gray-400">{task.pickupDate}</span>
                  </td>
                  <td className="p-3 font-bold text-gray-900 ">{task.cropName} ({task.quantity.toLocaleString()} {task.unit})</td>
                  <td className="p-3 font-semibold">{task.farmerName}</td>
                  <td className="p-3 font-bold">Priority {task.priority}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800  '
                        : task.status === 'Unable to Complete'
                        ? 'bg-red-100 text-red-800  '
                        : 'bg-amber-100 text-amber-800  '
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-[11px] text-gray-500 italic max-w-xs truncate">
                    {task.completionVerification?.notes || task.failureReason || task.notes || '—'}
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
