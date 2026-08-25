import React, { useState, useEffect } from 'react';
import { fetchPayoutCorridor, type PayoutCorridorResult } from '../services/payoutCorridor';
import { Landmark, Calendar, RefreshCw, AlertCircle, Info, Sparkles, CheckCircle2, MapPin, Check } from 'lucide-react';

export const PayoutCorridorCard: React.FC = () => {
  const [commodity, setCommodity] = useState<string>('Tomato');
  const [state, setState] = useState<string>('Uttar Pradesh');
  
  // Date Constraint States (DD/MM/YYYY vs YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>('20/08/2026'); // DD/MM/YYYY
  const [pickerDate, setPickerDate] = useState<string>('2026-08-20');     // YYYY-MM-DD
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PayoutCorridorResult | null>(null);

  // Validate DD/MM/YYYY format constraint
  const isValidDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(selectedDate);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchPayoutCorridor(commodity, state, selectedDate);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isValidDate) {
      loadData();
    }
  }, [commodity, state, selectedDate]);

  // Calendar Picker Handler -> Converts YYYY-MM-DD to DD/MM/YYYY
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    setPickerDate(val);
    const [yyyy, mm, dd] = val.split('-');
    const formattedDDMMYYYY = `${dd}/${mm}/${yyyy}`;
    setSelectedDate(formattedDDMMYYYY);
  };

  // Text Input Handler -> Syncs with Calendar Picker if valid
  const handleTextDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);
    if (/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(val)) {
      const [dd, mm, yyyy] = val.split('/');
      setPickerDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E7E0D2] bg-white p-5 sm:p-6 shadow-sm space-y-5 text-[#223124]">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE0] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF7E9] text-[#146B3A] shadow-xs">
            <Landmark size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-extrabold text-[#1E3B27]">
                Recommended Farmer Payout Corridor
              </h3>
              <span className="rounded-full bg-[#146B3A] px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider">
                Govt Agmarknet Data
              </span>
            </div>
            <p className="text-xs font-semibold text-[#667568] mt-0.5">
              Agmarknet Mandi API live benchmarks converted to ₹ per kg
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading || !isValidDate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E0D2] bg-[#FBF8EE] px-3 py-2 text-xs font-extrabold text-[#146B3A] hover:bg-[#EFF7E9] cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Fetching Mandi Rates...' : 'Refresh Mandi Rates'}
        </button>
      </div>

      {/* Filter Form Controls with Strict Date Constraints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FBF8EE] p-3.5 rounded-2xl border border-[#EAE4D8]">
        <div>
          <label className="block text-[11px] font-bold text-[#556658] mb-1">Select Crop / Commodity</label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full rounded-xl border border-[#E5DFD2] bg-white p-2.5 text-xs font-extrabold text-[#1E3B27] focus:ring-2 focus:ring-[#146B3A]"
          >
            <option value="Tomato">Tomato (टमाटर)</option>
            <option value="Potato">Potato (आलू)</option>
            <option value="Wheat">Wheat (गेहूँ)</option>
            <option value="Onion">Onion (प्याज)</option>
            <option value="Maize">Maize (मक्का)</option>
            <option value="Cotton">Cotton (कपास)</option>
            <option value="Paddy">Paddy / Rice (धान)</option>
            <option value="Mustard">Mustard (सरसों)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#556658] mb-1">Select State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border border-[#E5DFD2] bg-white p-2.5 text-xs font-extrabold text-[#1E3B27] focus:ring-2 focus:ring-[#146B3A]"
          >
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-bold text-[#556658]">Arrival Date (DD/MM/YYYY)</label>
            {isValidDate ? (
              <span className="text-[10px] font-extrabold text-[#146B3A] flex items-center gap-0.5">
                <Check size={12} /> Valid DD/MM/YYYY
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#D85536]">Use DD/MM/YYYY</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pickerDate}
              onChange={handleDatePickerChange}
              className="rounded-xl border border-[#E5DFD2] bg-white p-2 text-xs font-extrabold text-[#1E3B27] cursor-pointer shadow-xs focus:ring-2 focus:ring-[#146B3A]"
              title="Pick Date from Calendar"
            />

            <input
              type="text"
              value={selectedDate}
              onChange={handleTextDateChange}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              className={`w-full rounded-xl border p-2.5 text-xs font-extrabold focus:ring-2 ${
                isValidDate
                  ? 'border-[#E5DFD2] bg-white text-[#1E3B27] focus:ring-[#146B3A]'
                  : 'border-[#D85536] bg-[#FFF5F3] text-[#D85536] focus:ring-[#D85536]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Corridor & Payout Results Display */}
      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Government Mandi Current Average Price */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7FAF4] p-4 space-y-2">
              <span className="text-[11px] font-bold text-[#55715C] uppercase tracking-wider block">
                {data.state} Mandi Average Price ({data.commodity})
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-[#1E3B27]">
                  ₹{data.mandi_avg_price.modal_per_kg}
                </span>
                <span className="text-xs font-bold text-[#4D6553]">per kg</span>
                <span className="text-[10px] text-[#718073] font-semibold">
                  (Original: ₹{(data.mandi_avg_price.modal_per_kg * 100).toLocaleString()}/Quintal ÷ 100)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E2EBDD]">
                <div>
                  <span className="text-[#6D7D70] font-semibold block text-[10px]">Min Price</span>
                  <b className="text-[#27452F]">₹{data.mandi_avg_price.min_per_kg} per kg</b>
                </div>
                <div>
                  <span className="text-[#6D7D70] font-semibold block text-[10px]">Max Price</span>
                  <b className="text-[#27452F]">₹{data.mandi_avg_price.max_per_kg} per kg</b>
                </div>
              </div>
            </div>

            {/* Box 2: Recommended Farmer Payout Corridor */}
            <div className="rounded-2xl border-2 border-[#146B3A] bg-[#EFF7E9] p-4 space-y-2 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#146B3A] uppercase tracking-wider block">
                  Recommended Farmer Payout Corridor ({data.state})
                </span>
                <Sparkles size={16} className="text-[#146B3A]" />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-[#146B3A]">
                  ₹{data.recommended_payout_corridor.lower_bound} – ₹{data.recommended_payout_corridor.upper_bound}
                </span>
                <span className="text-xs font-extrabold text-[#146B3A]">per kg</span>
              </div>

              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#D4E8C9]">
                <div
                  className="h-full rounded-full bg-[#146B3A]"
                  style={{ width: '85%' }}
                />
              </div>

              <p className="text-[11px] font-semibold text-[#3D5B46] pt-1">
                Formula: Modal Mandi Rate minus Platform Margin config (Lower Bound: -5%, Upper Bound: -2%)
              </p>
            </div>
          </div>

          {/* Market-Wise Records Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-extrabold text-[#24412B] flex items-center gap-1.5">
                <MapPin size={16} className="text-[#146B3A]" />
                {data.state} Mandi Records ({data.markets.length} APMCs)
              </h4>
              <span className="text-[11px] font-bold text-[#55695A] bg-[#EFF7E9] px-2.5 py-1 rounded-lg border border-[#D4E8C9]">
                Arrival Date Constraint: {data.last_updated} (DD/MM/YYYY)
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E9E4DA] bg-white">
              <table className="w-full text-left text-xs text-[#2A3E2F]">
                <thead className="bg-[#F8F6EF] font-bold text-[#4B5E50] border-b border-[#E8E2D7]">
                  <tr>
                    <th className="p-3">Mandi / Market</th>
                    <th className="p-3">District ({data.state})</th>
                    <th className="p-3">Min Rate</th>
                    <th className="p-3">Max Rate</th>
                    <th className="p-3">Modal Rate</th>
                    <th className="p-3">Arrival Date (DD/MM/YYYY)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {data.markets.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F2]">
                      <td className="p-3 font-bold text-[#1E3B27]">{m.market}</td>
                      <td className="p-3 text-[#257342] font-extrabold">{m.district}</td>
                      <td className="p-3 font-bold text-[#2A663E]">₹{m.min_price_per_kg} / kg</td>
                      <td className="p-3 font-bold text-[#2A663E]">₹{m.max_price_per_kg} / kg</td>
                      <td className="p-3 font-extrabold text-[#146B3A]">₹{m.modal_price_per_kg} / kg</td>
                      <td className="p-3 text-[#146B3A] font-mono font-bold text-[11px]">{m.arrival_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Console Raw Verification Badge & Disclaimer */}
          <div className="rounded-xl bg-[#F6F4EB] p-3 text-[11px] text-[#5C6B60] space-y-1 border border-[#E7E2D6]">
            <p className="flex items-center gap-1.5 font-bold text-[#2B4332]">
              <CheckCircle2 size={14} className="text-[#146B3A]" />
              Raw Agmarknet API response printed in Developer Console (F12) for [{data.state} / {data.commodity}] on arrival_date: {data.last_updated}.
            </p>
            <p className="italic">
              Disclaimer: {data.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
