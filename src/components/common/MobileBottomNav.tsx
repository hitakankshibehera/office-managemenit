import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Bell,
  User,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, userRole, notifications } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const isEmp = userRole === 'EMPLOYEE';

  const navItems = isEmp
    ? [
        { id: 'employee-dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'leave', label: 'Leave', icon: CalendarDays },
        { id: 'profile', label: 'Profile', icon: User },
      ]
    : [
        { id: 'admin-dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'admin-attendance', label: 'Attendance', icon: Clock },
        { id: 'admin-tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'admin-leave', label: 'Leave', icon: CalendarDays },
        { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
      ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#071A2F]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
              isActive
                ? 'text-[#168BFF] dark:text-[#18BFFF] font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon size={19} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
