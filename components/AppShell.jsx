'use client';

import { useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Menu from '@/components/Menu';
import PwaBottomMenu from '@/components/PwaBottomMenu';
import AuthGuard from '@/components/AuthGuard';
import OfflineSyncListener from '@/components/OfflineSyncListener';
import OfflineSyncStatus from '@/components/OfflineSyncStatus';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const touchStartRef = useRef({ x: 0, y: 0 });

  const isAuthPage = pathname === '/' || pathname === '/signIn';

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
    return <main className="main-content">{children}</main>;
  }

  return (
    <AuthGuard>
      <Menu />
      <main
        className="main-content pb-24"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </main>
      <OfflineSyncListener />
      <OfflineSyncStatus />
      <PwaBottomMenu />
    </AuthGuard>
  );
}
