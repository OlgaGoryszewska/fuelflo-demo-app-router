'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // NOT logged in → stay on "/" only
      if (!user) {
        if (pathname !== '/') {
          router.replace('/');
        } else {
          setLoading(false);
        }
        return;
      }

      // Logged in → prevent going back to login page
      if (user && pathname === '/') {
        router.replace('/resources/projects'); // your main page
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="main-container flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}