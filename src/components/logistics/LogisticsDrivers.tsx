import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Users, PlusCircle, Phone, Award } from 'lucide-react';

export const LogisticsDrivers: React.FC = () => {
  const { drivers, addDriver } = useLogistics();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    addDriver({ name, phone, licenseNumber, availability: 'Available' });
    setName('');
    setPhone('');
    setLicenseNumber('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Fleet Driver Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Registered fleet drivers, phone contacts, license verification status & availability.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Fleet Driver
        </button>
      </div>

      {/* Drivers Table */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Driver ID / Name</th>
                <th className="p-3">Phone / Contact</th>
                <th className="p-3">License Number</th>
                <th className="p-3">Deliveries</th>
                <th className="p-3">On-Time %</th>
                <th className="p-3 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3">
                    <strong className="text-gray-900 dark:text-white block">{d.name}</strong>
                    <span className="text-[10px] font-mono text-gray-400">{d.id}</span>
                  </td>
                  <td className="p-3 font-mono text-blue-600 font-bold">{d.phone}</td>
                  <td className="p-3 font-mono text-gray-500">{d.licenseNumber}</td>
                  <td className="p-3 font-semibold">{d.completedDeliveries} Deliveries</td>
                  <td className="p-3 font-bold text-green-600">{d.onTimePercent}%</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      d.availability === 'Available'
                        ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {d.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Add Fleet Driver</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Driving License Number</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-gray-50 dark:bg-gray-700 font-bold"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md"
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
