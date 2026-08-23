import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Users, 
  Building2, 
  UserCheck, 
  ShoppingCart, 
  Warehouse, 
  BarChart3, 
  Wallet, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  TrendingUp,
  Info
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    farmers, 
    companies, 
    fieldAgents, 
    warehouses, 
    disputes, 
    riskAlerts, 
    auditLogs, 
    inactivityThresholdDays,
    setActiveSection 
  } = useAdmin();

  // Active Calculation Helpers based on activity timestamps (Section 5 & 6)
  const now = new Date().getTime();
  const thresholdMs = inactivityThresholdDays * 24 * 60 * 60 * 1000;

  const activeFarmersCount = farmers.filter((f) => {
    const lastActive = new Date(f.lastActivityDate).getTime();
    return now - lastActive <= thresholdMs;
  }).length;

  const activeCompaniesCount = companies.filter((c) => {
    const lastActive = new Date(c.lastActivityDate).getTime();
    return now - lastActive <= thresholdMs;
  }).length;

  const activeFieldAgentsCount = fieldAgents.filter((a) => a.status === 'Active').length;
  const totalAvailableProduceKg = warehouses.reduce((sum, w) => sum + w.availableStockTon * 1000, 0);

  const activeDisputesCount = disputes.filter((d) => d.status !== 'Resolved').length;
  const activeRisksCount = riskAlerts.filter((r) => r.status === 'Requires Review').length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-amber-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-950 uppercase tracking-wider border border-amber-300">
              Platform Command Center
            </span>
            <span className="text-xs text-slate-500 font-bold">
              Configured Inactivity Window: {inactivityThresholdDays} Days
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-fraunces">
            System Operations & Analytical Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            Real-time monitoring across farmer supply pools, company demands, field agent tasks, warehouse inventory & financial ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={() => setActiveSection('disputes')}
            className="py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            Dispute Queue ({activeDisputesCount})
          </button>
          <button
            onClick={() => setActiveSection('risk')}
            className="py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            Risk Alerts ({activeRisksCount})
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Farmers Card */}
        <div 
          onClick={() => setActiveSection('farmers')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-102 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Farmers Registered
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-950">
              {activeFarmersCount} Active
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-fraunces">{farmers.length}</span>
            <span className="text-xs font-bold text-slate-500">Total Pool</span>
          </div>
        </div>

        {/* Companies Card */}
        <div 
          onClick={() => setActiveSection('companies')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-102 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Companies Registered
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950">
              {activeCompaniesCount} Active
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-fraunces">{companies.length}</span>
            <span className="text-xs font-bold text-slate-500">Buyer Entities</span>
          </div>
        </div>

        {/* Field Agents Card */}
        <div 
          onClick={() => setActiveSection('field-agents')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-102 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-600" />
              Field Agents
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-950">
              {activeFieldAgentsCount} On Ground
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-fraunces">{fieldAgents.length}</span>
            <span className="text-xs font-bold text-slate-500">Operations Team</span>
          </div>
        </div>

        {/* Total Available Produce */}
        <div 
          onClick={() => setActiveSection('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-102 cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Warehouse className="w-4 h-4 text-amber-600" />
              Available Produce
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-950">
              In Storage
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-fraunces">{totalAvailableProduceKg.toLocaleString()} kg</span>
            <span className="text-xs font-bold text-slate-500">Available</span>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards (Sample / Estimated Badges) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Platform Financial Performance & Revenue Summary
          </h3>
          <span className="text-xs text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-extrabold flex items-center gap-1 border border-amber-300">
            <Info className="w-3.5 h-3.5" /> Sample / Estimated Mock Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-semibold">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">Total Platform Gross Revenue</span>
            <span className="text-2xl font-black text-slate-900 font-fraunces mt-1 block">₹66,70,000</span>
            <span className="text-[10px] text-slate-500 font-bold">Cumulative Buyer Receipts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">Total Farmer Payouts</span>
            <span className="text-2xl font-black text-emerald-700 font-fraunces mt-1 block">₹58,50,000</span>
            <span className="text-[10px] text-emerald-700 font-bold">Direct Farmer Settlements</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">Logistics & Handling Costs</span>
            <span className="text-2xl font-black text-amber-700 font-fraunces mt-1 block">₹4,20,000</span>
            <span className="text-[10px] text-amber-700 font-bold">Freight Pass-Through</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-900 block font-bold">Platform Net Operating Result</span>
            <span className="text-2xl font-black text-emerald-800 font-fraunces mt-1 block">₹4,00,000</span>
            <span className="text-[10px] text-emerald-800 font-bold">Net Platform Margin</span>
          </div>
        </div>
      </div>

      {/* Operational Overview & Risk Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Operational Order Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3 text-xs sm:text-sm font-semibold">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2 font-fraunces">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Operational Order Pipeline Status
          </h3>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span>Orders In Transit:</span>
            <strong className="text-blue-900 font-black">2 Orders (65,000 kg)</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span>Orders Completed & Settled:</span>
            <strong className="text-emerald-800 font-black">13 Orders (2,80,000 kg)</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex justify-between items-center text-red-950 font-bold">
            <span>Active Disputes Open:</span>
            <strong className="text-red-700 font-black">{activeDisputesCount} Ticket</strong>
          </div>
        </div>

        {/* High Risk Alerts Callout */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3 text-xs sm:text-sm font-semibold">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2 font-fraunces">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            High-Risk & Anomaly Notifications
          </h3>

          {riskAlerts.slice(0, 2).map((alert) => (
            <div key={alert.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
              <div className="flex justify-between font-black">
                <span>{alert.entityName}</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] uppercase font-mono">
                  Score: {alert.riskScore}/100
                </span>
              </div>
              <p className="text-xs text-amber-900">{alert.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline Stream */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
          <Clock className="w-5 h-5 text-blue-600" />
          Platform System Event Log Stream
        </h3>

        <div className="space-y-3 text-xs sm:text-sm font-semibold">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-extrabold">{log.action}</strong>
                  <span className="text-[10px] text-slate-500 font-bold">{log.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  Actor: <strong>{log.actor}</strong> • Entity: <span className="font-mono text-blue-900 font-bold">{log.entity}</span>
                </p>
                {log.reason && <p className="text-xs text-slate-500 italic mt-0.5">Reason: {log.reason}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
