import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import type { LogisticsNavSection } from '../../types';
import { 
  LayoutDashboard, 
  PackageCheck, 
  Truck, 
  History, 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  User 
} from 'lucide-react';

export const LogisticsSidebar: React.FC = () => {
  const { activeSection, setActiveSection, shipments } = useLogistics();

  const pickupRequestsCount = shipments.filter((s) => s.status === 'Pickup Requested').length;
  const activeDeliveriesCount = shipments.filter((s) => s.status !== 'Delivered' && s.status !== 'Pickup Requested').length;

  const navItems: { id: LogisticsNavSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'pickup-requests', 
      label: 'Pickup Requests', 
      icon: <PackageCheck className="w-4 h-4" />, 
      badge: pickupRequestsCount > 0 ? `${pickupRequestsCount} New` : undefined 
    },
    { 
      id: 'active-deliveries', 
      label: 'Active Deliveries', 
      icon: <Truck className="w-4 h-4" />, 
      badge: activeDeliveriesCount > 0 ? `${activeDeliveriesCount} Active` : undefined 
    },
    { id: 'delivery-history', label: 'Delivery History', icon: <History className="w-4 h-4" /> },
    { id: 'drivers', label: 'Drivers', icon: <Users className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'issues', label: 'Issues & Support', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-3 shrink-0 text-slate-300">
      <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                      ? 'bg-white text-blue-900'
                      : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
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
