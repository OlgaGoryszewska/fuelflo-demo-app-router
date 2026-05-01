'use client';

import { useEffect, useState } from 'react';

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      console.log('User installed app');
    }

    setDeferredPrompt(null);
  }

  if (isInstalled) return null;

  return (
    <div className="mx-4 mt-4 rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Install FuelFlo App</h3>

      {deferredPrompt ? (
        <button
          onClick={handleInstall}
          className="button-big w-full"
        >
          Install App
        </button>
      ) : (
        <p className="text-sm text-gray-600">
          If you don’t see install option:
          <br />
          • Android: use Chrome menu → Install App
          <br />
          • iPhone: Share → Add to Home Screen
        </p>
      )}
    </div>
  );
}