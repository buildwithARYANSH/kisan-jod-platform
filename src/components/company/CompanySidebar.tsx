import React from 'react';
import { useCompany } from '../../context/CompanyContext';
import type { CompanyNavSection } from '../../types';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Scale, 
  TrendingUp, 
  ShieldCheck, 
  ReceiptText, 
  Truck, 
  CreditCard,
  User,
  LifeBuoy
} from 'lucide-react';

export const CompanySidebar: React.FC = () => {
  const { activeSection, setActiveSection, setIsCompanyComplaintModalOpen } = useCompany();

  const navItems: { id: CompanyNavSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'demand-entry',
      label: 'Demand Entry',
      icon: <PlusCircle className="w-4 h-4" />,
      badge: 'Post Requirement',
    },
    {
      id: 'fair-price',
      label: 'Fair Procurement Price',
      icon: <Scale className="w-4 h-4" />,
      badge: 'Engine',
    },
    {
      id: 'profit-comparison',
      label: 'Profit / Cost Comparison',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'incoming-quality',
      label: 'Incoming Quality',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'AI Rating',
    },
    {
      id: 'receipts',
      label: 'Receipts & Invoices',
      icon: <ReceiptText className="w-4 h-4" />,
    },
    {
      id: 'order-tracking',
      label: 'Order Tracking',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'pay-portal',
      label: 'Pay Portal & Escrow',
      icon: <CreditCard className="w-4 h-4" />,
      badge: 'Bank Details',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-4 rounded-3xl border border-blue-100 shadow-md shrink-0 flex flex-col justify-between">
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-auto md:w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-extrabold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md scale-102'
                  : 'text-slate-800 hover:bg-blue-50/80 hover:text-blue-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider hidden lg:inline ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-950 border border-blue-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Complaint Registration Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 hidden md:block">
        <button
          onClick={() => setIsCompanyComplaintModalOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 font-extrabold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs group"
          title="Report an issue or register official dispute"
        >
          <div className="flex items-center gap-2.5">
            <LifeBuoy className="w-4 h-4 text-red-600 group-hover:rotate-12 transition-transform" />
            <span>Register Complaint</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-900 font-black uppercase tracking-wider border border-red-300">
            24/7 Desk
          </span>
        </button>
      </div>
    </aside>
  );
};
