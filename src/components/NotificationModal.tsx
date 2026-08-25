import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, Check, ShoppingCart, Truck, CreditCard, Recycle, Info } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const { 
    isNotificationModalOpen, 
    setIsNotificationModalOpen, 
    notifications, 
    unreadNotificationsCount, 
    markAllNotificationsRead,
    setActiveSection,
    speak,
    textReaderActive,
    language
  } = useApp();

  if (!isNotificationModalOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'demand':
        return <ShoppingCart className="w-5 h-5 text-emerald-600" />;
      case 'pickup':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'waste':
        return <Recycle className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleNotificationClick = (item: typeof notifications[0]) => {
    const itemTitle = language === 'hi' ? (item.titleHi || item.title) : item.title;
    const itemMsg = language === 'hi' ? (item.messageHi || item.message) : item.message;
    if (textReaderActive) {
      speak(itemTitle + '. ' + itemMsg);
    }
    if (item.actionUrl) {
      setActiveSection(item.actionUrl);
      setIsNotificationModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold relative">
              <Bell className="w-5 h-5 text-emerald-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-fraunces leading-tight">
                {language === 'hi' ? 'किसान सूचनाएं' : 'Farmer Notifications'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {language === 'hi'
                  ? 'लाइव मांग अलर्ट, ऑर्डर पिकअप अपडेट और पेमेंट रसीदें'
                  : 'Live demand alerts, order pickup updates & payment credits'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark All Read Button */}
        {unreadNotificationsCount > 0 && (
          <div className="flex justify-end mb-3">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {language === 'hi' ? 'सभी को पढ़ा हुआ चिन्हित करें' : 'Mark all as read'}
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {notifications.map((n) => {
            let displayTitle = n.title;
            let displayMessage = n.message;
            let displayTimestamp = n.timestamp;

            if (language === 'hi') {
              if (n.titleHi) {
                displayTitle = n.titleHi;
              } else if (n.type === 'demand' || n.title.toLowerCase().includes('demand') || n.title.toLowerCase().includes('tomato')) {
                displayTitle = '🛒 टमाटर की तत्काल मांग बढ़ी';
              } else if (n.type === 'payment' || n.title.toLowerCase().includes('payment')) {
                displayTitle = '💰 भुगतान सफलतापूर्वक प्राप्त हुआ';
              } else {
                displayTitle = `🔔 ${n.title}`;
              }

              if (n.messageHi) {
                displayMessage = n.messageHi;
              } else if (n.type === 'demand') {
                displayMessage = 'इंडस्ट्रियल खरीदार फ्रेशएग्रो ने ₹18/किलो पर 1,00,000 किलो टमाटर की मांग बढ़ाई है। अपनी फसल अभी दर्ज करें!';
              } else if (n.type === 'payment') {
                displayMessage = 'टमाटर बिक्री का ₹8,40,000 आपके SBI बैंक खाते ****4921 में जमा कर दिया गया है।';
              }

              if (n.timestampHi) {
                displayTimestamp = n.timestampHi;
              } else if (n.timestamp === '10 mins ago') {
                displayTimestamp = '10 मिनट पहले';
              } else if (n.timestamp === '2 hours ago') {
                displayTimestamp = '2 घंटे पहले';
              }
            }

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                  n.read
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/40 hover:bg-emerald-100/80'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 font-fraunces">
                      {displayTitle}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-bold shrink-0">
                      {displayTimestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                    {displayMessage}
                  </p>

                  {n.actionUrl && (
                    <span className="inline-block mt-2 text-[11px] font-extrabold text-emerald-700 hover:underline">
                      {language === 'hi'
                        ? `${n.actionUrl.toUpperCase()} में देखें →`
                        : `View in ${n.actionUrl.toUpperCase()} →`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="py-2.5 px-5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 cursor-pointer"
          >
            {language === 'hi' ? 'सूचनाएं बंद करें' : 'Close Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
};
