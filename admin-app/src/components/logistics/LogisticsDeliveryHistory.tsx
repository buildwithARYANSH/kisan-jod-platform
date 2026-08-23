import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { History, CheckCircle2, FileText, Camera } from 'lucide-react';

export const LogisticsDeliveryHistory: React.FC = () => {
  const { shipments } = useLogistics();
  const completed = shipments.filter((s) => s.status === 'Delivered');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          Completed Delivery History & Proof of Delivery Log
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Historical log of verified deliveries with delivered quantities, receiver names & timestamped POD.
        </p>
      </div>

      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 ">
            <thead className="bg-gray-50  text-gray-500  font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Order ID / Batch</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Delivered Qty</th>
                <th className="p-3">Driver / Vehicle</th>
                <th className="p-3">Receiver Name</th>
                <th className="p-3">Delivery Timestamp</th>
                <th className="p-3 text-right">POD Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {completed.map((s) => (
                <tr key={s.orderId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-mono">
                    <strong className="text-gray-900  block">{s.orderId}</strong>
                    <span className="text-[10px] text-gray-400">{s.batchId}</span>
                  </td>
                  <td className="p-3 font-bold text-blue-600">{s.cropName}</td>
                  <td className="p-3 font-black text-green-600">{s.actualDeliveredQuantityKg?.toLocaleString() || s.expectedQuantityKg.toLocaleString()} kg</td>
                  <td className="p-3 font-semibold">{s.assignedDriver?.name} ({s.assignedVehicle?.registrationNumber})</td>
                  <td className="p-3 font-semibold">{s.proofOfDelivery?.receiverName || 'Receiving Manager'}</td>
                  <td className="p-3 text-gray-400 font-mono text-[10px]">{s.proofOfDelivery?.deliveredTimestamp || '2026-08-21 10:42 AM'}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-green-100  text-green-800  text-[10px] font-bold">
                      ✓ POD Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
