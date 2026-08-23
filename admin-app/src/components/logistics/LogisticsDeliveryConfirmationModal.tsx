import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import type { LogisticsShipment } from '../../types';
import { CheckCircle2, AlertTriangle, X, Camera, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeliveryModalProps {
  shipment: LogisticsShipment;
  onClose: () => void;
}

export const LogisticsDeliveryConfirmationModal: React.FC<DeliveryModalProps> = ({ shipment, onClose }) => {
  const { confirmDelivery } = useLogistics();

  const [isCheckboxTicked, setIsCheckboxTicked] = useState(false);
  const [deliveredQty, setDeliveredQty] = useState<number>(shipment.actualLoadedQuantityKg || shipment.expectedQuantityKg);
  const [receiverName, setReceiverName] = useState('ABC Industries Receiving Manager');
  const [notes, setNotes] = useState('All crates inspected and delivered in compliant condition.');

  const qtyDiff = shipment.expectedQuantityKg - deliveredQty;

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCheckboxTicked) return;

    confetti({ particleCount: 50, spread: 60 });
    confirmDelivery(
      shipment.orderId,
      deliveredQty,
      receiverName,
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80',
      notes
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70  flex items-center justify-center p-4">
      <div className="bg-white  rounded-3xl p-6 max-w-lg w-full border border-gray-200  shadow-2xl animate-in fade-in zoom-in duration-200 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <span className="text-[10px] font-mono text-gray-400 font-bold">DELIVERY CONFIRMATION</span>
            <h3 className="text-xl font-extrabold text-gray-900 ">
              {shipment.cropName} ({shipment.orderId})
            </h3>
            <p className="text-xs text-gray-500">Destination: {shipment.destinationCompanyName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantity at Delivery Check (Section 58) */}
        <div className="p-4 rounded-2xl bg-gray-50  border border-gray-200  text-xs space-y-2">
          <div className="flex justify-between">
            <span>Expected Order Quantity:</span>
            <strong>{shipment.expectedQuantityKg.toLocaleString()} kg</strong>
          </div>

          <div>
            <label className="block font-bold text-gray-700  mb-1">
              Actual Quantity Delivered (kg)
            </label>
            <input
              type="number"
              value={deliveredQty}
              onChange={(e) => setDeliveredQty(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-gray-300  bg-white  font-black text-sm text-blue-600"
              required
            />
          </div>

          {qtyDiff !== 0 && (
            <div className="p-3 rounded-xl bg-amber-50  border border-amber-300 text-amber-900  space-y-1">
              <span className="font-extrabold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                ⚠️ Quantity Difference Detected
              </span>
              <p className="text-[11px]">
                Expected: <strong>{shipment.expectedQuantityKg.toLocaleString()} kg</strong> vs Delivered: <strong>{deliveredQty.toLocaleString()} kg</strong> (Difference: <strong>{qtyDiff} kg</strong>). Confirming will record delivered quantity & create an exception record.
              </p>
            </div>
          )}
        </div>

        {/* Proof of Delivery Details */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700  mb-1">Receiver Name / Signature Contact</label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700  mb-1">Condition Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-gray-300  bg-gray-50  font-semibold"
            />
          </div>
        </div>

        {/* Section 54: 2-Step Checkbox & Button UI */}
        <form onSubmit={handleConfirmSubmit} className="space-y-3 pt-2">
          <label className="p-3.5 rounded-xl border-2 border-blue-500 bg-blue-50/60  flex items-center gap-3 cursor-pointer text-xs font-extrabold text-blue-900 ">
            <input
              type="checkbox"
              checked={isCheckboxTicked}
              onChange={(e) => setIsCheckboxTicked(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
            <span>☐ I confirm that this shipment has been physically delivered to the receiving company.</span>
          </label>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isCheckboxTicked}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                isCheckboxTicked
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer hover:scale-102'
                  : 'bg-gray-300  text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Delivery & Broadcast Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
