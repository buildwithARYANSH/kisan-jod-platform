import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { ReceiptText, Eye, ShieldCheck } from 'lucide-react';

export const CompanyReceipts: React.FC = () => {
  const { receipts, setSelectedReceipt } = useCompany();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <ReceiptText className="w-6 h-6 text-blue-600" />
            Invoices & Payment Receipts
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Itemized B2B invoices separating Produce Cost, Transport Pass-through & Platform Fees.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-black shrink-0">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Milestone Escrow Active
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Invoice ID / Crop</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Product Cost</th>
                <th className="p-3.5">Transport (Pass-through)</th>
                <th className="p-3.5">Platform Fee</th>
                <th className="p-3.5">Total Payable</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-black block font-fraunces">{rec.cropName}</strong>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{rec.invoiceId} • {rec.date}</span>
                  </td>
                  <td className="p-3.5 font-bold">{rec.quantity.toLocaleString()} {rec.unit}</td>
                  <td className="p-3.5 font-black text-slate-900">₹{rec.productCost.toLocaleString()}</td>
                  <td className="p-3.5 text-amber-800 font-extrabold">₹{rec.transportCost.toLocaleString()}</td>
                  <td className="p-3.5 text-blue-800 font-extrabold">₹{rec.platformFee.toLocaleString()}</td>
                  <td className="p-3.5 font-black text-slate-900 text-base font-fraunces">
                    ₹{rec.totalPayable.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      rec.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}>
                      {rec.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      View Invoice
                    </button>
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
