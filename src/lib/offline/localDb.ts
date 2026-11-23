// Tiny IndexedDB key/value store for media blobs — free, on-device, no external service.
const DB_NAME = 'aivision-local';
const STORE = 'media';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const r = fn(db.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export const localDb = {
  put: (key: string, blob: Blob) => tx('readwrite', (s) => s.put(blob, key)),
  get: (key: string) => tx<Blob | undefined>('readonly', (s) => s.get(key)),
  remove: (key: string) => tx('readwrite', (s) => s.delete(key)),
  keys: () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys()),
};
