import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-600 text-white px-4 py-2.5 shadow-lg flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <WifiOff size={16} className="animate-pulse" />
          <span>You are currently offline. Check your internet connection.</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-amber-700 hover:bg-amber-800 rounded-lg text-white font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
};
