import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { ShoppingCart, Search, Filter, Eye, X, CheckCircle2, Truck, ShieldCheck, Warehouse, Users, Building2, Wallet, Clock, ArrowRight } from 'lucide-react';
import type { ShipmentOrder } from '../../types';

export const AdminOrderManagement: React.FC = () => {
  const { orders } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<ShipmentOrder | null>(null);

  // Default sorting: Ascending order by Order ID (Section 8 rule)
  const sortedOrders = [...orders].sort((a, b) => a.orderId.localeCompare(b.orderId));

  const filteredOrders = sortedOrders.filter((ord) => {
    const matchesSearch = 
      ord.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.driverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ord.currentStage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
            End-to-End Order Lifecycle & Unit Economics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
            Order Management & Timeline Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Track orders from demand creation to final settlement, including 13-stage visual timeline and order unit economics.
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Order ID, Crop, Driver..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-extrabold cursor-pointer"
          >
            <option value="All">All Stages</option>
            <option value="In Transit">In Transit</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Quality Checked">Quality Checked</option>
            <option value="Arrived">Arrived</option>
          </select>
        </div>
      </div>

      {/* Orders Table (Ascending Order ID by default) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order ID (Ascending)</th>
                <th className="p-3.5">Crop Commodity</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Logistics Fleet</th>
                <th className="p-3.5">Driver & Contact</th>
                <th className="p-3.5">Estimated Arrival</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{ord.orderId}</td>
                  <td className="p-3.5 font-black text-slate-900 font-fraunces">{ord.cropName}</td>
                  <td className="p-3.5 font-bold">{ord.quantity.toLocaleString()} {ord.unit}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black border border-blue-300">
                      {ord.currentStage}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 font-bold">{ord.logisticsPartner}</td>
                  <td className="p-3.5">
                    <strong className="text-slate-900 font-bold block">{ord.driverName} ({ord.vehicleNumber})</strong>
                    <span className="text-[10px] text-slate-500">{ord.contact}</span>
                  </td>
                  <td className="p-3.5 text-amber-800 font-bold">{ord.estimatedArrival}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 ml-auto cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Order Details & Unit Economics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details & Visual Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-blue-200 shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                <ShoppingCart className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-fraunces">
                  Order Details: {selectedOrder.orderId}
                </h3>
                <span className="text-xs text-slate-500 font-bold">Commodity: {selectedOrder.cropName} ({selectedOrder.quantity.toLocaleString()} {selectedOrder.unit})</span>
              </div>
            </div>

            {/* 13-Stage Visual Timeline */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Visual Order Progression Timeline:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
                {selectedOrder.stages.map((stg, idx) => (
                  <div
                    key={stg.name}
                    className={`p-2 rounded-xl border ${
                      stg.completed 
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black' 
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mx-auto mb-1 ${stg.completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>{stg.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Entity Sub-Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-black text-blue-900 uppercase block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Company & Buyer Demand:
                </span>
                <p>Buyer: <strong>AgroProcure Foods Pvt Ltd</strong></p>
                <p>Target Price: <strong>₹18/kg</strong></p>
                <p>Destination Hub: <strong>Ludhiana Processing Hub</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-black text-purple-900 uppercase block flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Supply & Field Agents:
                </span>
                <p>Farmers Involved: <strong>Gurdev Singh + 2 Farmers</strong></p>
                <p>Field Agent: <strong>Ramesh Kumar (AGT-101)</strong></p>
                <p>Batch ID: <strong className="font-mono text-purple-900">LOT-2026-9920</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-black text-amber-900 uppercase block flex items-center gap-1">
                  <Warehouse className="w-3.5 h-3.5" /> Warehouse & Intake:
                </span>
                <p>Facility: <strong>Central Grain Silo - Hub A</strong></p>
                <p>Intake Manager: <strong>Baldev Singh</strong></p>
                <p>Intake Date: <strong>2026-08-19</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-black text-indigo-900 uppercase block flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Logistics Fleet:
                </span>
                <p>Fleet: <strong>{selectedOrder.logisticsPartner}</strong></p>
                <p>Driver: <strong>{selectedOrder.driverName} ({selectedOrder.vehicleNumber})</strong></p>
                <p>ETA: <strong>{selectedOrder.estimatedArrival}</strong></p>
              </div>
            </div>

            {/* Platform Profit / Unit Economics Breakdown (Section 9) */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-900 space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
                <Wallet className="w-4 h-4 text-amber-700" /> Platform Order Unit Economics Breakdown:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block text-[9px]">Company Payment</span>
                  <strong className="text-slate-900 text-sm">₹4,80,000</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block text-[9px]">Farmer Settlement</span>
                  <strong className="text-emerald-700 text-sm">- ₹4,25,000</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500 block text-[9px]">Logistics & Storage</span>
                  <strong className="text-amber-800 text-sm">- ₹18,750</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-emerald-800 block text-[9px]">Platform Net Result</span>
                  <strong className="text-emerald-700 text-sm">+ ₹36,250</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
