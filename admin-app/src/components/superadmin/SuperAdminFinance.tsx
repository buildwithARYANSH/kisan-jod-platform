import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Receipt, DollarSign, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

export const SuperAdminFinance: React.FC = () => {
  const { finance } = useSuperAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
            <Receipt className="w-6 h-6 text-green-600" />
            Platform Finance Portal & Ledger Breakdown
          </h2>
          <p className="text-xs text-gray-500  mt-1">
            Accounting-style financial presentation of incoming buyer payments, farmer payouts, agent fees & net margin.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-green-50  text-green-700 text-xs font-bold border border-green-200">
          Escrow Settlement Active
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Total Buyer Revenue</span>
          <span className="text-2xl font-black text-gray-900  mt-1 block">₹{finance.totalRevenueINR.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Farmer Payouts</span>
          <span className="text-2xl font-black text-green-600  mt-1 block">₹{finance.farmerPayoutsINR.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Logistics & Storage Expenses</span>
          <span className="text-2xl font-black text-amber-600  mt-1 block">₹{(finance.logisticsCostsINR + finance.storageCostsINR).toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Platform Net Profit</span>
          <span className="text-2xl font-black text-purple-600  mt-1 block">₹{finance.netMarginINR.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
