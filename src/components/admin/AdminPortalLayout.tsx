import React from 'react';
import { CompanyProvider } from '../../context/CompanyContext';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import { AdminTopNav } from './AdminTopNav';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminFarmerManagement } from './AdminFarmerManagement';
import { AdminCompanyManagement } from './AdminCompanyManagement';
import { AdminFieldAgentManagement } from './AdminFieldAgentManagement';
import { AdminOrderManagement } from './AdminOrderManagement';
import { AdminInventoryWarehouse } from './AdminInventoryWarehouse';
import { AdminCropAvailability } from './AdminCropAvailability';
import { AdminPriceIntelligence } from './AdminPriceIntelligence';
import { AdminAIPredictions } from './AdminAIPredictions';
import { AdminDemandAnalytics } from './AdminDemandAnalytics';
import { AdminDemandMatching } from './AdminDemandMatching';
import { AdminDemandForecasting } from './AdminDemandForecasting';
import { AdminLogisticsPayments } from './AdminLogisticsPayments';
import { AdminFinancePortal } from './AdminFinancePortal';
import { AdminDisputeManagement } from './AdminDisputeManagement';
import { AdminRiskAnomalies } from './AdminRiskAnomalies';
import { AdminReports } from './AdminReports';
import { AdminProfileView } from './AdminProfileView';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { AdminNotificationModal } from './AdminNotificationModal';

interface AdminPortalLayoutProps {
  onSwitchPersona: (persona: 'farmer' | 'company' | 'admin' | 'field-agent' | 'logistics') => void;
  initialSection?: any;
}

export const AdminPortalLayout: React.FC<AdminPortalLayoutProps> = ({ onSwitchPersona, initialSection }) => {
  return (
    <CompanyProvider>
      <AdminProvider initialSection={initialSection}>
        <AdminMainContent onSwitchPersona={onSwitchPersona} />
      </AdminProvider>
    </CompanyProvider>
  );
};

const AdminMainContent: React.FC<{ onSwitchPersona: (persona: 'farmer' | 'company' | 'admin') => void }> = ({ onSwitchPersona }) => {
  const { activeSection } = useAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-amber-50/20 to-orange-50/30 text-slate-900 flex flex-col justify-between font-sans selection:bg-amber-600 selection:text-white">
      <div>
        {/* Persistent Top Navigation Bar */}
        <AdminTopNav onSwitchPersona={onSwitchPersona} />

        {/* Main Body Shell Container */}
        <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row gap-10 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Left Collapsible Sidebar */}
          <AdminSidebar />

          {/* Center Dynamic Section View */}
          <main className="flex-1 min-w-0">
            {activeSection === 'dashboard' && <AdminDashboard />}
            {activeSection === 'farmers' && <AdminFarmerManagement />}
            {activeSection === 'companies' && <AdminCompanyManagement />}
            {activeSection === 'field-agents' && <AdminFieldAgentManagement />}
            {activeSection === 'orders' && <AdminOrderManagement />}
            {activeSection === 'inventory' && <AdminInventoryWarehouse />}
            {activeSection === 'crop-availability' && <AdminCropAvailability />}
            {activeSection === 'demand' && <AdminDemandAnalytics />}
            {activeSection === 'price-intelligence' && <AdminPriceIntelligence />}
            {activeSection === 'ai-predictions' && <AdminAIPredictions />}
            {activeSection === 'logistics' && <AdminLogisticsPayments />}
            {activeSection === 'finance' && <AdminFinancePortal />}
            {activeSection === 'disputes' && <AdminDisputeManagement />}
            {activeSection === 'risk' && <AdminRiskAnomalies />}
            {activeSection === 'matching' && <AdminDemandMatching />}
            {activeSection === 'forecasting' && <AdminDemandForecasting />}
            {activeSection === 'reports' && <AdminReports />}
            {activeSection === 'profile' && <AdminProfileView />}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-100 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-800">
            © 2026 Kisan Jod Admin & Platform Operations Control Center • Smart India Hackathon Prototype
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            System Level Governance • Unified Dispute Resolution Desk • Multi-Factor Pricing Engine
          </p>
        </div>
      </footer>

      {/* Global Modals Overlays */}
      <AdminGlobalSearchModal />
      <AdminNotificationModal />
    </div>
  );
};
