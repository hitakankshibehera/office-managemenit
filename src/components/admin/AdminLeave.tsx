import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  User,
  Check,
  X,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLeave: React.FC = () => {
  const { leaves, reviewLeave, openEmailModal, emails } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [search, setSearch] = useState('');

  const filteredLeaves = leaves.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review and adjudicate employee leave applications with automated email feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            {pendingCount} Pending Review
          </span>
        </div>
      </div>

      {/* Filter and Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pending Approval</span>
          <div className="text-2xl font-black text-amber-600 tabular-nums">{pendingCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Approved'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-400 block mb-1">Approved Leaves</span>
          <div className="text-2xl font-black text-emerald-600 tabular-nums">{approvedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Rejected'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold text-slate-400 block mb-1">Rejected</span>
          <div className="text-2xl font-black text-rose-600 tabular-nums">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name or reason..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              statusFilter === 'ALL' ? 'bg-[#168BFF] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({leaves.length})
          </button>
        </div>
      </div>

      {/* Leave Applications Table matching Screen 17 */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6">Reason</th>
                <th className="py-3.5 px-6">Applied On</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#168BFF] font-bold text-xs flex items-center justify-center">
                        {leave.employeeName.substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {leave.employeeName}
                        </span>
                        <span className="text-[11px] text-slate-400">{leave.employeeCode}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {leave.leaveType}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-mono text-slate-900 font-medium">
                      {leave.startDate} — {leave.endDate}
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {leave.days} {leave.days === 1 ? 'day' : 'days'}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                    {leave.reason}
                  </td>

                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {leave.appliedAt || leave.requestedAt}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        leave.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : leave.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {leave.status === 'Approved' && <CheckCircle2 size={13} />}
                      {leave.status === 'Rejected' && <XCircle size={13} />}
                      {leave.status === 'Pending' && <Clock size={13} />}
                      <span>{leave.status}</span>
                    </span>
                  </td>

                  {/* Actions: Approve / Reject buttons */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {leave.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => reviewLeave(leave.id, 'Approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                          title="Approve Leave"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => reviewLeave(leave.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                          title="Reject Leave"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Resolved by {leave.reviewedByName || leave.reviewedBy || 'Admin'}
                      </span>
                    )}
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
