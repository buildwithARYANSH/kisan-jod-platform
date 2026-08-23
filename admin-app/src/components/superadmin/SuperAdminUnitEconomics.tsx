import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { DollarSign, ArrowDownRight, ArrowUpRight, Calculator } from 'lucide-react';

export const SuperAdminUnitEconomics: React.FC = () => {
  const { orders } = useSuperAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Platform Unit Economics & Order Breakdown
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Itemized order-by-order financial formula: Company Payment − Farmer Payment − Agent Cost − Logistics − Storage = Platform Service Fee.
        </p>
      </div>

      {/* Unit Economics Cards per order */}
      <div className="space-y-4">
        {orders.map((ord) => {
          const companyPay = ord.financials.companyPayment;
          const farmerPay = ord.financials.farmerPayment;
          const agentCost = ord.financials.fieldAgentCost;
          const logisticsCost = ord.financials.logisticsCost;
          const storageCost = ord.financials.storageCost;
          const handlingCost = ord.financials.qualityHandlingCost;
          const platformFee = ord.financials.platformServiceFee;
          const totalExpenses = farmerPay + agentCost + logisticsCost + storageCost + handlingCost;
          const netMargin = companyPay - totalExpenses;

          return (
            <div key={ord.orderId} className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-3">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <strong className="text-gray-900  text-base">{ord.cropName}</strong>
                  <span className="text-xs font-mono text-gray-400 ml-2">({ord.orderId} • Buyer: {ord.companyName})</span>
                </div>
                <span className="text-sm font-black text-blue-600 ">
                  Total Volume: {ord.confirmedQtyKg.toLocaleString()} kg
                </span>
              </div>

              {/* Order Formula Line Items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs text-center font-bold">
                <div className="p-3 rounded-xl bg-blue-50  text-blue-900 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Buyer Payment</span>
                  <span>+ ₹{companyPay.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Farmer Payout</span>
                  <span className="text-green-600">- ₹{farmerPay.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Agent Cost</span>
                  <span className="text-amber-600">- ₹{agentCost.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Logistics Cost</span>
                  <span className="text-amber-600">- ₹{logisticsCost.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 ">
                  <span className="text-[10px] text-gray-400 block font-normal">Storage & Handling</span>
                  <span className="text-amber-600">- ₹{(storageCost + handlingCost).toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-50  text-purple-900 ">
                  <span className="text-[10px] text-purple-600 block font-normal">Platform Service Fee</span>
                  <span>₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-extrabold">
                  <span className="text-[10px] text-emerald-100 block font-normal">Order Net Margin</span>
                  <span className="text-sm">₹{netMargin.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
