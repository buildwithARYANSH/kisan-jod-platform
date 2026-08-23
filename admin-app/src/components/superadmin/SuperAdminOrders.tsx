import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import type { MasterOrder } from '../../types';

export const SuperAdminOrders: React.FC = () => {
  const { orders, setSelectedOrder, selectedOrder, updateOrderStatus } = useSuperAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'supply' | 'inventory' | 'logistics' | 'quality' | 'finance'>('overview');

  // Sorted by Order ID in ascending order by default
  const sortedOrders = [...orders].sort((a, b) => a.orderId.localeCompare(b.orderId));

  const filtered = sortedOrders.filter((o) => {
    const matchesSearch = o.orderId.toLowerCase().includes(search.toLowerCase()) || o.cropName.toLowerCase().includes(search.toLowerCase()) || o.companyName.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && o.currentStatus === statusFilter;
  });

  const timelineStages: MasterOrder['currentStatus'][] = [
    'Demand Created',
    'Supply Matched',
    'Collection',
    'Inventory Intake',
    'Quality Check',
    'In Transit',
    'Delivered',
    'Final Settlement',
    'Completed',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          Master Orders Control & Chain-of-Custody Tracking
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Sorted by Order ID in ascending order by default. Full visibility across supply, inventory, logistics, quality, & financials.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white  p-4 rounded-2xl border border-gray-200  shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID, crop, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-300  bg-gray-50  w-full font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-bold">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-gray-300  bg-gray-50  font-bold"
          >
            <option value="All">All Statuses</option>
            <option value="Demand Created">Demand Created</option>
            <option value="Supply Matched">Supply Matched</option>
            <option value="Inventory Intake">Inventory Intake</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Order ID (Ascending)</th>
                <th className="p-3">Crop Commodity</th>
                <th className="p-3">Req / Confirmed Qty</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Buyer Company</th>
                <th className="p-3">Field Agent</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono font-bold text-gray-900 ">{ord.orderId}</td>
                  <td className="p-3 font-bold text-blue-600">{ord.cropName}</td>
                  <td className="p-3 font-semibold">
                    {ord.confirmedQtyKg.toLocaleString()} / {ord.quantityRequestedKg.toLocaleString()} kg
                  </td>
                  <td className="p-3 font-bold">Grade {ord.grade}</td>
                  <td className="p-3 font-semibold">{ord.companyName}</td>
                  <td className="p-3 text-gray-500">{ord.fieldAgentName}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800   text-[10px] font-bold">
                      {ord.currentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs ml-auto cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Order Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal with 6 Tabs & Visual Timeline */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-4xl w-full border border-gray-200  shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{selectedOrder.orderId}</span>
                <h3 className="text-xl font-extrabold text-gray-900 ">
                  {selectedOrder.cropName} ({selectedOrder.confirmedQtyKg.toLocaleString()} kg)
                </h3>
                <p className="text-xs text-gray-500">Buyer: {selectedOrder.companyName} • Created: {selectedOrder.createdDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  Status: {selectedOrder.currentStatus}
                </span>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Visual 13-Stage Order Timeline Visualizer */}
            <div className="p-4 rounded-2xl bg-gray-50  space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Visual Chain-of-Custody Timeline Progression:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                {timelineStages.map((stg, idx) => {
                  const isCurrent = selectedOrder.currentStatus === stg;
                  const isPassed = timelineStages.indexOf(selectedOrder.currentStatus) >= idx;

                  return (
                    <div
                      key={stg}
                      className={`px-2 py-1 rounded-lg font-bold shrink-0 flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-extrabold shadow-md'
                          : isPassed
                          ? 'bg-green-100 text-green-800  '
                          : 'bg-gray-200  text-gray-400'
                      }`}
                    >
                      <span>{stg}</span>
                      {idx < timelineStages.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400 inline" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6 Tabs Switcher */}
            <div className="flex border-b border-gray-200  gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                1. Order Overview
              </button>
              <button
                onClick={() => setActiveTab('supply')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'supply' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                2. Supply & Farmers
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                3. Storage Intake
              </button>
              <button
                onClick={() => setActiveTab('logistics')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'logistics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                4. Logistics Driver
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'quality' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                5. Quality & Rating
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`py-2 px-3 border-b-2 cursor-pointer ${activeTab === 'finance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
              >
                6. Unit Economics
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
                <div className="flex justify-between"><span>Company Demand Qty:</span><strong>{selectedOrder.quantityRequestedKg.toLocaleString()} kg</strong></div>
                <div className="flex justify-between"><span>Confirmed Quantity:</span><strong className="text-green-600 font-bold">{selectedOrder.confirmedQtyKg.toLocaleString()} kg</strong></div>
                <div className="flex justify-between"><span>Negotiated Price:</span><strong>₹{selectedOrder.pricePerKgINR.toFixed(2)}/kg</strong></div>
                <div className="flex justify-between"><span>Risk Assessment Status:</span><strong className="text-blue-600">{selectedOrder.riskStatus}</strong></div>
              </div>
            )}

            {/* Tab 2: Supply */}
            {activeTab === 'supply' && (
              <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
                <div className="flex justify-between"><span>Farmer Source Pool:</span><strong>{selectedOrder.farmerSource}</strong></div>
                <div className="flex justify-between"><span>Field Agent Signoff:</span><strong>{selectedOrder.fieldAgentName} ({selectedOrder.fieldAgentId})</strong></div>
              </div>
            )}

            {/* Tab 3: Inventory */}
            {activeTab === 'inventory' && (
              <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
                <div className="flex justify-between"><span>Assigned Storage Facility:</span><strong>{selectedOrder.inventoryFacility}</strong></div>
                <div className="flex justify-between"><span>Storage Status:</span><strong className="text-purple-600">Cold Room Intake Verified</strong></div>
              </div>
            )}

            {/* Tab 4: Logistics */}
            {activeTab === 'logistics' && (
              <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
                <div className="flex justify-between"><span>Logistics Partner:</span><strong>{selectedOrder.logisticsPartner}</strong></div>
                <div className="flex justify-between"><span>Driver Name & Contact:</span><strong className="font-mono">{selectedOrder.driverName} ({selectedOrder.driverPhone})</strong></div>
                <div className="flex justify-between"><span>Vehicle Details:</span><strong>{selectedOrder.vehicleNumber}</strong></div>
              </div>
            )}

            {/* Tab 5: Quality */}
            {activeTab === 'quality' && (
              <div className="p-4 rounded-2xl bg-gray-50  text-xs space-y-2">
                <div className="flex justify-between"><span>AI Star Rating:</span><strong className="text-amber-600 font-bold">★★★★☆ 4.5 / 5.0</strong></div>
                <div className="flex justify-between"><span>Size Grade:</span><strong>Grade {selectedOrder.grade}</strong></div>
              </div>
            )}

            {/* Tab 6: Finance Line Items */}
            {activeTab === 'finance' && (
              <div className="p-4 rounded-2xl bg-blue-50  border border-blue-200 text-xs space-y-2">
                <div className="flex justify-between"><span>Company Payment:</span><strong>₹{selectedOrder.financials.companyPayment.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Farmer Payout:</span><strong className="text-green-600">- ₹{selectedOrder.financials.farmerPayment.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Logistics Cost:</span><strong className="text-amber-600">- ₹{selectedOrder.financials.logisticsCost.toLocaleString()}</strong></div>
                <div className="flex justify-between font-black text-sm text-blue-600 pt-2 border-t">
                  <span>Platform Service Fee:</span>
                  <span>₹{selectedOrder.financials.platformServiceFee.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
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
