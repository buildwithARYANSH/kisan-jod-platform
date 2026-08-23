import React from 'react';
import { GitMerge, CheckCircle2, ArrowRight } from 'lucide-react';

export const SuperAdminDemandMatching: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <GitMerge className="w-6 h-6 text-blue-600" />
          Algorithmic Demand-Supply Matching Engine
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Matches company bulk requirements against farmer aggregation pools using multi-parameter scoring.
        </p>
      </div>

      {/* Match Candidate Cards */}
      <div className="p-6 rounded-3xl bg-white  border border-gray-200  shadow-md space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase">Match Candidate Pair #1</span>
            <h3 className="text-lg font-extrabold text-gray-900 ">
              FreshAgro Foods (10,000 kg Tomato Grade A) ↔ Ramesh Kumar (Gill Pool)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-extrabold text-sm">
            87% Match Score
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 ">
            <span className="text-gray-500 block">Product Compatibility:</span>
            <strong className="text-green-600 font-bold">100% (Tomato Grade A)</strong>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 ">
            <span className="text-gray-500 block">Quantity Compatibility:</span>
            <strong className="text-green-600 font-bold">85% (6,000 / 10,000 kg)</strong>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 ">
            <span className="text-gray-500 block">Location Proximity:</span>
            <strong className="text-green-600 font-bold">92% (12 km Radius)</strong>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 ">
            <span className="text-gray-500 block">Price Compatibility:</span>
            <strong className="text-green-600 font-bold">95% (₹18.00/kg)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
