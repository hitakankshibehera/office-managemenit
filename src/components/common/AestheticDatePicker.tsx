import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

interface AestheticDatePickerProps {
  value: string; // Expected format: YYYY-MM-DD or empty
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export const AestheticDatePicker: React.FC<AestheticDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'dd-mm-yyyy',
  label,
  required = false,
  min,
  max,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current selected date or fallback to current date for view
  const parseDateStr = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const selectedDate = value ? parseDateStr(value) : null;
  const [viewDate, setViewDate] = useState<Date>(selectedDate || new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format YYYY-MM-DD
  const formatDateToIso = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format for display: e.g. "26 Sep 2026" or "dd-mm-yyyy"
  const getFormattedDisplay = () => {
    if (!value || !selectedDate) return null;
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const monthName = selectedDate.toLocaleDateString('en-US', { month: 'short' });
    const year = selectedDate.getFullYear();
    const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      dateText: `${day} ${monthName} ${year}`,
      weekday,
      rawDdMmYyyy: `${day}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${year}`,
    };
  };

  const displayObj = getFormattedDisplay();

  // Navigation handlers
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (dayNum: number) => {
    const newD = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
    const iso = formatDateToIso(newD);
    onChange(iso);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    setViewDate(today);
    onChange(formatDateToIso(today));
    setIsOpen(false);
  };

  const handleSelectTomorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setViewDate(tomorrow);
    onChange(formatDateToIso(tomorrow));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Calendar math
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

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

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Generate calendar grid array
  const calendarCells = [];
  // Prev month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i),
    });
  }
  // Next month padding to fill 35 or 42 cells
  const totalSoFar = calendarCells.length;
  const targetTotal = totalSoFar > 35 ? 42 : 35;
  for (let i = 1; i <= targetTotal - totalSoFar; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i),
    });
  }

  const todayIso = formatDateToIso(new Date());

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm cursor-pointer transition-all duration-200 select-none ${
          isOpen
            ? 'border-[#168BFF] ring-2 ring-[#18BFFF]/25 bg-white shadow-md'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className={`w-4 h-4 shrink-0 transition-colors ${value ? 'text-[#168BFF]' : 'text-slate-400'}`} />
          {displayObj ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-900">{displayObj.dateText}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-50 text-[#0066CC] border border-cyan-100 font-mono">
                {displayObj.weekday}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 font-normal tracking-wide">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="w-2 h-2 rounded-full bg-[#18BFFF] animate-pulse" />
        </div>
      </div>

      {/* Hidden input for HTML form compatibility */}
      <input type="hidden" value={value} required={required} />

      {/* Aesthetic Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Header: Month & Year Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-slate-900 text-sm">
                {monthNames[currentMonth]}
              </span>
              <select
                value={currentYear}
                onChange={(e) => setViewDate(new Date(parseInt(e.target.value, 10), currentMonth, 1))}
                className="font-bold text-slate-700 text-sm bg-transparent border-none focus:outline-none cursor-pointer hover:text-[#168BFF]"
              >
                {Array.from({ length: 10 }, (_, i) => 2024 + i).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 border-b border-slate-100/60">
            {daysOfWeek.map((d) => (
              <span key={d} className="text-[11px] font-extrabold text-[#168BFF] uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {calendarCells.map((cell, idx) => {
              const cellIso = formatDateToIso(cell.date);
              const isSelected = value === cellIso;
              const isToday = cellIso === todayIso;

              const isBeforeMin = min ? cellIso < min : false;
              const isAfterMax = max ? cellIso > max : false;
              const isDisabled = !cell.isCurrentMonth || isBeforeMin || isAfterMax;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !isDisabled && handleSelectDay(cell.day)}
                  disabled={isDisabled}
                  className={`h-9 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition-all duration-150 relative ${
                    isDisabled
                      ? 'text-slate-300 opacity-40 pointer-events-none bg-slate-50/50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-gradient-to-tr from-[#071A2F] via-[#0D2B4D] to-[#168BFF] text-white font-black shadow-md scale-105 cursor-pointer'
                      : isToday
                      ? 'bg-cyan-50 text-[#168BFF] font-bold border border-[#18BFFF]/40 hover:bg-[#18BFFF]/20 cursor-pointer'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#168BFF] cursor-pointer'
                  }`}
                >
                  {cell.day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#168BFF]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Shortcuts */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              disabled={Boolean(min && todayIso < min)}
              onClick={handleSelectToday}
              className="text-[#168BFF] font-bold hover:underline disabled:opacity-30 disabled:no-underline px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleSelectTomorrow}
              className="text-[#168BFF] font-bold hover:underline px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
            >
              Tomorrow
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
