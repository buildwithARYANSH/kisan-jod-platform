import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, TrendingUp, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react';
import type { IndustryDemand } from '../types';

export const DemandCarousel: React.FC = () => {
  const { demands, t, setActiveSection, speak, textReaderActive, setSelectedCropForAdd, setIsAddCropModalOpen } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCardClick = (demand: IndustryDemand) => {
    const textToRead = `${demand.cropName}. Required ${demand.requiredQty.toLocaleString()} kg. Offered price ${demand.pricePerKg} rupees per kg. Registered ${demand.registeredQty.toLocaleString()} kg.`;
    if (textReaderActive) {
      speak(textToRead);
    }
    setSelectedCropForAdd(demand);
    setIsAddCropModalOpen(true);
    setActiveSection('crops');
  };

  return (
    <section className="my-6 px-4 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-black flex items-center gap-2 font-fraunces">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            {t.currentDemand}
          </h2>
          <p className="text-xs sm:text-sm text-black font-semibold">
            {t.demandSubtitle}
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            aria-label="Previous Demands"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            aria-label="Next Demands"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-3 snap-x snap-mandatory scroll-smooth"
      >
        {demands.filter((demand) => {
          const isWaste = 
            demand.category === 'Agri Waste & Biomass' || 
            demand.cropName.toLowerCase().includes('parali') || 
            demand.cropName.toLowerCase().includes('stubble') || 
            demand.cropName.toLowerCase().includes('dung') || 
            demand.cropName.toLowerCase().includes('waste');
          return !isWaste;
        }).map((demand) => {
          const progressPercent = Math.min(
            100,
            Math.round((demand.registeredQty / demand.requiredQty) * 100)
          );
          const remainingQty = Math.max(0, demand.requiredQty - demand.registeredQty);

          return (
            <div
              key={demand.id}
              onClick={() => handleCardClick(demand)}
              className="snap-start shrink-0 w-72 sm:w-80 p-4.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl dark:hover:border-emerald-500 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Urgent Tag */}
              {demand.urgent && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-[10px] font-extrabold flex items-center gap-1 border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-3 h-3" />
                  {t.urgentDemand}
                </div>
              )}

              {/* Crop Info Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={demand.image}
                    alt={demand.cropName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 uppercase">
                      {demand.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {demand.cropName} {demand.cropNameHi ? `(${demand.cropNameHi})` : ''}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {demand.buyersCount} {t.buyers}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {t.offeredPrice}:
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    ₹{demand.pricePerKg} <span className="text-xs font-normal">/ {demand.unit}</span>
                  </span>
                </div>

                {/* Progress Bar & Quantities */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    <span>Progress:</span>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      {demand.registeredQty.toLocaleString()} / {demand.requiredQty.toLocaleString()} kg
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {progressPercent}% Filled
                    </span>
                    <span>
                      Need: <strong className="text-slate-900 dark:text-white font-bold">{remainingQty.toLocaleString()} kg</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(demand);
                }}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {t.registerSupplyForThis}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
