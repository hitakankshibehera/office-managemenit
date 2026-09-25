import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Mail,
  Calendar,
  Clock,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopNavbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onMenuClick,
  isSidebarCollapsed,
}) => {
  const {
    userRole,
    currentEmployee,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    emails,
    openEmailModal,
    logout,
    setActiveView,
    activeView,
    liveRealTime,
    liveRealDate,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.read);
  const unreadEmails = emails.filter((e) => !e.isRead);

  // Current formatted date matching screenshot (e.g. "Wed, 24 Sep 2026")
  const formattedDate = "Wed, 24 Sep 2026";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 md:gap-6 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              userRole === 'EMPLOYEE'
                ? 'Search tasks, attendance, documents...'
                : 'Search employees, tasks, departments, logs...'
            }
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right: View Website Button, Date, Notifications, Email Dispatch, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick View Website Button */}
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#071A2F] to-[#168BFF] text-white hover:from-[#0D2B4D] hover:to-[#18BFFF] text-xs font-semibold shadow-sm transition-all cursor-pointer"
          title="Browse Wonder Light Adventure Public Website"
        >
          <Globe size={14} className="text-[#18BFFF] animate-pulse" />
          <span className="hidden md:inline">View Website</span>
        </button>

        {/* Live Real-Time Clock Display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs">
          <Clock size={14} className="text-[#168BFF] animate-pulse" />
          <span className="font-mono tabular-nums text-slate-900 font-extrabold tracking-tight">
            {liveRealTime}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">{liveRealDate}</span>
        </div>

        {/* Email Dispatch Icon (Gmail-style quick preview) */}
        <button
          onClick={() => setActiveView('inbox')}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Email Dispatch Inbox (wonderlightadventure@gmail.com)"
        >
          <Mail size={19} />
          {unreadEmails.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#18BFFF] text-[#071A2F] text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadEmails.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#071A2F]">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#168BFF] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkUrl) setActiveView(notif.linkUrl);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                              !notif.read ? 'bg-[#168BFF]' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {notif.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    onClick={() => {
                      setActiveView('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs font-semibold text-[#168BFF] hover:underline"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-[#168BFF]/30 shrink-0">
              <img
                src={
                  currentEmployee?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={currentEmployee?.fullName || 'User'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] flex items-center justify-center font-bold text-white text-xs">
                {currentEmployee?.fullName?.substring(0, 2) || 'AD'}
              </div>
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#071A2F] leading-tight">
                {currentEmployee?.fullName || (userRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin User')}
              </div>
              <div className="text-[11px] text-[#168BFF] font-medium flex items-center gap-1">
                <span>{userRole === 'EMPLOYEE' ? 'Software Developer' : userRole === 'ADMIN' ? 'Administrator' : 'Super Admin'}</span>
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">
                    {currentEmployee?.fullName || currentUser?.email}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentUser?.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                    {userRole}
                  </span>
                </div>

                <div className="py-1">
                  {userRole === 'EMPLOYEE' && (
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon size={14} className="text-slate-400" />
                      My Profile
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveView('inbox');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Mail size={14} className="text-slate-400" />
                    Simulated Email Inbox
                  </button>

                  <button
                    onClick={() => {
                      setActiveView(userRole === 'EMPLOYEE' ? 'settings' : 'company-settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-slate-400" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
