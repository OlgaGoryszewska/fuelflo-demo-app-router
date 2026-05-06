'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Building, Plus, User } from 'lucide-react';
import Link from 'next/link';

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

  const pathname = usePathname();

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
    'flex flex-col items-center gap-1  transition-all duration-200 active:scale-90';

  const inactive = 'text-[#717887]';
  const active = 'text-[#62748e] scale-110 -translate-y-1';
  const projectsActive = pathname?.startsWith('/resources/projects');

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
          className={`${base} ${projectsActive ? active : inactive}`}
        >
          <Building size={24} />
        </Link>

        <Link
          href="/resources/projects"
          aria-current={projectsActive ? 'page' : undefined}
          className={`
            flex -translate-y-4 items-center justify-center rounded-full p-4 text-white
            shadow-lg transition-all duration-200 active:scale-90 active:bg-[#344158]
            active:ring-4 active:ring-[#62748e]/30
            ${
              projectsActive
                ? 'scale-110 bg-[#41516a] ring-4 ring-[#62748e]/25 shadow-[0_12px_28px_rgba(65,81,106,0.35)]'
                : 'bg-[#62748e] shadow-[0_8px_20px_rgba(98,116,142,0.25)]'
            }
          `}
        >
          <Plus size={26} strokeWidth={projectsActive ? 3 : 2} />
        </Link>

        <Link
          href="/resources/profile"
          className={`${base} ${pathname === '/resources/profile' ? active : inactive}`}
        >
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
}
