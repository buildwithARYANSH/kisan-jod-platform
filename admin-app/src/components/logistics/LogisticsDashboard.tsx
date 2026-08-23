import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Truck, PackageCheck, Clock, AlertTriangle, DollarSign, CheckCircle2 } from 'lucide-react';

export const LogisticsDashboard: React.FC = () => {
  const { shipments, drivers, vehicles, payments, setActiveSection } = useLogistics();

  const newRequests = shipments.filter((s) => s.status === 'Pickup Requested');
  const activeDeliveries = shipments.filter((s) => s.status !== 'Delivered' && s.status !== 'Pickup Requested');
  const completedDeliveries = shipments.filter((s) => s.status === 'Delivered');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 uppercase tracking-wider border border-blue-400/30">
            Logistics Operational Hub
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Fleet Operations & Delivery Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Accept assigned transportation requirements, validate vehicle capacity & execute proof-of-delivery signoffs.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('pickup-requests')}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <PackageCheck className="w-4 h-4" />
          Pickup Requests ({newRequests.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 block">New Pickup Requests</span>
          <span className="text-2xl font-black text-blue-600  mt-1 block">{newRequests.length}</span>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">Awaiting Acceptance</span>
        </div>

        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 block">Active Deliveries</span>
          <span className="text-2xl font-black text-purple-600  mt-1 block">{activeDeliveries.length}</span>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">In Transit / Loading</span>
        </div>

        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 block">Completed Deliveries</span>
          <span className="text-2xl font-black text-green-600  mt-1 block">{completedDeliveries.length}</span>
          <span className="text-[10px] text-green-600 font-bold mt-1 block">Proof of Delivery Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white  border border-gray-200  shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 block">Total Logistics Earnings</span>
          <span className="text-2xl font-black text-gray-900  mt-1 block">₹13,000</span>
          <span className="text-[10px] text-gray-400 italic block">Approved Freight Fees</span>
        </div>
      </div>

      {/* Today's Operations Chronological Timeline */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md space-y-4">
        <h3 className="text-sm font-bold text-gray-900  flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Today's Operational Transportation Timeline
        </h3>

        <div className="space-y-3">
          {shipments.map((s) => (
            <div
              key={s.orderId}
              className="p-4 rounded-xl bg-gray-50  border border-gray-200  flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-400 font-bold">{s.orderId}</span>
                  <strong className="text-gray-900  text-sm">{s.cropName} ({s.expectedQuantityKg.toLocaleString()} kg)</strong>
                </div>
                <p className="text-gray-500">
                  Pickup: <strong>{s.pickupInventoryName}</strong> → Destination: <strong>{s.destinationCompanyName}</strong>
                </p>
                <p className="text-gray-400 font-mono text-[10px]">
                  Driver: {s.assignedDriver?.name || 'Pending Assignment'} • Vehicle: {s.assignedVehicle?.registrationNumber || 'Pending'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100  text-blue-800  text-[10px] font-bold">
                  {s.status}
                </span>
                <button
                  onClick={() => setActiveSection(s.status === 'Pickup Requested' ? 'pickup-requests' : 'active-deliveries')}
                  className="py-1 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
