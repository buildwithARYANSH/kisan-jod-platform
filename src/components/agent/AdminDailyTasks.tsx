import React, { useState } from 'react';
import { useAdmin } from '../../context/AgentContext';
import type { FieldAgentTask, TaskPriority, CompletionVerification } from '../../types';
import { 
  CheckSquare, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Plus 
} from 'lucide-react';

export const AdminDailyTasks: React.FC = () => {
  const { 
    tasks, 
    taskPriorityFilter, 
    setTaskPriorityFilter, 
    updateTaskStatus, 
    completeTaskWithVerification, 
    rescheduleTask 
  } = useAdmin();

  // Modals state
  const [selectedTask, setSelectedTask] = useState<FieldAgentTask | null>(null);
  const [modalType, setModalType] = useState<'complete' | 'unable' | 'reschedule' | null>(null);

  // Complete Form State
  const [actualQty, setActualQty] = useState<number>(2000);
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [verificationNotes, setVerificationNotes] = useState('Collected and verified produce at farm site.');
  const [farmerConfirmed, setFarmerConfirmed] = useState(true);
  const [agentConfirmed, setAgentConfirmed] = useState(true);

  // Unable Form State
  const [unableReason, setUnableReason] = useState('Farmer unavailable');

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('2026-08-25');

  // Filter tasks by priority if set, then sort auto by Priority (1 -> 5)
  const filteredTasks = tasks
    .filter((t) => (taskPriorityFilter ? t.priority === taskPriorityFilter : true))
    .sort((a, b) => a.priority - b.priority);

  const handleOpenCompleteModal = (task: FieldAgentTask) => {
    setSelectedTask(task);
    setActualQty(task.quantity);
    setGrade(task.requiredGrade);
    setModalType('complete');
  };

  const handleOpenUnableModal = (task: FieldAgentTask) => {
    setSelectedTask(task);
    setModalType('unable');
  };

  const handleOpenRescheduleModal = (task: FieldAgentTask) => {
    setSelectedTask(task);
    setModalType('reschedule');
  };

  const submitComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    completeTaskWithVerification(selectedTask.id, {
      actualQty,
      collectedDate: new Date().toISOString().split('T')[0],
      grade,
      notes: verificationNotes,
      farmerConfirmed,
      agentConfirmed,
    });

    setModalType(null);
  };

  const submitUnable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    updateTaskStatus(selectedTask.id, 'Unable to Complete', unableReason);
    setModalType(null);
  };

  const submitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    rescheduleTask(selectedTask.id, rescheduleDate);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            Daily Operational Tasks (Auto-Sorted by Priority)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tasks assigned by platform system sorted from Priority 1 (Highest Urgency) to Priority 5.
          </p>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <button
            onClick={() => setTaskPriorityFilter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              taskPriorityFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {([1, 2, 3, 4, 5] as TaskPriority[]).map((p) => (
            <button
              key={p}
              onClick={() => setTaskPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                taskPriorityFilter === p
                  ? p === 1 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Priority {p}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-5 rounded-2xl bg-white dark:bg-gray-800 border shadow-md transition-all ${
              task.priority === 1
                ? 'border-red-300 dark:border-red-900/60'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Task Header info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    task.priority === 1
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300'
                      : task.priority === 2
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                  }`}>
                    PRIORITY {task.priority}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">{task.id}</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold">
                    Grade {task.requiredGrade}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">
                  {task.cropName} Collection ({task.quantity.toLocaleString()} {task.unit})
                </h3>

                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    Farmer: {task.farmerName} • <span className="font-mono text-blue-600 dark:text-blue-400">{task.farmerPhone}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Address: {task.farmerAddress}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    Pickup Date: {task.pickupDate}
                  </p>
                  {task.notes && (
                    <p className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-[11px] text-gray-500 italic mt-1">
                      Notes: {task.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  task.status === 'Completed'
                    ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                    : task.status === 'In Progress'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  Status: {task.status}
                </span>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  <a
                    href={`tel:${task.farmerPhone}`}
                    className="p-2 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 text-xs font-bold flex items-center gap-1 hover:bg-green-100 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>

                  {task.status === 'Pending' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'In Progress')}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Start Task
                    </button>
                  )}

                  {task.status !== 'Completed' && (
                    <>
                      <button
                        onClick={() => handleOpenCompleteModal(task)}
                        className="py-1.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Complete Task
                      </button>

                      <button
                        onClick={() => handleOpenUnableModal(task)}
                        className="py-1.5 px-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 border border-red-200 font-bold text-xs cursor-pointer"
                      >
                        Unable to Complete
                      </button>

                      <button
                        onClick={() => handleOpenRescheduleModal(task)}
                        className="py-1.5 px-3 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-xs cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Task Modal */}
      {modalType === 'complete' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
              Complete Task & Verify Collection
            </h3>
            <p className="text-xs text-gray-500 mb-4 font-mono">
              Task ID: {selectedTask.id} • Farmer: {selectedTask.farmerName}
            </p>

            <form onSubmit={submitComplete} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Actual Quantity Collected ({selectedTask.unit})
                </label>
                <input
                  type="number"
                  value={actualQty}
                  onChange={(e) => setActualQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Verified Size Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                >
                  <option value="A">Grade A (Large Size - Premium Processing)</option>
                  <option value="B">Grade B (Medium Size - Standard)</option>
                  <option value="C">Grade C (Small Size - Quick Commerce)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Collection Notes
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                />
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={farmerConfirmed}
                    onChange={(e) => setFarmerConfirmed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Farmer Physical Receipt Confirmation
                </label>
                <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agentConfirmed}
                    onChange={(e) => setAgentConfirmed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  Agent Ground Verification Signoff
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Task Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unable to Complete Modal */}
      {modalType === 'unable' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Report Unable to Complete Task
            </h3>

            <form onSubmit={submitUnable} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Failure:
                </label>
                <select
                  value={unableReason}
                  onChange={(e) => setUnableReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                >
                  <option value="Farmer unavailable">Farmer unavailable</option>
                  <option value="Quantity unavailable">Quantity unavailable</option>
                  <option value="Crop damaged / Quality issue">Crop damaged / Quality issue</option>
                  <option value="Transportation vehicle issue">Transportation vehicle issue</option>
                  <option value="Weather / Road block">Weather / Road block</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                >
                  Submit Reason
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {modalType === 'reschedule' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Reschedule Collection Task
            </h3>

            <form onSubmit={submitReschedule} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select New Date:
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Reschedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
