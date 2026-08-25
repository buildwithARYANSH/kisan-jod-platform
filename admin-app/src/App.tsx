import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { SuperAdminProvider, useSuperAdmin } from './context/SuperAdminContext';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { AdminAuthPortal } from './components/auth/AdminAuthPortal';

// Field Agent Components
import { AdminTopNav } from './components/AdminTopNav';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminDailyTasks } from './components/AdminDailyTasks';
import { AdminFarmers } from './components/AdminFarmers';
import { AdminInventory } from './components/AdminInventory';
import { AdminOrders } from './components/AdminOrders';
import { AdminDispatch } from './components/AdminDispatch';
import { AdminRating } from './components/AdminRating';
import { AdminReferrals } from './components/AdminReferrals';
import { AdminNotifications } from './components/AdminNotifications';
import { AdminTaskHistory } from './components/AdminTaskHistory';
import { AdminReportIssue } from './components/AdminReportIssue';
import { AdminProfileView } from './components/AdminProfileView';
import { AdminVoiceModal } from './components/AdminVoiceModal';
import { AdminVoiceConfirmModal } from './components/AdminVoiceConfirmModal';

// Super-Admin Components
import { SuperAdminTopNav } from './components/superadmin/SuperAdminTopNav';
import { SuperAdminSidebar } from './components/superadmin/SuperAdminSidebar';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { SuperAdminFarmers } from './components/superadmin/SuperAdminFarmers';
import { SuperAdminCompanies } from './components/superadmin/SuperAdminCompanies';
import { SuperAdminFieldAgents } from './components/superadmin/SuperAdminFieldAgents';
import { SuperAdminOrders } from './components/superadmin/SuperAdminOrders';
import { SuperAdminUnitEconomics } from './components/superadmin/SuperAdminUnitEconomics';
import { SuperAdminCropAvailability } from './components/superadmin/SuperAdminCropAvailability';
import { SuperAdminPriceIntelligence } from './components/superadmin/SuperAdminPriceIntelligence';
import { SuperAdminDemandMatching } from './components/superadmin/SuperAdminDemandMatching';
import { SuperAdminWarehouses } from './components/superadmin/SuperAdminWarehouses';
import { SuperAdminFinance } from './components/superadmin/SuperAdminFinance';
import { SuperAdminDisputes } from './components/superadmin/SuperAdminDisputes';
import { SuperAdminRiskAnomalies } from './components/superadmin/SuperAdminRiskAnomalies';
import { SuperAdminReports } from './components/superadmin/SuperAdminReports';
import { SuperAdminAuditLog } from './components/superadmin/SuperAdminAuditLog';
import { SuperAdminGlobalSearchModal } from './components/superadmin/SuperAdminGlobalSearchModal';

// Logistics Partner Components
import { LogisticsTopNav } from './components/logistics/LogisticsTopNav';
import { LogisticsSidebar } from './components/logistics/LogisticsSidebar';
import { LogisticsDashboard } from './components/logistics/LogisticsDashboard';
import { LogisticsPickupRequests } from './components/logistics/LogisticsPickupRequests';
import { LogisticsActiveDeliveries } from './components/logistics/LogisticsActiveDeliveries';
import { LogisticsDeliveryHistory } from './components/logistics/LogisticsDeliveryHistory';
import { LogisticsDrivers } from './components/logistics/LogisticsDrivers';
import { LogisticsVehicles } from './components/logistics/LogisticsVehicles';
import { LogisticsPayments } from './components/logistics/LogisticsPayments';
import { LogisticsPerformance } from './components/logistics/LogisticsPerformance';
import { LogisticsIssues } from './components/logistics/LogisticsIssues';
import { LogisticsProfileView } from './components/logistics/LogisticsProfileView';

import { ShieldCheck, Crown, Truck, LogOut } from 'lucide-react';

type PersonaType = 'super-admin' | 'middleman' | 'logistics';

