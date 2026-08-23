import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { 
  Crown, 
  Users, 
  Building2, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { farmers, isFarmerActive, companies, isCompanyActive, fieldAgents, orders, disputes, riskAlerts, finance, setActiveSection } = useSuperAdmin();

  const registeredFarmersCount = farmers.length;
  const activeFarmersCount = farmers.filter(isFarmerActive).length;

  const registeredCompaniesCount = companies.length;
  const activeCompaniesCount = companies.filter(isCompanyActive).length;

  const activeAgentsCount = fieldAgents.filter((a) => a.status === 'Active').length;

  const activeOrdersCount = orders.filter((o) => o.currentStatus !== 'Completed').length;
  const pendingOrdersCount = orders.filter((o) => o.currentStatus === 'Demand Created' || o.currentStatus === 'Supply Matched').length;
  const openDisputesCount = disputes.filter((d) => d.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-amber-200 text-slate-900 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 uppercase tracking-wider border border-amber-300">
            Platform Master Control Center
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Super-Admin Operations Overview
          </h2>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            Nationwide agri aggregation metrics, supply-demand matching, financial unit economics & chain-of-custody disputes.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('orders-master')}
          className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Master Orders System ({orders.length})
        </button>
      </div>

      {/* Top Master KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Farmers */}
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Registered Farmers</span>
          <span className="text-2xl font-black text-gray-900  mt-1 block">{registeredFarmersCount}</span>
          <span className="text-[10px] text-green-600 font-bold mt-1 block">
            {activeFarmersCount} Active (90-Day Rule)
          </span>
        </div>

        {/* Companies */}
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Registered Companies</span>
          <span className="text-2xl font-black text-blue-600  mt-1 block">{registeredCompaniesCount}</span>
          <span className="text-[10px] text-blue-600  font-bold mt-1 block">
            {activeCompaniesCount} Active (90-Day Rule)
          </span>
        </div>

        {/* Active Orders */}
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Active Orders</span>
          <span className="text-2xl font-black text-emerald-600  mt-1 block">{activeOrdersCount}</span>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">
            {pendingOrdersCount} Pending Allocation
          </span>
        </div>

        {/* Financial Net Margin */}
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Platform Net Margin</span>
          <span className="text-2xl font-black text-purple-600  mt-1 block">₹{finance.netMarginINR.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 italic block">
            * Estimated Sample Mock Data
          </span>
        </div>
      </div>

      {/* Operational Overview & Risk Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operational Overview */}
        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-3">
          <h3 className="text-sm font-bold text-gray-900  flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            Nationwide Order Pipeline Overview
          </h3>
          <div className="p-4 rounded-xl bg-gray-50  space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Orders Pending Intake:</span>
              <strong className="text-amber-600 font-bold">{pendingOrdersCount} Orders</strong>
            </div>
            <div className="flex justify-between">
              <span>Orders In Transit:</span>
              <strong className="text-blue-600 font-bold">1 Order (#ORD-BUY-101)</strong>
            </div>
            <div className="flex justify-between">
              <span>Open Disputes Under Review:</span>
              <strong className="text-red-600 font-bold">{openDisputesCount} Tickets</strong>
            </div>
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900  flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              High-Risk Anomaly Alerts
            </h3>
            <button
              onClick={() => setActiveSection('risk-anomalies')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-red-50  border border-red-200  text-red-900 ">
                <div className="flex justify-between font-bold">
                  <span>{alert.title}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-red-600 text-white uppercase">{alert.severity}</span>
                </div>
                <p className="text-[11px] text-red-700  mt-1">{alert.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
