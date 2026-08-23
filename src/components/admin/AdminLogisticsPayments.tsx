import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Truck, Wallet, MapPin, CheckCircle2 } from 'lucide-react';

export const AdminLogisticsPayments: React.FC = () => {
  const { orders } = useCompany();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
          Freight & Transport Settlements
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Logistics Payments & Freight Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Track 3rd-party logistics partner freight settlements, per-delivery costs & mileage pass-throughs.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
        <h3 className="text-base font-black text-slate-900 font-fraunces mb-3">Freight Delivery Audit Trail</h3>
        {orders.map((ord) => (
          <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-semibold">
            <div>
              <strong className="text-slate-900 text-sm font-bold block">{ord.logisticsPartner}</strong>
              <span className="text-slate-500 font-mono text-[10px]">{ord.orderId} • Driver: {ord.driverName} ({ord.vehicleNumber})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-900 font-black text-sm block">₹12,500</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-bold">Settled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
