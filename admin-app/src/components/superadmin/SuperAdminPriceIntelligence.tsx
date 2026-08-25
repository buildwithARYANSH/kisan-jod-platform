import React from 'react';
import { Scale, BrainCircuit, CheckCircle2, TrendingUp } from 'lucide-react';
import { PayoutCorridorCard } from '../PayoutCorridorCard';

export const SuperAdminPriceIntelligence: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Scale className="w-6 h-6 text-purple-600" />
          AI Price Intelligence & Multi-Factor Benchmark Engine
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Recommended fair procurement price range output balancing buyer demand, supply availability, quality, seasonality & operational costs.
        </p>
      </div>

      {/* Recommended Farmer Payout Corridor Component (Agmarknet API) */}
      <PayoutCorridorCard />

      {/* AI Range Card */}
      <div className="bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-white  border-2 border-purple-500 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-600 text-white uppercase tracking-wider shadow-xs">
            AI Recommended Fair Procurement Range
          </span>
          <h3 className="text-3xl font-black text-gray-900  mt-2">
            ₹17.50 – ₹19.00 <span className="text-sm text-gray-500 font-semibold">/ kg (Tomato Grade A)</span>
          </h3>
          <p className="text-xs text-purple-700  font-semibold mt-1">
            Confidence: 94% • AI Model Reference Range
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white  border border-gray-200  text-xs space-y-1">
          <div className="flex justify-between"><span>Predicted Price:</span><strong>₹18.20/kg</strong></div>
          <div className="flex justify-between"><span>Mandi Market Reference:</span><strong>₹18.00/kg</strong></div>
          <div className="flex justify-between"><span>Actual Transaction Average:</span><strong className="text-green-600">₹18.10/kg</strong></div>
        </div>
      </div>
    </div>
  );
};
