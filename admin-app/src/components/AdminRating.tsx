import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Star, ShieldAlert, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminRating: React.FC = () => {
  const { rating } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
          Field Agent Performance & Operational Rating
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Transparent operational performance rating based on task completion, data accuracy & farmer satisfaction.
        </p>
      </div>

      {/* Main Overall Rating Card */}
      <div className="bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-white  border-2 border-purple-500 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-600 text-white uppercase tracking-wider shadow-xs">
            Current Agent Score
          </span>
          <h3 className="text-4xl font-black text-gray-900  mt-2 flex items-center gap-2">
            {rating.overallRating.toFixed(1)} / 5.0
            <span className="flex text-purple-500">
              <Star className="w-8 h-8 fill-purple-500" />
            </span>
          </h3>
          <p className="text-xs text-purple-700  font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Task Completion Rate: {rating.tasksCompletedPercent}%
          </p>
        </div>

        {/* Warning Threshold Policy Banner */}
        <div className="p-4 rounded-2xl bg-amber-50  border border-amber-200  text-xs text-amber-900  max-w-sm space-y-1">
          <span className="font-extrabold flex items-center gap-1 text-amber-800 ">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Platform Eligibility Policy:
          </span>
          <p>
            Maintain an operational rating of <strong>2.0 or above</strong> to remain active for field procurement operations. Ratings below 2.0 trigger a Performance Review.
          </p>
        </div>
      </div>

      {/* Performance Parameters Breakdown */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h3 className="text-sm font-bold text-gray-900  flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Rating Parameter Scores
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50  space-y-1">
            <span className="text-gray-500 font-medium block">Task Completion:</span>
            <strong className="text-base text-gray-900  block">{rating.breakdown.taskCompletion} / 5.0</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50  space-y-1">
            <span className="text-gray-500 font-medium block">On-Time Performance:</span>
            <strong className="text-base text-amber-600 block">{rating.breakdown.onTimePerformance} / 5.0</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50  space-y-1">
            <span className="text-gray-500 font-medium block">Data Accuracy:</span>
            <strong className="text-base text-green-600 block">{rating.breakdown.dataAccuracy} / 5.0</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50  space-y-1">
            <span className="text-gray-500 font-medium block">Farmer Interaction:</span>
            <strong className="text-base text-purple-600 block">{rating.breakdown.farmerInteraction} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* Rating Transparency Audit Log */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md space-y-3">
        <h3 className="text-sm font-bold text-gray-900 ">
          Rating Transparency & Operational Feedback History
        </h3>

        <div className="space-y-2 text-xs">
          {rating.recentIssues.map((iss, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50  text-gray-700 ">
              • {iss}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
