import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Crown, 
  ArrowRight, 
  Lock, 
  Phone, 
  User, 
  Mail, 
  KeyRound, 
  MapPin, 
  Briefcase, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useLogistics } from '../../context/LogisticsContext';

interface AdminAuthPortalProps {
  onLoginSuccess: (persona: 'super-admin' | 'middleman' | 'logistics') => void;
}

export const AdminAuthPortal: React.FC<AdminAuthPortalProps> = ({ onLoginSuccess }) => {
  const { profile: agentProfile, updateProfile: updateAgentProfile } = useAdmin();
  const { profile: logisticsProfile } = useLogistics();

  const [role, setRole] = useState<'middleman' | 'logistics' | 'hidden_admin'>('middleman');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  // Hidden Admin Login State
  const [adminUsername, setAdminUsername] = useState('ADMIN-001');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Field Agent Form State
  const [agentPhone, setAgentPhone] = useState(agentProfile.phone || '+91 98100 11223');
  const [agentPassword, setAgentPassword] = useState('agent123');
  const [agentName, setAgentName] = useState(agentProfile.name || 'Ramesh Kumar');
  const [agentEmployeeId, setAgentEmployeeId] = useState(agentProfile.employeeId || 'AGT-101');
  const [agentEmail, setAgentEmail] = useState(agentProfile.email || 'ramesh.agent@kisanjod.in');
  const [assignedRegion, setAssignedRegion] = useState(agentProfile.assignedRegion || 'Ludhiana Central Agri Cluster (Zone 4)');
  const [agentRole, setAgentRole] = useState(agentProfile.role || 'Senior Field Agent / Procurement Officer');
  const [baseSalary, setBaseSalary] = useState<number>(agentProfile.baseSalary || 28000);

  // Logistics Form State
  const [logisticsPhone, setLogisticsPhone] = useState('+91 98721 99881');
  const [logisticsPassword, setLogisticsPassword] = useState('logistics123');
  const [carrierName, setCarrierName] = useState('Express Agri Transport Ltd');
  const [driverName, setDriverName] = useState('Rajesh Kumar');
  const [licenseNumber, setLicenseNumber] = useState('PB-10-2021-00921');
  const [vehicleNumber, setVehicleNumber] = useState('PB-10-CZ-4491');
  const [vehicleType, setVehicleType] = useState('15-Ton Refrigerated Container');

  // Trigger OTP Action
  const handleSendOtp = (recipient: string) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpNotice(`OTP Verification Code [${code}] sent to ${recipient}. Valid for 5 minutes.`);
  };

  // Agent Login Handler
  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || enteredOtp !== generatedOtp)) {
      if (!otpSent) {
        handleSendOtp(agentPhone);
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        alert('Invalid OTP. Please enter 1234.');
        return;
      }
    }

    updateAgentProfile({
      name: agentName,
      employeeId: agentEmployeeId,
      phone: agentPhone,
      email: agentEmail,
      assignedRegion,
      role: agentRole,
      baseSalary,
    });

    onLoginSuccess('middleman');
  };

  // Agent Register Handler
  const handleAgentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp(agentPhone);
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      alert('Invalid OTP. Please enter 1234.');
      return;
    }

    updateAgentProfile({
      name: agentName,
      employeeId: agentEmployeeId,
      phone: agentPhone,
      email: agentEmail,
      assignedRegion,
      role: agentRole,
      baseSalary,
    });

    onLoginSuccess('middleman');
  };

  // Logistics Login Handler
  const handleLogisticsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || enteredOtp !== generatedOtp)) {
      if (!otpSent) {
        handleSendOtp(logisticsPhone);
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        alert('Invalid OTP. Please enter 1234.');
        return;
      }
    }

    onLoginSuccess('logistics');
  };

  // Logistics Register Handler
  const handleLogisticsRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp(logisticsPhone);
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      alert('Invalid OTP. Please enter 1234.');
      return;
    }

    onLoginSuccess('logistics');
  };

  // Hidden Admin Login Handler
  const handleHiddenAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername || !adminPassword) {
      alert('Please enter Admin ID and Password');
      return;
    }
    onLoginSuccess('super-admin');
  };

  // Quick Test Autofill
  const handleAutofillDemo = () => {
    if (role === 'middleman') {
      setAgentName('Ramesh Kumar');
      setAgentPhone('+91 98100 11223');
      setAgentEmployeeId('AGT-101');
      setEnteredOtp('1234');
      setOtpSent(true);
    } else if (role === 'logistics') {
      setCarrierName('Express Agri Transport Ltd');
      setDriverName('Rajesh Kumar');
      setLogisticsPhone('+91 98721 99881');
      setEnteredOtp('1234');
      setOtpSent(true);
    } else {
      setAdminUsername('ADMIN-001');
      setAdminPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white font-sans">
                Kisan Jod <span className="text-purple-400 text-xs font-bold font-sans">Operations & Fleet Portal</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                Port 5174 Operations, Field Agent & Freight Partner Gateway
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Encrypted Operations Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-950 backdrop-blur-xl relative">
          
          {/* Header Title */}
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-wider border border-purple-500/20">
              {role === 'hidden_admin' ? 'Executive Admin Access' : 'Operations Authentication Gate'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              {role === 'hidden_admin' && '👑 Executive Platform Admin Sign In'}
              {role === 'middleman' && (mode === 'login' ? '👨‍🌾 Middleman / Field Agent Login' : '📝 Middleman / Field Agent Signup')}
              {role === 'logistics' && (mode === 'login' ? '🚚 Logistics Carrier Login' : '📝 Logistics Partner Signup')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1 max-w-md mx-auto">
              {role === 'hidden_admin' 
                ? 'Authorized platform admin credentials required. Registration is restricted.'
                : 'Select your operational role below to access your field or logistics desk.'}
            </p>
          </div>

          {/* Role Switcher (Middleman vs Logistics) */}
          {role !== 'hidden_admin' && (
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setRole('middleman'); setMode('login'); }}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  role === 'middleman'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60 ring-2 ring-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span>👨‍🌾 Middleman / Agent</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('logistics'); setMode('login'); }}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  role === 'logistics'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>🚚 Logistics Carrier</span>
              </button>
            </div>
          )}

          {/* Mode Switcher (Login vs Register) */}
          {role !== 'hidden_admin' && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'login' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔑 Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'register' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📝 Register / Signup
                </button>
              </div>

              <button
                type="button"
                onClick={handleAutofillDemo}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Quick Test Autofill</span>
              </button>
            </div>
          )}

          {/* OTP Notice Banner */}
          {otpNotice && role !== 'hidden_admin' && (
            <div className="mb-6 p-3.5 rounded-2xl bg-purple-950/60 border border-purple-700/80 text-purple-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{otpNotice} (Try entering: <strong className="text-white font-extrabold">{generatedOtp}</strong>)</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. MIDDLEMAN / AGENT LOGIN & REGISTER                    */}
          {/* ======================================================== */}
          {role === 'middleman' && mode === 'login' && (
            <form onSubmit={handleAgentLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">Login Method:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      authMethod === 'otp' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400'
                    }`}
                  >
                    📱 SMS OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('password')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      authMethod === 'password' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400'
                    }`}
                  >
                    🔒 Password
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  Agent Registered Phone / Employee ID
                </label>
                <input
                  type="text"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  placeholder="+91 98100 11223 or AGT-101"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {authMethod === 'password' ? (
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" /> Password
                  </label>
                  <input
                    type="password"
                    value={agentPassword}
                    onChange={(e) => setAgentPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-purple-400" /> 4-Digit Verification OTP
                    </span>
                    {otpSent && (
                      <button type="button" onClick={() => handleSendOtp(agentPhone)} className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                        Resend OTP
                      </button>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 1234"
                      maxLength={4}
                      className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-center tracking-widest text-base focus:ring-2 focus:ring-purple-500"
                    />
                    {!otpSent && (
                      <button type="button" onClick={() => handleSendOtp(agentPhone)} className="px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shrink-0 cursor-pointer">
                        Send OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950 cursor-pointer transition-all"
              >
                <span>Login to Middleman & Field Agent Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {role === 'middleman' && mode === 'register' && (
            <form onSubmit={handleAgentRegister} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Employee / Agent ID
                  </label>
                  <input
                    type="text"
                    value={agentEmployeeId}
                    onChange={(e) => setAgentEmployeeId(e.target.value)}
                    placeholder="e.g. AGT-101"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-400" /> Mobile Phone Number
                  </label>
                  <input
                    type="text"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Official Email Address
                  </label>
                  <input
                    type="email"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> Assigned Agri Region / Cluster
                </label>
                <input
                  type="text"
                  value={assignedRegion}
                  onChange={(e) => setAssignedRegion(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  required
                />
              </div>

              {/* OTP Verification Step */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-300 font-bold">
                  <span>SMS OTP Verification:</span>
                  <p className="text-[10px] text-slate-500 font-normal">Click Send OTP to receive 4-digit code (e.g. 1234)</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="4-Digit OTP"
                    maxLength={4}
                    className="w-28 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-center font-black"
                  />
                  {!otpSent && (
                    <button type="button" onClick={() => handleSendOtp(agentPhone)} className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs">
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950 cursor-pointer transition-all"
              >
                <span>Verify OTP & Register Middleman Agent Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. LOGISTICS CARRIER LOGIN & REGISTER                     */}
          {/* ======================================================== */}
          {role === 'logistics' && mode === 'login' && (
            <form onSubmit={handleLogisticsLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">Login Method:</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setAuthMethod('otp')} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${authMethod === 'otp' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'text-slate-400'}`}>
                    📱 SMS OTP
                  </button>
                  <button type="button" onClick={() => setAuthMethod('password')} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${authMethod === 'password' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'text-slate-400'}`}>
                    🔒 Password
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  Logistics Phone Number / Driver ID
                </label>
                <input
                  type="text"
                  value={logisticsPhone}
                  onChange={(e) => setLogisticsPhone(e.target.value)}
                  placeholder="+91 98721 99881 or DRV-101"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {authMethod === 'password' ? (
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                  </label>
                  <input
                    type="password"
                    value={logisticsPassword}
                    onChange={(e) => setLogisticsPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> 4-Digit Verification OTP
                    </span>
                    {otpSent && (
                      <button type="button" onClick={() => handleSendOtp(logisticsPhone)} className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                        Resend OTP
                      </button>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 1234"
                      maxLength={4}
                      className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-center tracking-widest text-base focus:ring-2 focus:ring-indigo-500"
                    />
                    {!otpSent && (
                      <button type="button" onClick={() => handleSendOtp(logisticsPhone)} className="px-4 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shrink-0 cursor-pointer">
                        Send OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 cursor-pointer transition-all"
              >
                <span>Login to Freight Logistics Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {role === 'logistics' && mode === 'register' && (
            <form onSubmit={handleLogisticsRegister} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" /> Freight Company Name
                </label>
                <input
                  type="text"
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  placeholder="e.g. Express Agri Transport Ltd"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Lead Driver Name
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Driver License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. PB-10-2021-00921"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-indigo-400" /> Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. PB-10-CZ-4491"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Vehicle Type / Fleet Model</label>
                  <input
                    type="text"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g. 15-Ton Refrigerated Container"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
              </div>

              {/* OTP Verification */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-300 font-bold">
                  <span>Contact OTP Verification:</span>
                  <p className="text-[10px] text-slate-500 font-normal">Click Send OTP to receive 4-digit code (e.g. 1234)</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="4-Digit OTP"
                    maxLength={4}
                    className="w-28 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-center font-black"
                  />
                  {!otpSent && (
                    <button type="button" onClick={() => handleSendOtp(logisticsPhone)} className="px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs">
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 cursor-pointer transition-all"
              >
                <span>Verify OTP & Register Logistics Fleet Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. HIDDEN PLATFORM ADMIN LOGIN (RESTRICTED SECRET FORM) */}
          {/* ======================================================== */}
          {role === 'hidden_admin' && (
            <form onSubmit={handleHiddenAdminLogin} className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-700/60 text-amber-300 text-xs font-semibold flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Restricted Access: Super-Admin Executive Control Center credentials required. Registration is disabled.</span>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Executive Admin ID / Username
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="ADMIN-001 or superadmin"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin Security Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950 cursor-pointer transition-all"
              >
                <span>Authenticate Executive Admin Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Hidden Admin Access Link at bottom */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
            {role !== 'hidden_admin' ? (
              <button
                type="button"
                onClick={() => setRole('hidden_admin')}
                className="text-xs font-bold text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>👑 Executive Admin Portal Login (Restricted)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRole('middleman')}
                className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                ← Back to Operational Roles (Middleman & Logistics)
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-center text-xs text-slate-500 font-semibold">
        Kisan Jod Field Operations, Logistics & Executive Operations Gateway • Port 5174
      </footer>
    </div>
  );
};
