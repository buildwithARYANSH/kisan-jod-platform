import React from 'react';
import { useAdmin } from '../../context/AgentContext';
import { 
  CheckSquare, 
  AlertCircle, 
  Warehouse, 
  Star, 
  TrendingUp, 
  Mic, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tasks, inventory, rating, setActiveSection, setTaskPriorityFilter, startVoiceInput } = useAdmin();

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const priority1Count = tasks.filter((t) => t.priority === 1).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
            Field Operations & Ground Control
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            Agent Operational Dashboard
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage daily farmer collections, priority tasks, approved storage allocations, and order dispatches.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveSection('daily-tasks');
            setTaskPriorityFilter(1);
          }}
          className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer shrink-0"
        >
          <AlertCircle className="w-4 h-4" />
          View Priority 1 Tasks ({priority1Count})
        </button>
      </div>

      {/* Voice Assistant Central Button */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
            <Mic className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">Tap to Speak with AI Assistant</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Ask: "Aaj kitne priority 1 tasks hain?", "Ramesh Kumar ka task dikhao", or "Inventory check karo"
            </p>
          </div>
        </div>

        <button
          onClick={startVoiceInput}
          className="py-3 px-6 rounded-2xl bg-white text-blue-900 font-extrabold text-xs hover:bg-blue-50 shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
        >
          Start Voice Command
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Total Tasks Today</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">{totalTasks}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Pending Tasks</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{pendingTasks}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">In Progress</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{inProgressTasks}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Completed</span>
          <span className="text-2xl font-black text-green-600 dark:text-green-400 mt-1 block">{completedTasks}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Agent Rating</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block flex items-center gap-1">
            {rating.overallRating} <Star className="w-4 h-4 fill-purple-600 text-purple-600 inline" />
          </span>
        </div>
      </div>

      {/* Today's Collections & Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Collections */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Today's Produce Collection Progress
          </h3>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Total Produce Collected:</span>
              <strong className="text-green-600 font-bold text-sm">7,000 kg</strong>
            </div>
            <div className="flex justify-between">
              <span>Farmers Visited:</span>
              <strong className="text-gray-900 dark:text-white">3 Farmers</strong>
            </div>
            <div className="flex justify-between">
              <span>Verified Quality Batches:</span>
              <strong className="text-blue-600 font-bold">2 Batches</strong>
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-blue-600" />
            Storage Capacity Summary
          </h3>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Occupied Storage Capacity:</span>
              <strong className="text-gray-900 dark:text-white">320,000 / 500,000 kg</strong>
            </div>
            <div className="flex justify-between">
              <span>Cold Storage Utilization:</span>
              <strong className="text-purple-600 font-bold">65,000 / 100,000 kg (65%)</strong>
            </div>
            <div className="flex justify-between">
              <span>Pending Dispatches:</span>
              <strong className="text-amber-600 font-bold">2 Batches Ready</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
