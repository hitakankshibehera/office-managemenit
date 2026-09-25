import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { MountainIllustration } from '../common/MountainIllustration';
import { OtpVerificationView } from './OtpVerificationView';
import { useApp } from '../../context/AppContext';

export const SignUpView: React.FC = () => {
  const { registerEmployee, departments, setActiveView } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: departments[0]?.id || 'dept-1',
    designation: '',
    agreed: false,
  });

  const [step, setStep] = useState<'FILL_FORM' | 'ENTER_OTP'>('FILL_FORM');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.designation.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!formData.agreed) {
      setError('You must agree to the company policy to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await registerEmployee({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || '+91 98765 00000',
      departmentId: formData.departmentId,
      designation: formData.designation,
    });

    setIsLoading(false);

    if (result.success) {
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
          <div className="p-8 sm:p-10 flex flex-col justify-between">
            {step === 'FILL_FORM' ? (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#168BFF] uppercase tracking-wider block">
                    Join Wonder Light Adventure Team
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2F] tracking-tight mt-1">
                    Create Your Account
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your company details to initiate your workspace access.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Company Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@wonderlightadventure.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Department & Designation in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 size={16} />
                        </div>
                        <select
                          value={formData.departmentId}
                          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white"
                        >
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Briefcase size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          placeholder="e.g. Software Developer"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#168BFF]/20 focus:border-[#168BFF] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Policy Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                        className="mt-0.5 rounded text-[#168BFF] focus:ring-[#168BFF] w-4 h-4"
                      />
                      <span className="text-xs text-slate-600 leading-tight">
                        I agree to Wonder Light Adventure company policy, privacy protocol, and attendance guidelines.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-101 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Dispatching Verification...' : 'SEND VERIFICATION CODE'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveView('login')}
                    className="font-bold text-[#168BFF] hover:underline"
                  >
                    Login
                  </button>
                </div>
              </div>
            ) : (
              <OtpVerificationView
                mode="SIGNUP"
                email={formData.email}
                onBack={() => setStep('FILL_FORM')}
              />
            )}

            <div className="text-[11px] text-slate-400 mt-4 text-center">
              Wonder Light Adventure CMS · wonderlightadventure@gmail.com
            </div>
          </div>

          {/* Right Mountain Graphic Column */}
          <div className="hidden lg:block relative min-h-[560px]">
            <MountainIllustration
              theme="golden-dawn"
              title="A Great Team"
              subtitle="Creates Extraordinary Journeys"
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
