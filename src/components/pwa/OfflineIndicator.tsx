import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/95 border border-emerald-400 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-sm animate-fade-in">
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Connected back online</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2.5 rounded-xl bg-[#C94A4A] border border-red-300/40 px-3.5 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-sm">
      <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
      <span>Offline Mode — Cached ministry data is active</span>
    </div>
  );
};
