import React, { useEffect } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { Search, X, ShoppingBag, Users, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';

export const SuperAdminGlobalSearchModal: React.FC = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, searchQuery, setSearchQuery, farmers, companies, fieldAgents, orders, disputes, setSelectedOrder, setSelectedFarmer, setSelectedCompany, setSelectedAgent, setSelectedDispute, setActiveSection } = useSuperAdmin();

  // Keyboard shortcut listener (CTRL + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const query = searchQuery.toLowerCase();

  const matchingOrders = query ? orders.filter((o) => o.orderId.toLowerCase().includes(query) || o.cropName.toLowerCase().includes(query) || o.companyName.toLowerCase().includes(query)) : [];
  const matchingFarmers = query ? farmers.filter((f) => f.name.toLowerCase().includes(query) || f.id.toLowerCase().includes(query)) : [];
  const matchingCompanies = query ? companies.filter((c) => c.companyName.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)) : [];
  const matchingAgents = query ? fieldAgents.filter((a) => a.name.toLowerCase().includes(query) || a.id.toLowerCase().includes(query)) : [];
  const matchingDisputes = query ? disputes.filter((d) => d.disputeId.toLowerCase().includes(query) || d.type.toLowerCase().includes(query)) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70  flex items-start justify-center pt-20 p-4">
      <div className="bg-white  rounded-3xl p-6 max-w-2xl w-full border border-gray-200  shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-200  pb-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              autoFocus
              placeholder="Type order ID (ORD-), farmer (FRM-), company, agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-base font-bold text-gray-900  focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 text-xs">
          {!query && (
            <p className="text-center text-gray-400 py-6">
              Start typing to search across Orders, Farmers, Companies, Agents & Dispute Tickets...
            </p>
          )}

          {matchingOrders.map((ord) => (
            <div
              key={ord.orderId}
              onClick={() => {
                setSelectedOrder(ord);
                setActiveSection('orders-master');
                setIsGlobalSearchOpen(false);
              }}
              className="p-3 rounded-2xl bg-gray-50  hover:bg-blue-50 dark:hover:bg-blue-50/40 border border-gray-200  cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <div>
                  <strong className="text-gray-900  block">{ord.cropName} ({ord.confirmedQtyKg.toLocaleString()} kg)</strong>
                  <span className="text-[10px] text-gray-400 font-mono">Order ID: {ord.orderId} • Buyer: {ord.companyName}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Order</span>
            </div>
          ))}

          {matchingFarmers.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFarmer(f);
                setActiveSection('farmers-master');
                setIsGlobalSearchOpen(false);
              }}
              className="p-3 rounded-2xl bg-gray-50  hover:bg-green-50 dark:hover:bg-green-950/40 border border-gray-200  cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-green-600" />
                <div>
                  <strong className="text-gray-900  block">{f.name}</strong>
                  <span className="text-[10px] text-gray-400 font-mono">Farmer ID: {f.id} • Region: {f.region}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">Farmer</span>
            </div>
          ))}

          {matchingCompanies.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCompany(c);
                setActiveSection('companies-master');
                setIsGlobalSearchOpen(false);
              }}
              className="p-3 rounded-2xl bg-gray-50  hover:bg-purple-50 dark:hover:bg-purple-50/40 border border-gray-200  cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                <div>
                  <strong className="text-gray-900  block">{c.companyName}</strong>
                  <span className="text-[10px] text-gray-400 font-mono">Company ID: {c.id} • {c.branch}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">Company</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
