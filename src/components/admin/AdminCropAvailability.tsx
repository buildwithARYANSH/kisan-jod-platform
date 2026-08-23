import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useAdmin as useAdminContext } from '../../context/AdminContext';
import { Sprout, Recycle, Heart, Scale, CheckCircle2, Edit3, ShieldCheck } from 'lucide-react';

export const AdminCropAvailability: React.FC = () => {
  const { fairPricing } = useCompany();
  const { overrideCropPrice, priceOverrides } = useAdminContext();

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [minPrice, setMinPrice] = useState(17.5);
  const [maxPrice, setMaxPrice] = useState(19.5);
  const [overrideReason, setOverrideReason] = useState('Adjusted for verified Grade A size and regional demand pressure.');
  const [overrideMessage, setOverrideMessage] = useState(false);

  const currentFair = (fairPricing && fairPricing[selectedCrop]) 
    ? fairPricing[selectedCrop] 
    : (fairPricing && fairPricing['Tomato']) 
      ? fairPricing['Tomato'] 
      : {
          recommendedRangeMin: 17.5,
          recommendedRangeMax: 19.0,
          marketReferencePrice: 18.0,
          buyerExpectedPrice: 18.5,
          operationalCostEstimate: 1.2,
          buyerDemandLevel: 'High Demand',
          supplyAvailability: 'Abundant Supply'
        };

  const handlePriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    overrideCropPrice(selectedCrop, minPrice, maxPrice, overrideReason);
    setOverrideMessage(true);
    setTimeout(() => setOverrideMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 uppercase tracking-wider border border-emerald-200">
          Supply Pool & Platform Price Governance
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Crop Availability & Reference Price Approval
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Monitor fresh produce, agri waste (parali, cow dung) & women enterprise products. Approve or override platform reference prices with multi-factor audit logging.
        </p>
      </div>

      {/* Confirmation Note */}
      {overrideMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-950 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Reference Price Override Saved & Logged!</strong> Audit record generated in system audit log.
          </span>
        </div>
      )}

      {/* 3 Categories Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm font-semibold">
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-black">
            <Sprout className="w-5 h-5 text-emerald-600" /> Fresh Crop Produce Pool
          </div>
          <p className="text-slate-600">Available: <strong>2,200 Ton</strong> (Tomato, Potato, Wheat, Onion)</p>
          <span className="text-[10px] text-emerald-700 font-bold block">100% Field Agent Quality Rated</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-black">
            <Recycle className="w-5 h-5 text-amber-600" /> Agri Waste & Biomass Pool
          </div>
          <p className="text-slate-600">Available: <strong>450 Ton</strong> (Cow Dung, Parali Stubble, Husk)</p>
          <span className="text-[10px] text-amber-800 font-bold block">Redirected to Biogas & Bio-Pellet Plants</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-200 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-rose-900 font-black">
            <Heart className="w-5 h-5 text-rose-600" /> Women Enterprise Products
          </div>
          <p className="text-slate-600">Available: <strong>1,200 Units</strong> (Organic Spices, Pickles, Bio-Soaps)</p>
          <span className="text-[10px] text-rose-800 font-bold block">Direct Women Collective Fair Pricing</span>
        </div>
      </div>

      {/* Crop Reference Price Management & 12 Factors Panel (Section 10 & 11) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <Scale className="w-5 h-5 text-blue-600" />
            Transparent 12-Factor Price Approval & Audit Override
          </h3>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-black cursor-pointer"
          >
            <option value="Tomato">Tomato (Grade A)</option>
            <option value="Potato">Potato (Grade B)</option>
            <option value="Wheat">Wheat (Grade A)</option>
          </select>
        </div>

        {/* 12 Pricing Factors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">1. AI Predicted Price</span>
            <strong className="text-blue-900 font-black">₹{currentFair.buyerExpectedPrice}/kg</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">2. Current Market Price</span>
            <strong className="text-slate-900 font-black">₹{currentFair.marketReferencePrice}/kg</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">3. Transaction Price</span>
            <strong className="text-emerald-800 font-black">₹18.00/kg</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">4. Prediction Accuracy</span>
            <strong className="text-purple-800 font-black">94.5%</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">5. Regional Prices</span>
            <strong className="text-slate-900 font-black">₹17 - ₹21/kg</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">6. Price Anomalies</span>
            <strong className="text-emerald-700 font-black">None (Normal)</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">7. Current Demand</span>
            <strong className="text-blue-900 font-black">{currentFair.buyerDemandLevel}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block">8. Current Supply</span>
            <strong className="text-emerald-800 font-black">{currentFair.supplyAvailability}</strong>
          </div>
        </div>

        {/* Price Override Form */}
        <form onSubmit={handlePriceSave} className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-xs sm:text-sm font-semibold">
          <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">
            Approved Platform Reference Price Range ({selectedCrop}):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Min Price (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-black text-blue-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Max Price (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-black text-blue-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Override Audit Reason</label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" /> Save Approved Reference Price & Log Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
