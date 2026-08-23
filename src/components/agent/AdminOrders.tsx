import React from 'react';
import { useAdmin } from '../../context/AgentContext';
import { ShoppingBag, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import type { AdminOrder } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderCheckbox } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          Order Verification & Checkbox Workflow Control
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Operational stage checkboxes propagating through shared backend state to Farmer & Buyer portals.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((ord) => (
          <div
            key={ord.orderId}
            className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400 font-bold">{ord.orderId}</span>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  {ord.cropName} — Buyer: {ord.buyerName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Confirmed Qty: <strong>{ord.confirmedQty.toLocaleString()} kg</strong> (Demand: {ord.companyDemandQty.toLocaleString()} kg)
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold self-start sm:self-auto">
                Grade {ord.grade}
              </span>
            </div>

            {/* Checkbox Operational Workflow Control */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                Operational Progress Verification Checkboxes:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {/* Quantity Checked */}
                <label className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  ord.statusCheckboxes.quantityChecked
                    ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
                    : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={ord.statusCheckboxes.quantityChecked}
                    onChange={(e) => updateOrderCheckbox(ord.orderId, 'quantityChecked', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span>☑ Quantity Checked</span>
                </label>

                {/* Quality Checked */}
                <label className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  ord.statusCheckboxes.qualityChecked
                    ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
                    : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={ord.statusCheckboxes.qualityChecked}
                    onChange={(e) => updateOrderCheckbox(ord.orderId, 'qualityChecked', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span>☑ Quality Checked</span>
                </label>

                {/* Approved */}
                <label className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  ord.statusCheckboxes.approved
                    ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
                    : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={ord.statusCheckboxes.approved}
                    onChange={(e) => updateOrderCheckbox(ord.orderId, 'approved', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span>☑ Approved</span>
                </label>

                {/* Shifted to Inventory */}
                <label className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  ord.statusCheckboxes.shiftedToInventory
                    ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
                    : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={ord.statusCheckboxes.shiftedToInventory}
                    onChange={(e) => updateOrderCheckbox(ord.orderId, 'shiftedToInventory', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span>☑ Shifted to Storage</span>
                </label>

                {/* Ready for Dispatch */}
                <label className={`p-3 rounded-xl border flex items-center gap-2 font-bold cursor-pointer transition-all ${
                  ord.statusCheckboxes.readyForDispatch
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}>
                  <input
                    type="checkbox"
                    checked={ord.statusCheckboxes.readyForDispatch}
                    onChange={(e) => updateOrderCheckbox(ord.orderId, 'readyForDispatch', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>☐ Ready for Dispatch</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
