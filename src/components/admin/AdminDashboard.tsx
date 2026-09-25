import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  UserPlus,
  TrendingUp,
  ArrowUpRight,
  Download,
  Calendar,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    employees,
    tasks,
    attendanceRecords,
    leaves,
    departments,
    setActiveView,
    resetToScratch,
    registerEmployee,
    verifyRegisterOtp,
    userRole,
    currentUser,
    adminUnlockCheckIn,
  } = useApp();

  const [dateFilter] = useState('2026-09-24');

  // Dynamic stats calculated from real state
  const totalEmployeesCount = employees.length;
  const presentTodayCount = employees.filter(
    (e) => e.workingStatus === 'Working' || e.workingStatus === 'Checked Out'
  ).length;
  const pendingApprovalCount = leaves.filter((l) => l.status === 'Pending').length;
  const absentCount = Math.max(0, employees.length - presentTodayCount);
  const activeTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  const turnoutPercentage =
    totalEmployeesCount > 0
      ? Math.round((presentTodayCount / totalEmployeesCount) * 100)
      : 0;

  const recentAttendance = attendanceRecords.slice(0, 6);

  const handleQuickRegisterSample = async () => {
    const samples = [
      {
        fullName: 'Aarav Sharma',
        email: `aarav.${Date.now().toString().slice(-4)}@wonderlightadventure.com`,
        phone: '+91 98765 12340',
        departmentId: departments[0]?.id || 'dept-1',
        designation: 'Expeditions Lead',
      },
      {
        fullName: 'Neha Patel',
        email: `neha.${Date.now().toString().slice(-4)}@wonderlightadventure.com`,
        phone: '+91 98111 22334',
        departmentId: departments[2]?.id || 'dept-3',
        designation: 'Software Developer',
      },
    ];
    const sample = samples[employees.length % samples.length];
    const res = await registerEmployee(sample);
    if (res.otp) {
      await verifyRegisterOtp(sample.email, res.otp);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Employee,ID,Email,Department,Designation,Status,RegisteredAt\n' +
      employees
        .map(
          (e) =>
            `"${e.fullName}","${e.employeeCode}","${e.email}","${e.departmentName}","${e.designation}","${e.status}","${e.signupTimestamp || e.joiningDate}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WLA_SignedUp_Employees_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-[#071A2F]">
              {userRole === 'SUPER_ADMIN' ? 'Super Admin Portal' : 'Admin Portal'}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                userRole === 'SUPER_ADMIN'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-[#168BFF] border-blue-100'
              }`}
            >
              {userRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {userRole === 'SUPER_ADMIN'
              ? 'Complete company control, live employee sign-up feed & system audit (wonderlightadventure@gmail.com)'
              : 'Personnel monitoring, attendance records & employee sign-up roster'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveView('signup')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus size={15} />
            <span>+ Sign Up Employee</span>
          </button>

          <button
            onClick={handleQuickRegisterSample}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-emerald-600" />
            <span>Test Quick Sign-Up</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export Roster</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset workspace to empty scratch state (0 employees)?')) {
                resetToScratch();
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors flex items-center gap-1.5"
            title="Reset all records to empty"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards with real state values */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Employees */}
        <div
          onClick={() => setActiveView('employees')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer hover:border-[#168BFF]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Signed-Up</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#071A2F] tabular-nums">
            {totalEmployeesCount}
          </div>
          <span className="text-[10px] text-[#168BFF] font-semibold mt-1 block">
            {totalEmployeesCount === 0 ? 'Empty (Scratch)' : 'View in Directory →'}
          </span>
        </div>

        {/* Present Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Working</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 tabular-nums">
            {presentTodayCount}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {turnoutPercentage}% turnout
          </span>
        </div>

        {/* Tasks */}
        <div
          onClick={() => setActiveView('admin-tasks')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer hover:border-[#168BFF]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#168BFF] flex items-center justify-center">
              <FileText size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 tabular-nums">
            {activeTasksCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Work in progress</span>
        </div>

        {/* Pending Approval */}
        <div
          onClick={() => setActiveView('admin-leave')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 cursor-pointer hover:border-[#168BFF]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Leave</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 tabular-nums">
            {pendingApprovalCount}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
            {pendingApprovalCount > 0 ? 'Action required' : 'Clear queue'}
          </span>
        </div>

        {/* Absent */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Off Duty</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 tabular-nums">
            {absentCount}
          </div>
          <span className="text-[10px] text-rose-500 font-medium mt-1 block">Not clocked in</span>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-600 tabular-nums">
            {completedTasksCount}
          </div>
          <span className="text-[10px] text-teal-600 font-semibold mt-1 block">Done</span>
        </div>
      </div>

      {/* Dedicated Section: Signed Up Employees Feed */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#071A2F]">Live Signed-Up Employees</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#168BFF]">
                {employees.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Employees who completed the onboarding sign-up form appear here automatically.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('employees')}
              className="text-xs font-bold text-[#168BFF] hover:underline flex items-center gap-1"
            >
              <span>Full Directory Table</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="p-10 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#168BFF] flex items-center justify-center mx-auto mb-3">
              <Users size={28} />
            </div>
            <h3 className="text-base font-bold text-[#071A2F]">0 Employees Signed Up</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The database has been initialized from scratch. As soon as a user fills out the sign-up form, they will appear in this roster.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveView('signup')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#168BFF] text-white hover:bg-[#1270cc] transition-colors flex items-center gap-1.5"
              >
                <UserPlus size={14} />
                <span>Open Sign-Up Form</span>
              </button>
              <button
                onClick={handleQuickRegisterSample}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center gap-1"
              >
                <Sparkles size={13} />
                <span>Add Sample</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Designation</th>
                  <th className="py-3.5 px-6">Registered At</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setActiveView('employees')}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-2 ring-[#168BFF]/20 shrink-0">
                          <img
                            src={emp.profileImage}
                            alt={emp.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-[#168BFF] text-white flex items-center justify-center font-bold text-xs">
                            {emp.fullName.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {emp.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-[#168BFF]">
                      {emp.employeeCode}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {emp.departmentName}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {emp.designation}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500">
                      {emp.signupTimestamp || emp.joiningDate}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{emp.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Biometric Punches Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#071A2F]">Today's Shift Attendance</h2>
            <span className="text-xs text-slate-400">Employee clock-in / clock-out punches</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('admin-attendance')}
              className="text-xs font-bold text-[#168BFF] hover:underline"
            >
              Full Attendance Records →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentAttendance.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No attendance clock-ins recorded yet today.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Check In</th>
                  <th className="py-3.5 px-6">Check Out</th>
                  <th className="py-3.5 px-6">Working Hours</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttendance.map((row) => {
                  const emp = employees.find((e) => e.id === row.employeeId);
                  const isLocked = (emp?.shiftCompletedToday || row.checkOut) && !emp?.allowReCheckInToday;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#168BFF] font-bold text-xs flex items-center justify-center shrink-0">
                            {row.employeeName.substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {row.employeeName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {row.employeeCode} · {row.department}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 tabular-nums">
                        {row.checkIn}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 tabular-nums">
                        {row.checkOut || '--'}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-900 tabular-nums">
                        {row.workingHoursText}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            row.status === 'Working'
                              ? 'bg-blue-50 text-[#168BFF]'
                              : row.status === 'Present'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isLocked ? (
                          <button
                            onClick={() => adminUnlockCheckIn(row.employeeId)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Unlock check-in for this employee today"
                          >
                            <Lock size={12} className="text-amber-600" />
                            <span>Unlock Check-In</span>
                          </button>
                        ) : emp?.allowReCheckInToday ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Re-Check-In Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
