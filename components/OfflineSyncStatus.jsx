'use client';

import { useCallback, useEffect, useState } from 'react';
import { getOfflineTransactions } from '@/lib/offline/offlineDb';
import { syncTransactions } from '@/lib/offline/syncTransactions';

export default function OfflineSyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );

  const refreshCount = useCallback(async () => {
    const items = await getOfflineTransactions();
    setPendingCount(items.length);
  }, []);

  const handleSync = useCallback(async () => {
    if (!navigator.onLine) return;

    setSyncing(true);
    await syncTransactions();
    await refreshCount();
    setSyncing(false);
  }, [refreshCount]);

  useEffect(() => {
    const countTimer = window.setTimeout(refreshCount, 0);

    async function handleOnline() {
      setIsOnline(true);
      await handleSync();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-transactions-changed', refreshCount);

    return () => {
      window.clearTimeout(countTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-transactions-changed', refreshCount);
    };
  }, [handleSync, refreshCount]);

  if (pendingCount === 0) return null;

  return (
    <div className="mx-4 my-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
      <p>Pending offline uploads: {pendingCount}</p>

      {isOnline ? (
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="mt-2 rounded bg-yellow-200 px-3 py-1"
        >
          {syncing ? 'Syncing...' : 'Sync now'}
        </button>
      ) : (
        <p className="mt-1">They will sync when internet comes back.</p>
      )}
    </div>
  );
}
