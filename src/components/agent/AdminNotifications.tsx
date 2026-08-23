import React from 'react';
import { useAdmin } from '../../context/AgentContext';
import { Bell, Check, Trash2, ShieldAlert } from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Operational Notifications & Alerts
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            System alerts regarding priority task assignments, logistics dispatches & rating updates.
          </p>
        </div>

        <button
          onClick={clearNotifications}
          className="py-2 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Trash2 className="w-4 h-4 text-red-500" /> Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border shadow-sm flex items-start justify-between gap-3 transition-colors ${
              notif.read
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75'
                : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {notif.priority === 'high' && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[9px] font-black uppercase">
                    High Priority
                  </span>
                )}
                <strong className="text-sm text-gray-900 dark:text-white font-extrabold">
                  {notif.title}
                </strong>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{notif.message}</p>
              <span className="text-[10px] text-gray-400 block">{notif.timestamp}</span>
            </div>

            {!notif.read && (
              <button
                onClick={() => markNotificationRead(notif.id)}
                className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 cursor-pointer shrink-0"
                title="Mark as Read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
