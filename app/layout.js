import './globals.css';
import { Poppins, Roboto_Flex } from 'next/font/google';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  preload: false,
});

const roboto = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-roboto-flex',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>
        <Menu />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}