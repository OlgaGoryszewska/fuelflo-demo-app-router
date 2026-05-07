'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  FolderKanban,
  Fuel,
  LayoutDashboard,
  Menu as MenuIcon,
  Plus,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import logo from '@/public/flo-logo.png';
import { supabase } from '@/lib/supabaseClient';

const roleMenus = {
  technician: [
    {
      href: '/operations/dashboard/technician',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/resources/projects/add-transaction',
      label: 'Add transaction',
      icon: Plus,
    },
    {
      href: '/resources/fuel-transactions',
      label: 'Fuel transactions',
      icon: Fuel,
    },
    { href: '/resources/projects', label: 'Projects', icon: FolderKanban },
    { href: '/resources/profile', label: 'Profile', icon: User },
  ],
  manager: [
    {
      href: '/operations/dashboard/manager',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/resources/projects/add-transaction',
      label: 'Add transaction',
      icon: Plus,
    },
    { href: '/resources/projects', label: 'Projects', icon: FolderKanban },
    {
      href: '/resources/fuel-transactions',
      label: 'Fuel transactions',
      icon: Fuel,
    },
    { href: '/resources/profile', label: 'Profile', icon: User },
  ],
  hire_desk: [
    {
      href: '/operations/dashboard/hire-desk',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    { href: '/add-forms/add-new-project', label: 'New project', icon: Plus },
    {
      href: '/resources/projects/add-transaction',
      label: 'Add transaction',
      icon: Plus,
    },
    { href: '/resources/projects', label: 'Projects', icon: FolderKanban },
    { href: '/resources/fuel-transactions', label: 'Deliveries', icon: Fuel },
    { href: '/register', label: 'Register user', icon: UserPlus },
    { href: '/resources/profile', label: 'Profile', icon: User },
  ],
  fuel_supplier: [
    {
      href: '/dashboard/fuel-supplier',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    { href: '/resources/fuel-transactions/[id]/page.js', label: 'Deliveries', icon: Fuel },
    { href: '/resources/profile', label: 'Profile', icon: User },
  ],
};

const roleLabels = {
  technician: 'Technician',
  manager: 'Manager',
  hire_desk: 'Hire desk',
  fuel_supplier: 'Fuel supplier',
};

function isMenuItemActive(href, pathname) {
  const addTransactionActive =
    pathname === '/resources/projects/add-transaction' ||
    /^\/resources\/projects\/[^/]+\/new/.test(pathname || '');

  if (href === '/resources/projects/add-transaction') {
    return addTransactionActive;
  }

  if (href === '/resources/projects') {
    return (
      pathname === href ||
      (pathname?.startsWith('/resources/projects/') && !addTransactionActive)
    );
  }

  return pathname === href || pathname?.startsWith(`${href}/`);
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const menuRef = useRef(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleLinkClick = () => setIsOpen(false);

  useEffect(() => {
    if (pathname === '/') return;

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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const fetchedRole = await fetchRole(nextUser.id);
        setRole(fetchedRole);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

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

  if (pathname === '/') {
    return null;
  }

  const links = role ? (roleMenus[role] ?? []) : [];
  const roleLabel = role ? roleLabels[role] : null;

  return (
    <div className="menu" ref={menuRef}>
      <nav className="flex h-14 items-center justify-between border-b border-gray-200 bg-white/75 px-3 backdrop-blur-xl">
        <Link href={links[0]?.href || '/'} className="flex items-center gap-2">
          <Image src={logo} alt="FuelFlo" className="h-auto w-10" />
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-gray-900">
              FuelFlo
            </span>
            {roleLabel && (
              <span className="block text-xs font-medium text-[#717887]">
                {roleLabel}
              </span>
            )}
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc] transition active:scale-90 active:bg-[#dbeaf5]"
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </nav>

      <ul
        className={`absolute right-3 left-3 z-[1000] mt-2 rounded-2xl border border-white/60 bg-white/95 p-2 shadow-[0_16px_40px_rgba(15,23,38,0.14)] backdrop-blur-xl ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {!user && (
          <li>
            <Link
              onClick={handleLinkClick}
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-900 transition active:bg-[#eef4fb]"
            >
              Login
            </Link>
          </li>
        )}

        {user &&
          links.map((item) => {
            const Icon = item.icon;
            const active = isMenuItemActive(item.href, pathname);

            return (
              <li key={item.href}>
                <Link
                  onClick={handleLinkClick}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition active:scale-[0.98] ${
                    active
                      ? 'bg-[#eef4fb] text-gray-900 ring-1 ring-[#d5eefc]'
                      : 'text-gray-800 active:bg-[#eef4fb]'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ${
                      active
                        ? 'bg-white text-[#62748e] ring-[#d5eefc]'
                        : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
                    }`}
                  >
                    <Icon size={19} strokeWidth={2.2} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
