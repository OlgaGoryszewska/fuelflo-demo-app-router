import { openDB } from 'idb';

let dbPromise = null;

function getDb() {
  if (typeof window === 'undefined') return null;

  if (!dbPromise) {
    dbPromise = openDB('fuel-field-data-db', 1, {
      upgrade(db) {
        db.createObjectStore('generators', { keyPath: 'id' });
        db.createObjectStore('tanks', { keyPath: 'id' });
      },
    });
  }

  return dbPromise;
}

export async function saveGenerators(generators) {
  const db = await getDb();
  if (!db) return;

  const tx = db.transaction('generators', 'readwrite');

  for (const generator of generators) {
    await tx.store.put(generator);
  }

  await tx.done;
}

export async function getGenerators() {
  const db = await getDb();
  if (!db) return [];

  return db.getAll('generators');
}

export async function saveTanks(tanks) {
  const db = await getDb();
  if (!db) return;

  const tx = db.transaction('tanks', 'readwrite');

  for (const tank of tanks) {
    await tx.store.put(tank);
  }

  await tx.done;
}

export async function getTanks() {
  const db = await getDb();
  if (!db) return [];

  return db.getAll('tanks');
}
