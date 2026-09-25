import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportView: React.FC = () => {
  const { currentEmployee, sendEmail } = useApp();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does daily biometric check-in work?',
      a: 'Click the "Check In" button upon beginning your workday. Your working timer calculates automatically in real-time. Click "Check Out" at the conclusion of your shift.',
    },
    {
      q: 'What should I do if I did not receive my 4-digit OTP?',
      a: 'Verification codes are dispatched to your company email from wonderlightadventure@gmail.com. Please check your Inbox / Spam folder, or click "Resend OTP" after the 5-minute countdown.',
    },
    {
      q: 'How are task notifications sent?',
      a: 'Whenever an administrator or department lead assigns a new task or modifies milestone deadlines, an automated notification email is sent to your registered address with complete specifications.',
    },
    {
      q: 'Can I edit my attendance after checkout?',
      a: 'No. Attendance records are cryptographically stored on the server to preserve audit integrity. If you encountered an anomaly, raise an internal ticket with HR.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    sendEmail({
      to: 'wonderlightadventure@gmail.com',
      toName: 'HR & IT Support Desk',
      subject: `[Support Ticket] ${ticketSubject}`,
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h3>New Employee Help Desk Request</h3>
          <p><strong>From:</strong> ${currentEmployee?.fullName || 'Employee'} (${currentEmployee?.email})</p>
          <p><strong>Subject:</strong> ${ticketSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${ticketMessage}</p>
        </div>
      `,
      type: 'ANNOUNCEMENT',
    });

    setSubmitted(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-[#071A2F]">Help & Support Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Need assistance with your workspace, attendance logs, or credentials? We're here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-[#071A2F] mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
              >
                <summary className="font-semibold text-xs sm:text-sm text-slate-800 flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed pt-2 border-t border-slate-200/60">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Submit Ticket Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#071A2F] mb-1">
              Contact Operations Desk
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Direct inquiry to: <strong className="text-slate-700">wonderlightadventure@gmail.com</strong>
            </p>

            {submitted && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Ticket submitted successfully! Support will reply shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Attendance timestamp adjustment"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Detail your request..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                <span>Send to IT Desk</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
