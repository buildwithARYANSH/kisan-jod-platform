import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopNav } from './TopNav';
import { TextReaderBanner } from './TextReaderBanner';
import { DemandCarousel } from './DemandCarousel';
import { CentralMicButton } from './CentralMicButton';
import { FeatureNavigation } from './FeatureNavigation';
import { MyCropSection } from './MyCropSection';
import { WasteManagementSection } from './WasteManagementSection';
import { WomenEnterprisesSection } from './WomenEnterprisesSection';
import { ProfitSection } from './ProfitSection';
import { PaycheckSection } from './PaycheckSection';
import { MyProfileSection } from './MyProfileSection';
import { TollFreeHelpline } from './TollFreeHelpline';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { LogoutModal } from './LogoutModal';
import { NotificationModal } from './NotificationModal';
import { ComplaintModal } from './ComplaintModal';
import { ToastContainer } from './ToastContainer';
import { 
  ArrowLeft, Building2, Sprout, ShieldCheck, 
  TrendingUp, Recycle, Sparkles, LogOut, ShieldAlert
} from 'lucide-react';

interface FarmerPortalProps {
  onSwitchPersona?: (persona: 'farmer' | 'company' | 'admin') => void;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({ onSwitchPersona }) => {
  const { 
    activeSection, 
    setActiveSection, 
    textReaderActive, 
    speak, 
    profile, 
    demands, 
    crops, 
    wasteItems,
    setIsLogoutModalOpen,
    setIsComplaintModalOpen,
    t 
  } = useApp();

  // Accessibility Text Reader Global Hover Listener
  useEffect(() => {
    if (!textReaderActive) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.innerText && target.innerText.trim().length > 0 && target.innerText.trim().length < 120) {
        target.classList.add('reader-highlight');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.classList.remove('reader-highlight');
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.innerText && target.innerText.trim().length > 0) {
        speak(target.innerText.trim());
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
    };
  }, [textReaderActive, speak]);

  const activeDemandsCount = demands.length;
  const totalWasteCount = wasteItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-emerald-50/40 to-green-50/50 text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white relative">
      <div>
        {/* Prominent Persona Top Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold shadow-md z-50 relative border-b border-emerald-600/30">
          <span className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Active View: <strong className="text-emerald-200">Farmer Application Portal (किसान पोर्टल)</strong></span>
          </span>
        </div>

        {/* Accessibility Reader Active Banner */}
        <TextReaderBanner />

        {/* Main App Navigation Bar */}
        <TopNav />

        {/* Main Content Area */}
        <main className="pb-12">
          {/* Industry Demand Live Carousel */}
          <DemandCarousel />

          {/* AI Voice Assistant Microphone Button */}
          <CentralMicButton />

          {/* 6 Paytm-style Feature Navigation Buttons */}
          <FeatureNavigation />

          {/* Back Navigation Bar (When viewing a specific sub-section) */}
          {activeSection !== 'home' && (
            <div className="max-w-5xl mx-auto px-4 mt-4 mb-2 flex items-center justify-between">
              <button
                onClick={() => setActiveSection('home')}
                className="py-2 px-4 rounded-xl bg-white border border-emerald-200 text-emerald-950 text-xs font-extrabold flex items-center gap-2 shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                Back to Farmer Dashboard
              </button>

              <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider border border-emerald-300">
                Active Section: {activeSection}
              </span>
            </div>
          )}

          {/* Active Section Views */}
          {activeSection === 'crops' && <MyCropSection />}
          {activeSection === 'waste' && <WasteManagementSection />}
          {activeSection === 'women' && <WomenEnterprisesSection />}
          {activeSection === 'profit' && <ProfitSection />}
          {activeSection === 'paycheck' && <PaycheckSection />}
          {activeSection === 'profile' && <MyProfileSection />}

          {/* Toll-Free Helpline Support Card */}
          <TollFreeHelpline />

          {/* Bottom Register Complaint / Report Issue Action Button */}
          <div className="max-w-md mx-auto px-4 mt-6 space-y-3">
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-sm font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Register Complaint / Report Problem (शिकायत दर्ज करें)</span>
            </button>

            {/* Logout Action Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-red-50 text-red-600 border border-red-200 shadow-sm font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>{t.logout}</span>
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-800">
            © 2026 Kisan Jod B2B Agriculture Platform • Smart India Hackathon Prototype
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Farmer Choice Autonomy • Milestone Buyer Advances • Waste Value Recovery
          </p>
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <VoiceAssistantModal />
      <DigitalReceiptModal />
      <NotificationModal />
      <ComplaintModal />
      <LogoutModal />
      <ToastContainer />
    </div>
  );
};
