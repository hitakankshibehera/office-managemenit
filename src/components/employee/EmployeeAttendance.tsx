import React, { useState } from 'react';
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Filter,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const EmployeeAttendance: React.FC = () => {
  const {
    currentEmployee,
    isWorkingNow,
    workingTimerText,
    checkIn,
    checkOut,
    attendanceRecords,
    liveRealTime,
    liveRealDate,
    lastCalculatedWorkTime,
  } = useApp();

  // Strict employee data isolation
  const myAttendance = attendanceRecords.filter((r) => r.employeeId === currentEmployee?.id);

  // Dynamic Live Date Calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const todayDayNumber = now.getDate();
  const todayDateString = now.toISOString().split('T')[0];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [currentDateObj, setCurrentDateObj] = useState(new Date());

  const displayedYear = currentDateObj.getFullYear();
  const displayedMonthIndex = currentDateObj.getMonth();
  const displayedMonthName = `${monthNames[displayedMonthIndex]} ${displayedYear}`;

  const firstDayOfWeek = new Date(displayedYear, displayedMonthIndex, 1).getDay();
  const totalDaysInDisplayedMonth = new Date(displayedYear, displayedMonthIndex + 1, 0).getDate();
  const daysArray = Array.from({ length: totalDaysInDisplayedMonth }, (_, i) => i + 1);
  const emptyOffsetArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const isCurrentViewMonth =
    displayedYear === currentYear && displayedMonthIndex === currentMonthIndex;

  const isShiftLockedToday =
    currentEmployee?.shiftCompletedToday &&
    currentEmployee?.lastShiftDate === todayDateString &&
    !currentEmployee?.allowReCheckInToday;

  const handlePrevMonth = () => {
    setCurrentDateObj((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDateObj((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time biometric check-in log and certified shift summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            <Clock size={14} className="text-[#168BFF] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">REAL TIME:</span>
            <span className="font-mono tabular-nums text-slate-900 font-extrabold">{liveRealTime}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">{liveRealDate}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Immutable Server Records</span>
          </div>
        </div>
      </div>

      {/* Top 2 Cards: Mini Calendar & Today's Attendance Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900">{displayedMonthName}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mt-4 mb-2">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {emptyOffsetArray.map((_, idx) => (
              <div key={`offset-${idx}`} className="p-2" />
            ))}

            {daysArray.map((day) => {
              const isToday = isCurrentViewMonth && day === todayDayNumber;
              const dayOfWeek = new Date(displayedYear, displayedMonthIndex, day).getDay();
              const isPastPresent =
                isCurrentViewMonth && day <= todayDayNumber && dayOfWeek !== 0 && dayOfWeek !== 6;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl font-medium transition-all ${
                    isToday
                      ? 'bg-[#168BFF] text-white font-bold shadow-md shadow-blue-500/25 ring-2 ring-blue-300'
                      : isPastPresent
                      ? 'bg-blue-50/60 text-blue-900 font-semibold hover:bg-blue-100/60'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#168BFF]" />
              <span>Today ({todayDayNumber}{getOrdinalSuffix(todayDayNumber)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-300" />
              <span>Present</span>
            </div>
          </div>
        </div>

        {/* Today's Attendance Punch Box (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#071A2F]">Today's Attendance</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
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
                    ? 'Active Shift (Timer Running)'
                    : isShiftLockedToday
                    ? 'Shift Completed (Locked)'
                    : 'Shift Completed'}
                </span>
              </span>
            </div>

            {/* Real-Time Clock Bar */}
            <div className="flex items-center justify-between mt-4 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock size={13} className="text-[#168BFF]" />
                <span className="font-semibold text-slate-600">Top Real Time:</span>
              </span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {liveRealTime}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Check In</span>
                <span className="text-lg font-extrabold text-[#071A2F] mt-1 block tabular-nums">
                  {currentEmployee?.todayCheckIn || '--:--:--'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Check Out</span>
                <span className="text-lg font-extrabold text-[#071A2F] mt-1 block tabular-nums">
                  {currentEmployee?.todayCheckOut || (isWorkingNow ? 'Active' : '--:--:--')}
                </span>
              </div>
            </div>

            {/* Large Active Working Time Widget */}
            <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Active Working Time
              </span>
              <span className="text-4xl font-black text-[#071A2F] font-mono tabular-nums block mt-1 tracking-tight">
                {workingTimerText}
              </span>
              <span className="text-xs text-slate-500 block mt-2 font-medium">
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
                  Checked in at {lastCalculatedWorkTime?.checkIn || currentEmployee?.todayCheckIn || '09:12:00 AM'} and checked out at {lastCalculatedWorkTime?.checkOut || currentEmployee?.todayCheckOut || '03:54:18 PM'}. Shift duration calculated and recorded.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isWorkingNow ? (
              <button
                onClick={checkOut}
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square size={15} className="fill-current" />
                <span>Check Out (Calculate Work Time)</span>
              </button>
            ) : isShiftLockedToday ? (
              <div className="w-full space-y-2">
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2.5">
                  <Lock size={16} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Shift Completed & Locked for Today</span>
                    <span className="text-[11px] text-amber-700">You checked in & checked out today. Contact HR / MD to reactivate check-in.</span>
                  </div>
                </div>
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>Check In Locked (Shift Finished for Today)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={checkIn}
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#168BFF] hover:bg-[#1270cc] text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={15} className="fill-current" />
                <span>Check In (Start Countdown / Timer)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Table (Screen 13 lower half) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#071A2F]">Attendance History</h2>
          <span className="text-xs text-slate-400">All shifts are verified server-side</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold text-xs">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Working Hours</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 tabular-nums">
                    {record.date}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700">
                    {record.checkIn}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-700">
                    {record.checkOut || '--'}
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-900 tabular-nums">
                    {record.status === 'Working' ? workingTimerText : record.workingHoursText}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        record.status === 'Working'
                          ? 'bg-blue-50 text-[#168BFF]'
                          : record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {record.status}
                    </span>
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
