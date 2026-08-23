import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, t, showToast } = useApp();

  if (!isLogoutModalOpen) return null;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    showToast('Logged out successfully', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-red-200 shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2 font-fraunces">
          {t.confirmLogoutTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mb-6">
          {t.confirmLogoutMsg}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="w-1/2 py-3 rounded-2xl border border-slate-300 text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirmLogout}
            className="w-1/2 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
