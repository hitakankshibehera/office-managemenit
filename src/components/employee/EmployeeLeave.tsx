import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Send,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaveType } from '../../types';
import { AestheticDatePicker } from '../common/AestheticDatePicker';

export const EmployeeLeave: React.FC = () => {
  const { currentEmployee, leaves, applyLeave, companySettings } = useApp();

  const [activeTab, setActiveTab] = useState<'MY_LEAVES' | 'APPLY'>('MY_LEAVES');
  const [formData, setFormData] = useState({
    leaveType: 'Casual' as LeaveType,
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Strict employee isolation
  const myLeaves = leaves.filter((l) => l.employeeId === currentEmployee?.id);

  const todayIso = new Date().toISOString().split('T')[0];

  const calculateDaysBetween = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 1;
    const d1 = new Date(startStr);
    const d2 = new Date(endStr);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const handleStartDateChange = (val: string) => {
    let updatedEnd = formData.endDate;
    if (!updatedEnd || updatedEnd < val) {
      updatedEnd = val;
    }
    const daysCount = calculateDaysBetween(val, updatedEnd);
    setFormData((prev) => ({
      ...prev,
      startDate: val,
      endDate: updatedEnd,
      days: daysCount,
    }));
  };

  const handleEndDateChange = (val: string) => {
    const daysCount = calculateDaysBetween(formData.startDate || val, val);
    setFormData((prev) => ({
      ...prev,
      endDate: val,
      days: daysCount,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) return;

    setIsSubmitting(true);
    applyLeave({
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: Number(formData.days),
      reason: formData.reason,
    });

    setIsSubmitting(false);
    setSuccessNotice(true);
    setActiveTab('MY_LEAVES');
    setFormData({
      leaveType: 'Casual',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
    });
    setTimeout(() => setSuccessNotice(false), 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle size={13} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock size={13} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit vacation, medical, or casual leave requests with automated admin approval workflow.
          </p>
        </div>

        {/* Tab switcher matching Screen 16 */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('MY_LEAVES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MY_LEAVES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('APPLY')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'APPLY'
                ? 'bg-[#168BFF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus size={14} />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Quota overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Casual Leave Quota</span>
          <div className="text-2xl font-extrabold text-[#071A2F] tabular-nums">
            7 <span className="text-xs font-normal text-slate-400">/ 12 days left</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Sick Leave Quota</span>
          <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            10 <span className="text-xs font-normal text-slate-400">/ 12 days left</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Approved This Year</span>
          <div className="text-2xl font-extrabold text-blue-600 tabular-nums">
            5 days <span className="text-xs font-normal text-slate-400">taken</span>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span className="font-semibold">
            ✓ Your leave application has been submitted and sent to management for review.
          </span>
          <button onClick={() => setSuccessNotice(false)}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* View: My Leave Requests Table matching Screen 16 */}
      {activeTab === 'MY_LEAVES' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#071A2F]">Leave History</h2>
            <span className="text-xs text-slate-400">{myLeaves.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                  <th className="py-3.5 px-6">Date Range</th>
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Reason</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {req.startDate} — {req.endDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-700">{req.leaveType}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-800 tabular-nums">
                      {req.days} {req.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                      {req.reason}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Apply for Leave Form */
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[#071A2F] mb-1">Apply for Leave</h2>
          <p className="text-xs text-slate-500 mb-6">
            Ensure team tasks are handed over prior to scheduled leave start.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Leave Type
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF]"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Emergency">Emergency Leave</option>
                <option value="Personal">Personal Work</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AestheticDatePicker
                label="Start Date"
                required
                min={todayIso}
                placeholder="dd-mm-yyyy"
                value={formData.startDate}
                onChange={handleStartDateChange}
              />

              <AestheticDatePicker
                label="End Date"
                required
                min={formData.startDate || todayIso}
                placeholder="dd-mm-yyyy"
                value={formData.endDate}
                onChange={handleEndDateChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Leave
              </label>
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="State the purpose of your leave request..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('MY_LEAVES')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Send size={14} />
                <span>Submit Leave Application</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
