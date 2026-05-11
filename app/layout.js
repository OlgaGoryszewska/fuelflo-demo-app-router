import './globals.css';
import { Poppins, Roboto_Flex } from 'next/font/google';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import AppShell from '@/components/AppShell';

const offlineRecoveryScript = `
(function () {
  var wasOfflineKey = 'fuelflo-was-offline';
  var reloadKey = 'fuelflo-online-recovery-reloaded';

  function markOffline() {
    try {
      sessionStorage.setItem(wasOfflineKey, '1');
      sessionStorage.removeItem(reloadKey);
    } catch (error) {}
  }

  function recoverOnline() {
    try {
      var wasOffline = sessionStorage.getItem(wasOfflineKey) === '1';
      var alreadyReloaded = sessionStorage.getItem(reloadKey) === '1';

      if (!wasOffline || alreadyReloaded) return;

      sessionStorage.setItem(reloadKey, '1');
      sessionStorage.removeItem(wasOfflineKey);

      if (window.location.pathname === '/offline') {
        window.location.replace('/');
        return;
      }

      window.location.reload();
    } catch (error) {
      window.location.reload();
    }
  }

  function recoverChunkError(event) {
    var target = event && event.target;
    var tagName = target && target.tagName;
    var isAppAsset =
      (tagName === 'SCRIPT' || tagName === 'LINK') &&
      target &&
      typeof target.src === 'string'
        ? target.src.indexOf('/_next/') !== -1
        : target && typeof target.href === 'string'
          ? target.href.indexOf('/_next/') !== -1
          : false;

    if (!isAppAsset || !navigator.onLine) return;

    try {
      if (sessionStorage.getItem(reloadKey) === '1') return;
      sessionStorage.setItem(reloadKey, '1');
    } catch (error) {}

    window.location.reload();
  }

  if (!navigator.onLine) {
    markOffline();
  }

  window.addEventListener('offline', markOffline);
  window.addEventListener('online', recoverOnline);
  window.addEventListener('error', recoverChunkError, true);
})();
`;

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  preload: false,
});

const roboto = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-flex',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#e2ecfc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FuelFlo" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: offlineRecoveryScript }} />
        <ServiceWorkerRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
