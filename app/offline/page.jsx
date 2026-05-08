'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { RefreshCcw, WifiOff } from 'lucide-react';

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
    <main className="mx-auto flex min-h-screen w-full max-w-[640px] items-center px-3 py-8">
      <Script id="fuelflo-offline-recover" strategy="beforeInteractive">
        {`
          window.addEventListener('online', function () {
            window.location.replace('/');
          });
        `}
      </Script>

      <section className="w-full rounded-[28px] border border-[#fee39f] bg-gradient-to-br from-white via-[#fff8ea] to-[#fee39f] p-5 text-center shadow-[0_12px_30px_rgba(98,116,142,0.16)]">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-[#f25822] ring-1 ring-white">
          <WifiOff size={27} strokeWidth={2.4} />
        </span>

        <p className="page-kicker">Offline mode</p>
        <h2 className="mt-2">Connection lost</h2>

        <p className="steps-text mx-auto mt-2 max-w-sm">
          This page was not saved on this device yet. Saved projects and field
          transactions still work offline and will sync when connection returns.
        </p>

        <div
          className={`mx-auto mt-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            isOnline
              ? 'border-[#d7edce] bg-[#f3fbef] text-[#2f8f5b]'
              : 'border-[#fee39f] bg-white/70 text-[#9a5f12]'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="button-big mt-5 gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isOnline}
        >
          <RefreshCcw size={18} strokeWidth={2.3} />
          Try again
        </button>
      </section>
    </main>
  );
}
