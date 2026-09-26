import React from 'react';
import {
  Clock,
  CheckCircle2,
  Users,
  Shield,
  BarChart3,
  Calendar,
  ArrowRight,
  Sparkles,
  Mountain,
  Compass,
  Mail,
  Lock,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { MountainIllustration } from '../common/MountainIllustration';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ArrowRight as ArrowIcon } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, isLoggedIn, isAuthenticated, userRole, openAdminPortal } = useApp();

  const isUserAuthenticated = isLoggedIn || isAuthenticated;
  const dashboardTargetView = (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') ? 'admin-dashboard' : 'employee-dashboard';

  return (
    <div className="min-h-screen bg-[#071A2F] text-slate-100 flex flex-col selection:bg-[#18BFFF]/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#071A2F]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="md" />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-300 transition-colors">
              Features
            </a>
            <a href="#attendance" className="hover:text-cyan-300 transition-colors">
              Attendance
            </a>
            <a href="#tasks" className="hover:text-cyan-300 transition-colors">
              Task Engine
            </a>
            <a href="#security" className="hover:text-cyan-300 transition-colors">
              Security
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isUserAuthenticated ? (
              <button
                onClick={() => setActiveView(dashboardTargetView)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveView('login')}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveView('signup')}
                  className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-102"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Mountain Adventure Backdrop */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-8 border-b border-white/10">
        {/* Background glow & subtle mountain vectors */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#18BFFF]/20 via-[#168BFF]/10 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-cyan-300 mb-6 backdrop-blur-md">
              <Compass size={14} className="animate-spin" style={{ animationDuration: '10s' }} />
              <span>Wonder Light Adventure · Enterprise CMS</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Company Management,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18BFFF] via-[#38BDF8] to-white">
                Simplified.
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              People · Work · Growth · Together. Manage your team, track real-time attendance, delegate priority tasks, and scale operations from one powerful workspace.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setActiveView('login')}
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setActiveView('signup')}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all hover:scale-102 cursor-pointer"
              >
                Employee Sign Up
              </button>
            </div>
          </div>

          {/* Interactive Floating Preview Card Showcase */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="bg-[#0B2340] rounded-xl overflow-hidden p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">wonderlight-workspace.internal</span>
                </div>
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
                </span>
              </div>

              {/* Sample Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Total Employees</span>
                  <div className="text-2xl font-black text-white tabular-nums">48</div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Active Workforce</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Present Today</span>
                  <div className="text-2xl font-black text-emerald-400 tabular-nums">41</div>
                  <span className="text-[11px] text-slate-300 mt-1 block">95.4% Rate</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Active Tasks</span>
                  <div className="text-2xl font-black text-cyan-300 tabular-nums">126</div>
                  <span className="text-[11px] text-blue-300 mt-1 block">82 Completed</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-400 block mb-1">Working Time</span>
                  <div className="text-2xl font-black text-white tabular-nums font-mono">06h 42m</div>
                  <span className="text-[11px] text-emerald-300 mt-1 block">Live Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 px-4 sm:px-8 bg-[#071A2F] border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18BFFF]">
              Architected for Performance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
              Everything Your Adventure Team Needs
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered with rock-solid role isolation, strict backend authorization, and instantaneous OTP verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-[#0B2340]/60 border border-white/10 hover:border-cyan-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/20">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Immutable Attendance Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Employees check in and check out with 1 click. Work sessions calculate server-side durations automatically with tamper-proof records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-[#0B2340]/60 border border-white/10 hover:border-cyan-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/20">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Task Delegation & Automatic Email</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Assign tasks with priorities, subtasks, and deadlines. Automatically notifies employees via official email from wonderlightadventure@gmail.com.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-[#0B2340]/60 border border-white/10 hover:border-cyan-500/40 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#18BFFF] flex items-center justify-center text-white mb-5 shadow-lg shadow-blue-500/20">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Role Isolation & Audit Logs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Employees can strictly never access other employees' tasks, profiles, or admin APIs. Every mutation logs an immutable audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 sm:px-8 bg-[#051322] border-t border-white/10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo variant="light" size="sm" />
          <div className="flex items-center gap-6">
            <span>Official Inquiries:</span>
            <a
              href="mailto:wonderlightadventure@gmail.com"
              className="text-cyan-400 hover:underline font-semibold"
            >
              wonderlightadventure@gmail.com
            </a>
          </div>
          <div className="text-slate-500 text-center md:text-right">
            © 2026 Wonder Light Adventure. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
