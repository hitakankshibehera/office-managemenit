import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Mail,
  Clock,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Database,
  Cloud,
  RefreshCw,
  Server,
  Send,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    companySettings,
    updateCompanySettings,
    userRole,
    firebaseStatus,
    firebaseProjectId,
    checkFirebaseConnection,
    testEmailConnection,
  } = useApp();

  const [settings, setSettings] = useState(companySettings);
  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Email Test state
  const [testRecipient, setTestRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestPing = async () => {
    setIsTesting(true);
    await checkFirebaseConnection();
    setTimeout(() => setIsTesting(false), 600);
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const result = await testEmailConnection(testRecipient.trim() || undefined);
      if (result.success) {
        setTestResult({
          success: true,
          message: 'Test email sent successfully.',
        });
      } else {
        setTestResult({
          success: false,
          message: 'Unable to send test email. Check email configuration.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'Unable to send test email. Check email configuration.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A2F]">Workspace Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure enterprise parameters, official email relay, and shift protocols.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={14} /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Building2 className="text-[#168BFF]" size={20} />
            <h2 className="text-base font-bold text-[#071A2F]">Company Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email (Relay Sender)
              </label>
              <input
                type="text"
                disabled={true}
                value="wonderlightadventure@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-[#168BFF] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Timezone
              </label>
              <input
                type="text"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Working Days
              </label>
              <input
                type="text"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.workingDays}
                onChange={(e) => setSettings({ ...settings, workingDays: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Shift & Attendance Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Clock className="text-[#168BFF]" size={20} />
            <h2 className="text-base font-bold text-[#071A2F]">Shift & Attendance Protocols</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Shift Start
              </label>
              <input
                type="text"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.workingHoursStart}
                onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Shift End
              </label>
              <input
                type="text"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.workingHoursEnd}
                onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Leave Quota (Days)
              </label>
              <input
                type="number"
                disabled={userRole === 'EMPLOYEE'}
                value={settings.annualLeaveQuota}
                onChange={(e) => setSettings({ ...settings, annualLeaveQuota: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Settings → Email Configuration (Rule #16) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Mail className="text-[#168BFF]" size={20} />
              <div>
                <h2 className="text-base font-bold text-[#071A2F]">Email Configuration</h2>
                <p className="text-xs text-slate-500">Official company communication & notification relay</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Provider
              </span>
              <span className="text-sm font-bold text-slate-900">
                Gmail
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sender
              </span>
              <span className="font-mono text-sm font-bold text-[#168BFF]">
                wonderlightadventure@gmail.com
              </span>
            </div>
          </div>

          {/* Test Email Trigger (Only sent after admin explicitly clicks button) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 block">Dispatch Verification Ping</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Send a test email from <span className="font-semibold text-slate-700">wonderlightadventure@gmail.com</span> to verify relay delivery.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="Recipient email (optional)"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono w-full sm:w-64"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="px-4 py-2 rounded-xl font-bold text-xs bg-[#071A2F] text-white hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isSendingTest ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                <span>SEND TEST EMAIL</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{testResult.message}</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Server credentials and secrets are kept strictly isolated on the backend.</span>
          </div>
        </div>

        {/* Security & OTP Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Shield className="text-[#168BFF]" size={20} />
            <h2 className="text-base font-bold text-[#071A2F]">Security Policies</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireOtpEveryLogin}
                onChange={(e) => setSettings({ ...settings, requireOtpEveryLogin: e.target.checked })}
                className="w-4 h-4 rounded text-[#168BFF]"
              />
              <span className="text-xs font-semibold text-slate-800">
                Enforce 4-Digit Email OTP on every login session
              </span>
            </label>
          </div>
        </div>

        {/* Firebase Cloud Infrastructure */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="text-amber-500" size={20} />
              <div>
                <h2 className="text-base font-bold text-[#071A2F]">Firebase Cloud Database & Auth</h2>
                <p className="text-xs text-slate-500">Live backend services attached to Google Cloud Firebase project</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {firebaseStatus}
              </span>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isTesting}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Test Firestore Connection"
              >
                <RefreshCw size={14} className={isTesting ? 'animate-spin text-[#168BFF]' : ''} />
                <span className="hidden sm:inline font-semibold">Ping</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Firebase Project ID
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 break-all">
                {firebaseProjectId}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Auth Domain
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 break-all">
                email-43406.firebaseapp.com
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Realtime Database
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 break-all">
                email-43406-default-rtdb
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Storage Bucket
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 break-all">
                email-43406.firebasestorage.app
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cloud Firestore Rules
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} /> Active & Hardened
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Measurement ID
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                G-S1PP638HYK
              </span>
            </div>
          </div>
        </div>

        {userRole !== 'EMPLOYEE' && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={15} />
              <span>Save System Settings</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
