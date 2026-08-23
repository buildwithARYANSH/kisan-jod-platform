import React from 'react';
import { FileSpreadsheet, Download, Filter } from 'lucide-react';
import { fireConfetti } from '../../utils/confetti';

export const AdminReports: React.FC = () => {
  const handleExportCSV = (reportName: string) => {
    fireConfetti({ particleCount: 30, spread: 40 });
    const content = `data:text/csv;charset=utf-8,Report Name,Export Date,Status\n${reportName},${new Date().toISOString()},Generated`;
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName.toLowerCase().replace(/ /g, '_')}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-100 text-blue-950 uppercase tracking-wider border border-blue-200">
          Executive Data Export & CSV Summaries
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-fraunces">
          Reports & Analytical Export Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
          Export system CSV reports for farmer growth, company demands, order completion, logistics expenses & platform profit ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold">
        {['Farmer Growth & Supply Report', 'Company Demand Trends Report', 'Order Lifecycle Completion Report', 'Logistics Freight Expense Report', 'Platform Revenue & Net Result Report'].map((rep) => (
          <div key={rep} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3 flex flex-col justify-between">
            <div>
              <strong className="text-slate-900 text-base font-black font-fraunces block">{rep}</strong>
              <span className="text-slate-500 text-xs">Updated daily • CSV Format</span>
            </div>
            <button
              onClick={() => handleExportCSV(rep)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
