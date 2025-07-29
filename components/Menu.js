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
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/add-new-project">Add new Project</Link>
        </li>
        <li>
          <Link href="/signIn">Sign in</Link>
        </li>
      </ul>
    </div>
  );
}
