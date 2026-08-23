import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { FarmerCrop, Grade } from '../types';
import { Sprout, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Info, Calendar, Scale, Tag } from 'lucide-react';

const STATUS_STEPS = ["Listed", "Agent assigned", "Collected & graded", "In inventory", "Sold", "Paid"];

export const MyCropSection: React.FC = () => {
  const { 
    crops, 
    demands, 
    addCrop, 
    updateCrop, 
    deleteCrop, 
    t, 
    isAddCropModalOpen, 
    setIsAddCropModalOpen, 
    selectedCropForAdd, 
    setSelectedCropForAdd 
  } = useApp();
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<FarmerCrop | null>(null);

  // Form State (Farmer inputs crop, quantity, grade & harvest date - Price is allocated by platform)
  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState<number>(50000);
  const [grade, setGrade] = useState<Grade>('A');
  const [harvestDate, setHarvestDate] = useState('2026-09-01');

  // Auto-open modal when triggered from DemandCarousel "Register supply for this demand" button
  React.useEffect(() => {
    if (isAddCropModalOpen || selectedCropForAdd) {
      if (selectedCropForAdd) {
        setCropName(selectedCropForAdd.cropName);
        const needed = Math.max(1000, selectedCropForAdd.requiredQty - selectedCropForAdd.registeredQty);
        setQuantity(needed);
        if (selectedCropForAdd.gradeRequirement) {
          setGrade(selectedCropForAdd.gradeRequirement);
        }
      }
      setIsAddModalOpen(true);
    }
  }, [isAddCropModalOpen, selectedCropForAdd]);

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsAddCropModalOpen(false);
    setSelectedCropForAdd(null);
    setEditingCrop(null);
  };

  const getAllocatedPrice = (name: string): number => {
    const matchedDemand = demands.find(d => d.cropName.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.cropName.toLowerCase()));
    if (matchedDemand) return matchedDemand.pricePerKg;
    if (name.includes('Tomato')) return 18;
    if (name.includes('Potato')) return 16;
    if (name.includes('Wheat')) return 24;
    if (name.includes('Onion')) return 22;
    if (name.includes('Maize')) return 20;
    if (name.includes('Cotton')) return 45;
    return 20;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || quantity <= 0) return;

    const allocatedPrice = getAllocatedPrice(cropName);

    if (editingCrop) {
      updateCrop(editingCrop.id, {
        cropName,
        quantity,
        grade,
        harvestDate,
        offerPrice: allocatedPrice,
      });
      setEditingCrop(null);
    } else {
      addCrop({
        cropName,
        quantity,
        grade,
        harvestDate,
        offerPrice: allocatedPrice,
        status: 'Listed',
      });
    }

    closeModal();
    resetForm();
  };

  const resetForm = () => {
    setCropName('Tomato');
    setQuantity(50000);
    setGrade('A');
    setHarvestDate('2026-09-01');
  };

  const openEdit = (crop: FarmerCrop) => {
    setEditingCrop(crop);
    setCropName(crop.cropName);
    setQuantity(crop.quantity);
    setGrade(crop.grade);
    setHarvestDate(crop.harvestDate);
    setIsAddModalOpen(true);
  };

  return (
    <section className="my-6 px-4 max-w-5xl mx-auto">
      {/* Header & Add Crop Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-5 sm:p-6 rounded-3xl border border-emerald-200 shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 font-fraunces">
            <Sprout className="w-6 h-6 text-emerald-600" />
            {t.registeredCrops}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
            Manage your registered crops, size grades (A/B/C), and view platform allocated rates
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingCrop(null);
            setIsAddModalOpen(true);
          }}
          className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          {t.addCrop}
        </button>
      </div>

      {/* Grade System Explanation Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 font-semibold leading-relaxed">
          <strong className="font-extrabold text-sm block mb-1">SIH Size-Based Grading Standard:</strong>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong className="text-emerald-800 font-bold">Grade A (Large):</strong> Matched directly to chips/industrial processors.</li>
            <li><strong className="text-blue-800 font-bold">Grade B (Medium):</strong> Standard food & fresh market pool.</li>
            <li><strong className="text-purple-800 font-bold">Grade C (Small):</strong> Routed to Quick-Commerce / Baby vegetable buyers.</li>
          </ul>
        </div>
      </div>

      {/* Crop Cards List */}
      {crops.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-emerald-300 text-slate-600 font-bold">
          <p className="text-sm">{t.noCropsYet}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-emerald-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Grade Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                  crop.grade === 'A'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : crop.grade === 'B'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-purple-100 text-purple-900 border border-purple-300'
                }`}>
                  Grade {crop.grade} ({crop.grade === 'A' ? 'Large Size' : crop.grade === 'B' ? 'Medium Size' : 'Small Size'})
                </span>

                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-extrabold border border-slate-200">
                  {crop.status}
                </span>
              </div>

              {/* Crop Main Info */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-fraunces">
                  {crop.cropName}
                </h3>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    <span>Qty: <strong className="text-slate-900 font-bold">{crop.quantity.toLocaleString()} kg</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Allocated Price: <strong className="text-emerald-700 font-extrabold">₹{crop.offerPrice}/kg</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Harvest Date: <strong className="text-slate-900 font-bold">{crop.harvestDate}</strong></span>
                  </div>
                </div>

                {/* Matched Demand Box */}
                {crop.matchedDemandCrop ? (
                  <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Matched Demand: <strong className="font-bold">{crop.matchedDemandCrop}</strong></span>
                  </div>
                ) : (
                  <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Awaiting direct buyer allocation match</span>
                  </div>
                )}

                {/* Status Stepper (Farmer status view - step advancement handled by platform/agent) */}
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 mb-2">
                    <span>Track Status:</span>
                    <span className="text-emerald-700 uppercase font-black">
                      {STATUS_STEPS[crop.stepIndex ?? 0]}
                    </span>
                  </div>
                  
                  <div className="flex items-center w-full my-2 px-1">
                    {STATUS_STEPS.map((s, i) => {
                      const isDone = i <= (crop.stepIndex ?? 0);
                      return (
                        <React.Fragment key={s}>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                              isDone 
                                ? 'bg-emerald-600 text-white ring-2 ring-emerald-200' 
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDone ? '✓' : i + 1}
                            </div>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 transition-all ${
                              i < (crop.stepIndex ?? 0) ? 'bg-emerald-600' : 'bg-slate-200'
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEdit(crop)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {t.edit}
                </button>
                <button
                  onClick={() => deleteCrop(crop.id)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 border border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-100 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              {editingCrop ? 'Edit Crop Details' : t.addCrop}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.cropName}
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Red Onion">Red Onion (प्याज)</option>
                  <option value="Maize (Corn)">Maize (मक्का)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.quantityKg}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {t.grade} (Size Standard)
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="A">Grade A (Large Size - Industrial / Chips)</option>
                  <option value="B">Grade B (Medium Size - Standard Fresh Market)</option>
                  <option value="C">Grade C (Small Size - Quick Commerce / Baby)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-semibold">
                <span>Allocated Platform Rate: </span>
                <strong className="text-emerald-800 font-extrabold">₹{getAllocatedPrice(cropName)}/kg</strong>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">Price is automatically allocated based on buyer demand requirements.</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  {editingCrop ? 'Save Changes' : 'Register Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
