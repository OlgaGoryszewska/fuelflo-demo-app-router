'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Archive,
  BarChart3,
  Boxes,
  FolderKanban,
  Fuel,
  LayoutDashboard,
  Menu as MenuIcon,
  Plus,
  RefreshCcw,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Truck,
  User,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';
import logo from '@/public/flo-logo.png';
import { supabase } from '@/lib/supabaseClient';

const roleMenus = {
  technician: {
    quick: [
      {
        href: '/resources/projects/add-transaction',
        label: 'Add transaction',
        description: 'Capture fuel evidence',
        icon: Plus,
      },
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Assigned work',
        icon: FolderKanban,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/technician',
            label: 'Dashboard',
            description: 'Today’s field tools',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Start delivery or return',
            icon: Plus,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Open event fuel jobs',
            icon: FolderKanban,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Incoming fuel evidence',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel evidence',
            icon: RotateCcw,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Assigned fleet records',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Fuel source records',
            icon: Truck,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  manager: {
    quick: [
      {
        href: '/operations/dashboard/manager',
        label: 'Dashboard',
        description: 'Operations overview',
        icon: LayoutDashboard,
      },
      {
        href: '/resources/projects/add-transaction',
        label: 'Add transaction',
        description: 'Record fuel movement',
        icon: Plus,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/manager',
            label: 'Dashboard',
            description: 'Fuel position and actions',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Active fuel operations',
            icon: FolderKanban,
          },
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Create delivery or return',
            icon: Plus,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Incoming fuel proof',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel proof',
            icon: RotateCcw,
          },
          {
            href: '/resources/reports',
            label: 'Reports',
            description: 'PDFs and summaries',
            icon: BarChart3,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Fleet equipment',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Storage equipment',
            icon: Truck,
          },
          {
            href: '/resources/technician',
            label: 'Technicians',
            description: 'Assigned field users',
            icon: ShieldCheck,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  hire_desk: {
    quick: [
      {
        href: '/add-forms/add-new-project',
        label: 'New project',
        description: 'Create event job',
        icon: Plus,
      },
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Manage jobs',
        icon: FolderKanban,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/hire-desk',
            label: 'Dashboard',
            description: 'Setup and dispatch tools',
            icon: LayoutDashboard,
          },
          {
            href: '/add-forms/add-new-project',
            label: 'New project',
            description: 'Create fuel operation',
            icon: Plus,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'All active jobs',
            icon: FolderKanban,
          },
          {
            href: '/resources/projects/archived',
            label: 'Archived projects',
            description: 'Closed job history',
            icon: Archive,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Record delivery or return',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Fuel delivery records',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Fuel return records',
            icon: RotateCcw,
          },
          {
            href: '/resources/reports',
            label: 'Reports',
            description: 'Project and fuel reports',
            icon: ScrollText,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/add-forms/add_equipment',
            label: 'Add equipment',
            description: 'Generator or tank setup',
            icon: Boxes,
          },
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Fleet equipment',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Tank records',
            icon: Truck,
          },
          {
            href: '/register',
            label: 'Register user',
            description: 'Create team profiles',
            icon: UserPlus,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  fuel_supplier: {
    quick: [
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Assigned events',
        icon: FolderKanban,
      },
      {
        href: '/resources/fuel-transactions',
        label: 'Deliveries',
        description: 'Fuel records',
        icon: Fuel,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Assigned fuel operations',
            icon: FolderKanban,
          },
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Delivery evidence',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel records',
            icon: RotateCcw,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
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

function flattenMenuItems(menu) {
  return menu?.sections?.flatMap((section) => section.items) || [];
}

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (pathname === '/') {
    return null;
  }

  const menu = role ? roleMenus[role] : null;
  const links = flattenMenuItems(menu);
  const roleLabel = role ? roleLabels[role] : null;
  const homeHref = menu?.quick?.[0]?.href || links[0]?.href || '/';

  return (
    <header
      className={`sticky top-0 z-[900] px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] transition-all duration-300 ${
        isScrolled && !isOpen
          ? 'border-b border-white/60 bg-[#e2ecfc]/70 shadow-[0_10px_30px_rgba(98,116,142,0.16)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#e2ecfc]/55'
          : 'border-b border-transparent bg-transparent shadow-none backdrop-blur-0'
      }`}
      ref={menuRef}
    >
      <nav
        className={`mx-auto h-14 w-full max-w-[640px] items-center justify-between ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <Link
          href={homeHref}
          className={`flex min-w-0 items-center gap-2 rounded-full border px-2.5 py-1 transition active:scale-[0.98] ${
            isScrolled
              ? 'border-white/70 bg-white/70 shadow-sm ring-1 ring-[#d5eefc]/70 backdrop-blur-xl'
              : 'border-white/45 bg-white/45 shadow-none ring-1 ring-white/45 backdrop-blur-sm'
          }`}
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
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-[#62748e] transition active:scale-90 active:bg-[#eef4fb] ${
              isScrolled
                ? 'border-white/70 bg-white/70 shadow-sm ring-1 ring-[#d5eefc]/70 backdrop-blur-xl'
                : 'border-white/45 bg-white/45 shadow-none ring-1 ring-white/45 backdrop-blur-sm'
            }`}
          >
            <RefreshCcw size={20} />
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-[#62748e] transition active:scale-90 active:bg-[#eef4fb] ${
              isScrolled
                ? 'border-white/70 bg-white/70 shadow-sm ring-1 ring-[#d5eefc]/70 backdrop-blur-xl'
                : 'border-white/45 bg-white/45 shadow-none ring-1 ring-white/45 backdrop-blur-sm'
            }`}
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[930] overflow-hidden bg-[#e2ecfc]/82 backdrop-blur-2xl"
        >
          <span className="pointer-events-none absolute inset-0 opacity-[0.11] [background-image:radial-gradient(#62748e_0.7px,transparent_0.7px)] [background-size:8px_8px]" />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-[#e2ecfc]/45 to-[#d5eefc]/55" />
        </button>
      )}

      <div
        className={`fixed left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[1000] mx-auto max-h-[min(88vh,760px)] max-w-[640px] overflow-hidden rounded-[28px] border border-white/75 bg-[#f8fafc] shadow-[0_26px_80px_rgba(65,81,106,0.24)] ring-1 ring-[#d5eefc]/80 transition-all duration-200 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#f8fafc] to-[#eef4fb]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.11] [background-image:radial-gradient(#62748e_0.7px,transparent_0.7px)] [background-size:8px_8px]" />
        <div className="relative max-h-[min(88vh,760px)] overflow-y-auto p-3">
          <div className="mb-3 rounded-[22px] border border-[#e8edf3] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] ring-1 ring-[#d5eefc]">
                  <Image src={logo} alt="" className="h-auto w-8" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-gray-900">
                    FuelFlo
                  </span>
                  <span className="steps-text block truncate">
                    {roleLabel || 'Navigation'}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-[#62748e] ring-1 ring-[#d5eefc] transition active:scale-90"
              >
                <X size={21} strokeWidth={2.3} />
              </button>
            </div>
          </div>

          {!user && (
            <Link
              onClick={handleLinkClick}
              href="/"
              className="mb-3 flex h-12 items-center justify-center rounded-2xl bg-[#41516a] px-4 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              Login
            </Link>
          )}

          {user && menu?.quick?.length > 0 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {menu.quick.map((item) => {
                const Icon = item.icon;
                const active = isMenuItemActive(item.href, pathname);

                return (
                  <Link
                    key={`quick-${item.href}`}
                    onClick={handleLinkClick}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-[22px] border p-3 transition active:scale-[0.98] ${
                      active
                        ? 'border-[#41516a] bg-[#41516a] text-white shadow-[0_10px_26px_rgba(65,81,106,0.24)]'
                        : 'border-[#e8edf3] bg-white text-gray-900'
                    }`}
                  >
                    <span
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${
                        active
                          ? 'bg-white/15 text-white ring-white/20'
                          : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
                      }`}
                    >
                      <Icon size={20} strokeWidth={2.3} />
                    </span>
                    <span
                      className={`block text-sm font-semibold ${
                        active ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        active ? 'text-white/75' : 'text-[#717887]'
                      }`}
                    >
                      {item.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {user &&
            menu?.sections?.map((section) => (
              <section key={section.title} className="mb-3 last:mb-0">
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#717887]">
                  {section.title}
                </p>
                <div className="rounded-[22px] border border-[#e8edf3] bg-white p-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isMenuItemActive(item.href, pathname);

                    return (
                      <Link
                        key={`${section.title}-${item.href}`}
                        onClick={handleLinkClick}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-[18px] px-3 py-3 transition active:scale-[0.99] ${
                          active
                            ? 'bg-[#eef4fb] text-gray-900 ring-1 ring-[#d5eefc]'
                            : 'text-gray-800 active:bg-[#f5fbff]'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${
                            active
                              ? 'bg-white text-[#41516a] ring-[#d5eefc]'
                              : 'bg-[#eef4fb] text-[#62748e] ring-[#d5eefc]'
                          }`}
                        >
                          <Icon size={19} strokeWidth={2.2} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-gray-900">
                            {item.label}
                          </span>
                          <span className="steps-text mt-0.5 block truncate">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
        </div>
      </div>
    </header>
  );
}
