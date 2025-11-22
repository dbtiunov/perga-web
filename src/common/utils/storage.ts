/**
 * Safe localStorage helpers with SSR guards and typed getters/setters.
 * These utilities avoid throwing if storage is unavailable (e.g., in private mode,
 * disabled storage, or during SSR). They return provided defaults when appropriate.
 */

const hasWindow = typeof window !== 'undefined';

function getStorage(): Storage | null {
  try {
    if (!hasWindow) {
      return null;
    }

    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Get raw string value from localStorage. */
export function get(key: string, defaultValue: string | null = null): string | null {
  const storage = getStorage();
  if (!storage) {
    return defaultValue;
  }

  try {
    const value = storage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

/** Set raw string value to localStorage. */
export function set(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // ignore
  }
}

/** Remove key from localStorage. */
export function remove(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Get parsed JSON value from localStorage. */
export function getJSON<T>(key: string, defaultValue: T): T {
  const raw = get(key, null);
  if (raw === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/** Set JSON-serializable value to localStorage. */
export function setJSON<T>(key: string, value: T): void {
  try {
    const raw = JSON.stringify(value);
    set(key, raw);
  } catch {
    // ignore serialization errors
  }
}

/** Get boolean value from localStorage. Accepts 'true'/'false' (string) or 1/0. */
export function getBoolean(key: string, defaultValue = false): boolean {
  const raw = get(key, null);

  let result: boolean;
  switch (raw) {
    case 'true':
    case '1':
      result = true;
      break;
    case 'false':
    case '0':
      result = false;
      break;
    default:
      result = defaultValue;
      break;
  }

  return result;
}

/** Set boolean value to localStorage (stored as 'true'/'false'). */
export function setBoolean(key: string, value: boolean): void {
  set(key, String(value));
}

const Storage = {
  get,
  set,
  remove,
  getJSON,
  setJSON,
  getBoolean,
  setBoolean,
};

export default Storage;
