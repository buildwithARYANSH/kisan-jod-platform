import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Building2, Phone, Mail, MapPin, Edit3, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CompanyProfileView: React.FC = () => {
  const { profile, updateProfile, receipts } = useCompany();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState(profile.companyName);
  const [contactPerson, setContactPerson] = useState(profile.contactPerson);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [registeredAddress, setRegisteredAddress] = useState(profile.registeredAddress);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      companyName,
      contactPerson,
      phone,
      email,
      registeredAddress,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={profile.companyLogo}
            alt={profile.companyName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-blue-500 shadow-md shrink-0"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-fraunces">
                {profile.companyName}
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-950 text-xs font-black flex items-center gap-1 border border-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verified Buyer
              </span>
            </div>

            <div className="mt-2.5 space-y-1 text-xs sm:text-sm text-slate-700 font-semibold">
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Contact Person: <strong className="text-slate-900 font-extrabold">{profile.contactPerson}</strong>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                {profile.phone} • <Mail className="w-4 h-4 text-blue-600 ml-1" /> {profile.email}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                {profile.registeredAddress}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="py-2.5 px-4 rounded-2xl border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Details & GSTIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2 text-xs sm:text-sm">
          <h3 className="font-black text-slate-900 text-base mb-3 font-fraunces">
            Business & Regulatory Verification
          </h3>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-bold">GSTIN Number:</span>
            <strong className="font-mono text-slate-900 font-bold">{profile.gstin}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-bold">Procurement Hub:</span>
            <strong className="text-slate-900 font-extrabold">{profile.procurementHub}</strong>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2 text-xs sm:text-sm">
          <h3 className="font-black text-slate-900 text-base mb-3 font-fraunces">
            Platform Membership Overview
          </h3>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-bold">Member Since:</span>
            <strong className="text-slate-900 font-extrabold">{profile.memberSince}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center text-emerald-950 font-extrabold">
            <span>Escrow Standing:</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 font-fraunces">
          Complete Procurement Order History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800 font-semibold">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Invoice / Order ID</th>
                <th className="p-3.5">Crop Commodity</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Order Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold">{rec.invoiceId}</td>
                  <td className="p-3.5 font-black text-slate-900 font-fraunces">{rec.cropName}</td>
                  <td className="p-3.5 font-bold">{rec.quantity.toLocaleString()} {rec.unit}</td>
                  <td className="p-3.5 text-slate-500 font-semibold">{rec.date}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black">
                      {rec.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-black text-slate-900 text-base font-fraunces">
                    ₹{rec.totalPayable.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-blue-200 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-4 font-fraunces">
              Edit Company Profile
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm font-semibold">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Registered Address
                </label>
                <textarea
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md cursor-pointer"
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
