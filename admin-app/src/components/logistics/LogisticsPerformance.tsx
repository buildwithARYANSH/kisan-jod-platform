import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { TrendingUp, Star, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LogisticsPerformance: React.FC = () => {
  const { performance } = useLogistics();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Logistics Performance Score & Reliability Metrics
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Operational performance rating score based on on-time delivery %, quantity accuracy & incident rate.
        </p>
      </div>

      {/* Main Rating Card */}
      <div className="bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-white  border-2 border-purple-500 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-600 text-white uppercase tracking-wider">
            Overall Logistics Performance Score
          </span>
          <h3 className="text-4xl font-black text-gray-900  mt-2 flex items-center gap-2">
            {performance.overallScore.toFixed(1)} / 5.0
            <Star className="w-8 h-8 fill-purple-500 text-purple-500" />
          </h3>
          <p className="text-xs text-purple-700  font-bold mt-1">
            Successful Deliveries Completed: {performance.successfulDeliveriesCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white  border text-xs space-y-1">
          <div className="flex justify-between"><span>On-Time Pickup Rate:</span><strong className="text-green-600">{performance.onTimePickupPercent}%</strong></div>
          <div className="flex justify-between"><span>On-Time Delivery Rate:</span><strong className="text-green-600">{performance.onTimeDeliveryPercent}%</strong></div>
          <div className="flex justify-between"><span>Quantity Accuracy:</span><strong className="text-green-600">{performance.quantityAccuracyPercent}%</strong></div>
          <div className="flex justify-between"><span>Dispute Rate:</span><strong className="text-blue-600">{performance.disputeRatePercent}%</strong></div>
        </div>
      </div>
    </div>
  );
};
