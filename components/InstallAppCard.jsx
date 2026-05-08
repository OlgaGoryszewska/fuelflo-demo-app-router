'use client';

import { useEffect, useState } from 'react';

export default function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;

    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  });
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <section className="mx-4 mt-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
          Field mode
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Install FuelFlo
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Add the app to your home screen for faster access, offline work, photo
          evidence, and automatic sync when internet returns.
        </p>
      </div>

      {deferredPrompt ? (
        <button type="button" onClick={installApp} className="button-big w-full">
          Install app
        </button>
      ) : isIOS ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Install on iPhone</p>
          <p className="mt-2">
            Open this page in Safari, tap <strong>Share</strong>, then choose{' '}
            <strong>Add to Home Screen</strong>.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Install on Android/Desktop</p>
          <p className="mt-2">
            Open Chrome menu, then choose <strong>Install app</strong> or{' '}
            <strong>Add to Home screen</strong>.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
        <div className="rounded-2xl bg-orange-50 p-3">Offline</div>
        <div className="rounded-2xl bg-orange-50 p-3">Photos</div>
        <div className="rounded-2xl bg-orange-50 p-3">Auto-sync</div>
      </div>
    </section>
  );
}
