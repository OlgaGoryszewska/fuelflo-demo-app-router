import './globals.css';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { Poppins } from 'next/font/google';
import { Roboto_Flex } from 'next/font/google';
import Head from 'next/head';
import Menu from '@/components/Menu';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});
const roboto = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-roboto-flex',
});

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
            rel="stylesheet"
          />
        </Head>
      <Menu />
        <div className="navAvatar">
          <div>
            <h3>Name</h3>
            <h3>ID: 7767867</h3>
          </div>
          <img src="/avatar.png" alt="Avatar" className="avatar" />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
