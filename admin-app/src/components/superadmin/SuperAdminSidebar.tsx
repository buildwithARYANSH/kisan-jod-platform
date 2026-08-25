import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import type { SuperAdminNavSection } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ShieldCheck, 
  ShoppingBag, 
  DollarSign, 
  Sprout, 
  Scale, 
  BrainCircuit, 
  BarChart3, 
  GitMerge, 
  TrendingUp, 
  Truck, 
  Warehouse, 
  Receipt, 
  AlertTriangle, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';

export const SuperAdminSidebar: React.FC = () => {
  const { activeSection, setActiveSection, disputes, riskAlerts } = useSuperAdmin();

  const openDisputesCount = disputes.filter((d) => d.status !== 'Resolved').length;
  const criticalRiskCount = riskAlerts.filter((r) => r.status === 'Requires Review').length;

  const navItems: { id: SuperAdminNavSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'farmers-master', label: 'Farmers Master', icon: <Users className="w-4 h-4" /> },
    { id: 'companies-master', label: 'Companies Master', icon: <Building2 className="w-4 h-4" /> },
    { id: 'field-agents-master', label: 'Field Agents Master', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'orders-master', label: 'Orders Master', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'unit-economics', label: 'Unit Economics', icon: <DollarSign className="w-4 h-4" />, badge: 'Per Order' },
    { id: 'crop-availability', label: 'Crop Availability & Price', icon: <Sprout className="w-4 h-4" /> },
    { id: 'price-intelligence', label: 'AI Price Intelligence', icon: <Scale className="w-4 h-4" />, badge: 'AI Fair' },
    { id: 'ai-predictions', label: 'AI Prediction Monitor', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'total-demand', label: 'Demand Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'demand-matching', label: 'Demand-Supply Matching', icon: <GitMerge className="w-4 h-4" />, badge: '87% Match' },
    { id: 'demand-forecasting', label: 'Demand Forecasting', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'logistics-payments', label: 'Logistics Payments', icon: <Truck className="w-4 h-4" /> },
    { id: 'warehouses-master', label: 'Warehouses & Flow', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'finance-portal', label: 'Finance Portal', icon: <Receipt className="w-4 h-4" /> },
    { 
      id: 'disputes-center', 
      label: 'Disputes Center', 
      icon: <AlertTriangle className="w-4 h-4" />, 
      badge: openDisputesCount > 0 ? `${openDisputesCount} Open` : undefined 
    },
    { 
      id: 'risk-anomalies', 
      label: 'Risk & Anomalies', 
      icon: <ShieldAlert className="w-4 h-4" />, 
      badge: criticalRiskCount > 0 ? `${criticalRiskCount} Alerts` : undefined 
    },
    { id: 'audit-log', label: 'Platform Audit Log', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-amber-200 p-3 shrink-0 text-slate-800 rounded-2xl md:rounded-none shadow-sm font-sans">
      <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-auto md:w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md font-extrabold'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-950 font-bold'
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
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
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
