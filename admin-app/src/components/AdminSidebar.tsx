import React from 'react';
import { useAdmin } from '../context/AdminContext';
import type { AdminNavSection } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Warehouse, 
  ShoppingBag, 
  Truck, 
  Star, 
  Gift, 
  Bell, 
  History, 
  AlertTriangle, 
  User 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { activeSection, setActiveSection, unreadCount, tasks } = useAdmin();

  const priority1TasksCount = tasks.filter((t) => t.priority === 1 && t.status !== 'Completed').length;

  const navItems: { id: AdminNavSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'daily-tasks',
      label: 'Daily Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: priority1TasksCount > 0 ? `${priority1TasksCount} Urgent` : undefined,
    },
    {
      id: 'farmers',
      label: 'Farmers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'inventory',
      label: 'Inventory Storage',
      icon: <Warehouse className="w-4 h-4" />,
    },
    {
      id: 'orders',
      label: 'Orders Workflow',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'dispatch',
      label: 'Company Dispatch',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'rating',
      label: 'My Rating',
      icon: <Star className="w-4 h-4" />,
      badge: '4.3 ★',
    },
    {
      id: 'referrals',
      label: 'Refer & Earn',
      icon: <Gift className="w-4 h-4" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
    },
    {
      id: 'task-history',
      label: 'Task History',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'report-issue',
      label: 'Report Issue',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white  border-b md:border-b-0 md:border-r border-gray-200  p-3 shrink-0">
      <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-auto md:w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700  hover:bg-gray-100 dark:hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-wider ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
