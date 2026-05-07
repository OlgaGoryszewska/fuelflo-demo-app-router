import { openDB } from 'idb';

let dbPromise = null;
const DB_NAME = 'fuel-app-offline-db';
const DB_VERSION = 2;
const TRANSACTIONS_STORE = 'fuel_transactions_queue';
const SYNC_LOGS_STORE = 'sync_logs';

function notifyOfflineTransactionsChanged() {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event('offline-transactions-changed'));
}

function normalizeTransaction(transaction) {
  const now = new Date().toISOString();

  return {
    ...transaction,
    created_at: transaction.created_at || now,
    updated_at: now,
    sync_status: transaction.sync_status || 'pending',
    sync_error: transaction.sync_error || null,
    before_upload_status:
      transaction.before_upload_status ||
      (transaction.before_photo_url ? 'uploaded' : 'pending'),
    after_upload_status:
      transaction.after_upload_status ||
      (transaction.after_photo_url ? 'uploaded' : 'pending'),
  };
}

function getDb() {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
          db.createObjectStore(TRANSACTIONS_STORE, {
            keyPath: 'id',
          });
        }

        if (!db.objectStoreNames.contains(SYNC_LOGS_STORE)) {
          db.createObjectStore(SYNC_LOGS_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }

  return dbPromise;
}

export async function saveTransactionOffline(transaction) {
  const db = await getDb();
  if (!db) return;

  await db.put(TRANSACTIONS_STORE, normalizeTransaction(transaction));
  notifyOfflineTransactionsChanged();
}

export async function getOfflineTransactions() {
  const db = await getDb();
  if (!db) return [];

  const transactions = await db.getAll(TRANSACTIONS_STORE);

  return transactions.filter((transaction) =>
    ['pending', 'error'].includes(transaction.sync_status)
  );
}

export async function getOfflineTransaction(id) {
  const db = await getDb();
  if (!db || !id) return null;

  return db.get(TRANSACTIONS_STORE, id);
}

export async function getAllOfflineTransactions() {
  const db = await getDb();
  if (!db) return [];

  return db.getAll(TRANSACTIONS_STORE);
}

export async function deleteOfflineTransaction(id) {
  const db = await getDb();
  if (!db) return;

  await db.delete(TRANSACTIONS_STORE, id);
  notifyOfflineTransactionsChanged();
}

export async function updateOfflineTransaction(id, updates, options = {}) {
  const db = await getDb();
  if (!db) return;

  const existing = await db.get(TRANSACTIONS_STORE, id);
  const nextSyncStatus =
    updates.sync_status ||
    options.syncStatus ||
    existing?.sync_status ||
    'pending';

  if (!existing) {
    await db.put(
      TRANSACTIONS_STORE,
      normalizeTransaction({
        id,
        ...updates,
        sync_status: nextSyncStatus,
      })
    );
    notifyOfflineTransactionsChanged();
    return;
  }

  await db.put(
    TRANSACTIONS_STORE,
    normalizeTransaction({
      ...existing,
      ...updates,
      sync_status: nextSyncStatus,
    })
  );
  notifyOfflineTransactionsChanged();
}

export async function markOfflineTransactionSynced(id, updates = {}) {
  await updateOfflineTransaction(
    id,
    {
      ...updates,
      sync_status: 'synced',
      sync_error: null,
    },
    { syncStatus: 'synced' }
  );
}

export async function markOfflineTransactionError(id, error) {
  const message = error?.message || String(error || 'Sync failed.');

  await updateOfflineTransaction(
    id,
    {
      sync_status: 'error',
      sync_error: message,
      last_sync_attempt_at: new Date().toISOString(),
    },
    { syncStatus: 'error' }
  );
}

export async function addSyncLog(entry) {
  const db = await getDb();
  if (!db) return;

  await db.add(SYNC_LOGS_STORE, {
    ...entry,
    created_at: new Date().toISOString(),
  });
}