// Field Agent Shell - Kisan Jod Earn Mobile-First Interface
const MiddlemanMainContent: React.FC<{ onSwitchPersona?: (p: PersonaType) => void; onLogout: () => void }> = ({ onLogout }) => {
  const { activeSection, setActiveSection, unreadCount, profile, language, setLanguage } = useAdmin();
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const navItems: { id: AdminNavSection; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'घर', icon: '⌂' },
    { id: 'daily-tasks', label: 'काम', icon: '✓' },
    { id: 'farmers', label: 'किसान', icon: '♙' },
    { id: 'inventory', label: 'कामकाज', icon: '▣' },
    { id: 'profile', label: 'और', icon: '•••' },
  ];

  return (
    <div className="shell selection:bg-[#1f6a45] selection:text-white">
      {/* Top Header */}
      <header className="topbar">
        <div>
          <div className="greeting">नमस्ते, {profile?.name || 'अमित कुमार'}</div>
          <div className="identity">एजेंट आईडी · {profile?.employeeId || 'AGT1256'}</div>
        </div>

        <div className="top-actions">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'logout') {
                onLogout();
              } else if (onSwitchPersona) {
                onSwitchPersona(val as PersonaType);
              }
            }}
            className="border border-[#e7e7df] bg-white h-[39px] rounded-[14px] px-2 text-[11px] font-extrabold text-[#1f6a45] cursor-pointer shadow-xs"
            defaultValue="middleman"
            title="Switch Portal or Logout"
          >
            <option value="middleman">🌾 Middleman</option>
            <option value="super-admin">👑 Super-Admin</option>
            <option value="logistics">🚛 Logistics</option>
            <option value="logout">🔒 Login Page / Logout</option>
          </select>

          <button
            className="icon-btn"
            onClick={() => {
              setActiveSection('notifications');
              showToast(`${unreadCount || 4} नई सूचनाएं हैं`);
            }}
            title="Notifications"
          >
            ◉<em className="dot">{unreadCount || 4}</em>
          </button>

          <button
            className="language"
            onClick={() => setIsLanguageSheetOpen(true)}
            title="Change Language"
          >
            {language === 'hi' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </header>

      {/* Screen Body */}
      <section className="screen">
        {activeSection === 'dashboard' && <AdminDashboard />}
        {activeSection === 'daily-tasks' && <AdminDailyTasks />}
        {activeSection === 'farmers' && <AdminFarmers />}
        {(activeSection === 'inventory' || activeSection === 'orders' || activeSection === 'dispatch') && (
          <div className="space-y-4">
            <div className="screen-head">
              <div>
                <h1>कामकाज</h1>
                <p>इन्वेंटरी, ऑर्डर और डिस्पैच</p>
              </div>
            </div>
            <div className="operation-tabs">
              <button
                className={activeSection === 'inventory' ? 'active' : ''}
                onClick={() => setActiveSection('inventory')}
              >
                इन्वेंटरी
              </button>
              <button
                className={activeSection === 'orders' ? 'active' : ''}
                onClick={() => setActiveSection('orders')}
              >
                ऑर्डर
              </button>
              <button
                className={activeSection === 'dispatch' ? 'active' : ''}
                onClick={() => setActiveSection('dispatch')}
              >
                डिस्पैच
              </button>
            </div>
            {activeSection === 'inventory' && <AdminInventory />}
            {activeSection === 'orders' && <AdminOrders />}
            {activeSection === 'dispatch' && <AdminDispatch />}
          </div>
        )}
        {(activeSection === 'profile' ||
          activeSection === 'rating' ||
          activeSection === 'referrals' ||
          activeSection === 'task-history' ||
          activeSection === 'report-issue' ||
          activeSection === 'notifications') && (
          <div className="space-y-4 font-sans">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeSection === 'profile' ? 'bg-[#1f6a45] text-white' : 'bg-white text-[#718076] border border-[#e7e7df]'
                }`}
              >
                मेरा प्रोफाइल
              </button>
              <button
                onClick={() => setActiveSection('rating')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeSection === 'rating' ? 'bg-[#1f6a45] text-white' : 'bg-white text-[#718076] border border-[#e7e7df]'
                }`}
              >
                रेटिंग
              </button>
              <button
                onClick={() => setActiveSection('referrals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeSection === 'referrals' ? 'bg-[#1f6a45] text-white' : 'bg-white text-[#718076] border border-[#e7e7df]'
                }`}
              >
                कमाई और रेफरल
              </button>
              <button
                onClick={() => setActiveSection('task-history')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeSection === 'task-history' ? 'bg-[#1f6a45] text-white' : 'bg-white text-[#718076] border border-[#e7e7df]'
                }`}
              >
                हिस्ट्री
              </button>
              <button
                onClick={() => setActiveSection('report-issue')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeSection === 'report-issue' ? 'bg-[#1f6a45] text-white' : 'bg-white text-[#718076] border border-[#e7e7df]'
                }`}
              >
                मदद / समस्या
              </button>
            </div>
            {activeSection === 'profile' && <AdminProfileView onLogout={onLogout} />}
            {activeSection === 'rating' && <AdminRating />}
            {activeSection === 'referrals' && <AdminReferrals />}
            {activeSection === 'notifications' && <AdminNotifications />}
            {activeSection === 'task-history' && <AdminTaskHistory />}
            {activeSection === 'report-issue' && <AdminReportIssue />}
          </div>
        )}
      </section>

      {/* Bottom Fixed Navigation Bar */}
      <nav className="bottomnav">
        {navItems.map((n) => {
          const isActive =
            activeSection === n.id ||
            (n.id === 'inventory' && (activeSection === 'orders' || activeSection === 'dispatch')) ||
            (n.id === 'profile' &&
              (activeSection === 'rating' ||
                activeSection === 'referrals' ||
                activeSection === 'task-history' ||
                activeSection === 'report-issue' ||
                activeSection === 'notifications'));

          return (
            <button
              key={n.id}
              className={`nav ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(n.id)}
            >
              <b>{n.icon}</b>
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Bottom Sheet Modal */}
      {isLanguageSheetOpen && (
        <div className="sheet show" onClick={() => setIsLanguageSheetOpen(false)}>
          <div className="sheet-box" onClick={(e) => e.stopPropagation()}>
            <h2>अपनी भाषा चुनें</h2>
            <p>पूरे वेबसाइट का कंटेंट तुरंत बदलेगा।</p>
            <div className="language-grid">
              {['हिंदी', 'English', 'मराठी', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'বাংলা'].map((langName) => (
                <button
                  key={langName}
                  onClick={() => {
                    setLanguage(langName.toLowerCase().includes('eng') ? 'en' : 'hi');
                    setIsLanguageSheetOpen(false);
                    showToast(`${langName} भाषा चुनी गई`);
                  }}
                >
                  {langName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && <div className="toast show">{toastMessage}</div>}

      <AdminVoiceModal />
      <AdminVoiceConfirmModal />
    </div>
  );
};

// Super-Admin Shell
const SuperAdminMainContent: React.FC<{ onSwitchPersona?: (p: PersonaType) => void; onLogout: () => void }> = ({ onLogout }) => {
  const { activeSection } = useSuperAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-amber-50/20 to-orange-50/30 text-slate-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 text-amber-950 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold border-b border-amber-200/80 shadow-xs font-sans">
        <span className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-700" />
          Platform Super-Admin Operations Control Center — Running on Port 5174
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 shadow-xs flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <SuperAdminTopNav onSwitchPersona={() => {}} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 p-4">
        <SuperAdminSidebar />
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && <SuperAdminDashboard />}
          {activeSection === 'farmers-master' && <SuperAdminFarmers />}
          {activeSection === 'companies-master' && <SuperAdminCompanies />}
          {activeSection === 'field-agents-master' && <SuperAdminFieldAgents />}
          {activeSection === 'orders-master' && <SuperAdminOrders />}
          {activeSection === 'unit-economics' && <SuperAdminUnitEconomics />}
          {activeSection === 'crop-availability' && <SuperAdminCropAvailability />}
          {activeSection === 'price-intelligence' && <SuperAdminPriceIntelligence />}
          {activeSection === 'ai-predictions' && <SuperAdminPriceIntelligence />}
          {activeSection === 'total-demand' && <SuperAdminDashboard />}
          {activeSection === 'demand-matching' && <SuperAdminDemandMatching />}
          {activeSection === 'demand-forecasting' && <SuperAdminCropAvailability />}
          {activeSection === 'logistics-payments' && <SuperAdminFinance />}
          {activeSection === 'warehouses-master' && <SuperAdminWarehouses />}
          {activeSection === 'finance-portal' && <SuperAdminFinance />}
          {activeSection === 'disputes-center' && <SuperAdminDisputes />}
          {activeSection === 'risk-anomalies' && <SuperAdminRiskAnomalies />}
          {activeSection === 'reports-analytics' && <SuperAdminReports />}
          {activeSection === 'audit-log' && <SuperAdminAuditLog />}
          {activeSection === 'profile' && <SuperAdminDashboard />}
        </main>
      </div>

      <SuperAdminGlobalSearchModal />
    </div>
  );
};

// Logistics Partner Shell
const LogisticsMainContent: React.FC<{ onSwitchPersona?: (p: PersonaType) => void; onLogout: () => void }> = ({ onLogout }) => {
  const { activeSection } = useLogistics();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-inner">
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-400" />
          Logistics Partner Portal — Sample Fleet Logistics Ltd — Running on Port 5174
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all bg-red-950 text-red-300 border border-red-800 shadow-xs flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <LogisticsTopNav onSwitchPersona={() => {}} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 p-4">
        <LogisticsSidebar />
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && <LogisticsDashboard />}
          {activeSection === 'pickup-requests' && <LogisticsPickupRequests />}
          {activeSection === 'active-deliveries' && <LogisticsActiveDeliveries />}
          {activeSection === 'delivery-history' && <LogisticsDeliveryHistory />}
          {activeSection === 'drivers' && <LogisticsDrivers />}
          {activeSection === 'vehicles' && <LogisticsVehicles />}
          {activeSection === 'payments' && <LogisticsPayments />}
          {activeSection === 'performance' && <LogisticsPerformance />}
          {activeSection === 'issues' && <LogisticsIssues />}
          {activeSection === 'profile' && <LogisticsProfileView />}
        </main>
      </div>
    </div>
  );
};

function AdminAppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [currentPersona, setCurrentPersona] = useState<PersonaType>('middleman');

  const handleLoginSuccess = (persona: PersonaType) => {
    setCurrentPersona(persona);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('kisan_admin_session_active');
    } catch (e) {
      console.warn(e);
    }
  };

  if (!isLoggedIn) {
    return <AdminAuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {currentPersona === 'super-admin' && <SuperAdminMainContent onSwitchPersona={setCurrentPersona} onLogout={handleLogout} />}
      {currentPersona === 'middleman' && <MiddlemanMainContent onSwitchPersona={setCurrentPersona} onLogout={handleLogout} />}
      {currentPersona === 'logistics' && <LogisticsMainContent onSwitchPersona={setCurrentPersona} onLogout={handleLogout} />}
    </>
  );
}

export default function App() {
  return (
    <SuperAdminProvider>
      <AdminProvider>
        <LogisticsProvider>
          <AdminAppContent />
        </LogisticsProvider>
      </AdminProvider>
    </SuperAdminProvider>
  );
}
