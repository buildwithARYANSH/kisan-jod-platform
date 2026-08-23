import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const AdminFinancePortal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 uppercase tracking-wider border border-emerald-200">
          Financial Control & Escrow Accounting Ledger
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Platform Finance Portal & Transaction Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Accounting-style presentation tracking incoming buyer wire receipts, farmer payouts, field agent commissions & net platform operating results.
        </p>
      </div>

      {/* Accounting Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm font-semibold">
        {/* Incoming */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" /> Incoming Buyer Wire Receipts
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-fraunces">₹66,70,000</p>
          <div className="space-y-1 text-slate-600 text-xs">
            <div className="flex justify-between"><span>Produce Cost Receipts:</span> <span>₹62,50,000</span></div>
            <div className="flex justify-between"><span>Logistics Pass-Through:</span> <span>₹2,80,000</span></div>
            <div className="flex justify-between"><span>Platform Service Fees:</span> <span>₹1,40,000</span></div>
          </div>
        </div>

        {/* Outgoing */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-amber-600" /> Outgoing Operational Payouts
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 font-fraunces">₹62,70,000</p>
          <div className="space-y-1 text-slate-600 text-xs">
            <div className="flex justify-between"><span>Farmer Direct Settlements:</span> <span>₹58,50,000</span></div>
            <div className="flex justify-between"><span>Field Agent Commissions:</span> <span>₹1,40,000</span></div>
            <div className="flex justify-between"><span>Logistics Freight Settlements:</span> <span>₹2,80,000</span></div>
          </div>
        </div>

        {/* Platform Net Result */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-500 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Platform Net Operating Margin
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black text-[10px]">Net Result</span>
          </div>
          <p className="text-3xl font-black text-emerald-900 font-fraunces">+ ₹4,00,000</p>
          <p className="text-xs text-emerald-800 font-semibold">
            Clear separation of Produce Product Cost, Transport Pass-through, Field Agent Fee & Net Platform Revenue.
          </p>
        </div>
      </div>

      {/* Transaction Details Ledger Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 font-fraunces">
          Platform Transaction Audit Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Transaction ID / Ref</th>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Party Involved</th>
                <th className="p-3.5">Transaction Type</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-bold">TXN-2026-9912</td>
                <td className="p-3.5 font-mono text-blue-900">ORD-2026-0819-01</td>
                <td className="p-3.5 font-bold">AgroProcure Foods Pvt Ltd</td>
                <td className="p-3.5 text-emerald-800 font-bold">Buyer Escrow Milestone Deposit</td>
                <td className="p-3.5 font-black text-slate-900 font-fraunces">₹4,80,000</td>
                <td className="p-3.5 text-slate-500">2026-08-19</td>
                <td className="p-3.5 text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs">Completed</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-bold">TXN-2026-9915</td>
                <td className="p-3.5 font-mono text-blue-900">ORD-2026-0819-01</td>
                <td className="p-3.5 font-bold">Gurdev Singh (Farmer FAR-1001)</td>
                <td className="p-3.5 text-amber-800 font-bold">Farmer Direct Bank Payout</td>
                <td className="p-3.5 font-black text-slate-900 font-fraunces">₹4,25,000</td>
                <td className="p-3.5 text-slate-500">2026-08-20</td>
                <td className="p-3.5 text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
