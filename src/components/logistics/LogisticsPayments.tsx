import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { DollarSign, ShieldCheck } from 'lucide-react';

export const LogisticsPayments: React.FC = () => {
  const { payments } = useLogistics();

  const totalEarnings = payments.reduce((acc, p) => acc + p.totalPayableINR, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          Logistics Partner Earnings & Escrow Settlements
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Confidential freight earnings log, agreed transportation charges & payment status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-gray-500 block font-semibold">Total Agreed Earnings</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">₹{totalEarnings.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-gray-500 block font-semibold">Escrow Processing</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">₹4,000</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-gray-500 block font-semibold">Settled & Paid</span>
          <span className="text-2xl font-black text-green-600 mt-1 block">₹9,000</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Payment ID / Order</th>
                <th className="p-3">Delivery Date</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Agreed Charge</th>
                <th className="p-3">Additional Charges</th>
                <th className="p-3">Total Payable</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono">
                    <strong className="text-gray-900 dark:text-white block">{p.id}</strong>
                    <span className="text-[10px] text-gray-400">Order: {p.orderId}</span>
                  </td>
                  <td className="p-3 font-semibold">{p.deliveryDate}</td>
                  <td className="p-3 font-mono">{p.distanceKm} km</td>
                  <td className="p-3 font-bold">₹{p.agreedChargeINR.toLocaleString()}</td>
                  <td className="p-3 text-gray-500">+ ₹{p.approvedAdditionalChargesINR}</td>
                  <td className="p-3 font-black text-green-600 text-sm">₹{p.totalPayableINR.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      p.status === 'Paid'
                        ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {p.status}
                    </span>
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
