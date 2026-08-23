import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { X, Printer, QrCode, FileText } from 'lucide-react';
import { fireConfetti } from '../../utils/confetti';

export const CompanyReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt } = useCompany();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    fireConfetti({ particleCount: 40, spread: 50 });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => setSelectedReceipt(null)}
          className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <FileText className="w-6 h-6 text-blue-700" />
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 border border-blue-300 uppercase tracking-wider">
            Official B2B Procurement Invoice
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1.5 font-fraunces">
            Tax Invoice & Settlement
          </h3>
          <p className="text-xs text-slate-500 font-mono font-bold mt-0.5">
            Invoice: {selectedReceipt.invoiceId} • {selectedReceipt.date}
          </p>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="my-4 space-y-3 text-xs sm:text-sm font-semibold">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-700">
              <span>Commodity Requirement:</span>
              <strong className="text-slate-900 font-extrabold">{selectedReceipt.cropName}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Procured Quantity:</span>
              <strong className="text-slate-900 font-extrabold">{selectedReceipt.quantity.toLocaleString()} {selectedReceipt.unit}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Agreed Unit Price:</span>
              <strong className="text-slate-900 font-extrabold">₹{selectedReceipt.agreedUnitPrice}/{selectedReceipt.unit}</strong>
            </div>
            <div className="flex justify-between text-slate-900 font-black pt-2 border-t border-slate-200">
              <span>Produce Product Cost:</span>
              <span>₹{selectedReceipt.productCost.toLocaleString()}</span>
            </div>
          </div>

          {/* Itemized Line Items (SIH Mandate: Keep transport & fees separate!) */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5 text-blue-950 font-bold">
            <div className="text-[11px] font-black text-blue-900 uppercase tracking-wider mb-1">
              Separate Line Item Charges:
            </div>
            <div className="flex justify-between">
              <span>Transport Pass-through Cost (Logistics Fleet):</span>
              <span>+ ₹{selectedReceipt.transportCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Field Inspection & Quality Handling:</span>
              <span>+ ₹{selectedReceipt.handlingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black">
              <span>Platform Service Fee:</span>
              <span>+ ₹{selectedReceipt.platformFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Total & Advances */}
          <div className="p-4 rounded-2xl bg-blue-600 text-white space-y-1 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-100 font-bold">Total Invoice Amount:</span>
              <span className="text-2xl font-black font-fraunces">₹{selectedReceipt.totalPayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-blue-200 pt-1.5 border-t border-blue-500 font-semibold">
              <span>Milestone Advance Paid: ₹{selectedReceipt.advancePaid.toLocaleString()}</span>
              <span>Balance Due: ₹{selectedReceipt.balanceDue.toLocaleString()}</span>
            </div>
          </div>

          {/* Verification QR */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-700 font-semibold">
              <p>Status: <strong className="text-emerald-700 font-black">{selectedReceipt.paymentStatus}</strong></p>
              <p>Verification Code: <strong className="text-slate-900 font-bold">QR-VERIFIED-SECURE</strong></p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
              <QrCode className="w-8 h-8 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
