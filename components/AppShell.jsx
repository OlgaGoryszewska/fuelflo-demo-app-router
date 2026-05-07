'use client';

import { usePathname } from 'next/navigation';
import Menu from '@/components/Menu';
import PwaBottomMenu from '@/components/PwaBottomMenu';
import AuthGuard from '@/components/AuthGuard';
import OfflineSyncListener from '@/components/OfflineSyncListener';
import OfflineSyncStatus from '@/components/OfflineSyncStatus';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <main className="main-content">{children}</main>;
  }

  return (
    <AuthGuard>
      <Menu />
      <main className="main-content pb-24">{children}</main>
      <OfflineSyncListener />
      <OfflineSyncStatus />
      <PwaBottomMenu />
    </AuthGuard>
  );
}
