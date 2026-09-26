import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle, Send, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface OtpVerificationViewProps {
  mode: 'LOGIN' | 'SIGNUP';
  email: string;
  onSuccess?: () => void;
  onBack: () => void;
}

export const OtpVerificationView: React.FC<OtpVerificationViewProps> = ({
  mode,
  email,
  onSuccess,
  onBack,
}) => {
  const {
    verifyLoginOtp,
    verifyRegisterOtp,
    resendOtp,
    latestGeneratedOtp,
    setActiveView,
  } = useApp();

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (05:00)
  const [cooldown, setCooldown] = useState<number>(60); // 60s cooldown for resend
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [signupVerifiedSuccess, setSignupVerifiedSuccess] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // 5-minute code expiration timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setErrorMessage('This verification code has expired. Please request a new code.');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 60-second resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [cooldown]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next input box
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Automatically submit when all 4 digits are entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 4) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const chars = pastedData.split('');
      setDigits(chars);
      inputRefs[3].current?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 4) {
      setErrorMessage('Please enter all 4 digits of the verification code.');
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage('This verification code has expired. Please request a new code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      let result;
      if (mode === 'LOGIN') {
        result = await verifyLoginOtp(email, code);
      } else {
        result = await verifyRegisterOtp(email, code);
      }

      if (result.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#168BFF', '#18BFFF', '#16C784', '#071A2F'],
        });
        if (mode === 'SIGNUP') {
          setSignupVerifiedSuccess(true);
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(result.message || 'Invalid or expired verification code. Please try again.');
      }
    } catch {
      setErrorMessage('Verification failed. Please check your network and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setResendSuccess(false);
    setErrorMessage(null);
    try {
      const res = await resendOtp(email, mode);
      if (res.success) {
        setTimeLeft(300);
        setCooldown(60); // reset 60s cooldown
        setDigits(['', '', '', '']);
        inputRefs[0].current?.focus();
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsResending(false);
    }
  };

  const fillCode = (code: string) => {
    if (code && code.length === 4) {
      const chars = code.split('');
      setDigits(chars);
      handleVerify(code);
    }
  };

  if (signupVerifiedSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 max-w-md w-full mx-auto text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
          Email Verified · Account Created
        </span>

        <h2 className="text-2xl font-black text-[#071A2F] tracking-tight mt-2">
          Registration Complete!
        </h2>

        <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
          Your account has been officially verified and enrolled in the Wonder Light Adventure workspace.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              setActiveView('employee-dashboard');
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Employee Dashboard →</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 max-w-md w-full mx-auto text-center animate-in fade-in duration-200">
      {/* Mail Icon in circular halo */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-[#168BFF] shadow-xs">
        <Mail size={32} />
      </div>

      <h2 className="text-2xl font-black text-[#071A2F] tracking-tight">
        {mode === 'LOGIN' ? 'Enter Verification Code' : 'Verify Your Email'}
      </h2>

      <p className="text-sm text-slate-500 mt-2 mb-5">
        We sent a 4-digit verification code to:
        <span className="font-semibold text-slate-800 block truncate mt-0.5">{email}</span>
      </p>


      {/* Official Company Direct Email Dispatch Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-[#071A2F] text-white text-left shadow-md border border-slate-700/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#18BFFF] border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <Send size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Dispatched From Official Company Sender:</span>
            </div>
            <div className="text-xs font-mono font-bold text-[#18BFFF] truncate mt-1">
              wonderlightadventure@gmail.com
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Check your inbox at <span className="font-semibold text-white underline underline-offset-2">{email}</span> for your 4-digit code.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Digit Boxes */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-6" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={isVerifying}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-14 h-16 sm:w-16 sm:h-18 text-2xl sm:text-3xl font-extrabold text-center rounded-2xl border-2 transition-all font-mono tabular-nums ${
              digit
                ? 'border-[#168BFF] bg-blue-50/30 text-[#071A2F] ring-2 ring-[#168BFF]/20 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 focus:border-[#168BFF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15'
            } disabled:opacity-50`}
          />
        ))}
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 justify-center text-left animate-in shake duration-200">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Timer & Resend with Cooldown */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-slate-400" />
          <span>Code expires in:</span>
        </span>
        <span className={`font-mono font-bold ${timeLeft <= 60 ? 'text-rose-600' : 'text-slate-800'}`}>
          {formatTime(timeLeft)}
        </span>
        <span>·</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="text-[#168BFF] hover:underline font-semibold disabled:opacity-50 disabled:hover:no-underline cursor-pointer flex items-center gap-1"
        >
          {isResending && <RefreshCw size={12} className="animate-spin" />}
          <span>
            {isResending
              ? 'Sending...'
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend Code'}
          </span>
        </button>
      </div>

      {resendSuccess && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-center gap-1.5 font-medium">
          <CheckCircle2 size={14} />
          <span>New 4-digit code dispatched from wonderlightadventure@gmail.com!</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || digits.join('').length !== 4}
        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-101 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
      >
        {isVerifying ? 'Verifying...' : mode === 'LOGIN' ? 'Verify & Login' : 'Verify & Continue'}
      </button>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Change Email Address</span>
      </button>

      {/* Security notice */}
      <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Official Company Sender: wonderlightadventure@gmail.com</span>
      </div>
    </div>
  );
};
