import React from 'react';
import { LogisticsProvider, useLogistics } from '../../context/LogisticsContext';
import { LogisticsTopNav } from './LogisticsTopNav';
import { LogisticsSidebar } from './LogisticsSidebar';
import { LogisticsDashboard } from './LogisticsDashboard';
import { LogisticsPickupRequests } from './LogisticsPickupRequests';
import { LogisticsActiveDeliveries } from './LogisticsActiveDeliveries';
import { LogisticsDeliveryHistory } from './LogisticsDeliveryHistory';
import { LogisticsDrivers } from './LogisticsDrivers';
import { LogisticsVehicles } from './LogisticsVehicles';
import { LogisticsPayments } from './LogisticsPayments';
import { LogisticsPerformance } from './LogisticsPerformance';
import { LogisticsIssues } from './LogisticsIssues';
import { LogisticsProfileView } from './LogisticsProfileView';

interface LogisticsPortalLayoutProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'logistics') => void;
}

const LogisticsMainContent: React.FC<LogisticsPortalLayoutProps> = ({ onSwitchPersona }) => {
  const { activeSection } = useLogistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <LogisticsTopNav onSwitchPersona={onSwitchPersona as any} />

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

export const LogisticsPortalLayout: React.FC<LogisticsPortalLayoutProps> = (props) => {
  return (
    <LogisticsProvider>
      <LogisticsMainContent {...props} />
    </LogisticsProvider>
  );
};
