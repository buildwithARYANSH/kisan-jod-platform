import React from 'react';
import { Layers, CheckCircle2, Sparkles, Sliders } from 'lucide-react';

export const AdminDemandMatching: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 uppercase tracking-wider border border-emerald-200">
          Smart Supply-Demand Allocation Engine
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Demand-Supply Matching Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Configurable weight matching engine evaluating Crop Compatibility, Quantity, Quality Grade, Location Proximity & Reliability.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 text-xs sm:text-sm font-semibold">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="font-extrabold text-slate-900 text-base font-fraunces">Top Candidate Match Result</span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs">
            87% Match Score
          </span>
        </div>

        <div className="space-y-2 text-slate-700">
          <div className="flex justify-between"><span>Product Compatibility:</span> <strong className="text-emerald-700">100% Match</strong></div>
          <div className="flex justify-between"><span>Quantity Feasibility:</span> <strong className="text-emerald-700">92% Match</strong></div>
          <div className="flex justify-between"><span>Quality Grade Compatibility:</span> <strong className="text-emerald-700">95% Match</strong></div>
          <div className="flex justify-between"><span>Location Proximity:</span> <strong className="text-amber-700">75% Match (18 km transit)</strong></div>
        </div>
      </div>
    </div>
  );
};
