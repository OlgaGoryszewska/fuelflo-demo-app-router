import './globals.css';
import { Poppins, Roboto_Flex } from 'next/font/google';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import OfflineBanner from '@/components/OfflineBanner';
import AppShell from '@/components/AppShell';


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
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FuelFlo" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body>
        <ServiceWorkerRegister />
        <OfflineBanner />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}