import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Scale, Sparkles, TrendingUp, Info } from 'lucide-react';

export const AdminPriceIntelligence: React.FC = () => {
  const { fairPricing } = useCompany();
  const tomatoFair = (fairPricing && fairPricing['Tomato']) ? fairPricing['Tomato'] : {
    recommendedRangeMin: 17.5,
    recommendedRangeMax: 19.0,
    marketReferencePrice: 18.0,
    buyerExpectedPrice: 18.5,
    operationalCostEstimate: 1.2
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-purple-100 text-purple-950 uppercase tracking-wider border border-purple-200">
          AI Fair Price Recommendation Engine
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          AI Price Intelligence Module
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Multi-factor pricing algorithm combining Demand, Supply, Market, Quality, Seasonality, Location & Operational Costs.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl space-y-4">
        <span className="text-xs font-black text-amber-300 uppercase tracking-wider">AI Fair Procurement Range Recommendation</span>
        <h3 className="text-3xl sm:text-5xl font-black font-fraunces">
          ₹{tomatoFair.recommendedRangeMin.toFixed(2)} – ₹{tomatoFair.recommendedRangeMax.toFixed(2)} / kg
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold pt-2 border-t border-white/20">
          <div><span className="text-slate-300 block text-[10px]">Confidence:</span> 94.8% High</div>
          <div><span className="text-slate-300 block text-[10px]">Market Benchmark:</span> ₹{tomatoFair.marketReferencePrice}/kg</div>
          <div><span className="text-slate-300 block text-[10px]">Target Price:</span> ₹{tomatoFair.buyerExpectedPrice}/kg</div>
          <div><span className="text-slate-300 block text-[10px]">Operational Cost:</span> ₹{tomatoFair.operationalCostEstimate}/kg</div>
        </div>
      </div>
    </div>
  );
};
