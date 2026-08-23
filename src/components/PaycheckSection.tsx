import React from 'react';
import { useApp } from '../context/AppContext';
import { ReceiptText, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PaycheckSection: React.FC = () => {
  const { paychecks, setSelectedReceipt, t } = useApp();

  return (
    <section className="my-6 px-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-violet-200 shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <ReceiptText className="w-6 h-6 text-violet-600" />
            {t.paycheckSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Transparent milestone payouts, itemized transport/handling deductions & verified digital receipts
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-black shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Direct Bank Settlement Active
        </div>
      </div>

      {/* Transactions List */}
      {paychecks.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-violet-300 text-slate-600 font-bold">
          {t.noTransactionsYet}
        </div>
      ) : (
        <div className="space-y-4">
          {paychecks.map((pay) => (
            <div
              key={pay.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-violet-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-violet-300"
            >
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono border border-slate-200">
                    {pay.txnId}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {pay.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {pay.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 font-fraunces mt-1">
                  {pay.cropOrProduct}
                </h3>

                <div className="text-xs sm:text-sm text-slate-700 font-semibold flex flex-wrap gap-x-4 gap-y-1">
                  <span>Quantity: <strong className="text-slate-900 font-bold">{pay.quantity.toLocaleString()} {pay.unit}</strong></span>
                  <span>Rate: <strong className="text-slate-900 font-bold">₹{pay.pricePerUnit}/{pay.unit}</strong></span>
                  <span>Buyer: <strong className="text-slate-900 font-bold">{pay.buyerName}</strong></span>
                </div>
              </div>

              {/* Right Amounts & Receipt Trigger Button */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                    Final Amount Credited
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 font-fraunces">
                    ₹{pay.finalAmountReceived.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedReceipt(pay)}
                  className="py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  {t.viewReceipt}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
