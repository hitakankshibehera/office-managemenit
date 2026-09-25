import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Calendar,
  Mail,
  X,
  Send,
  Sparkles,
  Bell,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const {
    announcements,
    userRole,
    createAnnouncement,
    openEmailModal,
    emails,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General' as Announcement['category'],
    targetDepartment: 'All',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    createAnnouncement({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      targetDepartment: formData.targetDepartment,
    });

    setShowCreateModal(false);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      targetDepartment: 'All',
    });
  };

  const getCategoryBadge = (category: Announcement['category']) => {
    switch (category) {
      case 'Holiday':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Holiday</span>;
      case 'Emergency':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Emergency</span>;
      case 'Event':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Event</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">Company Notice</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Announcements & Bulletins</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Official company wide broadcasts dispatched to all team member inboxes.
          </p>
        </div>

        {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-cyan-500/30 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {getCategoryBadge(ann.category)}
                <h3 className="text-lg font-bold text-[#071A2F]">{ann.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={13} />
                <span>{ann.date}</span>
                <span>·</span>
                <span>By {ann.authorName}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
              {ann.content}
            </p>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">
                Audience: <strong>{ann.targetDepartment === 'All' ? 'All Employees' : `${ann.targetDepartment} Department`}</strong>
              </span>

              {/* View Email dispatched */}
              <button
                onClick={() => {
                  const matchingEmail = emails.find((e) => e.type === 'ANNOUNCEMENT') || emails[1];
                  if (matchingEmail) openEmailModal(matchingEmail);
                }}
                className="text-xs font-semibold text-[#168BFF] hover:underline flex items-center gap-1"
              >
                <Mail size={14} />
                <span>View Dispatched Email Preview</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#071A2F]">Broadcast Announcement</h2>
                <span className="text-xs text-slate-400">
                  Sends notice email via wonderlightadventure@gmail.com
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Office Holiday Notice - Gandhi Jayanti"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="General">General</option>
                    <option value="Holiday">Company Holiday</option>
                    <option value="Event">Event</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Department
                  </label>
                  <select
                    value={formData.targetDepartment}
                    onChange={(e) => setFormData({ ...formData, targetDepartment: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  >
                    <option value="All">All Departments</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Draft your corporate notice..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                <Mail size={16} className="text-[#168BFF] shrink-0" />
                <span>
                  Dispatched to all employee inboxes automatically with company branding.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
