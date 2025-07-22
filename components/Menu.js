'use client';
import Link from 'next/link';

import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useState } from 'react';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="menu">
      <nav className="nav">
        <img src="/logo.png" alt="Logo" className="logo" />
        <HiOutlineMenuAlt3 className="hamburger" onClick={toggleMenu} />
      </nav>
      <ul className={`menu-items ${isOpen ? 'open' : 'closed'}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/signIn">Signin</Link>
        </li>
      </ul>
    </div>
  );
}
