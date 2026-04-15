'use client';

import Link from 'next/link';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/flo-logo.png';
import { supabase } from '@/lib/supabaseClient';

const roleMenus = {
  technician: [
    { href: '/operations/dashboard/technician', label: 'Dashboard' },
    { href: '/resources/fuel-transactions', label: 'Fuel transactions' },
    { href: '/resources/projects', label: 'Projects' },
    { href: '/resources/profile', label: 'Profile' },
  ],
  manager: [
    { href: '/operations/dashboard/manager', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/users', label: 'Team' },
    { href: '/profile', label: 'Profile' },
  ],
  hire_desk: [
    { href: '/operations/dashboard/hire-desk', label: 'Dashboard' },
    { href: '/add-forms/add-new-project', label: 'New project' },
    { href: '/register', label: 'Register user' },
    { href: '/resources/profile/', label: 'Profile' },
  ],
  fuel_supplier: [
    { href: '/dashboard/fuel-supplier', label: 'Dashboard' },
    { href: '/deliveries', label: 'Deliveries' },
    { href: '/profile', label: 'Profile' },
  ],
};

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const menuRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleLinkClick = () => setIsOpen(false);

  useEffect(() => {
    async function fetchRole(userId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching role:', error.message);
        return null;
      }

      return profile?.role ?? null;
    }

    async function loadUserAndRole() {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        setUser(null);
        setRole(null);
        return;
      }

      setUser(currentUser ?? null);

      if (!currentUser) {
        setRole(null);
        return;
      }

      const fetchedRole = await fetchRole(currentUser.id);
      setRole(fetchedRole);
    }

    loadUserAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        return;
      }

      const fetchedRole = await fetchRole(nextUser.id);
      setRole(fetchedRole);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      return;
    }

    setUser(null);
    setRole(null);
    setIsOpen(false);

    router.push('/signIn');
    router.refresh();
  };

  const links = role ? (roleMenus[role] ?? []) : [];

  return (
    <div className="menu" ref={menuRef}>
      <nav className="nav">
        <Image src={logo} alt="Logo" className="logo" />
        <HiOutlineMenuAlt3 className="hamburger" onClick={toggleMenu} />
      </nav>

      <ul className={`menu-items ${isOpen ? 'open' : 'closed'}`}>
        <li className="pl-2">
          <Link onClick={handleLinkClick} href="/">
            Home
          </Link>
        </li>

        {!user && (
          <li className="pl-2">
            <Link onClick={handleLinkClick} href="/signIn">
              Login
            </Link>
          </li>
        )}

        {user &&
          links.map((item) => (
            <li className="pl-2" key={item.href}>
              <Link onClick={handleLinkClick} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}

{user && (
          <li className="logout-button pl-2" onClick={handleLogout}>
            Logout
          </li>
        )}
      </ul>
    </div>
  );
}
