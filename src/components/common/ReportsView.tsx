import React from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Building2,
  Printer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { departments, employees, tasks, attendanceRecords } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Executive Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Comprehensive audit reports, departmental KPIs, and attendance analytics.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer size={15} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Departmental Performance Matrix */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <h2 className="text-base font-bold text-[#071A2F] mb-4">
          Departmental Performance Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const deptEmps = employees.filter((e) => e.departmentId === dept.id);
            const deptTasks = tasks.filter((t) => t.department === dept.name);
            const completed = deptTasks.filter((t) => t.status === 'COMPLETED').length;
            const completionRate = deptTasks.length > 0 ? Math.round((completed / deptTasks.length) * 100) : 85;

            return (
              <div key={dept.id} className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{dept.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {dept.employeeCount ?? dept.totalEmployees} staff
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Task Completion</span>
                    <span className="font-mono font-bold text-slate-900">{completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#168BFF] to-[#18BFFF] rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Attendance: <strong>94.2%</strong></span>
                  <span>Head: <strong>{dept.leadName ?? dept.headName}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Attendance Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <h2 className="text-base font-bold text-[#071A2F] mb-2">
          Monthly Attendance Statistics (September 2026)
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Aggregate workforce shifts logged across company branches.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Total Scheduled Shifts</span>
            <div className="text-2xl font-black text-slate-900 tabular-nums">1,152</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Total Hours Worked</span>
            <div className="text-2xl font-black text-[#168BFF] font-mono tabular-nums">9,840h</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Avg Check-in Time</span>
            <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums">09:08 AM</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">Leaves Approved</span>
            <div className="text-2xl font-black text-amber-600 tabular-nums">18 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};
