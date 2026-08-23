import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, ArrowUpRight, Calculator, Sparkles, Building2, Store } from 'lucide-react';

export const ProfitSection: React.FC = () => {
  const { t } = useApp();

  const [cropSelected, setCropSelected] = useState('Tomato');
  const [quantity, setQuantity] = useState<number>(1000);
  const [mandiRate, setMandiRate] = useState<number>(15);
  const [platformRate, setPlatformRate] = useState<number>(18);

  const mandiEarnings = mandiRate * quantity;
  const platformEarnings = platformRate * quantity;
  const extraProfit = platformEarnings - mandiEarnings;
  const percentageGain = mandiEarnings > 0 ? Math.round((extraProfit / mandiEarnings) * 100) : 0;

  return (
    <section className="my-6 px-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-blue-200 shadow-md mb-6">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Transparent Economic Realization
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-1.5 font-fraunces">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          {t.profitSectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Compare your net earnings between traditional local Mandi / Dalal intermediaries and the Kisan Jod B2B Platform
        </p>
      </div>

      {/* Interactive Calculator Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md mb-6">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
          <Calculator className="w-5 h-5 text-blue-600" />
          Interactive Profit Calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Select Crop
            </label>
            <select
              value={cropSelected}
              onChange={(e) => {
                const c = e.target.value;
                setCropSelected(c);
                if (c === 'Tomato') { setMandiRate(15); setPlatformRate(18); }
                if (c === 'Potato') { setMandiRate(13); setPlatformRate(16); }
                if (c === 'Wheat') { setMandiRate(20); setPlatformRate(24); }
                if (c === 'Onion') { setMandiRate(18); setPlatformRate(22); }
              }}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Onion">Red Onion (प्याज)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Mandi / Dalal Rate (₹/kg)
            </label>
            <input
              type="number"
              value={mandiRate}
              onChange={(e) => setMandiRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Platform Rate (₹/kg)
            </label>
            <input
              type="number"
              value={platformRate}
              onChange={(e) => setPlatformRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 font-black focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Visual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Mandi Option */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-black flex items-center gap-1.5 border border-slate-200">
              <Store className="w-4 h-4 text-slate-600" />
              OPTION B: Local Mandi / Dalal
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Traditional multi-layered intermediary trade
          </p>

          <div className="my-4 pt-3.5 border-t border-slate-100">
            <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-semibold mb-1.5">
              <span>Rate Offered:</span>
              <strong className="text-slate-900 font-bold">₹{mandiRate}/kg</strong>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-semibold mb-3">
              <span>Total Volume:</span>
              <strong className="text-slate-900 font-bold">{quantity.toLocaleString()} kg</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 flex justify-between items-center border border-slate-200">
              <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                {t.mandiEarnings}:
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-fraunces">
                ₹{mandiEarnings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Option */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-500 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
              <Building2 className="w-4 h-4" />
              OPTION A: Kisan Jod Platform
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">
              +{percentageGain}% Realization
            </span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-950 font-bold mt-1">
            Aggregated Industrial Procurement with direct settlement
          </p>

          <div className="my-4 pt-3.5 border-t border-emerald-100">
            <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-semibold mb-1.5">
              <span>Platform Rate Offered:</span>
              <strong className="text-emerald-800 font-bold">₹{platformRate}/kg</strong>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-semibold mb-3">
              <span>Total Volume:</span>
              <strong className="text-slate-900 font-bold">{quantity.toLocaleString()} kg</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 flex justify-between items-center">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-950">
                {t.platformEarnings}:
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-fraunces">
                ₹{platformEarnings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Profit Highlight Callout Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
            Net Farmer Realization Difference
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-2 font-fraunces">
            You earn ₹{extraProfit.toLocaleString()} MORE through the platform!
            <ArrowUpRight className="w-8 h-8 text-amber-300" />
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 max-w-xl">
            By eliminating multiple intermediary margins and aggregating supply, the platform returns higher value directly to your bank account.
          </p>
        </div>
      </div>
    </section>
  );
};
