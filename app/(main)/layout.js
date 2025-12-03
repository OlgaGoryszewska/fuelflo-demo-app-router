import '../globals.css';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { Poppins } from 'next/font/google';
import { Roboto_Flex } from 'next/font/google';

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
        <div className="navAvatar">
          <div>
            <p >Name</p>
          </div>
          <img src="/avatar.png" alt="Avatar" className="avatar" />
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
