import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const AdminVoiceConfirmModal: React.FC = () => {
  const { confirmVoiceActionModal, setConfirmVoiceActionModal } = useAdmin();

  if (!confirmVoiceActionModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70  flex items-center justify-center p-4">
      <div className="bg-white  rounded-3xl p-6 max-w-md w-full border border-amber-200  shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-amber-100  text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-600  uppercase tracking-wider block">
              AI Action Confirmation Required
            </span>
            <h3 className="text-base font-extrabold text-gray-900 ">
              {confirmVoiceActionModal.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-700  my-4 p-3 rounded-xl bg-gray-50 ">
          {confirmVoiceActionModal.message}
        </p>

        <div className="flex justify-end gap-2 text-xs">
          <button
            onClick={() => setConfirmVoiceActionModal(null)}
            className="px-4 py-2 rounded-xl border font-bold cursor-pointer"
          >
            Cancel Action
          </button>
          <button
            onClick={() => {
              confirmVoiceActionModal.onConfirm();
              setConfirmVoiceActionModal(null);
            }}
            className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md cursor-pointer"
          >
            Confirm & Execute
          </button>
        </div>
      </div>
    </div>
  );
};
