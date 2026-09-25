import React from 'react';
import { X, Mail, CheckCircle2, ArrowLeft, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmailPreviewModal: React.FC = () => {
  const { activeEmailModal, closeEmailModal, setActiveView } = useApp();

  if (!activeEmailModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Email Header Bar (Simulating Gmail / Mail Client) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <Mail size={16} />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>Official Email Dispatch</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SMTP Verified
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Sender: <strong className="text-white">wonderlightadventure@gmail.com</strong>
              </div>
            </div>
          </div>

          <button
            onClick={closeEmailModal}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Subject & Metadata */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-base sm:text-lg font-bold text-[#071A2F] mb-2 leading-snug">
            {activeEmailModal.subject}
          </h2>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="text-slate-400">To:</span>{' '}
              <span className="font-medium text-slate-800">{activeEmailModal.toName}</span>{' '}
              <span className="text-slate-400">({activeEmailModal.to})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <Clock size={12} className="text-slate-400" />
              <span>{activeEmailModal.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Email HTML Body content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <div
            className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-2 sm:p-6"
            dangerouslySetInnerHTML={{ __html: activeEmailModal.htmlContent }}
          />
        </div>

        {/* Footer controls */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
            <ShieldCheck size={14} />
            <span>Authenticated via wonderlightadventure@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            {activeEmailModal.type === 'TASK' && (
              <button
                onClick={() => {
                  closeEmailModal();
                  setActiveView('tasks');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#168BFF] text-white font-semibold text-xs hover:bg-[#1270cc] transition-colors"
              >
                Go to Tasks
              </button>
            )}
            <button
              onClick={closeEmailModal}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
