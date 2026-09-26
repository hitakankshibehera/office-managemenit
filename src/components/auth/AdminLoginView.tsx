import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';

export const AdminLoginView: React.FC = () => {
  const { setActiveView, switchDemoUser, loginWithEmail } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setError('Please enter your Admin Email ID.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter the Admin Portal password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Verify Admin Email & Password
    const isValidAdminEmail =
      cleanEmail === 'wonderlightadenture@gmail.com' ||
      cleanEmail === 'wonderlightadventure@gmail.com' ||
      cleanEmail === 'admin@wonderlightadventure.com' ||
      cleanEmail === 'priya@wonderlightadventure.com';

    const isValidAdminPassword =
      cleanPass === 'Wonderlight@2024' ||
      cleanPass === 'Wonderlight@2026' ||
      cleanPass === 'wonderlight@2024' ||
      cleanPass === 'wonderlight@2026' ||
      cleanPass === 'Wonderlight2024' ||
      cleanPass === 'Wonderlight2026' ||
      cleanPass === 'wonderlight';

    if (isValidAdminEmail && isValidAdminPassword) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#168BFF', '#18BFFF', '#F59E0B', '#071A2F'],
      });
      setIsLoading(false);
      switchDemoUser('SUPER_ADMIN');
    } else if (!isValidAdminEmail) {
      setIsLoading(false);
      setError('Invalid Admin Portal ID.');
    } else {
      setIsLoading(false);
      setError('Incorrect Admin Password. Please check and try again.');
    }
  };

  const handleRequestOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your Admin Email.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const res = await loginWithEmail(email);
    setIsLoading(false);
    if (res.success) {
      setActiveView('login');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2F] text-slate-100 flex flex-col justify-between selection:bg-[#18BFFF]/30">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div onClick={() => setActiveView('landing')} className="cursor-pointer">
          <Logo variant="light" size="md" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <ShieldCheck size={14} />
          <span>Restricted HR / MD Portal (/admin)</span>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-[#0D2B4D]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto font-black shadow-lg shadow-amber-500/20">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">HR / MD Portal Sign In</h1>
            <p className="text-xs text-slate-300">
              Authorized Management Portal Access · URL: <code className="text-[#18BFFF] font-mono">/admin</code>
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('PASSWORD');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMode === 'PASSWORD'
                  ? 'bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('OTP');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMode === 'OTP'
                  ? 'bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gmail 4-Digit OTP
            </button>
          </div>

          {loginMode === 'PASSWORD' ? (
            <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  HR / MD Portal ID / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter HR / MD Portal ID or Email"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#18BFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  HR / MD Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter HR / MD Password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40 focus:border-[#18BFFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Log In to Admin Portal</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Admin Email Address"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18BFFF]/40"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2">
                  <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#168BFF] to-[#18BFFF] hover:from-[#18BFFF] hover:to-[#0066CC] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send 4-Digit Gmail OTP</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/10">
        © 2026 Wonder Light Adventure · Admin Management Portal
      </footer>
    </div>
  );
};
