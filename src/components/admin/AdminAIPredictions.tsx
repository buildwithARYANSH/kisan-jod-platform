import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminAIPredictions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
          Model Accuracy & Historical Validation
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          AI Prediction Performance Monitoring
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Historical prediction vs actual transaction price error analysis across regional mandi hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Overall Price Prediction Accuracy</span>
          <strong className="text-3xl font-black text-emerald-700 font-fraunces">94.5%</strong>
          <span className="text-[10px] text-slate-400 block font-bold">Historical Mean Absolute Error: 2.1%</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Tomato Price Prediction Error</span>
          <strong className="text-3xl font-black text-blue-900 font-fraunces">1.8%</strong>
          <span className="text-[10px] text-slate-400 block font-bold">₹0.35/kg Variance vs Actual</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-1">
          <span className="text-slate-500 font-bold block">Potato Price Prediction Error</span>
          <strong className="text-3xl font-black text-blue-900 font-fraunces">2.4%</strong>
          <span className="text-[10px] text-slate-400 block font-bold">₹0.42/kg Variance vs Actual</span>
        </div>
      </div>
    </div>
  );
};
