'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed left-0 top-0 z-[10000] w-full border-b border-[#fee39f] bg-[#fff7e6] p-2 text-center text-sm font-semibold text-[#9a5f12] shadow-sm"
    >
      You are offline. Field data will save locally and sync when connection returns.
    </div>
  );
}
