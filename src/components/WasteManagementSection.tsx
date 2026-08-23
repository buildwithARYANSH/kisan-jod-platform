import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Recycle, Plus, Trash2, Zap, Flame, CheckCircle2, Building2 } from 'lucide-react';

const STATUS_STEPS = ["Registered", "Inspected", "Allocated", "In transit", "Sold", "Paid"];

export const WasteManagementSection: React.FC = () => {
  const { wasteItems, addWaste, deleteWaste, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasteName, setWasteName] = useState('Rotten Vegetables & Spoiled Fruit');
  const [quantity, setQuantity] = useState<number>(500);
  const [wasteType, setWasteType] = useState<'Wet' | 'Dry'>('Wet');
  const [expectedPrice, setExpectedPrice] = useState<number>(1500);

  // Active Company Waste Demands (Company Waste Market Opportunities)
  const companyWasteDemands = useMemo(() => {
    try {
      const saved = localStorage.getItem('kisan_company_demands');
      const demands = saved ? JSON.parse(saved) : [];
      return demands.filter((d: any) => 
        d.category === 'Agri Waste & Biomass' || 
        d.wastePurpose || 
        d.cropName.toLowerCase().includes('parali') || 
        d.cropName.toLowerCase().includes('stubble') || 
        d.cropName.toLowerCase().includes('dung') || 
        d.cropName.toLowerCase().includes('waste')
      );
    } catch {
      return [];
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteName || quantity <= 0) return;

    addWaste({
      wasteName,
      quantity,
      wasteType,
      expectedPrice,
    });

    setIsModalOpen(false);
    setWasteName('Rotten Vegetables & Spoiled Fruit');
    setQuantity(500);
    setWasteType('Wet');
    setExpectedPrice(1500);
  };

  return (
    <section className="my-6 px-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-md">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider">
            Secondary Revenue Stream
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 mt-1.5 font-fraunces">
            <Recycle className="w-6 h-6 text-amber-600" />
            {t.wasteSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Convert agricultural waste, crop residue (Parali), cow dung & rotten produce into revenue via Biogas & Biomass buyers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          {t.addWaste}
        </button>
      </div>

      {/* Concept Explanation Box */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
          <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 font-semibold">
            <strong className="font-extrabold text-sm block text-emerald-900 mb-0.5">Wet Waste Stream</strong>
            Rotten vegetables, spoiled fruits, cow dung → Biogas, Compost & Bio-Fertilizer units.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3 shadow-xs">
          <Flame className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
          <div className="text-xs text-orange-950 font-semibold">
            <strong className="font-extrabold text-sm block text-orange-900 mb-0.5">Dry Waste Stream</strong>
            Stubble (Parali), husk, stalks, dry straw → Bioenergy pellet plants & Biomass industries.
          </div>
        </div>
      </div>

      {/* Industrial Waste Buyer Demands Section (कचरा मांग) */}
      {companyWasteDemands.length > 0 && (
        <div className="mb-8 bg-amber-500/10 border border-amber-300 p-5 sm:p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-amber-950 font-fraunces flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-700" />
              Industrial Buyer Waste Requirements & Opportunities (कंपनी कचरा मांग)
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-black">
              {companyWasteDemands.length} Active Buyer Demands
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyWasteDemands.map((demand: any) => (
              <div key={demand.id} className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-950 text-[10px] font-black uppercase border border-orange-300">
                      {demand.wastePurpose || 'Biomass & Bioenergy Procurement'}
                    </span>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ₹{demand.expectedPricePerUnit} / {demand.unit || 'kg'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">
                    {demand.cropName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-semibold">
                    Delivery Hub: <strong>{demand.deliveryLocation}</strong>
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span>Target Quantity: {demand.quantity.toLocaleString()} kg</span>
                    <span className="text-amber-800">{demand.matchedQuantity ? Math.round((demand.matchedQuantity / demand.quantity) * 100) : 0}% Filled</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWasteName(demand.cropName);
                    setQuantity(demand.quantity);
                    setExpectedPrice(demand.expectedPricePerUnit);
                    setWasteType(demand.cropName.toLowerCase().includes('dung') ? 'Wet' : 'Dry');
                    setIsModalOpen(true);
                  }}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Register Waste Supply for This Demand
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List of Registered Waste */}
      {wasteItems.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-amber-300 text-slate-600 font-bold">
          <p className="text-sm">{t.noWasteYet}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {wasteItems.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-100 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    item.wasteType === 'Wet'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-orange-100 text-orange-900 border border-orange-300'
                  }`}>
                    {item.wasteType === 'Wet' ? t.wetWaste : t.dryWaste}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-fraunces mt-1">
                  {item.wasteName}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                  <div>
                    Quantity: <strong className="text-slate-900 font-bold">{item.quantity.toLocaleString()} kg</strong>
                  </div>
                  <div>
                    Est. Value: <strong className="text-amber-700 font-extrabold">₹{item.expectedPrice}</strong>
                  </div>
                  <div className="col-span-2 text-xs text-slate-500 font-medium">
                    Registered: {item.registrationDate}
                  </div>
                </div>

                {item.buyerNote && (
                  <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Buyer Match: <strong className="font-bold">{item.buyerNote}</strong></span>
                  </div>
                )}

                {/* Status Stepper (Farmer status view - step advancement handled by platform/agent) */}
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-2">
                    <span>Track Pickup:</span>
                    <span className="text-amber-800 uppercase font-black">
                      {STATUS_STEPS[item.stepIndex ?? 0]}
                    </span>
                  </div>

                  <div className="flex items-center w-full my-2 px-1">
                    {STATUS_STEPS.map((s, i) => {
                      const isDone = i <= (item.stepIndex ?? 0);
                      return (
                        <React.Fragment key={s}>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                              isDone 
                                ? 'bg-amber-600 text-white ring-2 ring-amber-200' 
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDone ? '✓' : i + 1}
                            </div>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 transition-all ${
                              i < (item.stepIndex ?? 0) ? 'bg-amber-600' : 'bg-slate-200'
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => deleteWaste(item.id)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1 border border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Waste Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-200 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              {t.addWaste}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.wasteName}
                </label>
                <input
                  type="text"
                  value={wasteName}
                  onChange={(e) => setWasteName(e.target.value)}
                  placeholder="e.g. Parali, Rotten Tomatoes, Cow Dung"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.quantityKg}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="e.g. 500"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.wasteType}
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value as 'Wet' | 'Dry')}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Wet">{t.wetWaste} (Rotten veggies, Cow dung, Food waste)</option>
                  <option value="Dry">{t.dryWaste} (Crop residue/Parali, Husk, Straw)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.expectedPrice}
                </label>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Submit Waste Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
