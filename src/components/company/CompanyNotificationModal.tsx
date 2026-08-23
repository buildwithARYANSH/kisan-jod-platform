import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import { Bell, X, Check, ShoppingCart, Truck, ShieldCheck, ReceiptText, Recycle } from 'lucide-react';

export const CompanyNotificationModal: React.FC = () => {
  const { 
    isCompanyNotificationModalOpen, 
    setIsCompanyNotificationModalOpen, 
    companyNotifications, 
    unreadCompanyNotificationsCount, 
    markAllCompanyNotificationsRead,
    setActiveSection 
  } = useCompany();

  if (!isCompanyNotificationModalOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'demand':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'shipment':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'quality':
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'receipt':
        return <ReceiptText className="w-5 h-5 text-emerald-600" />;
      case 'waste':
        return <Recycle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleNotificationClick = (item: typeof companyNotifications[0]) => {
    if (item.actionSection) {
      setActiveSection(item.actionSection);
      setIsCompanyNotificationModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold relative">
              <Bell className="w-5 h-5 text-blue-700" />
              {unreadCompanyNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCompanyNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-fraunces leading-tight">
                Corporate Alerts & Notifications
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Demand matching, shipment updates, quality ratings & milestone payments
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCompanyNotificationModalOpen(false)}
            className="p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark All Read */}
        {unreadCompanyNotificationsCount > 0 && (
          <div className="flex justify-end mb-3">
            <button
              onClick={markAllCompanyNotificationsRead}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {companyNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                n.read
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  : 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/40 hover:bg-blue-100/80'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 font-fraunces">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                  {n.message}
                </p>

                {n.actionSection && (
                  <span className="inline-block mt-2 text-[11px] font-extrabold text-blue-700 hover:underline">
                    View in {n.actionSection.toUpperCase()} →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsCompanyNotificationModalOpen(false)}
            className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
