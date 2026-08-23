import React from 'react';
import { CompanyProvider, useCompany } from '../../context/CompanyContext';
import { CompanyTopNav } from './CompanyTopNav';
import { CompanySidebar } from './CompanySidebar';
import { CompanyDashboard } from './CompanyDashboard';
import { CompanyDemandEntry } from './CompanyDemandEntry';
import { CompanyFairPriceEngine } from './CompanyFairPriceEngine';
import { CompanyProfitComparison } from './CompanyProfitComparison';
import { CompanyIncomingQuality } from './CompanyIncomingQuality';
import { CompanyReceipts } from './CompanyReceipts';
import { CompanyOrderTracking } from './CompanyOrderTracking';
import { CompanyPaymentPortal } from './CompanyPaymentPortal';
import { CompanyProfileView } from './CompanyProfileView';
import { CompanyReceiptModal } from './CompanyReceiptModal';
import { CompanyNotificationModal } from './CompanyNotificationModal';
import { CompanyComplaintModal } from './CompanyComplaintModal';

interface CompanyPortalLayoutProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void;
}

const CompanyMainContent: React.FC<{ onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void }> = ({ onSwitchPersona }) => {
  const { activeSection } = useCompany();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-indigo-50/30 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      <div>
        {/* Top Navigation Bar */}
        <CompanyTopNav onSwitchPersona={onSwitchPersona} />

        {/* Main Body Shell */}
        <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row gap-10 lg:gap-12 p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Left Sidebar */}
          <CompanySidebar />

          {/* Center Main Dynamic View Area */}
          <main className="flex-1 min-w-0">
            {activeSection === 'dashboard' && <CompanyDashboard />}
            {activeSection === 'demand-entry' && <CompanyDemandEntry />}
            {activeSection === 'fair-price' && <CompanyFairPriceEngine />}
            {activeSection === 'profit-comparison' && <CompanyProfitComparison />}
            {activeSection === 'incoming-quality' && <CompanyIncomingQuality />}
            {activeSection === 'receipts' && <CompanyReceipts />}
            {activeSection === 'order-tracking' && <CompanyOrderTracking />}
            {activeSection === 'pay-portal' && <CompanyPaymentPortal />}
            {activeSection === 'profile' && <CompanyProfileView />}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-800">
            © 2026 Kisan Jod B2B Industrial Procurement Portal • Smart India Hackathon Prototype
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Aggregated Procurement • Multi-Factor Pricing Engine • Verified Quality Batches
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CompanyReceiptModal />
      <CompanyNotificationModal />
      <CompanyComplaintModal />
    </div>
  );
};

export const CompanyPortalLayout: React.FC<CompanyPortalLayoutProps> = ({ onSwitchPersona }) => {
  return (
    <CompanyProvider>
      <CompanyMainContent onSwitchPersona={onSwitchPersona} />
    </CompanyProvider>
  );
};
