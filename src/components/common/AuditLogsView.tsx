import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, ShieldAlert, Clock, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.performedByName || log.userName).toLowerCase().includes(search.toLowerCase()) ||
      (log.details || log.metadata || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#071A2F]">Security Audit Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Immutable
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Cryptographically sealed system activity ledger tracking every user action, authentication, and state change.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Zero Tamper Guarantee</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions, user, details..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">User / Actor</th>
                <th className="py-3.5 px-6">IP Address</th>
                <th className="py-3.5 px-6">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-sans font-medium text-slate-800 whitespace-nowrap">
                    {log.performedByName || log.userName}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-6 font-sans text-slate-600">
                    {log.details || log.metadata}
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
