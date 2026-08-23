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

// Field Agent Shell
const MiddlemanMainContent: React.FC<{ onSwitchPersona?: (p: PersonaType) => void; onLogout: () => void }> = ({ onLogout }) => {
  const { activeSection } = useAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50/20 to-indigo-50/30 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      <div className="bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-50 text-purple-950 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold border-b border-purple-200/80 shadow-xs font-sans">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          Middleman & Field Agent Operations Desk — Running on Port 5174
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

      <AdminTopNav />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-4 p-4">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && <AdminDashboard />}
          {activeSection === 'daily-tasks' && <AdminDailyTasks />}
          {activeSection === 'farmers' && <AdminFarmers />}
          {activeSection === 'inventory' && <AdminInventory />}
          {activeSection === 'orders' && <AdminOrders />}
          {activeSection === 'dispatch' && <AdminDispatch />}
          {activeSection === 'rating' && <AdminRating />}
          {activeSection === 'referrals' && <AdminReferrals />}
          {activeSection === 'notifications' && <AdminNotifications />}
          {activeSection === 'task-history' && <AdminTaskHistory />}
          {activeSection === 'report-issue' && <AdminReportIssue />}
          {activeSection === 'profile' && <AdminProfileView />}
        </main>
      </div>

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('kisan_admin_session_active') === 'true';
    } catch {
      return false;
    }
  });

  const [currentPersona, setCurrentPersona] = useState<PersonaType>('middleman');

  const handleLoginSuccess = (persona: PersonaType) => {
    setCurrentPersona(persona);
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('kisan_admin_session_active', 'true');
    } catch (e) {
      console.warn(e);
    }
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
