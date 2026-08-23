import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { BarChart3, Building2, Layers, CheckCircle2 } from 'lucide-react';

export const AdminDemandAnalytics: React.FC = () => {
  const { demands } = useCompany();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
          Aggregated Industrial Demand
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Demand Analytics & Buyer Distribution
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Crop-wise, company-wise & grade-wise demand aggregation with matched vs remaining supply breakdown.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <h3 className="text-base font-black text-slate-900 font-fraunces">Active Demand Distribution Breakdown</h3>
        <div className="space-y-3">
          {demands.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-semibold">
              <div>
                <strong className="text-slate-900 text-sm font-black font-fraunces block">{d.cropName}</strong>
                <span className="text-slate-500 font-mono text-[10px]">{d.id} • Target: ₹{d.expectedPricePerUnit}/{d.unit}</span>
              </div>
              <div className="text-right">
                <span className="text-blue-900 font-black text-sm block">{d.quantity.toLocaleString()} {d.unit}</span>
                <span className="text-emerald-700 font-bold">{d.matchedQuantity.toLocaleString()} {d.unit} Matched</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
