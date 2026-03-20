'use client';

import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/public/flo-logo.png';
import { supabase } from '@/lib/supabaseClient';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // 🔍 Check user + listen to auth changes
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
  };

  // ❌ Close menu when clicking outside
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

        {/* 🧠 ONLY show dashboard if logged in */}
        {user && (
          <>
          <li>
            <Link onClick={handleLinkClick} href="/operations/dashboard">
              Dashboard
            </Link>
          </li>
          <li>
            <Link onClick={handleLinkClick} href="/resources/projects/">
              Add fuel transaction
            </Link>
          </li>
          <li>
            <Link onClick={handleLinkClick} href="/resources/profile/">
              Profile
            </Link>
          </li>
          </>
          
        )}

        {/* 🔐 If NOT logged in */}
        {!user && (
          <>
            <li>
              <Link onClick={handleLinkClick} href="/signIn">
                Sign in
              </Link>
            </li>
            <li className="last-li">
              <Link onClick={handleLinkClick} href="/register/">
                Register
              </Link>
            </li>
          </>
        )}

        {/* 🚪 If logged in → show logout */}
        {user && (
          <li className="last-li">
            <button onClick={handleLogout} className="ml-2">
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}