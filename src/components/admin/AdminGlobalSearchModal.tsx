import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, X, Users, Building2, UserCheck, ShoppingCart, Warehouse, ShieldAlert } from 'lucide-react';

export const AdminGlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    farmers, 
    companies, 
    fieldAgents, 
    warehouses, 
    disputes, 
    setActiveSection 
  } = useAdmin();

  const [query, setQuery] = useState('');

  if (!isGlobalSearchOpen) return null;

  const results: { type: string; id: string; name: string; targetSection: any }[] = [];

  if (query.trim().length >= 2) {
    const q = query.toLowerCase();

    farmers.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)) {
        results.push({ type: 'Farmer', id: f.id, name: `${f.name} (${f.region})`, targetSection: 'farmers' });
      }
    });

    companies.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        results.push({ type: 'Company', id: c.id, name: `${c.name} - ${c.branch}`, targetSection: 'companies' });
      }
    });

    fieldAgents.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)) {
        results.push({ type: 'Field Agent', id: a.id, name: `${a.name} (${a.region})`, targetSection: 'field-agents' });
      }
    });

    warehouses.forEach((w) => {
      if (w.facilityName.toLowerCase().includes(q) || w.id.toLowerCase().includes(q)) {
        results.push({ type: 'Warehouse Facility', id: w.id, name: w.facilityName, targetSection: 'inventory' });
      }
    });

    disputes.forEach((d) => {
      if (d.id.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)) {
        results.push({ type: 'Dispute Ticket', id: d.id, name: `${d.type} - ${d.raisedBy}`, targetSection: 'disputes' });
      }
    });
  }

  const handleSelect = (section: any) => {
    setActiveSection(section);
    setIsGlobalSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/60  flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
            <Search className="w-4 h-4 text-amber-500" /> Platform Global Search
          </div>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type Farmer ID, Company Name, Order ID, Agent ID, Dispute..."
          className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-amber-500"
          autoFocus
        />

        <div className="max-h-64 overflow-y-auto space-y-2 text-xs font-semibold">
          {query.trim().length < 2 ? (
            <p className="text-slate-400 text-center py-4">Type at least 2 characters to search across entities...</p>
          ) : results.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No matching platform entities found for "{query}".</p>
          ) : (
            results.map((res) => (
              <div
                key={`${res.type}-${res.id}`}
                onClick={() => handleSelect(res.targetSection)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <strong className="text-slate-900 block font-bold">{res.name}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {res.id}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-black uppercase">
                  {res.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
