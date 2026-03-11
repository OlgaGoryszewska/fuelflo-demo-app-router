'use client';
import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/public/flo-logo.png';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // 🔹 reference to the entire menu area

  const toggleMenu = () => setIsOpen((prev) => !prev);

  //  Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="menu" ref={menuRef}>
      <nav className="nav">
        <Image src={logo} alt="Logo" className="logo" />
        <HiOutlineMenuAlt3 className="hamburger" onClick={toggleMenu} />
      </nav>
      <ul className={`menu-items ${isOpen ? 'open' : 'closed'}`}>
        <li>
          <Link onClick={handleLinkClick} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link onClick={handleLinkClick} href="/operations/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link onClick={handleLinkClick} href={`/resources/transactions/new/`}>
            Add fuel transaction
          </Link>
        </li>
        <li className="last-li">
          <Link onClick={handleLinkClick} href="/signIn">
            Sign in
          </Link>
        </li>
      </ul>
    </div>
  );
}
