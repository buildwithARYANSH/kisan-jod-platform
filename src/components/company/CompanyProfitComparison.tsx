import React, { useState } from 'react';
import { TrendingUp, Calculator, Store, Building2, ArrowUpRight, Sparkles } from 'lucide-react';

export const CompanyProfitComparison: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState<number>(100000);
  const [mandiCostPerUnit, setMandiCostPerUnit] = useState<number>(21);
  const [platformCostPerUnit, setPlatformCostPerUnit] = useState<number>(18);

  const totalMandiCost = mandiCostPerUnit * quantity;
  const totalPlatformCost = platformCostPerUnit * quantity;
  const totalSavings = totalMandiCost - totalPlatformCost;
  const percentageSavings = totalMandiCost > 0 ? Math.round((totalSavings / totalMandiCost) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Buyer Cost Reduction & Efficiency Analysis
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-1.5 font-fraunces">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Procurement Cost & Savings Comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Compare total effective procurement costs between traditional multi-layered Mandi/Wholesaler channels vs Kisan Jod Aggregated B2B Direct Sourcing.
        </p>
      </div>

      {/* Calculator Inputs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
          <Calculator className="w-5 h-5 text-blue-600" />
          Procurement Cost Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-semibold">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Select Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCrop(c);
                if (c === 'Tomato') { setMandiCostPerUnit(21); setPlatformCostPerUnit(18); }
                if (c === 'Potato') { setMandiCostPerUnit(19); setPlatformCostPerUnit(16); }
                if (c === 'Wheat') { setMandiCostPerUnit(27); setPlatformCostPerUnit(24); }
              }}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Procurement Volume (kg)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Traditional Mandi Cost (₹/kg)
            </label>
            <input
              type="number"
              value={mandiCostPerUnit}
              onChange={(e) => setMandiCostPerUnit(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-red-700 font-black"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Platform Direct Cost (₹/kg)
            </label>
            <input
              type="number"
              value={platformCostPerUnit}
              onChange={(e) => setPlatformCostPerUnit(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-300 bg-emerald-50 text-emerald-950 font-black"
            />
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Traditional Mandi */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-black flex items-center gap-1.5 border border-slate-200">
              <Store className="w-4 h-4 text-slate-600" />
              Traditional Mandi / Multi-Layer Intermediary
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-semibold mt-4">
            <div className="flex justify-between">
              <span>Effective Procurement Rate:</span>
              <strong className="text-slate-900 font-bold">₹{mandiCostPerUnit}/kg</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Volume:</span>
              <strong className="text-slate-900 font-bold">{quantity.toLocaleString()} kg</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex justify-between items-center mt-3">
              <span className="font-extrabold text-slate-800">Total Traditional Cost:</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-fraunces">₹{totalMandiCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Platform Direct Sourcing */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-blue-50 to-white border-2 border-blue-500 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
              <Building2 className="w-4 h-4" />
              Kisan Jod Aggregated Direct Sourcing
            </span>
            <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
              {percentageSavings}% Savings
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-semibold mt-4">
            <div className="flex justify-between">
              <span>Quoted Platform Rate:</span>
              <strong className="text-blue-800 font-extrabold">₹{platformCostPerUnit}/kg</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Volume:</span>
              <strong className="text-slate-900 font-bold">{quantity.toLocaleString()} kg</strong>
            </div>
            <div className="p-4 rounded-2xl bg-blue-100 border border-blue-300 flex justify-between items-center mt-3">
              <span className="font-extrabold text-blue-950">Total Platform Cost:</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-800 font-fraunces">₹{totalPlatformCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
            Net Procurement Savings
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-2 font-fraunces">
            Save ₹{totalSavings.toLocaleString()} on this order!
            <ArrowUpRight className="w-8 h-8 text-amber-300" />
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-1 max-w-xl">
            Estimated comparison based on available market reference data. Actual Mandi prices and transport costs may vary.
          </p>
        </div>
      </div>
    </div>
  );
};
