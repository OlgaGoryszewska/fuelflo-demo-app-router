'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';

const SESSION_RESTORE_DELAY_MS = 700;

export default function AuthGuard({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restoreChecked, setRestoreChecked] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session) {
        setRestoreChecked(true);
        setLoading(false);
        return;
      }

      window.setTimeout(async () => {
        if (!mounted) return;

        const {
          data: { session: restoredSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(restoredSession);
        setRestoreChecked(true);
        setLoading(false);
      }, SESSION_RESTORE_DELAY_MS);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setRestoreChecked(true);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading || !restoreChecked) return;

    // Not logged in
    if (!session) {
      if (pathname !== '/') {
        router.replace('/');
      }
      return;
    }

    // Logged in but on login page
    if (session && pathname === '/') {
      router.replace('/resources/projects');
    }
  }, [session, loading, restoreChecked, pathname, router]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return children;
}
