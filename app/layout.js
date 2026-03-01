import './globals.css';
import { Poppins } from 'next/font/google';
import { Roboto_Flex } from 'next/font/google';
import { Italiana } from 'next/font/google';
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
const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-italiana',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Menu />

        <main>{children}</main>
      </body>
    </html>
  );
}
