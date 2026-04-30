import './globals.css';
import { Poppins, Roboto_Flex } from 'next/font/google';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import OfflineBanner from '@/components/OfflineBanner';
import OfflineSyncListener from '@/components/OfflineSyncListener';
import OfflineSyncStatus from '@/components/OfflineSyncStatus';

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
      <body>
        <ServiceWorkerRegister />
        <OfflineBanner />
        <Menu />
   
        <main className="main-content">{children}</main>
        <OfflineSyncListener />
        <OfflineSyncStatus />
        <Footer />
      </body>
    </html>
  );
}
