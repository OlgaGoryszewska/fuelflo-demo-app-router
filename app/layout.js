import './globals.css';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { Poppins } from 'next/font/google';

const inter = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <img src="/logo.png" alt="Logo" className="logo" />
          <HiOutlineMenuAlt3 className="hamburger" />
        </nav>
        <div className="navAvatar">
          <div>
            <h2> Name</h2>
            <h3>ID: 7767867</h3>
          </div>
          <img src="/avatar.png" alt="Avatar" className="avatar" />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
