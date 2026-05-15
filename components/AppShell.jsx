'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Menu from '@/components/Menu';
import PwaBottomMenu from '@/components/PwaBottomMenu';
import AuthGuard from '@/components/AuthGuard';
import OfflineSyncListener from '@/components/OfflineSyncListener';
import OfflineSyncStatus from '@/components/OfflineSyncStatus';
import { supabase } from '@/lib/supabaseClient';

const APP_ROLES = new Set([
  'technician',
  'manager',
  'hire_desk',
  'fuel_supplier',
  'event_organizer',
]);

function normalizeRole(role) {
  return APP_ROLES.has(role) ? role : 'public';
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [role, setRole] = useState('public');

  const isAuthPage = pathname === '/' || pathname === '/signIn';

  useEffect(() => {
    let active = true;

    if (isAuthPage) {
      return () => {
        active = false;
      };
    }

    async function loadRole() {
      const savedRole =
        typeof window !== 'undefined'
          ? localStorage.getItem('offline_user_role')
          : null;

      if (savedRole) {
        setRole(normalizeRole(savedRole));
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active || !user) {
        if (active && !savedRole) setRole('public');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!active) return;

      const nextRole = normalizeRole(profile?.role);
      setRole(nextRole);

      if (nextRole !== 'public') {
        localStorage.setItem('offline_user_role', nextRole);
      }
    }

    loadRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadRole();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isAuthPage]);

  const activeRole = isAuthPage ? 'public' : role;

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    const { clientX, clientY } = event.touches[0];
    touchStartRef.current = { x: clientX, y: clientY };
  };

  const handleTouchEnd = (event) => {
    if (event.changedTouches.length !== 1) return;
    const { clientX, clientY } = event.changedTouches[0];
    const deltaX = clientX - touchStartRef.current.x;
    const deltaY = clientY - touchStartRef.current.y;

    if (Math.abs(deltaY) > 80) return;
    if (deltaX < -120 && Math.abs(deltaX) > Math.abs(deltaY)) {
      router.back();
    }
  };

  if (isAuthPage) {
    return (
      <div className="app-background" data-app-role={activeRole}>
        <main className="main-content">{children}</main>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="app-background" data-app-role={activeRole}>
        <div className="app-menu-layer">
          <Menu />
        </div>
        <main
          className="app-content-layer main-content pb-24"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </main>
        <div className="app-status-layer">
          <OfflineSyncListener />
          <OfflineSyncStatus />
        </div>
        <div className="app-bottom-nav-layer">
          <PwaBottomMenu />
        </div>
      </div>
    </AuthGuard>
  );
}
