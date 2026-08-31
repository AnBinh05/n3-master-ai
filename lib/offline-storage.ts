import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface N3MasterDB extends DBSchema {
  offlineReviews: {
    key: string;
    value: {
      id: string;
      cardId: string;
      rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
      timestamp: number;
    };
  };
  cachedCards: {
    key: string;
    value: {
      id: string;
      deckId: string;
      frontText: string;
      backMeaning: string;
      backReading?: string;
      backText?: string;
      easeFactor: number;
      interval: number;
      repetitions: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<N3MasterDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<N3MasterDB>('n3-master-ai-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offlineReviews')) {
          db.createObjectStore('offlineReviews', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cachedCards')) {
          db.createObjectStore('cachedCards', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveOfflineReview(cardId: string, rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') {
  const db = await getDB();
  if (!db) return;
  const review = {
    id: `${cardId}_${Date.now()}`,
    cardId,
    rating,
    timestamp: Date.now(),
  };
  await db.put('offlineReviews', review);
}

export async function getOfflineReviews() {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('offlineReviews');
}

export async function clearOfflineReviews() {
  const db = await getDB();
  if (!db) return;
  await db.clear('offlineReviews');
}
