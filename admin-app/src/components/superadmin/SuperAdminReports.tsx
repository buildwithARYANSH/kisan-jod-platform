import React from 'react';
import { FileText, Download, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SuperAdminReports: React.FC = () => {
  const handleExportCSV = (reportName: string) => {
    confetti({ particleCount: 30, spread: 40 });
    const content = `Report: ${reportName}\nDate: ${new Date().toISOString()}\nStatus: Generated Successfully`;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white  p-5 rounded-2xl border border-gray-200  shadow-md">
        <h2 className="text-xl font-bold text-gray-900  flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Platform Analytics & CSV Data Export
        </h2>
        <p className="text-xs text-gray-500  mt-1">
          Export nationwide platform reports (Farmer growth, Revenue, Logistics expenses, Dispute summary).
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md flex items-center justify-between">
          <div>
            <strong className="text-base text-gray-900  block font-extrabold">Farmer Growth & Supply Report</strong>
            <span className="text-gray-500">Registered farmers, active status & region breakdown</span>
          </div>
          <button
            onClick={() => handleExportCSV('Farmer_Supply_Report')}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" /> CSV Export
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-gray-200  shadow-md flex items-center justify-between">
          <div>
            <strong className="text-base text-gray-900  block font-extrabold">Financial Revenue & Unit Economics</strong>
            <span className="text-gray-500">Buyer revenue, farmer payouts & platform net margin</span>
          </div>
          <button
            onClick={() => handleExportCSV('Financial_Revenue_Report')}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" /> CSV Export
          </button>
        </div>
      </div>
    </div>
  );
};
