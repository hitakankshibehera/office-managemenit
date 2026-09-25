import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Logo } from '../common/Logo';
import { MountainIllustration } from '../common/MountainIllustration';
import { OtpVerificationView } from './OtpVerificationView';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { loginWithEmail, setActiveView, loginWithGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'ENTER_EMAIL' | 'ENTER_OTP'>('ENTER_EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your company email address or employee ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loginWithEmail(email);
    setIsLoading(false);

    if (result.success) {
      if (result.resolvedEmail) {
        setEmail(result.resolvedEmail);
      }
      setStep('ENTER_OTP');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div onClick={() => setActiveView('landing')} className="cursor-pointer">
          <Logo variant="dark" size="md" />
        </div>
        <button
          onClick={() => setActiveView('landing')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2">
          {/* Left Form Column */}
          <div className="p-8 sm:p-12 flex flex-col justify-between">
            {step === 'ENTER_EMAIL' ? (
              <div>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#168BFF] text-xs font-bold mb-4">
                    <Shield size={13} />
                    Secure OTP Authentication
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2F] tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Log in with your verified company email to access your workspace.
                  </p>
                </div>

                <form onSubmit={handleSubmitEmail} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Company Email or Employee ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="text"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        placeholder="e.g. rahul@wonderlightadventure.com or hitakankshib@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                        <span className="font-medium leading-relaxed">{error}</span>
                      </div>
                      {(error.toLowerCase().includes('create an account') || error.toLowerCase().includes('not found')) && (
                        <button
                          type="button"
                          onClick={() => setActiveView('signup')}
                          className="self-start text-[11px] font-bold text-[#168BFF] hover:underline flex items-center gap-1 cursor-pointer ml-5"
                        >
                          <span>Create your employee account now</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-101 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Dispatching...' : 'SEND LOGIN CODE'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Firebase Google Auth Button */}
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    const res = await (window as any).__loginWithGoogle ? (window as any).__loginWithGoogle() : loginWithGoogle();
                    setIsLoading(false);
                    if (!res.success) {
                      setError(res.message);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-medium border border-amber-200">Firebase</span>
                </button>

                <div className="mt-8 text-center text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setActiveView('signup')}
                    className="font-bold text-[#168BFF] hover:underline cursor-pointer"
                  >
                    Employee Sign Up
                  </button>
                </div>
              </div>
            ) : (
              <OtpVerificationView
                mode="LOGIN"
                email={email}
                onBack={() => setStep('ENTER_EMAIL')}
              />
            )}

            <div className="text-[11px] text-slate-400 mt-6 text-center">
              Wonder Light Adventure CMS · wonderlightadventure@gmail.com
            </div>
          </div>

          {/* Right Mountain Graphic Column */}
          <div className="hidden lg:block relative min-h-[520px]">
            <MountainIllustration
              theme="golden-dawn"
              title="Let's Work"
              subtitle="Explore & Grow Together"
            />
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 Wonder Light Adventure. Confidential & Proprietary.
      </footer>
    </div>
  );
};
