import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { CreditCard, Building2, QrCode, CheckCircle2, ShieldCheck, Upload, ArrowUpRight, Copy, Check } from 'lucide-react';
import type { CompanyPaymentSubmission } from '../../types';

export const CompanyPaymentPortal: React.FC = () => {
  const { receipts, bankEscrowDetails, paymentSubmissions, submitPaymentProof } = useCompany();

  const pendingInvoices = receipts.filter(r => r.paymentStatus !== 'Paid');
  const totalOutstandingAmount = pendingInvoices.reduce((sum, r) => sum + r.balanceDue, 0);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(pendingInvoices[0]?.invoiceId || receipts[0]?.invoiceId || '');
  const [transferAmount, setTransferAmount] = useState<number>(pendingInvoices[0]?.balanceDue || 240000);
  const [paymentMode, setPaymentMode] = useState<CompanyPaymentSubmission['paymentMode']>('NEFT/RTGS');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || transferAmount <= 0) return;

    submitPaymentProof(selectedInvoiceId, transferAmount, paymentMode, utrNumber);
    setSubmittedMessage(true);
    setUtrNumber('');
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
            Escrow Settlement & Direct Bank Wire
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-2 font-fraunces">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Corporate Pay Portal & Escrow Settlements
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Official bank account details for milestone advances, escrow deposits, and direct wire transfers
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-black shrink-0 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Triple-Verified Escrow Account
        </div>
      </div>

      {/* Outstanding Payable Alert Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            Total Pending Settlement Due
          </span>
          <h3 className="text-2xl sm:text-4xl font-black mt-1 font-fraunces flex items-center gap-2">
            ₹{totalOutstandingAmount.toLocaleString()}
            <ArrowUpRight className="w-8 h-8 text-amber-300" />
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-1">
            {pendingInvoices.length} Pending Invoice Milestones awaiting bank wire confirmation
          </p>
        </div>
      </div>

      {/* Official Bank Escrow Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bank Wire Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <Building2 className="w-5 h-5 text-blue-600" />
            Kisan Jod Official Escrow Bank Details
          </h3>

          <div className="space-y-2.5 text-xs sm:text-sm font-semibold">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[11px]">Bank Name:</span>
                <strong className="text-slate-900 font-extrabold">{bankEscrowDetails.bankName}</strong>
              </div>
              <button
                onClick={() => handleCopy(bankEscrowDetails.bankName, 'bank')}
                className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {copiedField === 'bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[11px]">Account Name:</span>
                <strong className="text-slate-900 font-extrabold">{bankEscrowDetails.accountName}</strong>
              </div>
              <button
                onClick={() => handleCopy(bankEscrowDetails.accountName, 'accName')}
                className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {copiedField === 'accName' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[11px]">Account Number:</span>
                <strong className="text-slate-900 font-mono font-bold text-base">{bankEscrowDetails.accountNumber}</strong>
              </div>
              <button
                onClick={() => handleCopy(bankEscrowDetails.accountNumber, 'accNo')}
                className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {copiedField === 'accNo' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[11px]">IFSC Code:</span>
                <strong className="text-slate-900 font-mono font-bold">{bankEscrowDetails.ifscCode}</strong>
              </div>
              <button
                onClick={() => handleCopy(bankEscrowDetails.ifscCode, 'ifsc')}
                className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex justify-between items-center text-blue-950 font-bold">
              <div>
                <span className="text-slate-500 block text-[11px]">UPI VPA Handle:</span>
                <strong className="font-mono text-blue-900">{bankEscrowDetails.upiId}</strong>
              </div>
              <button
                onClick={() => handleCopy(bankEscrowDetails.upiId, 'upi')}
                className="p-1.5 rounded-lg border border-blue-300 text-blue-800 hover:bg-blue-100 cursor-pointer"
              >
                {copiedField === 'upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Wire QR & Payment Proof Submission Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-fraunces">
              <Upload className="w-5 h-5 text-blue-600" />
              Submit Bank Wire Proof / UTR Number
            </h3>
            <QrCode className="w-6 h-6 text-slate-700" />
          </div>

          {submittedMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              Payment proof submitted! Verification ID generated and under audit.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm font-semibold">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Select Invoice to Settle
              </label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => {
                  const inv = receipts.find(r => r.invoiceId === e.target.value);
                  setSelectedInvoiceId(e.target.value);
                  if (inv) setTransferAmount(inv.balanceDue);
                }}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
              >
                {receipts.map((rec) => (
                  <option key={rec.id} value={rec.invoiceId}>
                    {rec.invoiceId} - {rec.cropName} (Balance Due: ₹{rec.balanceDue.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Transferred Amount (₹)
              </label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Payment Channel / Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
              >
                <option value="NEFT/RTGS">NEFT / RTGS Corporate Transfer</option>
                <option value="IMPS">IMPS Instant Transfer</option>
                <option value="UPI Direct">UPI Direct (QR / VPA)</option>
                <option value="Corporate NetBanking">Corporate NetBanking</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Bank UTR / Transaction Reference Number
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. UTR123498765432 or Bank Ref No."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Payment Transfer Proof
            </button>
          </form>
        </div>
      </div>

      {/* Submitted Payment Proofs Table */}
      {paymentSubmissions.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-900 mb-4 font-fraunces">
            Submitted Transfer Proofs Audit Trail
          </h3>

          <div className="space-y-2">
            {paymentSubmissions.map((ps) => (
              <div key={ps.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold">
                <div>
                  <strong className="text-slate-900 font-bold">{ps.invoiceId}</strong> • UTR: <span className="font-mono text-blue-900 font-bold">{ps.utrNumber}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">{ps.submittedDate} • Mode: {ps.paymentMode}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block font-fraunces">₹{ps.amount.toLocaleString()}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold text-[10px]">{ps.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
