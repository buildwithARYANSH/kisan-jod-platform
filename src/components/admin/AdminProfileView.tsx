import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { User, ShieldCheck, Phone, Mail, Edit3, X, Building2 } from 'lucide-react';

export const AdminProfileView: React.FC = () => {
  const { profile, updateProfile } = useAdmin();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-amber-500 text-white font-black text-3xl flex items-center justify-center font-fraunces shadow-md shrink-0">
          {profile.name.charAt(0)}
        </div>

        <div className="text-center sm:text-left flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900 font-fraunces">{profile.name}</h2>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black border border-amber-300">
              {profile.role}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-semibold">{profile.department} • Admin ID: <strong className="font-mono">{profile.adminId}</strong></p>
          <p className="text-xs text-slate-500 font-semibold flex items-center justify-center sm:justify-start gap-1">
            <Phone className="w-3.5 h-3.5 text-amber-600" /> {profile.phone} • <Mail className="w-3.5 h-3.5 text-amber-600 ml-1" /> {profile.email}
          </p>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Edit3 className="w-4 h-4 text-amber-600" /> Edit Profile
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2 text-xs sm:text-sm font-semibold">
        <h3 className="font-black text-slate-900 text-base mb-3 font-fraunces">Employment & Security Verification</h3>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between">
          <span className="text-slate-600">Employee Admin ID:</span>
          <strong className="font-mono text-slate-900 font-bold">{profile.adminId}</strong>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between">
          <span className="text-slate-600">Joining Date:</span>
          <strong className="text-slate-900 font-extrabold">{profile.joiningDate}</strong>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between">
          <span className="text-slate-600">Aadhaar Verification (Masked):</span>
          <strong className="font-mono text-slate-900 font-bold">{profile.aadhaarMasked}</strong>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-white/60  flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-fraunces">Edit Admin Profile</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs sm:text-sm font-semibold">
              <div>
                <label className="block text-slate-800 mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold" required />
              </div>
              <div>
                <label className="block text-slate-800 mb-1">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold" required />
              </div>
              <div>
                <label className="block text-slate-800 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold" required />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
