import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Gift, Share2, Users, CheckCircle2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminReferrals: React.FC = () => {
  const { referrals } = useAdmin();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referrals.referralCode);
    confetti({ particleCount: 30, spread: 40 });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10   p-5 rounded-2xl border border-purple-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Gift className="w-6 h-6 text-purple-600" />
          Refer & Earn — Farmer Onboarding Incentives
        </h2>
        <p className="text-xs text-gray-600  mt-1">
          Share your unique field agent referral code with farmers. Earn ₹500 per activated farmer onboarding.
        </p>
      </div>

      {/* Referral Code Box */}
      <div className="bg-white  p-6 rounded-3xl border border-gray-200  shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-purple-600  uppercase tracking-wider block">
            Your Unique Field Agent Referral ID:
          </span>
          <div className="text-3xl font-black font-mono text-gray-900  mt-1">
            {referrals.referralCode}
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          <Copy className="w-4 h-4" /> Copy Referral Code
        </button>
      </div>

      {/* Referral KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Total Registered Farmers</span>
          <span className="text-2xl font-black text-gray-900  mt-1 block">{referrals.totalFarmersRegistered}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Active Onboarded Farmers</span>
          <span className="text-2xl font-black text-green-600  mt-1 block">{referrals.activeFarmers}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500  block">Total Referral Earnings</span>
          <span className="text-2xl font-black text-purple-600  mt-1 block">₹{referrals.referralEarnings.toLocaleString()}</span>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h3 className="text-base font-bold text-gray-900  mb-4">
          Referral Onboarding History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Reward Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {referrals.referralHistory.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-bold text-gray-900 ">{ref.farmerName}</td>
                  <td className="p-3 font-mono text-gray-500">{ref.phone}</td>
                  <td className="p-3 text-gray-400">{ref.date}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      ref.status === 'Reward Paid'
                        ? 'bg-green-100  text-green-800 '
                        : 'bg-amber-100  text-amber-800 '
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-purple-600  text-sm">
                    + ₹{ref.rewardAmount}
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
