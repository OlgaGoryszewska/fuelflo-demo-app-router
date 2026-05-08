// components/ServiceWorkerRegister.jsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.update();
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });

    function handleOnline() {
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration?.update();
      });
    }

    function handleControllerChange() {
      if (sessionStorage.getItem('fuelflo-sw-controller-reloaded') === '1') {
        return;
      }

      sessionStorage.setItem('fuelflo-sw-controller-reloaded', '1');
      window.location.reload();
    }

    function handleMessage(event) {
      if (event.data?.type !== 'FUELFLO_SW_ONLINE_RESPONSE') return;
      sessionStorage.removeItem('fuelflo-sw-controller-reloaded');
    }

    window.addEventListener('online', handleOnline);
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange
    );
    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange
      );
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
}
