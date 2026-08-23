import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Users, UserPlus, Phone, MapPin, CheckCircle2, Gift } from 'lucide-react';

export const AdminFarmers: React.FC = () => {
  const { farmers, addFarmer } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('Gurmail Singh');
  const [phone, setPhone] = useState('+91 98144 77889');
  const [village, setVillage] = useState('Village Sahnewal');
  const [district, setDistrict] = useState('Ludhiana');
  const [cropsText, setCropsText] = useState('Tomato, Wheat');
  const [totalCapacity, setTotalCapacity] = useState('20,000 kg/season');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFarmer({
      name,
      phone,
      village,
      district,
      crops: cropsText.split(',').map((c) => c.trim()),
      totalCapacity,
      activeOrdersCount: 0,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Assigned Farmers & Onboarding Directory
          </h2>
          <p className="text-xs text-gray-500  mt-1">
            Manage assigned farmers in your cluster, track harvest availability, and register new farmers to earn referral rewards.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Register New Farmer (+₹500 Reward)
        </button>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farmers.map((frm) => (
          <div
            key={frm.id}
            className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-gray-400 font-bold">{frm.id}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-100  text-green-800  text-[10px] font-bold">
                  {frm.status}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-gray-900 ">
                {frm.name}
              </h3>

              <div className="mt-2 space-y-1 text-xs text-gray-600 ">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <a href={`tel:${frm.phone}`} className="font-mono text-blue-600 hover:underline">
                    {frm.phone}
                  </a>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {frm.village}, {frm.district}
                </p>
                <p className="text-[11px] font-semibold text-gray-700  pt-1">
                  Crops: <strong>{frm.crops.join(', ')}</strong>
                </p>
                <p className="text-[11px] text-gray-500">
                  Capacity: {frm.totalCapacity}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100  flex justify-between items-center text-xs">
              <span className="text-[10px] text-gray-400">Last interaction: {frm.lastInteraction}</span>
              <a
                href={`tel:${frm.phone}`}
                className="py-1 px-3 rounded-lg bg-blue-50  text-blue-700  text-xs font-bold"
              >
                Call Farmer
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Register New Farmer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-blue-100  text-blue-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 ">
                  Onboard & Register New Farmer
                </h3>
                <span className="text-[10px] font-bold text-green-600  flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> Auto-linked to Referral Code FA-10234 (+₹500)
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm mt-3">
              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700  mb-1">
                    Village Name
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700  mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Primary Crops (Comma separated)
                </label>
                <input
                  type="text"
                  value={cropsText}
                  onChange={(e) => setCropsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Estimated Seasonal Capacity
                </label>
                <input
                  type="text"
                  value={totalCapacity}
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Register Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
