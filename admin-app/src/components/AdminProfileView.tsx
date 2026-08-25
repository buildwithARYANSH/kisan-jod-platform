import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, DollarSign, LogOut } from 'lucide-react';

interface AdminProfileViewProps {
  onLogout?: () => void;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({ onLogout }) => {
  const { profile, updateProfile } = useAdmin();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email, address });
    setIsEditOpen(false);
  };

  const totalCompensation = profile.baseSalary + profile.referralEarnings + profile.bonuses;

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white  p-6 rounded-3xl border border-gray-200  shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
            GS
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-gray-900 ">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100  text-blue-800  text-xs font-bold font-mono">
                {profile.employeeId}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-xs text-gray-600 ">
              <p className="font-bold text-gray-800 ">
                Role: {profile.role} • {profile.assignedRegion}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> {profile.phone} • <Mail className="w-3.5 h-3.5 text-blue-600 ml-1" /> {profile.email}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {profile.address}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="py-2 px-4 rounded-xl border border-gray-300  text-gray-700  hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4 text-blue-600" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Sensitive Compensation & Earnings Breakdown */}
      <div className="bg-white  p-6 rounded-3xl border border-gray-200  shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900  flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Compensation & Operational Earnings Breakdown
          </h3>
          <span className="text-[10px] text-gray-400 font-semibold">Protected Confidential Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50  space-y-1">
            <span className="text-gray-500 block font-medium">Monthly Base Salary</span>
            <strong className="text-base text-gray-900  block">₹{profile.baseSalary.toLocaleString()}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50  space-y-1">
            <span className="text-gray-500 block font-medium">Farmer Referral Incentives</span>
            <strong className="text-base text-purple-600  block">+ ₹{profile.referralEarnings.toLocaleString()}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50  space-y-1">
            <span className="text-gray-500 block font-medium">Performance Bonuses</span>
            <strong className="text-base text-blue-600  block">+ ₹{profile.bonuses.toLocaleString()}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-green-50  border border-green-200  space-y-1">
            <span className="text-green-800  block font-bold">Total Estimated Monthly Take-home</span>
            <strong className="text-xl font-black text-green-600 block">₹{totalCompensation.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {onLogout && (
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-red-50 text-red-600 font-extrabold text-sm border border-red-200 hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>सुरक्षित लॉगआउट (Logout)</span>
        </button>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/60  flex items-center justify-center p-4">
          <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900  mb-4">
              Edit Agent Profile Information
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Full Name
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
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700  mb-1">
                  Residential Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  text-gray-900  font-semibold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
