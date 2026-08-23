import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { ShieldCheck, Star, Calendar, CheckCircle2, UserCheck } from 'lucide-react';

export const CompanyIncomingQuality: React.FC = () => {
  const { qualityBatches } = useCompany();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-200 shadow-md">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          Incoming Produce Verified Quality Batches
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Quality reports generated from ground Field Agent structured form inspection + AI Star Rating model.
        </p>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {qualityBatches.map((batch) => (
          <div
            key={batch.id}
            className="p-6 rounded-3xl bg-white border border-purple-100 shadow-md flex flex-col justify-between"
          >
            <div>
              {/* Batch Top Badge & Star Rating */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-md bg-purple-100 text-purple-950 border border-purple-300">
                  {batch.id}
                </span>

                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-amber-950">
                    {batch.starRating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-[10px] text-amber-700 font-extrabold ml-1">(AI Rating)</span>
                </div>
              </div>

              {/* Crop & Grade */}
              <h3 className="text-lg font-black text-slate-900 font-fraunces mt-1">
                {batch.cropName}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 text-xs font-black border border-emerald-300">
                  Grade {batch.grade} ({batch.grade === 'A' ? 'Large Size' : 'Medium Size'})
                </span>
                <span className="text-xs text-slate-700 font-bold">
                  Qty: {batch.quantity.toLocaleString()} {batch.unit}
                </span>
              </div>

              {/* Verified Quality Attributes */}
              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                  AI Assessed Attributes:
                </span>
                <div className="flex justify-between">
                  <span>Size Specification:</span>
                  <strong className="text-slate-900 font-bold">{batch.attributes.size}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Harvest Freshness Index:</span>
                  <strong className="text-emerald-700 font-extrabold">{batch.attributes.freshness}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Moisture Content:</span>
                  <strong className="text-slate-900 font-bold">{batch.attributes.moisture}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Defect / Rejection Risk:</span>
                  <strong className="text-teal-700 font-extrabold">{batch.attributes.defectPercent}</strong>
                </div>
              </div>

              {/* Field Agent & Inspection Info */}
              <div className="text-xs text-slate-600 font-semibold space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  {batch.fieldAgentRef}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Inspection Date: {batch.inspectionDate}
                </p>
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-black text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {batch.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
