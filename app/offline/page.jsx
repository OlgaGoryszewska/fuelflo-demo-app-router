'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      window.location.href = '/';
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md rounded-2xl bg-white p-6 text-center shadow">
        <h1 className="text-2xl font-semibold text-slate-900">
          You are offline
        </h1>

        <p className="mt-3 text-slate-600">
          This page was not saved yet. Connect to the internet and try again.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Status: {isOnline ? 'Online' : 'Offline'}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={!isOnline}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
