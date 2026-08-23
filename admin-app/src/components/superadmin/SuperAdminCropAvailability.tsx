import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Sprout, Scale, Edit3, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const SuperAdminCropAvailability: React.FC = () => {
  const { approvedReferencePrices, setApprovedReferencePrice } = useSuperAdmin();

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [overridePrice, setOverridePrice] = useState<number>(18.20);
  const [overrideReason, setOverrideReason] = useState('Adjusted based on high demand pressure in Ludhiana hub');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    setApprovedReferencePrice(selectedCrop, overridePrice, overrideReason);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Sprout className="w-6 h-6 text-green-600" />
          Nationwide Crop Availability & Reference Price Control
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Monitor regional crop supply, agri-waste recovery, women enterprise products & approve platform reference prices.
        </p>
      </div>

      {/* Crop Availability Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-2">
          <span className="text-[10px] font-bold text-green-600 uppercase">Crop Commodity Pool</span>
          <h3 className="text-base font-extrabold text-gray-900 ">Tomato (Grade A)</h3>
          <div className="flex justify-between text-gray-600 ">
            <span>Total Available Produce:</span>
            <strong>65,000 kg</strong>
          </div>
          <div className="flex justify-between text-gray-600 ">
            <span>Reserved for Orders:</span>
            <strong className="text-amber-600">25,000 kg</strong>
          </div>
          <div className="flex justify-between font-bold text-green-600 pt-1 border-t">
            <span>Approved Reference Price:</span>
            <span>₹{approvedReferencePrices['Tomato'] || 18.20}/kg</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-2">
          <span className="text-[10px] font-bold text-amber-600 uppercase">Agri-Waste Value Recovery</span>
          <h3 className="text-base font-extrabold text-gray-900 ">Stubble / Parali & Bio-Waste</h3>
          <div className="flex justify-between text-gray-600 ">
            <span>Registered Quantity:</span>
            <strong>120,000 kg</strong>
          </div>
          <div className="flex justify-between text-gray-600 ">
            <span>Target Buyer Industry:</span>
            <strong className="text-blue-600">Biogas / Biomass Plants</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md space-y-2">
          <span className="text-[10px] font-bold text-purple-600 uppercase">Women Enterprise Products</span>
          <h3 className="text-base font-extrabold text-gray-900 ">Rural Pickle & Dairy Crafts</h3>
          <div className="flex justify-between text-gray-600 ">
            <span>Listed Products:</span>
            <strong>45 Batches</strong>
          </div>
          <div className="flex justify-between text-gray-600 ">
            <span>Assigned Buyer Value:</span>
            <strong className="text-purple-600 font-bold">₹180,000 Total</strong>
          </div>
        </div>
      </div>

      {/* Crop Reference Price Management Panel (Transparent 12 AI Signals) */}
      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-600/10   p-6 rounded-3xl border border-blue-200  shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-blue-700  font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Admin Reference Price Assignment & Override Panel
        </div>

        {savedMessage && (
          <div className="p-3 rounded-xl bg-green-100 text-green-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Approved Reference Price updated and logged in Audit Trail.
          </div>
        )}

        <form onSubmit={handleSavePrice} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700  mb-1">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => {
                  const c = e.target.value;
                  setSelectedCrop(c);
                  setOverridePrice(approvedReferencePrices[c] || 18.20);
                }}
                className="w-full p-2.5 rounded-xl border border-gray-300  bg-white  font-bold"
              >
                <option value="Tomato">Tomato (Grade A)</option>
                <option value="Potato">Potato (Grade B)</option>
                <option value="Wheat">Wheat (High Grain Density)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700  mb-1">Approved Reference Price (₹/kg)</label>
              <input
                type="number"
                step="0.1"
                value={overridePrice}
                onChange={(e) => setOverridePrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-300  bg-white  font-bold text-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700  mb-1">Reason for Override / Assignment</label>
              <input
                type="text"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300  bg-white  font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
            >
              Approve Reference Price & Create Audit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
