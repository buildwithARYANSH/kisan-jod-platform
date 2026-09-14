import React, { useState } from 'react';
import { 
  Sprout, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Lock, 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Landmark, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  Send,
  X,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCompany } from '../../context/CompanyContext';
import { syncFarmerRegistered, syncCompanyRegistered } from '../../services/unifiedSync';

interface AuthPortalProps {
  onLoginSuccess: (role: 'farmer' | 'company' | 'agent' | 'logistics' | 'admin') => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess }) => {
  const { profile: farmerProfile, updateProfile: updateFarmerProfile, registerNewFarmer, loginFarmer, showToast } = useApp();
  const { profile: companyProfile, updateProfile: updateCompanyProfile, registerNewCompany, loginCompany } = useCompany();

  // Intro Video Popup Modal State (Autoplays & Loops on repeat until crossed)
  const [showIntroPopup, setShowIntroPopup] = useState<boolean>(true);

  const [role, setRole] = useState<'farmer' | 'company' | 'agent' | 'logistics' | 'admin'>('farmer');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Farmer Login / Register Form State
  const [farmerPhone, setFarmerPhone] = useState(farmerProfile.phone || '+91 98765 43210');
  const [farmerPassword, setFarmerPassword] = useState('kisan123');
  const [farmerName, setFarmerName] = useState(farmerProfile.name || 'Gurdev Singh');
  const [farmerEmail, setFarmerEmail] = useState('gurdev.singh@kisanjod.in');
  const [farmerVillage, setFarmerVillage] = useState(farmerProfile.village || 'Village Sunam');
  const [farmerDistrict, setFarmerDistrict] = useState(farmerProfile.district || 'Sangrur');
  const [farmerState, setFarmerState] = useState(farmerProfile.state || 'Punjab');
  const [farmerBankName, setFarmerBankName] = useState(farmerProfile.bankName || 'State Bank of India');
  const [farmerAccountNumber, setFarmerAccountNumber] = useState(farmerProfile.accountNumber || 'XXXX-XXXX-4921');
  const [farmerIfscCode, setFarmerIfscCode] = useState(farmerProfile.ifscCode || 'SBIN0001234');

  // Company Login / Register Form State
  const [companyPhone, setCompanyPhone] = useState(companyProfile.phone || '+91 98112 34567');
  const [companyPassword, setCompanyPassword] = useState('agro123');
  const [companyName, setCompanyName] = useState(companyProfile.companyName || 'FreshAgro Foods & Bio-Processing Pvt Ltd');
  const [procurementHub, setProcurementHub] = useState(companyProfile.procurementHub || 'North India Central Processing Hub');
  const [gstin, setGstin] = useState(companyProfile.gstin || '03AABCF1234H1Z5');
  const [registeredAddress, setRegisteredAddress] = useState(companyProfile.registeredAddress || 'Plot 42, Focal Point Industrial Zone, Ludhiana, Punjab - 141010');
  const [contactPerson, setContactPerson] = useState(companyProfile.contactPerson || 'Vikram Malhotra (Head of Procurement)');
  const [companyEmail, setCompanyEmail] = useState(companyProfile.email || 'procurement@freshagro.co.in');

  // Field Agent Login Form State
  const [agentPhone, setAgentPhone] = useState('+91 98765 22104');
  const [agentPassword, setAgentPassword] = useState('agent123');
  const [agentName, setAgentName] = useState('Arun Khot');

  // Logistics Login Form State
  const [logisticsPhone, setLogisticsPhone] = useState('+91 98450 11223');
  const [logisticsPassword, setLogisticsPassword] = useState('fleet123');
  const [logisticsName, setLogisticsName] = useState('North India Agro Logistics & Freight');

  // Admin Login State
  const [adminPhone, setAdminPhone] = useState('+91 99999 00000');
  const [adminPassword, setAdminPassword] = useState('admin9999');

  // Send OTP Action
  const handleSendOtp = (recipient: string, type: 'phone' | 'email') => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    const msg = `OTP Verification Code [${randomOtp}] sent via SMS to ${recipient}. Valid for 5 minutes.`;
    setOtpNotice(msg);
    showToast(msg, 'info');
  };

  // Farmer Login Handler
  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || (enteredOtp !== generatedOtp && enteredOtp !== '1234'))) {
      if (!otpSent) {
        handleSendOtp(farmerPhone, 'phone');
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        showToast('Invalid OTP entered. Please try 1234 or click Resend OTP.', 'error');
        return;
      }
    }

    // Restore existing farmer's data or demo profile
    loginFarmer(farmerPhone, {
      name: farmerName,
      phone: farmerPhone,
      village: farmerVillage,
      district: farmerDistrict,
      state: farmerState,
      bankName: farmerBankName,
      accountNumber: farmerAccountNumber,
      ifscCode: farmerIfscCode,
    });

    try {
      localStorage.setItem('kisan_auth_user', JSON.stringify({
        role: 'farmer',
        name: farmerName,
        phone: farmerPhone,
        email: farmerEmail,
        village: farmerVillage,
        bankName: farmerBankName,
      }));
    } catch (err) {
      console.warn(err);
    }

    showToast(`Logged in successfully as Farmer (${farmerName})`, 'success');
    onLoginSuccess('farmer');
  };

  // Company Login Handler
  const handleCompanyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || (enteredOtp !== generatedOtp && enteredOtp !== '1234'))) {
      if (!otpSent) {
        handleSendOtp(companyPhone, 'phone');
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        showToast('Invalid OTP entered. Please try 1234 or click Resend OTP.', 'error');
        return;
      }
    }

    loginCompany(companyPhone, {
      companyName,
      procurementHub,
      gstin,
      registeredAddress,
      contactPerson,
      phone: companyPhone,
      email: companyEmail,
    });

    try {
      localStorage.setItem('kisan_auth_user', JSON.stringify({
        role: 'company',
        name: companyName,
        phone: companyPhone,
        email: companyEmail,
        gstin,
      }));
    } catch (err) {
      console.warn(err);
    }

    showToast(`Logged in successfully as Company (${companyName})`, 'success');
    onLoginSuccess('company');
  };

  // Field Agent Login Handler
  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || (enteredOtp !== generatedOtp && enteredOtp !== '1234'))) {
      if (!otpSent) {
        handleSendOtp(agentPhone, 'phone');
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        showToast('Invalid OTP entered. Please try 1234 or click Resend OTP.', 'error');
        return;
      }
    }
    showToast(`Logged in successfully as Field Officer (${agentName})`, 'success');
    onLoginSuccess('agent');
  };

  // Logistics Login Handler
  const handleLogisticsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && (!otpSent || (enteredOtp !== generatedOtp && enteredOtp !== '1234'))) {
      if (!otpSent) {
        handleSendOtp(logisticsPhone, 'phone');
        return;
      }
      if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
        showToast('Invalid OTP entered. Please try 1234 or click Resend OTP.', 'error');
        return;
      }
    }
    showToast(`Logged in successfully as Logistics Partner (${logisticsName})`, 'success');
    onLoginSuccess('logistics');
  };

  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword !== 'admin9999' && adminPassword !== 'kisan123') {
      showToast('Invalid Admin Master Passkey. Try: admin9999', 'error');
      return;
    }
    showToast('Executive Admin Access Granted', 'success');
    onLoginSuccess('admin');
  };

  // Farmer Register Handler
  const handleFarmerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent && enteredOtp !== '1234') {
      handleSendOtp(farmerPhone, 'phone');
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showToast('Invalid OTP. Please enter the 4-digit code sent to your phone.', 'error');
      return;
    }

    // Register farmer into localStorage list & trigger master directory sync
    const newEntry = {
      id: `FRM-${Date.now().toString().slice(-4)}`,
      name: farmerName,
      phone: farmerPhone,
      email: farmerEmail,
      village: farmerVillage,
      district: farmerDistrict,
      state: farmerState,
      bankName: farmerBankName,
      accountNumber: farmerAccountNumber,
      ifscCode: farmerIfscCode,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    try {
      const existing = JSON.parse(localStorage.getItem('kisan_registered_farmers') || '[]');
      localStorage.setItem('kisan_registered_farmers', JSON.stringify([newEntry, ...existing]));
      syncFarmerRegistered(newEntry);
    } catch (err) {
      console.warn(err);
    }

    // Start NEW Farmer with 100% CLEAN state (0 crops, 0 waste, 0 women products/resources, 0 paychecks)
    registerNewFarmer({
      name: farmerName,
      phone: farmerPhone,
      village: farmerVillage,
      district: farmerDistrict,
      state: farmerState,
      bankName: farmerBankName,
      accountNumber: farmerAccountNumber,
      ifscCode: farmerIfscCode,
    });

    showToast(`Registration Successful! Welcome to Kisan Jod, ${farmerName}. Your portal is ready.`, 'success');
    onLoginSuccess('farmer');
  };

  // Company Register Handler
  const handleCompanyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent && enteredOtp !== '1234') {
      handleSendOtp(companyPhone, 'phone');
      return;
    }
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showToast('Invalid OTP. Please enter the 4-digit code sent to your phone/email.', 'error');
      return;
    }

    const newEntry = {
      id: `COMP-${Date.now().toString().slice(-4)}`,
      companyName,
      procurementHub,
      gstin,
      registeredAddress,
      contactPerson,
      phone: companyPhone,
      email: companyEmail,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    // Register company into localStorage list
    try {
      const existing = JSON.parse(localStorage.getItem('kisan_registered_companies') || '[]');
      localStorage.setItem('kisan_registered_companies', JSON.stringify([newEntry, ...existing]));
      syncCompanyRegistered(newEntry);
    } catch (err) {
      console.warn(err);
    }

    // Start NEW Company with 100% CLEAN state (0 demands, 0 quality batches, 0 receipts, 0 payment proofs)
    registerNewCompany({
      companyName,
      procurementHub,
      gstin,
      registeredAddress,
      contactPerson,
      phone: companyPhone,
      email: companyEmail,
    });

    showToast(`Corporate Account Registered! Welcome ${companyName}. Your portal is ready.`, 'success');
    onLoginSuccess('company');
  };

  // Send Forgot Password OTP
  const handleSendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered email address', 'warning');
      return;
    }
    setForgotOtpSent(true);
    showToast(`Password Reset OTP sent to ${forgotEmail}. Enter code to set a new password.`, 'info');
  };

  // Reset Password Action
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp || !newPassword) {
      showToast('Please enter the OTP and your new password', 'warning');
      return;
    }
    showToast('Password reset successfully! You can now log in with your new password.', 'success');
    setMode('login');
    setForgotOtpSent(false);
  };

  // Autofill Default Demo Account
  const handleAutofillDemo = () => {
    if (role === 'farmer') {
      setFarmerName('Gurdev Singh');
      setFarmerPhone('+91 98765 43210');
      setFarmerVillage('Village Sunam');
      setFarmerDistrict('Sangrur');
      setFarmerState('Punjab');
      setFarmerBankName('State Bank of India');
      setFarmerAccountNumber('XXXX-XXXX-4921');
      setFarmerIfscCode('SBIN0001234');
      setEnteredOtp('1234');
      setOtpSent(true);
      showToast('Autofilled Farmer credentials (Gurdev Singh)', 'info');
    } else if (role === 'company') {
      setCompanyName('FreshAgro Foods & Bio-Processing Pvt Ltd');
      setCompanyPhone('+91 98112 34567');
      setProcurementHub('North India Central Processing Hub');
      setGstin('03AABCF1234H1Z5');
      setContactPerson('Vikram Malhotra (Head of Procurement)');
      setEnteredOtp('1234');
      setOtpSent(true);
      showToast('Autofilled Buyer credentials (FreshAgro Foods)', 'info');
    } else if (role === 'agent') {
      setAgentPhone('+91 98765 22104');
      setAgentPassword('agent123');
      setEnteredOtp('1234');
      setOtpSent(true);
      showToast('Autofilled Field Officer credentials (Arun Khot)', 'info');
    } else if (role === 'logistics') {
      setLogisticsPhone('+91 98450 11223');
      setLogisticsPassword('fleet123');
      setEnteredOtp('1234');
      setOtpSent(true);
      showToast('Autofilled Logistics credentials (North India Freight)', 'info');
    } else {
      setAdminPhone('+91 99999 00000');
      setAdminPassword('admin9999');
      setEnteredOtp('1234');
      setOtpSent(true);
      showToast('Autofilled Admin Master Key (admin9999)', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans relative overflow-hidden">
      
      {/* INTRO VIDEO POPUP MODAL (Autoplays & Loops on repeat until crossed) */}
      {showIntroPopup && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-2xl overflow-visible p-1.5 sm:p-2">
            
            {/* Top-Right Corner Cross Button */}
            <button
              type="button"
              onClick={() => setShowIntroPopup(false)}
              className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/80"
              title="Close Video"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>

            {/* Video Container */}
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                src="/intro-vid.mp4"
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Bottom Bar Info */}
            <div className="px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between text-xs text-slate-400 font-sans">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Kisan Jod Introductory Video (Repeating)
              </span>
              <button
                type="button"
                onClick={() => setShowIntroPopup(false)}
                className="text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
              >
                Skip & Continue to Login →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white font-fraunces">
                Kisan Jod <span className="text-emerald-400 text-xs font-bold font-sans">किसान जोड़</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                Unified Authentication & Account Management Gateway
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Login Gate</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-950 backdrop-blur-xl relative">
          
          {/* Header Title */}
          <div className="text-center mb-8">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
              Portal Account Authentication
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 font-fraunces">
              {mode === 'login' && 'Sign In to Your Account'}
              {mode === 'register' && 'Create New Account'}
              {mode === 'forgot_password' && 'Reset Forgotten Password'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1 max-w-md mx-auto">
              Select your role below to access the Kisan Jod Agricultural Procurement Platform.
            </p>
          </div>

          {/* Role Selection Tabs (Farmer vs Company vs Agent vs Logistics) */}
          {mode !== 'forgot_password' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`py-3 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'farmer'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>🌾 Farmer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('company')}
                className={`py-3 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950/60 ring-2 ring-blue-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>🏢 Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('agent')}
                className={`py-3 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'agent'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-950/60 ring-2 ring-teal-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>👨‍🌾 Middleman</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('logistics')}
                className={`py-3 px-2 rounded-xl text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all cursor-pointer ${
                  role === 'logistics'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-950/60 ring-2 ring-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Truck className="w-4 h-4 text-purple-400" />
                <span>🚚 Logistics</span>
              </button>
            </div>
          )}

          {/* Mode Switcher Bar (Login vs Register) */}
          {mode !== 'forgot_password' && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔑 Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                      : 'text-slate-400 hover:text-white'
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

          {/* Banner Notice for OTP */}
          {otpNotice && mode !== 'forgot_password' && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/80 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{otpNotice} (Try entering: <strong className="text-white font-extrabold">{generatedOtp}</strong>)</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. LOGIN MODE (Phone / OTP / Password)                  */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <form onSubmit={
              role === 'farmer'
                ? handleFarmerLogin
                : role === 'company'
                ? handleCompanyLogin
                : role === 'agent'
                ? handleAgentLogin
                : role === 'logistics'
                ? handleLogisticsLogin
                : handleAdminLogin
            } className="space-y-4 text-xs sm:text-sm">
              
              {/* Auth Method Switcher (OTP vs Password) */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold">Login Method:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      authMethod === 'otp' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
                    }`}
                  >
                    📱 Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('password')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      authMethod === 'password' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
                    }`}
                  >
                    🔒 Password
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {role === 'farmer' && 'Farmer Registered Phone Number'}
                  {role === 'company' && 'Company Official Phone Number / Email'}
                  {role === 'agent' && 'Field Agent Registered Phone Number'}
                  {role === 'logistics' && 'Fleet Manager Registered Phone'}
                  {role === 'admin' && 'Admin Account Identifier'}
                </label>
                <input
                  type="text"
                  value={
                    role === 'farmer'
                      ? farmerPhone
                      : role === 'company'
                      ? companyPhone
                      : role === 'agent'
                      ? agentPhone
                      : role === 'logistics'
                      ? logisticsPhone
                      : adminPhone
                  }
                  onChange={(e) => {
                    if (role === 'farmer') setFarmerPhone(e.target.value);
                    else if (role === 'company') setCompanyPhone(e.target.value);
                    else if (role === 'agent') setAgentPhone(e.target.value);
                    else if (role === 'logistics') setLogisticsPhone(e.target.value);
                    else setAdminPhone(e.target.value);
                  }}
                  placeholder={
                    role === 'farmer'
                      ? '+91 98765 43210'
                      : role === 'company'
                      ? '+91 98112 34567'
                      : role === 'agent'
                      ? '+91 98765 22104'
                      : role === 'logistics'
                      ? '+91 98450 11223'
                      : '+91 99999 00000'
                  }
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Password or OTP Fields */}
              {authMethod === 'password' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      {role === 'admin' ? 'Master Admin Passkey' : 'Account Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={
                      role === 'farmer'
                        ? farmerPassword
                        : role === 'company'
                        ? companyPassword
                        : role === 'agent'
                        ? agentPassword
                        : role === 'logistics'
                        ? logisticsPassword
                        : adminPassword
                    }
                    onChange={(e) => {
                      if (role === 'farmer') setFarmerPassword(e.target.value);
                      else if (role === 'company') setCompanyPassword(e.target.value);
                      else if (role === 'agent') setAgentPassword(e.target.value);
                      else if (role === 'logistics') setLogisticsPassword(e.target.value);
                      else setAdminPassword(e.target.value);
                    }}
                    placeholder={role === 'admin' ? 'Enter admin passkey (e.g. admin9999)' : 'Enter password'}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        4-Digit Verification OTP Code
                      </span>
                      {otpSent && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSendOtp(
                              role === 'farmer'
                                ? farmerPhone
                                : role === 'company'
                                ? companyPhone
                                : role === 'agent'
                                ? agentPhone
                                : role === 'logistics'
                                ? logisticsPhone
                                : adminPhone,
                              'phone'
                            )
                          }
                          className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter 4-Digit OTP (e.g. 1234)"
                        maxLength={4}
                        className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-center tracking-widest text-base focus:ring-2 focus:ring-emerald-500"
                      />
                      {!otpSent && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSendOtp(
                              role === 'farmer'
                                ? farmerPhone
                                : role === 'company'
                                ? companyPhone
                                : role === 'agent'
                                ? agentPhone
                                : role === 'logistics'
                                ? logisticsPhone
                                : adminPhone,
                              'phone'
                            )
                          }
                          className="px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-101 ${
                  role === 'farmer'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-950'
                    : role === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-950'
                    : role === 'agent'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white shadow-teal-950'
                    : role === 'logistics'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-950'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-950'
                }`}
              >
                <span>
                  Login to {
                    role === 'farmer' ? '🌾 Farmer Application' :
                    role === 'company' ? '🏢 Industrial Buyer Portal' :
                    role === 'agent' ? '👨‍🌾 Field Agent / Middleman Desk' :
                    role === 'logistics' ? '🚚 Freight Logistics Portal' :
                    '👑 Platform Operations Command Center'
                  }
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. REGISTER / SIGNUP MODE                                */}
          {/* ======================================================== */}
          {mode === 'register' && (
            <div>
              {role === 'farmer' ? (
                <form onSubmit={handleFarmerRegister} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="e.g. Ramesh Patel / Gurdev Singh"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> Mobile Phone Number
                      </label>
                      <input
                        type="text"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address (For OTP Recovery)
                      </label>
                      <input
                        type="email"
                        value={farmerEmail}
                        onChange={(e) => setFarmerEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" /> Account Password
                      </label>
                      <input
                        type="password"
                        value={farmerPassword}
                        onChange={(e) => setFarmerPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Village / Town
                      </label>
                      <input
                        type="text"
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">District</label>
                      <input
                        type="text"
                        value={farmerDistrict}
                        onChange={(e) => setFarmerDistrict(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">State</label>
                      <input
                        type="text"
                        value={farmerState}
                        onChange={(e) => setFarmerState(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* DBT Bank Account */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-4 h-4" /> Direct Benefit Transfer (DBT) Bank Account
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={farmerBankName}
                          onChange={(e) => setFarmerBankName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={farmerAccountNumber}
                          onChange={(e) => setFarmerAccountNumber(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={farmerIfscCode}
                          onChange={(e) => setFarmerIfscCode(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification OTP Step */}
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
                        <button
                          type="button"
                          onClick={() => handleSendOtp(farmerPhone, 'phone')}
                          className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer transition-all"
                  >
                    <span>Verify OTP & Complete Farmer Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Company Registration Form */
                <form onSubmit={handleCompanyRegister} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> Company Registered Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. FreshAgro Foods & Bio-Processing Pvt Ltd"
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> Procurement Hub / Branch
                      </label>
                      <input
                        type="text"
                        value={procurementHub}
                        onChange={(e) => setProcurementHub(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" /> GSTIN Number
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Executive Head</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Official Phone</label>
                      <input
                        type="text"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Registered Corporate Address</label>
                    <input
                      type="text"
                      value={registeredAddress}
                      onChange={(e) => setRegisteredAddress(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      required
                    />
                  </div>

                  {/* Verification OTP Step */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-300 font-bold">
                      <span>Company Contact Verification OTP:</span>
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
                        <button
                          type="button"
                          onClick={() => handleSendOtp(companyEmail, 'email')}
                          className="px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs"
                        >
                          Send OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950 cursor-pointer transition-all"
                  >
                    <span>Verify OTP & Register Company Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. FORGOT PASSWORD MODE (Email OTP Reset)               */}
          {/* ======================================================== */}
          {mode === 'forgot_password' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/60 text-amber-300 text-xs font-semibold flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold text-amber-200 block text-sm mb-0.5">Password Recovery Assistant</strong>
                  Enter your registered email address below. We will send a 4-digit verification OTP to reset your password.
                </div>
              </div>

              {!forgotOtpSent ? (
                <form onSubmit={handleSendForgotOtp} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. gurdev.singh@kisanjod.in or procurement@freshagro.co.in"
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Verification OTP to Email</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold">
                    ✓ OTP Sent to <strong className="text-white">{forgotEmail}</strong>. (Try entering OTP: <strong className="text-white">1234</strong>)
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      Enter 4-Digit Email OTP
                    </label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="e.g. 1234"
                      maxLength={4}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-center tracking-widest text-lg focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Set New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950 cursor-pointer transition-all"
                  >
                    <span>Reset Password & Proceed to Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Back to Login Screen
                </button>
              </div>
            </div>
          )}

          {/* Discreet Admin Gateway Access Trigger */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setMode('login');
                setAuthMethod('password');
                showToast('Executive Admin Access Mode Activated (Passkey: admin9999)', 'info');
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-amber-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
              <span>Platform Operations & Executive Admin Gateway →</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-center text-xs text-slate-500 font-semibold">
        Kisan Jod Agricultural Direct Sourcing & Procurement Platform • Port 5173 Authentication Gateway
      </footer>
    </div>
  );
};
