import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, MapPin, Building, ShieldCheck, Edit3, LogOut, CheckCircle } from 'lucide-react';

export const MyProfileSection: React.FC = () => {
  const { profile, updateProfile, t, setIsLogoutModalOpen, language, crops } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [village, setVillage] = useState(profile.village);
  const [district, setDistrict] = useState(profile.district);
  const [state, setState] = useState(profile.state);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      village,
      district,
      state,
    });
    setIsEditModalOpen(false);
  };

  return (
    <section className="my-6 px-4 max-w-4xl mx-auto">
      {/* Profile Card Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-lg relative overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md shrink-0"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-fraunces">
                {profile.name}
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black flex items-center gap-1 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Verified Farmer
              </span>
            </div>

            <div className="mt-2.5 space-y-1 text-xs sm:text-sm text-slate-700 font-semibold">
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                {profile.phone}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {profile.village}, {profile.district}, {profile.state}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="py-2.5 px-4 rounded-2xl border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            {t.editProfile}
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Bank & Settlement Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
            <Building className="w-5 h-5 text-emerald-600" />
            {t.bankStatus}
          </h3>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center border border-slate-200">
              <span className="text-slate-600 font-bold">Bank Name:</span>
              <strong className="text-slate-900 font-extrabold">{profile.bankName}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center border border-slate-200">
              <span className="text-slate-600 font-bold">Account Number:</span>
              <strong className="text-slate-900 font-mono font-bold">{profile.accountNumber}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-emerald-950 font-extrabold">
              <span>Settlement Status:</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {profile.bankStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Registered Crops Summary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 font-fraunces">
            <User className="w-5 h-5 text-emerald-600" />
            Registered Crops Overview
          </h3>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center border border-slate-200">
              <span className="text-slate-600 font-bold">Total Registered Crops:</span>
              <strong className="text-slate-900 font-extrabold">{crops.length} Crops</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center border border-slate-200">
              <span className="text-slate-600 font-bold">Member Since:</span>
              <strong className="text-slate-900 font-extrabold">{profile.memberSince}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center border border-slate-200">
              <span className="text-slate-600 font-bold">Selected Language:</span>
              <strong className="text-emerald-700 font-black uppercase">{language}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings & Actions */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600" />
            Edit Profile Information
          </span>
          <span>→</span>
        </button>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center justify-between text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-red-600" />
            {t.logout}
          </span>
          <span>→</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-100 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              {t.editProfile}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
