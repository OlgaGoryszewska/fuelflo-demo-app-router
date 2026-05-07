'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function AuthGuard({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [session, loading, pathname, router]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return children;
}