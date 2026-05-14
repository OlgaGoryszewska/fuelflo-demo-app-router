'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Building, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

function getPwaSnapshot() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function subscribeToPwaMode(onStoreChange) {
  const mediaQuery = window.matchMedia('(display-mode: standalone)');

  mediaQuery.addEventListener('change', onStoreChange);

  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

export default function PwaBottomMenu() {
  const isPwa = useSyncExternalStore(
    subscribeToPwaMode,
    getPwaSnapshot,
    () => false
  );
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState('');

  const pathname = usePathname();

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      setRole(data?.role || '');
    }

    loadRole();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 10);

      if (y > lastScrollY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(y);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!isPwa) return null;

  const base =
    'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 active:scale-90 active:bg-[#344158] active:text-white active:ring-4 active:ring-[#62748e]/30';

  const inactive = 'text-[#717887] hover:bg-white/45';
  const active =
    'scale-110 -translate-y-1 bg-[#41516a] text-white ring-4 ring-[#62748e]/20 shadow-[0_8px_20px_rgba(65,81,106,0.25)]';
  const addTransactionActive =
    pathname === '/resources/projects/add-transaction' ||
    /^\/resources\/projects\/[^/]+\/new/.test(pathname || '');
  const projectsActive =
    pathname?.startsWith('/resources/projects') && !addTransactionActive;
  const profileActive = pathname === '/resources/profile';
  const canCreateTransaction = Boolean(role) && role !== 'event_organizer';

  return (
    <nav
      className={`
        glass-noise
        relative
        fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2
        rounded-3xl border border-white/30
        px-3 py-3
        backdrop-blur-xl
        transition-all duration-500 ease-out
        ${
          scrolled
            ? 'bg-white/40 shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
            : 'bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
        }
        ${hidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
    >
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/resources/projects"
          aria-current={projectsActive ? 'page' : undefined}
          className={`${base} ${projectsActive ? active : inactive}`}
        >
          <Building size={24} strokeWidth={projectsActive ? 2.6 : 2} />
        </Link>

        {canCreateTransaction && (
          <Link
            href="/resources/projects/add-transaction"
            aria-current={addTransactionActive ? 'page' : undefined}
            className={`
              flex -translate-y-4 items-center justify-center rounded-full p-4 text-white
              shadow-lg transition-all duration-200 active:scale-90 active:bg-[#344158]
              active:ring-4 active:ring-[#62748e]/30
              ${
                addTransactionActive
                  ? 'scale-110 bg-[#41516a] ring-4 ring-[#62748e]/25 shadow-[0_12px_28px_rgba(65,81,106,0.35)]'
                  : 'bg-[#62748e] shadow-[0_8px_20px_rgba(98,116,142,0.25)]'
              }
            `}
          >
            <Plus size={26} strokeWidth={addTransactionActive ? 3 : 2} />
          </Link>
        )}

        <Link
          href="/resources/profile"
          aria-current={profileActive ? 'page' : undefined}
          className={`${base} ${profileActive ? active : inactive}`}
        >
          <User size={24} strokeWidth={profileActive ? 2.6 : 2} />
        </Link>
      </div>
    </nav>
  );
}
