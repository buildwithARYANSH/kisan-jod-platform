import React from 'react';
import { TrendingUp, Calendar, Sparkles } from 'lucide-react';

export const AdminDemandForecasting: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
          Predictive Seasonal Horizon
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Demand Forecasting Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Predict upcoming regional demand, seasonal procurement surges & crop-specific supply requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Tomato Next Month Demand</span>
          <strong className="text-2xl font-black text-blue-900 font-fraunces">1,80,000 kg</strong>
          <span className="text-[10px] text-emerald-700 font-bold block">+15% Seasonal Surge Expected</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Potato Next Month Demand</span>
          <strong className="text-2xl font-black text-blue-900 font-fraunces">2,40,000 kg</strong>
          <span className="text-[10px] text-slate-500 font-bold block">Stable Processing Demand</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Parali Stubble Biogas Demand</span>
          <strong className="text-2xl font-black text-amber-900 font-fraunces">80,000 kg</strong>
          <span className="text-[10px] text-amber-700 font-bold block">+35% Energy Plant Procurement</span>
        </div>
      </div>
    </div>
  );
};
