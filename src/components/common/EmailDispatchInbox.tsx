import React, { useState } from 'react';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  Plus,
  ShieldCheck,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulatedEmail } from '../../types';

export const EmailDispatchInbox: React.FC = () => {
  const { emails, openEmailModal, sendEmail } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showCompose, setShowCompose] = useState(false);

  const [composeData, setComposeData] = useState({
    to: 'rahul@wonderlightadventure.com',
    toName: 'Rahul Kumar',
    subject: 'Wonder Light Adventure - Operational Update',
    bodyText: 'Please review the updated expedition protocols for the upcoming weekend trek.',
  });

  const filteredEmails = emails.filter((em) => {
    const matchesSearch =
      em.subject.toLowerCase().includes(search.toLowerCase()) ||
      em.to.toLowerCase().includes(search.toLowerCase()) ||
      em.toName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || em.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmail({
      to: composeData.to,
      toName: composeData.toName,
      subject: composeData.subject,
      htmlContent: `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background: #071A2F; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Wonder Light Adventure</h2>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Company Management System</p>
          </div>
          <div style="padding: 24px;">
            <p style="color: #071A2F; font-size: 15px; font-weight: bold;">Hello ${composeData.toName},</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">${composeData.bodyText}</p>
          </div>
          <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            Sent securely via wonderlightadventure@gmail.com
          </div>
        </div>
      `,
      type: 'ANNOUNCEMENT',
    });

    setShowCompose(false);
  };

  const getTypeBadge = (type: SimulatedEmail['type']) => {
    switch (type) {
      case 'OTP':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">OTP Auth</span>;
      case 'TASK':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">Task Alert</span>;
      case 'ANNOUNCEMENT':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700">Announcement</span>;
      case 'LEAVE':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">Leave Update</span>;
      default:
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">System</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#071A2F]">Official Email Dispatch</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              SMTP Simulator
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Sender account: <strong className="text-slate-800">wonderlightadventure@gmail.com</strong>
          </p>
        </div>

        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Dispatch Test Email</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email subject, recipient..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'TASK', 'ANNOUNCEMENT', 'OTP', 'LEAVE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === tab
                  ? 'bg-[#168BFF] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Mails' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Email Inbox Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => openEmailModal(email)}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#168BFF] shrink-0">
                  <Mail size={18} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(email.type)}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#168BFF] transition-colors truncate">
                      {email.subject}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 truncate">
                    To: <strong className="text-slate-700">{email.toName}</strong> &lt;{email.to}&gt;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end text-xs text-slate-400 pl-12 sm:pl-0">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Clock size={12} />
                  <span>{email.timestamp}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEmailModal(email);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#168BFF] group-hover:text-white text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <Eye size={13} />
                  <span>Open Preview</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-[#071A2F] mb-1">Dispatch Test Email</h2>
            <p className="text-xs text-slate-500 mb-4">
              Dispatches from: <strong>wonderlightadventure@gmail.com</strong>
            </p>

            <form onSubmit={handleSendCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">To Email</label>
                <input
                  type="email"
                  required
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={composeData.toName}
                  onChange={(e) => setComposeData({ ...composeData, toName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  value={composeData.bodyText}
                  onChange={(e) => setComposeData({ ...composeData, bodyText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
