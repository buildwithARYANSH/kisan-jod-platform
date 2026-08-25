import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Recycle,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  Trash2
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const { demands, qualityBatches, receipts, orders, setActiveSection, deleteDemand } = useCompany();

  // Revertible View Mode State: 'catchy' (Enhanced Executive View) vs 'classic' (Original Compact View)
  const [viewMode, setViewMode] = useState<'catchy' | 'classic'>('catchy');

  const activeDemandsCount = demands.filter((d) => d.status !== 'Closed' && d.status !== 'Fulfilled').length;
  const matchedDemandsCount = demands.filter((d) => d.status === 'Matched' || d.status === 'Partially Matched').length;
  const ordersInProgressCount = orders.filter((o) => o.currentStage !== 'Arrived').length;
  const incomingBatchesCount = qualityBatches.length;
  const pendingPaymentsCount = receipts.filter((r) => r.paymentStatus !== 'Paid').length;
  const completedOrdersCount = receipts.filter((r) => r.paymentStatus === 'Paid').length;

  return (
    <div className="space-y-6">
      {/* Top View Mode Switcher (Revertible Toggle) */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Industrial Buyer Dashboard View:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('catchy')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === 'catchy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Catchy Executive View ✨
          </button>
          <button
            onClick={() => setViewMode('classic')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              viewMode === 'classic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Classic View 📋
          </button>
        </div>
      </div>

      {viewMode === 'catchy' ? (
        /* CATCHY EXECUTIVE HERO & ANALYTICS VIEW */
        <>
          {/* Catchy Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-blue-900/40">
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Aggregation System Active • 42 Farmer Hubs Connected
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[10px] font-extrabold">
                    SIH B2B Procurement Suite
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white font-fraunces leading-tight">
                  Industrial Crop & Biomass Procurement Hub
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  Direct farmer pool sourcing, AI fair pricing estimates, verified quality batches & 3rd-party logistics fleet coordination.
                </p>

                {/* Stat Ticker Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold">
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    ₹4,35,000 Saved via Direct Sourcing
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    94.8% Batches Verified Grade A/B
                  </div>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={() => setActiveSection('demand-entry')}
                  className="py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer border border-blue-400/30"
                >
                  <PlusCircle className="w-5 h-5 text-white" />
                  Post Crop / Waste Demand
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveSection('pay-portal')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-blue-300" />
                    Pay Escrow
                  </button>
                  <button
                    onClick={() => setActiveSection('order-tracking')}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-300" />
                    Track Fleet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Catchy KPI Grid with Gradients & Visual Meters */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50/40 border border-blue-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider block">Active Demands</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-blue-900 font-fraunces">{activeDemandsCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950">Open</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border border-emerald-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">Matched Supply</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-emerald-900 font-fraunces">{matchedDemandsCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950">Allocated</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border border-amber-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block">Orders In Transit</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-amber-900 font-fraunces">{ordersInProgressCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950">Logistics</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-purple-50/40 border border-purple-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-purple-900 uppercase tracking-wider block">Incoming Batches</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-purple-900 font-fraunces">{incomingBatchesCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-950">AI Rated</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-rose-50/40 border border-rose-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-rose-900 uppercase tracking-wider block">Pending Balance</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-rose-900 font-fraunces">{pendingPaymentsCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-950">Wire Due</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50 via-white to-teal-50/40 border border-teal-200 shadow-md hover:shadow-lg transition-all hover:scale-102">
              <span className="text-[11px] font-extrabold text-teal-900 uppercase tracking-wider block">Completed</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-teal-900 font-fraunces">{completedOrdersCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-950">Settled</span>
              </div>
            </div>
          </div>

          {/* Executive Procurement Performance & Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-blue-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Sourcing Savings Index
                </span>
                <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md">
                  14.2% Cost Saved
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-fraunces">
                ₹4,35,000 Net Savings
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                Direct platform aggregation bypassed mandi middleman markups across recent 3 crop cycles.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  AI Quality Standard
                </span>
                <span className="text-xs font-black text-purple-950 bg-purple-100 px-2 py-0.5 rounded-md">
                  4.5 / 5.0 Avg
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-fraunces">
                Grade A & B Guaranteed
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                Ground Field Agent structured form verification + AI star rating model deployment.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-amber-600" />
                  Biomass Sustainability
                </span>
                <span className="text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-md">
                  20,000 kg Parali
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-fraunces">
                Biogas & Bio-Pellets
              </p>
              <p className="text-xs text-slate-600 font-semibold">
                Agricultural waste stubble redirected to industrial renewable energy procurement.
              </p>
            </div>
          </div>

          {/* Active Demand Supply Matching Visualizer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
                  Aggregated Farmer Pool Allocation
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2 font-fraunces">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Crop & Biomass Demand Fulfillment Tracker
                </h3>
              </div>
              <button
                onClick={() => setActiveSection('demand-entry')}
                className="text-xs font-extrabold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Manage Demands <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {(!demands || demands.length === 0) ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 font-semibold">
                  <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-base font-fraunces">No Active Requirements Posted</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Post New Requirement" to create your first bulk crop or biomass procurement demand.
                  </p>
                  <button
                    onClick={() => setActiveSection('demand-entry')}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                  >
                    Post First Requirement
                  </button>
                </div>
              ) : (
                demands.map((demand) => {
                  const matchPercent = Math.min(100, Math.round((demand.matchedQuantity / demand.quantity) * 100));
                  const remaining = Math.max(0, demand.quantity - demand.matchedQuantity);

                  return (
                    <div
                      key={demand.id}
                      className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 font-fraunces">
                            {demand.cropName}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                            demand.category === 'Agri Waste & Biomass' 
                              ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                              : 'bg-blue-100 text-blue-950 border border-blue-300'
                          }`}>
                            {demand.category || `Grade ${demand.requiredGrade}`}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-extrabold">
                            {demand.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-semibold">
                          Hub: {demand.deliveryLocation} • Target Price: <strong className="text-blue-900 font-bold">₹{demand.expectedPricePerUnit}/{demand.unit}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="w-full md:w-80 space-y-1.5">
                          <div className="flex justify-between text-xs font-extrabold text-slate-800">
                            <span>Matched: {demand.matchedQuantity.toLocaleString()} {demand.unit}</span>
                            <span>Required: {demand.quantity.toLocaleString()} {demand.unit}</span>
                          </div>
                          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 shadow-xs"
                              style={{ width: `${matchPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 font-semibold">
                            <span className="text-emerald-700 font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {matchPercent}% Supply Allocated
                            </span>
                            <span>Remaining: {remaining.toLocaleString()} {demand.unit}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          title="Delete Requirement"
                          onClick={() => deleteDemand(demand.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Catchy Activity Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
              <Clock className="w-5 h-5 text-blue-600" />
              Live Procurement Activity Stream
            </h3>

            {(!demands || demands.length === 0) ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 font-semibold">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-base font-fraunces">No Procurement Activity Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Live activity stream will automatically update here as soon as corporate requirements are posted and produce is matched with local farmers.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm font-semibold">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Supply Matched: 65,000 kg Grade A Tomato allocated across 3 Farmer Aggregation Pools in Ludhiana Hub.
                    </p>
                    <span className="text-xs text-slate-500 font-semibold">15 mins ago</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Shipment Dispatched: Batch #LOT-2026-9920 loaded via Sample Logistics Partner (Vehicle #PB-10-CZ-4921).
                    </p>
                    <span className="text-xs text-slate-500 font-semibold">2 hours ago</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Quality Rating Generated: Field Agent inspection complete. Star rating 4.5/5 assigned to Batch #LOT-2026-9920.
                    </p>
                    <span className="text-xs text-slate-500 font-semibold">1 day ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* CLASSIC ORIGINAL COMPACT VIEW (Revertible Target) */
        <>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
                Classic Industrial Procurement Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-fraunces">
                Buyer Dashboard (Classic View)
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                Track aggregated bulk requirements, AI fair pricing estimates, incoming verified batches & shipments
              </p>
            </div>

            <button
              onClick={() => setActiveSection('demand-entry')}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Post New Requirement
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-3xl bg-white border border-blue-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Active Demands</span>
              <span className="text-2xl font-black text-blue-700 font-fraunces mt-1 block">{activeDemandsCount}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Matched Supply</span>
              <span className="text-2xl font-black text-emerald-700 font-fraunces mt-1 block">{matchedDemandsCount}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Orders In Transit</span>
              <span className="text-2xl font-black text-amber-700 font-fraunces mt-1 block">{ordersInProgressCount}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Incoming Batches</span>
              <span className="text-2xl font-black text-purple-700 font-fraunces mt-1 block">{incomingBatchesCount}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Pending Balance</span>
              <span className="text-2xl font-black text-rose-700 font-fraunces mt-1 block">{pendingPaymentsCount}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-teal-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600 block">Completed</span>
              <span className="text-2xl font-black text-teal-700 font-fraunces mt-1 block">{completedOrdersCount}</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-fraunces">
                <Building2 className="w-5 h-5 text-blue-600" />
                Active Crop Requirements & Aggregated Supply Matching
              </h3>
              <button
                onClick={() => setActiveSection('demand-entry')}
                className="text-xs font-extrabold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                View All Demands <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {demands.map((demand) => {
                const matchPercent = Math.min(100, Math.round((demand.matchedQuantity / demand.quantity) * 100));
                const remaining = Math.max(0, demand.quantity - demand.matchedQuantity);

                return (
                  <div
                    key={demand.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900 font-fraunces">
                          {demand.cropName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 text-xs font-black">
                          Grade {demand.requiredGrade}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-extrabold">
                          {demand.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">
                        Location: {demand.deliveryLocation} • Target Price: <strong className="text-blue-900 font-bold">₹{demand.expectedPricePerUnit}/{demand.unit}</strong>
                      </p>
                    </div>

                    <div className="w-full md:w-80 space-y-1.5">
                      <div className="flex justify-between text-xs font-extrabold text-slate-800">
                        <span>Matched: {demand.matchedQuantity.toLocaleString()} {demand.unit}</span>
                        <span>Required: {demand.quantity.toLocaleString()} {demand.unit}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${matchPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 font-semibold">
                        <span className="text-emerald-700 font-bold">{matchPercent}% Supply Allocated</span>
                        <span>Remaining: {remaining.toLocaleString()} {demand.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
