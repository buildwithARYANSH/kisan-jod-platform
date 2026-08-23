import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, QrCode, FileText } from 'lucide-react';
import { fireConfetti } from '../utils/confetti';

export const DigitalReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, t } = useApp();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    fireConfetti({ particleCount: 40, spread: 50 });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => setSelectedReceipt(null)}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 uppercase">
            Official Kisan Jod Receipt
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1.5 font-fraunces">
            Settlement Receipt
          </h3>
          <p className="text-xs text-slate-500 font-mono font-bold mt-0.5">
            {selectedReceipt.txnId} • {selectedReceipt.date}
          </p>
        </div>

        {/* Itemized Table Breakdown */}
        <div className="my-4 space-y-3 text-xs sm:text-sm font-semibold">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-700">
              <span>Commodity / Produce:</span>
              <strong className="text-slate-900 font-extrabold">{selectedReceipt.cropOrProduct}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Delivered Quantity:</span>
              <strong className="text-slate-900 font-extrabold">{selectedReceipt.quantity.toLocaleString()} {selectedReceipt.unit}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Agreed Buyer Rate:</span>
              <strong className="text-slate-900 font-extrabold">₹{selectedReceipt.pricePerUnit}/{selectedReceipt.unit}</strong>
            </div>
            <div className="flex justify-between text-slate-900 font-black pt-2 border-t border-slate-200">
              <span>Gross Buyer Payment:</span>
              <span>₹{selectedReceipt.grossAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Itemized Deductions */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 text-amber-950 font-bold">
            <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider mb-1">
              Transparent Operational Cost Deductions:
            </div>
            <div className="flex justify-between">
              <span>Transport Pass-through Cost:</span>
              <span>- ₹{selectedReceipt.transportDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Field Agent Inspection / Handling:</span>
              <span>- ₹{selectedReceipt.handlingDeduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Service Fee:</span>
              <span>- ₹{selectedReceipt.platformCommission.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Final Settlement Amount */}
          <div className="p-4 rounded-2xl bg-emerald-600 text-white flex justify-between items-center shadow-lg">
            <div>
              <span className="text-[11px] text-emerald-100 font-bold block uppercase tracking-wider">
                Net Credited Amount
              </span>
              <span className="text-xs text-emerald-200 font-semibold">{selectedReceipt.paymentMethod}</span>
            </div>
            <span className="text-2xl font-black font-fraunces">
              ₹{selectedReceipt.finalAmountReceived.toLocaleString()}
            </span>
          </div>

          {/* Verification QR & Buyer info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-700 font-semibold">
              <p>Buyer: <strong className="text-slate-900 font-extrabold">{selectedReceipt.buyerName}</strong></p>
              <p>Account: <strong className="text-slate-900 font-extrabold">{selectedReceipt.bankAccount}</strong></p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
              <QrCode className="w-8 h-8 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Receipt Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {t.downloadReceipt}
          </button>
        </div>
      </div>
    </div>
  );
};
