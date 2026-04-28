import { openDB } from 'idb';

let dbPromise = null;

function getDb() {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB('fuel-app-offline-db', 1, {
      upgrade(db) {
        db.createObjectStore('fuel_transactions_queue', {
          keyPath: 'id',
        });
      },
    });
  }

  return dbPromise;
}

export async function saveTransactionOffline(transaction) {
  const db = await getDb();
  if (!db) return;

  await db.put('fuel_transactions_queue', transaction);
}

export async function getOfflineTransactions() {
  const db = await getDb();
  if (!db) return [];

  return db.getAll('fuel_transactions_queue');
}

export async function deleteOfflineTransaction(id) {
  const db = await getDb();
  if (!db) return;

  await db.delete('fuel_transactions_queue', id);
}