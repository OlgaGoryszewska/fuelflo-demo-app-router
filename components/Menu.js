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
  RefreshCcw,
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
  const refreshPage = () => window.location.reload();

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
    <header
      className="sticky top-0 z-[900] border-b border-white/60 bg-[#e2ecfc]/70 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-[0_8px_24px_rgba(98,116,142,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#e2ecfc]/55"
      ref={menuRef}
    >
      <nav className="mx-auto flex h-14 w-full max-w-[640px] items-center justify-between">
        <Link
          href={links[0]?.href || '/'}
          className="flex min-w-0 items-center gap-2 rounded-full border border-white/70 bg-white/65 px-2.5 py-1 shadow-sm ring-1 ring-[#d5eefc]/70 transition active:scale-[0.98]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb]">
            <Image src={logo} alt="FuelFlo" className="h-auto w-8" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-[#62748e]">
              FuelFlo
            </span>
            {roleLabel && (
              <span className="block max-w-[120px] truncate pr-2 text-xs font-medium text-[#62748e]">
                {roleLabel}
              </span>
            )}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshPage}
            aria-label="Refresh page"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/65 text-[#62748e] shadow-sm ring-1 ring-[#d5eefc]/70 transition active:scale-90 active:bg-[#eef4fb]"
          >
            <RefreshCcw size={20} />
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/65 text-[#62748e] shadow-sm ring-1 ring-[#d5eefc]/70 transition active:scale-90 active:bg-[#eef4fb]"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      <ul
        className={`absolute left-3 right-3 z-[1000] mx-auto mt-2 max-w-[640px] rounded-2xl border border-white/70 bg-white/85 p-2 shadow-[0_16px_40px_rgba(15,23,38,0.14)] backdrop-blur-2xl ${
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
    </header>
  );
}
