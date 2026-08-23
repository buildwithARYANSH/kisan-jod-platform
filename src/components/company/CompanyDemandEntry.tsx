import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import type { Grade, DemandCategory } from '../../types';
import { PlusCircle, Info, CheckCircle2, Trash2, XCircle, AlertTriangle, Recycle, Sprout } from 'lucide-react';

export const CompanyDemandEntry: React.FC = () => {
  const { demands, addDemand, updateDemandStatus, deleteDemand, fairPricing } = useCompany();

  // Category Selector: Fresh Produce vs Agri Waste & Biomass
  const [category, setCategory] = useState<DemandCategory>('Fresh Produce');

  // Form State
  const [cropName, setCropName] = useState('Tomato');
  const [wasteItemName, setWasteItemName] = useState('Cow Dung (गोबर)');
  const [wastePurpose, setWastePurpose] = useState('Biogas Power Plant Procurement');
  const [quantity, setQuantity] = useState<number>(100000);
  const [unit, setUnit] = useState<'kg' | 'Quintal' | 'Ton'>('kg');
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState<number>(18);
  const [requiredGrade, setRequiredGrade] = useState<Grade>('A');
  const [wasteQualityGrade, setWasteQualityGrade] = useState('High Dry Energy Grade');
  const [deliveryLocation, setDeliveryLocation] = useState('Ludhiana Food Processing Hub');
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Urgent'>('Urgent');

  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Price Range Bounds Calculation based on selected item
  const getItemPricingBounds = () => {
    if (category === 'Agri Waste & Biomass') {
      if (wasteItemName.includes('Cow Dung')) return { min: 1, max: 4, label: '₹1.00 – ₹4.00 / kg' };
      if (wasteItemName.includes('Straw')) return { min: 1.5, max: 5, label: '₹1.50 – ₹5.00 / kg' };
      if (wasteItemName.includes('Spoiled')) return { min: 1, max: 6, label: '₹1.00 – ₹6.00 / kg' };
      return { min: 1, max: 5, label: '₹1.00 – ₹5.00 / kg' };
    }
    const fair = fairPricing[cropName] || fairPricing['Tomato'];
    const min = Math.floor(fair.recommendedRangeMin - 2);
    const max = Math.ceil(fair.recommendedRangeMax + 2);
    return { min, max, label: `₹${min.toFixed(2)} – ₹${max.toFixed(2)} / ${unit}` };
  };

  const currentBounds = getItemPricingBounds();

  const handlePriceChange = (val: number) => {
    setExpectedPricePerUnit(val);
    if (val < currentBounds.min || val > currentBounds.max) {
      setPriceError(`Forced Price Range Enforcement: Target price must be within reasonable range (${currentBounds.label}).`);
    } else {
      setPriceError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    if (expectedPricePerUnit < currentBounds.min || expectedPricePerUnit > currentBounds.max) {
      setPriceError(`Cannot submit! Target price ₹${expectedPricePerUnit} is outside allowed market bounds (${currentBounds.label}).`);
      return;
    }

    const itemName = category === 'Fresh Produce' ? cropName : `${wasteItemName} (${wastePurpose})`;

    addDemand({
      cropName: itemName,
      category,
      wastePurpose: category === 'Agri Waste & Biomass' ? wastePurpose : undefined,
      quantity,
      unit,
      expectedPricePerUnit,
      requiredGrade,
      deliveryLocation,
      urgency,
    });

    setSubmittedMessage(true);
    setPriceError(null);
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
          <PlusCircle className="w-6 h-6 text-blue-600" />
          Demand Entry — Post Requirement (Fresh Produce & Agri Waste)
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Post requirements for Fresh Crops OR Agri Waste & Biomass (Cow Dung, Parali Stubble, Biogas feedstock) with forced price range validation.
        </p>
      </div>

      {/* Confirmation & Error Notes */}
      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-950 font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Requirement Submitted Successfully!</strong> Supply matching initiated for {category}.
          </span>
        </div>
      )}

      {/* Category Tabs: Fresh Produce vs Agri Waste Market */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-3xl border shadow-xs">
        <button
          type="button"
          onClick={() => {
            setCategory('Fresh Produce');
            setExpectedPricePerUnit(18);
            setPriceError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'Fresh Produce'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Fresh Agricultural Produce (FSSAI Processing / Food)
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory('Agri Waste & Biomass');
            setExpectedPricePerUnit(3);
            setPriceError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'Agri Waste & Biomass'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Recycle className="w-4 h-4" />
          Agri Waste & Biomass Market (Biogas, Bio-Fertilizer, Energy)
        </button>
      </div>

      {/* Requirement Submission Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Commodity Field */}
            {category === 'Fresh Produce' ? (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Crop Name
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Red Onion">Red Onion (प्याज)</option>
                  <option value="Maize (Corn)">Maize (मक्का)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Agri Waste Commodity Type
                </label>
                <select
                  value={wasteItemName}
                  onChange={(e) => setWasteItemName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-amber-50 text-amber-950 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Cow Dung (गोबर)">Organic Cow Dung (गोबर)</option>
                  <option value="Paddy Straw / Parali (पराली)">Crop Residue / Stubble / Parali (पराली)</option>
                  <option value="Spoiled Crop Residue">Spoiled Produce (Biogas Feedstock)</option>
                  <option value="Husk & Stalks">Rice Husk & Cotton Stalks (Bio-Pellets)</option>
                </select>
              </div>
            )}

            {/* Waste Purpose (If Waste Category) or Target Purpose */}
            {category === 'Agri Waste & Biomass' ? (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Industrial Purpose / Plant Use
                </label>
                <select
                  value={wastePurpose}
                  onChange={(e) => setWastePurpose(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-amber-50 text-amber-950 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Biogas Power Plant Procurement">Biogas Power Plant Procurement</option>
                  <option value="Bio-Fertilizer & Compost Production">Bio-Fertilizer & Compost Production</option>
                  <option value="Biomass Pellet Fuel Energy">Biomass Pellet Fuel Energy</option>
                  <option value="Paper & Industrial Fiber Manufacturing">Paper & Industrial Fiber Manufacturing</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantity Required
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                    required
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>
            )}

            {/* Quantity for Waste Category if not shown above */}
            {category === 'Agri Waste & Biomass' && (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantity Required
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                    required
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>
            )}

            {/* Price Field with Forced Validation Helper */}
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>Expected Target Price (₹/{unit})</span>
                <span className="text-xs text-blue-700 font-black">
                  Allowed Range: {currentBounds.label}
                </span>
              </label>
              <input
                type="number"
                value={expectedPricePerUnit}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className={`w-full p-3 rounded-xl border font-black ${
                  priceError 
                    ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400' 
                    : 'border-slate-300 bg-slate-50 text-blue-900'
                }`}
                required
              />
            </div>
          </div>

          {/* Forced Price Validation Error Alert */}
          {priceError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-xs sm:text-sm text-red-900 font-bold flex items-center gap-2 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{priceError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grade Spec */}
            {category === 'Fresh Produce' ? (
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                  Required Size Grade
                  <span title="Grade A = Large | Grade B = Medium | Grade C = Small">
                    <Info className="w-4 h-4 text-blue-600 cursor-pointer" />
                  </span>
                </label>
                <select
                  value={requiredGrade}
                  onChange={(e) => setRequiredGrade(e.target.value as Grade)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                >
                  <option value="A">Grade A (Large Size - Processing Standard)</option>
                  <option value="B">Grade B (Medium Size - Standard Fresh)</option>
                  <option value="C">Grade C (Small Size - Quick Commerce / Baby)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Moisture / Energy Quality Spec
                </label>
                <select
                  value={wasteQualityGrade}
                  onChange={(e) => setWasteQualityGrade(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                >
                  <option value="High Dry Energy Grade">High Dry Energy Grade (&lt;12% Moisture)</option>
                  <option value="Standard Organic Grade">Standard Organic Feedstock Grade</option>
                  <option value="Raw Wet Dung/Residue">Raw Wet Slurry / Dung Grade</option>
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Delivery Location Hub
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Ludhiana Processing Hub"
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Requirement Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold"
              >
                <option value="Normal">Normal Procurement (7-10 Days)</option>
                <option value="High">High Priority (3-5 Days)</option>
                <option value="Urgent">Urgent Procurement (48 Hours)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!!priceError}
              className={`py-3.5 px-6 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                priceError 
                  ? 'bg-slate-400 cursor-not-allowed opacity-60' 
                  : category === 'Fresh Produce' 
                  ? 'bg-blue-600 hover:bg-blue-700 hover:scale-102' 
                  : 'bg-amber-600 hover:bg-amber-700 hover:scale-102'
              }`}
            >
              Submit {category} Requirement
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Demand List Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 font-fraunces">
          Submitted Requirements History (Crops & Waste)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Demand ID / Commodity</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Required Qty</th>
                <th className="p-3.5">Matched Qty</th>
                <th className="p-3.5">Target Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demands.map((demand) => (
                <tr key={demand.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-extrabold block font-fraunces">{demand.cropName}</strong>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{demand.id}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                      demand.category === 'Agri Waste & Biomass'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-blue-100 text-blue-950 border border-blue-300'
                    }`}>
                      {demand.category || 'Fresh Produce'}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold">{demand.quantity.toLocaleString()} {demand.unit}</td>
                  <td className="p-3.5 font-black text-emerald-700">
                    {demand.matchedQuantity.toLocaleString()} {demand.unit}
                  </td>
                  <td className="p-3.5 font-black text-slate-900">
                    ₹{demand.expectedPricePerUnit}/{demand.unit}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      demand.status === 'Matched' || demand.status === 'Fulfilled'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : demand.status === 'Partially Matched'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-blue-100 text-blue-950 border border-blue-300'
                    }`}>
                      {demand.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-semibold">{demand.submittedDate}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {demand.status !== 'Closed' && (
                        <button
                          onClick={() => updateDemandStatus(demand.id, 'Closed')}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Close Demand"
                        >
                          <XCircle className="w-4 h-4 text-amber-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteDemand(demand.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                        title="Delete Demand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
