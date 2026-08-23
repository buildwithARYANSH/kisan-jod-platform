import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import type { AdminNavSection } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck, 
  ShoppingCart, 
  Warehouse, 
  Sprout, 
  BarChart3, 
  Scale, 
  Sparkles, 
  Truck, 
  Wallet, 
  ShieldAlert, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  FileSpreadsheet, 
  User, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { activeSection, setActiveSection, riskAlerts, disputes } = useAdmin();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeDisputesCount = disputes.filter(d => d.status !== 'Resolved').length;
  const activeRisksCount = riskAlerts.filter(r => r.status === 'Requires Review').length;

  const navItems: { id: AdminNavSection; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'farmers', label: 'Farmers', icon: <Users className="w-4 h-4" />, badge: 'Directory' },
    { id: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4" />, badge: 'Buyers' },
    { id: 'field-agents', label: 'Field Agents', icon: <UserCheck className="w-4 h-4" />, badge: 'Operations' },
    { id: 'orders', label: 'Orders & Timeline', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory & Warehouses', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'crop-availability', label: 'Crop Availability & Price', icon: <Sprout className="w-4 h-4" /> },
    { id: 'demand', label: 'Demand Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'price-intelligence', label: 'Price Intelligence Engine', icon: <Scale className="w-4 h-4" />, badge: 'AI Engine' },
    { id: 'ai-predictions', label: 'AI Prediction Performance', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'logistics', label: 'Logistics Payments', icon: <Truck className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance Portal', icon: <Wallet className="w-4 h-4" />, badge: 'Ledger' },
    { 
      id: 'disputes', 
      label: 'Disputes & Chain of Custody', 
      icon: <ShieldAlert className="w-4 h-4" />, 
      badge: activeDisputesCount > 0 ? `${activeDisputesCount}` : undefined,
      badgeColor: 'bg-red-600 text-white'
    },
    { 
      id: 'risk', 
      label: 'Risk & Anomalies', 
      icon: <AlertTriangle className="w-4 h-4" />, 
      badge: activeRisksCount > 0 ? `${activeRisksCount}` : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    { id: 'matching', label: 'Demand-Supply Matching', icon: <Layers className="w-4 h-4" /> },
    { id: 'forecasting', label: 'Demand Forecasting', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside 
      className={`bg-white border border-amber-100 text-slate-800 rounded-3xl p-3.5 shadow-md transition-all duration-300 shrink-0 flex flex-col justify-between ${
        isCollapsed ? 'w-full md:w-20' : 'w-full md:w-64 lg:w-72'
      }`}
    >
      <div>
        {/* Collapse/Expand Toggle Header */}
        <div className="hidden md:flex items-center justify-between px-2 pb-3 mb-2 border-b border-amber-100">
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Admin Navigation
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer ml-auto transition-colors shadow-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar max-h-[calc(100vh-220px)] md:overflow-y-auto pr-0.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-between gap-2.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md scale-102 font-black'
                    : 'text-slate-800 hover:bg-amber-50/80 hover:text-amber-950'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg ${isActive ? 'text-white' : 'text-amber-700'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-950 border border-amber-200')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
