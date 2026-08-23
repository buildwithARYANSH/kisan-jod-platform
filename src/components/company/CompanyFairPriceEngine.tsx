import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Scale, Sparkles, Info, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export const CompanyFairPriceEngine: React.FC = () => {
  const { fairPricing } = useCompany();
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');

  const pricingData = fairPricing[selectedCrop] || fairPricing['Tomato'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Multi-Factor Pricing Benchmark
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-1.5 font-fraunces">
          <Scale className="w-6 h-6 text-blue-600" />
          Fair Procurement Price Recommendation Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Algorithmic fair-pricing recommendation balancing buyer demand, farmer supply availability, quality parameters, market reference & operational cost structures.
        </p>
      </div>

      {/* Crop Selection Selector */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          Select Commodity for Fair Price Analysis:
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-blue-500"
        >
          <option value="Tomato">Tomato (Grade A)</option>
          <option value="Potato">Potato (Grade B Chips Quality)</option>
          <option value="Wheat">Wheat (Grade A Grain)</option>
        </select>
      </div>

      {/* Main Recommended Price Range Card */}
      <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-500 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black px-3.5 py-1 rounded-full bg-blue-600 text-white uppercase tracking-wider shadow-xs">
              Recommended Procurement Range
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2 font-fraunces">
              ₹{pricingData.recommendedRangeMin.toFixed(2)} – ₹{pricingData.recommendedRangeMax.toFixed(2)}{' '}
              <span className="text-sm font-bold text-slate-500">/ kg</span>
            </h3>
            <p className="text-xs sm:text-sm text-blue-900 font-extrabold mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Estimated Recommendation • {pricingData.location}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md text-xs sm:text-sm space-y-2 min-w-[240px] font-semibold">
            <div className="flex justify-between text-slate-700">
              <span>Buyer Target Price:</span>
              <strong className="text-blue-700 font-black">₹{pricingData.buyerExpectedPrice.toFixed(2)}/kg</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Market Reference:</span>
              <strong className="text-slate-900 font-black">₹{pricingData.marketReferencePrice.toFixed(2)}/kg</strong>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 font-extrabold">
              <span className="text-slate-800">Operational Costs:</span>
              <span className="text-amber-700 font-black">₹{pricingData.operationalCostEstimate.toFixed(2)}/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Factors Contributing to Fair Price Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h4 className="text-sm sm:text-base font-black text-slate-900 mb-4 flex items-center gap-2 font-fraunces">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Multi-Factor Pricing Weights & Parameters
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">A. Market Demand (Highest Weight)</span>
            <strong className="text-base text-blue-800 block mt-1 font-fraunces">{pricingData.buyerDemandLevel} Buyer Demand</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">B. Supply Availability</span>
            <strong className="text-base text-emerald-800 block mt-1 font-fraunces">{pricingData.supplyAvailability} Farmer Pool</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">C. Produce Quality Score</span>
            <strong className="text-xs text-purple-800 block mt-1 font-black">{pricingData.qualityScore}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">D. Seasonality & Volatility</span>
            <strong className="text-slate-900 block mt-1 font-bold">{pricingData.seasonality} • Volatility: {pricingData.priceVolatility}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">E. Operational Costs (Deducted)</span>
            <strong className="text-amber-800 block mt-1 font-bold">₹{pricingData.operationalCostEstimate.toFixed(2)} / kg (Pass-through + Handling)</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block font-bold">F. Regional Location Adjustment</span>
            <strong className="text-slate-900 block mt-1 font-bold">{pricingData.location}</strong>
          </div>
        </div>
      </div>

      {/* Disclaimers & TODO Architectural Code Comments */}
      <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950 font-semibold flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-sm block mb-1">Important Pricing Benchmark Distinction:</strong>
          This is an estimated recommendation based on currently available demand, supply, quality, and market data. Actual procurement prices may vary following ground negotiations.
          <code className="block mt-2.5 p-3 rounded-xl bg-white text-[11px] font-mono font-bold text-slate-700 border border-blue-100">
            // TODO: Replace mock mandi reference with official government Agmarknet API.
            <br />
            // TODO: Connect AI quality model output to dynamically adjust quality score multiplier.
          </code>
        </div>
      </div>
    </div>
  );
};
