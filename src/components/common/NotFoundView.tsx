import React from 'react';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotFoundView: React.FC = () => {
  const { setActiveView, isLoggedIn, userRole } = useApp();

  const handleGoHome = () => {
    if (isLoggedIn) {
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('employee-dashboard');
      }
    } else {
      setActiveView('landing');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#0B2340] rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mx-auto mb-6 text-[#168BFF] dark:text-[#18BFFF]">
          <Compass size={44} className="animate-spin-slow" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-[#168BFF] dark:text-[#18BFFF] uppercase tracking-wider">
          404 · Page Not Found
        </span>

        <h1 className="text-3xl font-extrabold text-[#071A2F] dark:text-white mt-3 tracking-tight">
          Lost in the Trails?
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8 leading-relaxed">
          The page or route you are looking for does not exist or has been moved to a new trail location.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-[#168BFF] to-[#18BFFF] text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={15} />
            <span>Go to Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('landing')}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
