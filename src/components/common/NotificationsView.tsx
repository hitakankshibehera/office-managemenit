import React from 'react';
import { Bell, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    setActiveView,
  } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Notifications Center</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Stay updated with real-time alerts for assignments, approvals, and company bulletins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#168BFF] hover:bg-blue-50 transition-colors"
          >
            Mark All as Read
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.linkUrl) setActiveView(notif.linkUrl);
              }}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div
                className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${
                  !notif.read ? 'bg-[#168BFF]' : 'bg-slate-300'
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {notif.createdAt}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {notif.linkUrl && (
                <ArrowRight size={16} className="text-slate-300 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
