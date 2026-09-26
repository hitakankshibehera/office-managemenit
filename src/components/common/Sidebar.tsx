import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  User,
  CalendarDays,
  Bell,
  HelpCircle,
  Settings,
  Users,
  FileBarChart,
  Megaphone,
  Building2,
  ShieldAlert,
  LogOut,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const {
    userRole,
    activeView,
    setActiveView,
    currentEmployee,
    currentUser,
    logout,
    notifications,
    tasks,
    leaves,
    groups,
    emails,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
  const myPendingTasks = tasks.filter(
    (t) => t.assignedToId === currentEmployee?.id && t.status !== 'COMPLETED'
  ).length;
  const myGroupCount = groups.filter(
    (g) => userRole !== 'EMPLOYEE' || (currentEmployee && g.memberIds.includes(currentEmployee.id))
  ).length;

  const employeeNavItems = [
    { id: 'employee-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'landing', label: 'Company Website', icon: Globe },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: myPendingTasks > 0 ? myPendingTasks : undefined },
    { id: 'groups', label: 'Employee Groups', icon: Users, badge: myGroupCount > 0 ? myGroupCount : undefined },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'leave', label: 'Leave Request', icon: CalendarDays },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'inbox', label: 'Email Dispatch', icon: Mail, badge: emails.filter((e) => !e.isRead).length },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'landing', label: 'Company Website', icon: Globe },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'groups', label: 'Employee Groups', icon: Users, badge: groups.length > 0 ? groups.length : undefined },
    { id: 'admin-tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'admin-attendance', label: 'Attendance', icon: Clock },
    { id: 'admin-leave', label: 'Leave Management', icon: CalendarDays, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'inbox', label: 'Email Dispatch', icon: Mail, badge: emails.filter((e) => !e.isRead).length },
    { id: 'company-settings', label: 'Settings', icon: Settings },
    { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const isEmployeeRole = userRole === 'EMPLOYEE' || Boolean(currentEmployee);
  const navItems = isEmployeeRole ? employeeNavItems : adminNavItems;

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#071A2F] text-slate-300 border-r border-[#0B2340] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[78px]' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-white/5 shrink-0">
          <div
            onClick={() => handleNavClick(isEmployeeRole ? 'employee-dashboard' : 'admin-dashboard')}
            className="cursor-pointer overflow-hidden py-1"
          >
            <Logo
              variant="light"
              size={isCollapsed ? 'sm' : 'md'}
              showSubtitle={!isCollapsed}
            />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role Mode Banner */}
        <div className="px-3 pt-3 pb-1">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              isEmployeeRole
                ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
          >
            <Sparkles size={14} className="shrink-0" />
            {!isCollapsed && (
              <span className="truncate">
                {isEmployeeRole
                  ? 'EMPLOYEE PORTAL'
                  : userRole === 'SUPER_ADMIN'
                  ? 'SUPER ADMIN PORTAL'
                  : 'ADMIN PORTAL'}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {/* Badge indicator */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : 'bg-[#18BFFF] text-[#071A2F]'
                    } ${isCollapsed ? 'absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-white/5 bg-[#071A2F] shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 ring-2 ring-blue-500/40">
                <img
                  src={
                    currentEmployee?.profileImage ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={currentEmployee?.fullName || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to initials
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] flex items-center justify-center font-bold text-white text-xs">
                  {currentEmployee?.fullName?.substring(0, 2) || 'AD'}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071A2F]" />
            </div>

            {/* Info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate leading-tight">
                  {currentEmployee?.fullName || (userRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin User')}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentEmployee ? currentEmployee.employeeCode : 'wonderlightadventure@gmail.com'}
                </div>
              </div>
            )}

            {/* Logout button */}
            {!isCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
