import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Building2, 
  Mail, 
  Phone, 
  Award, 
  Users, 
  Truck, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Clock, 
  CreditCard, 
  TrendingUp, 
  Star,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LogisticsProfileView: React.FC = () => {
  const { drivers, vehicles, performance, shipments } = useLogistics();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    companyName: 'Sample Fleet Logistics Pvt Ltd',
    tagline: 'Leading Agri-Cold Chain & Bulk Freight Transportation Partner',
    yearsExperience: '14 Years (Est. 2012)',
    email: 'operations@samplefleetlogistics.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 161 2456789',
    totalDrivers: '15 Registered Drivers (3 Active Today)',
    totalTrucks: '12 Fleet Vehicles (2 Assigned Today)',
    address: 'Plot 104, Focal Point Industrial Zone, Phase VIII, Ludhiana, Punjab - 141010',
    gstin: '03AABCU9603R1ZM',
    permitType: 'All India National Heavy Freight Permit (NP-PB-882)',
    serviceCorridors: 'Punjab, Haryana, Delhi NCR, Himachal Pradesh, Western UP',
    bankName: 'HDFC Bank Ltd (Commercial Branch)',
    accountNumber: '5020••••••••5678',
    ifscCode: 'HDFC0001234',
    specializations: 'Refrigerated Cold-Chain, Grain Silo Hopper Trailers, Parali Stubble Flatbed Transport',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const completedDeliveriesCount = shipments.filter((s) => s.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shrink-0">
              <Truck className="w-9 h-9" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 uppercase tracking-wider border border-blue-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Verified Freight Partner
                </span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {performance.overallScore} / 5.0 SLA Score
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2">
                {profile.companyName}
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-medium max-w-xl">
                {profile.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all shrink-0 ${
              isEditing 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel Editing' : 'Edit Company Profile'}
          </button>
        </div>
      </div>

      {/* Save Toast Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Logistics Company Profile updated successfully! Changes saved across all active portals.</span>
        </div>
      )}

      {/* Main Details Section */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Edit Logistics Company Information
            </h3>
            <span className="text-xs text-gray-400 italic">Update company roster, vehicles & contact channels</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Company Name</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Years of Experience</label>
              <input
                type="text"
                value={profile.yearsExperience}
                onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Official Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Number of Drivers (Fleet Roster)</label>
              <input
                type="text"
                value={profile.totalDrivers}
                onChange={(e) => setProfile({ ...profile, totalDrivers: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Number of Fleet Trucks</label>
              <input
                type="text"
                value={profile.totalTrucks}
                onChange={(e) => setProfile({ ...profile, totalTrucks: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">GSTIN Number</label>
              <input
                type="text"
                value={profile.gstin}
                onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">National Freight Permit</label>
              <input
                type="text"
                value={profile.permitType}
                onChange={(e) => setProfile({ ...profile, permitType: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1.5">Base Depot Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-2.5 px-5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics Overview */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Active Drivers</span>
                <span className="text-xl font-black text-gray-900 dark:text-white mt-0.5 block">{drivers.length} Drivers</span>
                <span className="text-[10px] text-blue-600 font-bold">15 Total Registered</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Fleet Trucks</span>
                <span className="text-xl font-black text-gray-900 dark:text-white mt-0.5 block">{vehicles.length} Heavy Vehicles</span>
                <span className="text-[10px] text-indigo-600 font-bold">12 Vehicles Total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Years Experience</span>
                <span className="text-xl font-black text-gray-900 dark:text-white mt-0.5 block">{profile.yearsExperience.split(' ')[0]} Years</span>
                <span className="text-[10px] text-green-600 font-bold">Agri-Freight Master</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Completed Trips</span>
                <span className="text-xl font-black text-gray-900 dark:text-white mt-0.5 block">240+ Deliveries</span>
                <span className="text-[10px] text-amber-600 font-bold">96% On-Time SLA</span>
              </div>
            </div>
          </div>

          {/* Left Column: Official Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Credentials */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                Company Overview & Core Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Registered Company Name</span>
                  <strong className="text-gray-900 dark:text-white text-sm mt-0.5 block">{profile.companyName}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Years of Industry Experience</span>
                  <strong className="text-gray-900 dark:text-white text-sm mt-0.5 block flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> {profile.yearsExperience}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Official Email Address</span>
                  <strong className="text-blue-600 dark:text-blue-400 text-sm mt-0.5 block flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {profile.email}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Official Contact Phone</span>
                  <strong className="text-gray-900 dark:text-white text-sm mt-0.5 block flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-green-600" /> {profile.phone}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Total Drivers Roster</span>
                  <strong className="text-gray-900 dark:text-white text-sm mt-0.5 block flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" /> {profile.totalDrivers}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium block">Total Fleet Trucks</span>
                  <strong className="text-gray-900 dark:text-white text-sm mt-0.5 block flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" /> {profile.totalTrucks}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-xs space-y-1">
                <span className="text-[11px] text-gray-400 font-medium block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Main Base Fleet Depot Address
                </span>
                <p className="text-gray-900 dark:text-white font-bold">{profile.address}</p>
              </div>
            </div>

            {/* Statutory & Regulatory Permits */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                Statutory Licensing & Transport Permits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white font-mono">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">GSTIN Registration</span>
                  <span className="text-sm font-extrabold text-amber-400 mt-1 block">{profile.gstin}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-white font-mono">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Freight Permit Type</span>
                  <span className="text-xs font-bold text-blue-300 mt-1 block">{profile.permitType}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                <span className="font-extrabold text-blue-900 dark:text-blue-300 block mb-1">Primary Transport Corridors</span>
                <p className="text-blue-800 dark:text-blue-400 font-semibold">{profile.serviceCorridors}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Escrow Bank Details & SLAs */}
          <div className="space-y-6">
            {/* Escrow Settlement Payout Bank */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Freight Payout Bank Account
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase">
                  Verified
                </span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Bank Name</span>
                  <strong className="text-white text-sm">{profile.bankName}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Account Number (Masked)</span>
                  <strong className="text-emerald-400 font-mono text-sm">{profile.accountNumber}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">IFSC Code</span>
                  <strong className="text-slate-200 font-mono text-xs">{profile.ifscCode}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Freight payouts credited automatically upon recipient Proof-of-Delivery signoff.</span>
              </div>
            </div>

            {/* Performance SLA Standards */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Platform SLA Guarantees
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-600 dark:text-gray-300 font-bold">On-Time Pickup SLA</span>
                  <span className="font-extrabold text-green-600 dark:text-green-400">{performance.onTimePickupPercent}%</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-600 dark:text-gray-300 font-bold">On-Time Delivery SLA</span>
                  <span className="font-extrabold text-green-600 dark:text-green-400">{performance.onTimeDeliveryPercent}%</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-600 dark:text-gray-300 font-bold">Quantity Accuracy Rate</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">{performance.quantityAccuracyPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
