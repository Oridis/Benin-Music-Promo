/**
 * Utility for persisting uploaded audio files (Blob / File) in IndexedDB.
 * Since localStorage has a 5MB limit and does not support binary blobs well,
 * IndexedDB provides robust client-side storage for files up to several hundred MBs.
 */

const DB_NAME = 'BeninMusicPromoAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';

let dbInstance: IDBDatabase | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Saves an audio Blob/File to IndexedDB.
 * @param id The unique identifier (e.g. request ID or a temporary upload ID)
 * @param file The audio File or Blob object
 */
export async function saveAudioFile(id: string, file: Blob | File): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file, id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('IndexedDB put error:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Retrieves an audio Blob/File from IndexedDB and returns a fresh local URL.createObjectURL.
 * If the file is not found, returns null.
 * @param id The unique identifier (e.g. request ID)
 */
export async function getAudioFileUrl(id: string): Promise<string | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const file = request.result;
      if (file instanceof Blob) {
        const url = URL.createObjectURL(file);
        resolve(url);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error('IndexedDB get error:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Checks if an audio file exists in IndexedDB for the given ID.
 */
export async function hasAudioFile(id: string): Promise<boolean> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getKey(id);

    request.onsuccess = () => {
      resolve(request.result !== undefined);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Deletes an audio file from IndexedDB.
 */
export async function deleteAudioFile(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
