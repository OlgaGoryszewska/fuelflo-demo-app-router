'use client';

import { useEffect } from 'react';
import { syncTransactions } from '@/lib/offline/syncTransactions';

export default function OfflineSyncListener() {
  useEffect(() => {
    function handleOnline() {
      console.log('Back online → syncing...');
      syncTransactions();
    }

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}