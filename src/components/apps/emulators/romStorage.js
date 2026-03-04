const DATABASE_NAME = "win95p-rom-library";
const DATABASE_VERSION = 1;
const STORE_NAME = "uploaded-roms";

const createDatabase = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("system", "system", { unique: false });
        store.createIndex("uploadedAt", "uploadedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Failed to open the ROM storage database."));
  });

const withStore = async (mode, callback) => {
  const database = await createDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    let settled = false;

    const finishResolve = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const finishReject = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    transaction.oncomplete = () => {
      database.close();
      finishResolve(undefined);
    };

    transaction.onerror = () => {
      database.close();
      finishReject(transaction.error || new Error("ROM storage transaction failed."));
    };

    transaction.onabort = () => {
      database.close();
      finishReject(transaction.error || new Error("ROM storage transaction was aborted."));
    };

    Promise.resolve(callback(store, finishResolve, finishReject)).catch((error) => {
      try {
        transaction.abort();
      } catch {
        database.close();
      }
      finishReject(error);
    });
  });
};

const createRomId = (system, file) => {
  const randomPart =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${system}-${randomPart}-${file.name}`;
};

export const saveUploadedRom = async (system, file) => {
  if (!(file instanceof Blob)) {
    throw new Error("The selected upload is not a valid file.");
  }

  const record = {
    id: createRomId(system, file),
    system,
    fileName: "name" in file ? file.name : `upload-${Date.now()}`,
    mimeType: file.type || "application/octet-stream",
    size: file.size || 0,
    lastModified: "lastModified" in file ? file.lastModified : Date.now(),
    uploadedAt: Date.now(),
    blob: file,
  };

  await withStore("readwrite", (store, finishResolve, finishReject) => {
    const request = store.put(record);
    request.onsuccess = () => finishResolve(record);
    request.onerror = () =>
      finishReject(request.error || new Error("Failed to store the uploaded ROM."));
  });

  return record;
};

export const listUploadedRoms = async (system) => {
  const records = await withStore("readonly", (store, finishResolve, finishReject) => {
    const request = store.getAll();
    request.onsuccess = () => finishResolve(request.result || []);
    request.onerror = () =>
      finishReject(request.error || new Error("Failed to read stored ROM uploads."));
  });

  return records
    .filter((record) => record?.system === system)
    .sort((left, right) => {
      const byTime = (right?.uploadedAt || 0) - (left?.uploadedAt || 0);
      if (byTime !== 0) return byTime;
      return String(left?.fileName || "").localeCompare(String(right?.fileName || ""));
    });
};
