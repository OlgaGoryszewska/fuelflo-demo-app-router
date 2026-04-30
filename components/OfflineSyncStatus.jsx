'use client';

import { useEffect, useState } from 'react';
import { getOfflineTransactions } from '@/lib/offline/offlineDb';
import { syncTransactions } from '@/lib/offline/syncTransactions';

export default function OfflineSyncStatus() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  async function refreshCount() {
    const items = await getOfflineTransactions();
    setPendingCount(items.length);
  }

  async function handleSync() {
    if (!navigator.onLine) return;

    setSyncing(true);
    await syncTransactions();
    await refreshCount();
    setSyncing(false);
  }

  useEffect(() => {
    refreshCount();

    async function handleOnline() {
      await handleSync();
    }

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (pendingCount === 0) return null;

  return (
    <div className="mx-4 my-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
      <p>Pending offline uploads: {pendingCount}</p>

      {navigator.onLine ? (
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