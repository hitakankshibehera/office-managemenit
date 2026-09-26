import React from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Play,
  Square,
  Sparkles,
  ChevronRight,
  Timer,
  Globe,
  Mail,
  MapPin,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployeeDashboard: React.FC = () => {
  const {
    currentEmployee,
    isWorkingNow,
    workingTimerText,
    checkIn,
    checkOut,
    tasks,
    setActiveView,
    setSelectedTaskId,
    attendanceRecords,
    liveRealTime,
    liveRealDate,
    lastCalculatedWorkTime,
  } = useApp();

  const todayDateString = new Date().toISOString().split('T')[0];
  const isShiftLockedToday =
    currentEmployee?.shiftCompletedToday &&
    currentEmployee?.lastShiftDate === todayDateString &&
    !currentEmployee?.allowReCheckInToday;

  // Employee-only tasks & attendance
  const myTasks = tasks.filter((t) => t.assignedToId === currentEmployee?.id);
  const completedTasks = myTasks.filter((t) => t.status === 'COMPLETED');
  const pendingTasks = myTasks.filter((t) => t.status !== 'COMPLETED');
  const todayTasks = myTasks.slice(0, 3);

  // Dynamic metrics starting from 0
  const myAttendance = attendanceRecords.filter((r) => r.employeeId === currentEmployee?.id);
  const presentAttendanceCount = myAttendance.filter(
    (r) => r.status === 'Present' || r.status === 'Working'
  ).length;
  const attendanceRateText =
    myAttendance.length > 0
      ? `${Math.round((presentAttendanceCount / myAttendance.length) * 100)}%`
      : '0%';

  const totalTasksCount = myTasks.length;
  const completedTasksCount = completedTasks.length;
  const pendingTasksCount = pendingTasks.length;

  // Status priority color helper
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Urgent Priority</span>;
      case 'HIGH':
        return <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">High Priority</span>;
      case 'MEDIUM':
        return <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Medium</span>;
      default:
        return <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="text-xs font-semibold text-[#168BFF] bg-blue-50 px-2.5 py-1 rounded-lg">In Progress</span>;
      case 'ON_HOLD':
        return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">Pending</span>;
      default:
        return <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Not Started</span>;
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveView('task-detail');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2F] tracking-tight flex items-center gap-2">
            <span>Welcome back, {currentEmployee?.fullName || currentUser?.fullName || 'Team Member'}</span>
            <span>👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Have a productive day! Check your daily milestones and active assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            <Clock size={14} className="text-[#168BFF] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">REAL TIME:</span>
            <span className="font-mono tabular-nums text-slate-900 font-extrabold">{liveRealTime}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">{liveRealDate}</span>
          </div>
          <button
            onClick={() => setActiveView('leave')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-[#168BFF] hover:bg-blue-100 transition-colors"
          >
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Main Grid: Attendance Card & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Card (Left - 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Attendance
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isWorkingNow
                    ? 'bg-emerald-50 text-emerald-600'
                    : isShiftLockedToday
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isWorkingNow
                      ? 'bg-emerald-500 animate-pulse'
                      : isShiftLockedToday
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span>
                  {isWorkingNow
                    ? 'Working (Timer Running)'
                    : isShiftLockedToday
                    ? 'Shift Completed (Locked)'
                    : 'Checked Out'}
                </span>
              </span>
            </div>

            {/* Real-Time Live Clock Bar */}
            <div className="flex items-center justify-between mt-4 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock size={13} className="text-[#168BFF]" />
                <span className="font-semibold text-slate-600">Top Real Time:</span>
              </span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {liveRealTime}
              </span>
            </div>

            {/* Check-in & Check-out times display */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CHECK IN TIME</span>
                <span className="text-base font-extrabold text-[#071A2F] tabular-nums mt-0.5 block">
                  {currentEmployee?.todayCheckIn || '--:--:--'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CHECK OUT TIME</span>
                <span className="text-base font-extrabold text-[#071A2F] tabular-nums mt-0.5 block">
                  {currentEmployee?.todayCheckOut || (isWorkingNow ? 'Active' : '--:--:--')}
                </span>
              </div>
            </div>

            {/* Large Active Working Time Display (06h 42m 18s) */}
            <div className="my-6 text-center bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Working Time
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#071A2F] font-mono tabular-nums tracking-tight">
                {workingTimerText}
              </div>
              <span className="text-xs text-slate-500 mt-2 block font-medium">
                {isWorkingNow
                  ? 'Session duration calculated live • Changes every second'
                  : 'Total work time calculated for today'}
              </span>
            </div>

            {/* Work Time Calculated Card upon Checkout */}
            {!isWorkingNow && (lastCalculatedWorkTime || currentEmployee?.todayTotalHours) && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Work Time Calculated</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-mono font-bold">
                    SAVED
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-950 tabular-nums">
                  {lastCalculatedWorkTime?.durationText || currentEmployee?.todayTotalHours || workingTimerText}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Checked in at {lastCalculatedWorkTime?.checkIn || currentEmployee?.todayCheckIn || '09:12:00 AM'} and checked out at {lastCalculatedWorkTime?.checkOut || currentEmployee?.todayCheckOut || '03:54:18 PM'}. Shift calculated and recorded.
                </p>
              </div>
            )}
          </div>

          {/* Action Button: Check In / Check Out */}
          <div>
            {isWorkingNow ? (
              <button
                onClick={checkOut}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-500/20 transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square size={16} className="fill-current" />
                <span>Check Out (Calculate Work Time)</span>
              </button>
            ) : isShiftLockedToday ? (
              <div className="w-full space-y-2">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
                  <Lock size={15} className="text-amber-600 shrink-0" />
                  <span>Shift finished for today. Contact HR / MD to unlock re-check-in.</span>
                </div>
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  <span>Check In Locked (Shift Finished for Today)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={checkIn}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-101 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={16} className="fill-current" />
                <span>Check In (Start Countdown / Timer)</span>
              </button>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Standard Shift: 09:00 AM – 06:00 PM</span>
              <button
                onClick={() => setActiveView('attendance')}
                className="text-[#168BFF] hover:underline font-semibold"
              >
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Today's Tasks (Right - 7 Cols matching screenshot 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#071A2F]">Today's Tasks</h2>
                <span className="text-xs text-slate-400 font-medium">
                  {myTasks.length} Tasks Assigned to You
                </span>
              </div>
              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-bold text-[#168BFF] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Task Item Cards */}
            <div className="divide-y divide-slate-100 mt-2">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No tasks assigned currently. Enjoy your workday!
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className="py-4 hover:bg-slate-50/80 px-2 rounded-xl transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#168BFF]" />
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#168BFF] transition-colors truncate">
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {getPriorityBadge(task.priority)}
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{task.deadline}</span>
                        </span>
                        {task.progress > 0 && (
                          <>
                            <span>·</span>
                            <span className="font-mono tabular-nums text-slate-700">
                              {task.progress}% done
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {getStatusBadge(task.status)}
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-[#168BFF] transition-colors hidden sm:block"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Click any task to view requirements, subtasks, and submit progress.</span>
            <button
              onClick={() => setActiveView('tasks')}
              className="font-bold text-[#168BFF] hover:underline"
            >
              My Tasks Workspace →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Row (Starts from 0 and updates dynamically with real employee data) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Quick Stats
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Tasks */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#168BFF] shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Tasks</span>
              <span className="text-2xl font-black text-[#071A2F] tabular-nums">{totalTasksCount}</span>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Completed</span>
              <span className="text-2xl font-black text-emerald-600 tabular-nums">{completedTasksCount}</span>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Pending</span>
              <span className="text-2xl font-black text-amber-600 tabular-nums">{pendingTasksCount}</span>
            </div>
          </div>

          {/* Card 4: Attendance Rate */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-500 shrink-0">
              <UserCheck size={22} />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Attendance</span>
              <span className="text-2xl font-black text-[#168BFF] tabular-nums">{attendanceRateText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company & Website Details Banner Card */}
      <div className="bg-gradient-to-r from-[#071A2F] via-[#0D2B4D] to-[#071A2F] rounded-2xl p-6 text-white shadow-xl border border-slate-700/50 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#18BFFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              WLA
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Wonder Light Adventure
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#18BFFF]/20 text-[#18BFFF] border border-[#18BFFF]/30">
                  Official Website & Enterprise Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Travel. Explore. Experience. · High Altitude Expeditions & Corporate Tour Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#18BFFF] to-[#168BFF] hover:from-[#168BFF] hover:to-[#0066CC] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer shrink-0"
          >
            <Globe className="w-4 h-4 text-white animate-pulse" />
            <span>Browse Full Company Website →</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs relative z-10">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#18BFFF]" />
              <span>Official Email</span>
            </span>
            <p className="font-bold text-slate-100 truncate">wonderlightadventure@gmail.com</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#18BFFF]" />
              <span>Shift & Operating Hours</span>
            </span>
            <p className="font-bold text-slate-100">09:00 AM - 06:00 PM (IST)</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#18BFFF]" />
              <span>Corporate HQ Location</span>
            </span>
            <p className="font-bold text-slate-100">Mumbai & Leh Expedition Base</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Verification</span>
            </span>
            <p className="font-bold text-emerald-300">Active Real Gmail Dispatch</p>
          </div>
        </div>
      </div>
    </div>
  );
};
