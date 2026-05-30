import type { KvAdapter } from './types';

const localStorageAdapter: KvAdapter = {
  getString: (key: string): string | undefined => {
    return globalThis.localStorage.getItem(key) ?? undefined;
  },
  setString: (key: string, value: string): void => {
    globalThis.localStorage.setItem(key, value);
  },
  getNumber: (key: string): number | undefined => {
    const value = globalThis.localStorage.getItem(key);
    if (value === null) return undefined;
    return Number(value);
  },
  setNumber: (key: string, value: number): void => {
    globalThis.localStorage.setItem(key, String(value));
  },
  getBoolean: (key: string): boolean | undefined => {
    const value = globalThis.localStorage.getItem(key);
    if (value === null) return undefined;
    return value === 'true';
  },
  setBoolean: (key: string, value: boolean): void => {
    globalThis.localStorage.setItem(key, String(value));
  },
  getObject: <T>(key: string): T | undefined => {
    const value = globalThis.localStorage.getItem(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },
  setObject: <T>(key: string, value: T): void => {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    globalThis.localStorage.removeItem(key);
  },
  clear: (): void => {
    globalThis.localStorage.clear();
  },
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  },
  contains: (key: string): boolean => {
    return globalThis.localStorage.getItem(key) !== null;
  },
};

export class MemoryKvAdapter implements KvAdapter {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map<string, string>();
  }

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  setString(key: string, value: string): void {
    this.store.set(key, value);
  }

  getNumber(key: string): number | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;
    return Number(value);
  }

  setNumber(key: string, value: number): void {
    this.store.set(key, String(value));
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;
    return value === 'true';
  }

  setBoolean(key: string, value: boolean): void {
    this.store.set(key, String(value));
  }

  getObject<T>(key: string): T | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  setObject<T>(key: string, value: T): void {
    this.store.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }

  contains(key: string): boolean {
    return this.store.has(key);
  }

  get size(): number {
    return this.store.size;
  }
}

function createPlatformAdapter(): KvAdapter {
  try {
    const { Platform } = require('react-native') as {
      Platform: { OS: string };
    };
    const { createMMKV } = require('react-native-mmkv') as {
      createMMKV: (opts: { id: string }) => {
        getString: (key: string) => string | undefined;
        set: (key: string, value: string) => void;
        remove: (key: string) => void;
        clearAll: () => void;
        getAllKeys: () => string[];
      };
    };

    const isWeb = Platform.OS === 'web';
    const mmkv = isWeb ? null : createMMKV({ id: 'slate-storage' });

    const store = {
      getItem(key: string): string | null {
        if (isWeb) return globalThis.localStorage.getItem(key);
        return mmkv?.getString(key) ?? null;
      },
      setItem(key: string, value: string): void {
        if (isWeb) {
          globalThis.localStorage.setItem(key, value);
        } else {
          mmkv?.set(key, value);
        }
      },
      removeItem(key: string): void {
        if (isWeb) {
          globalThis.localStorage.removeItem(key);
        } else {
          mmkv?.remove(key);
        }
      },
      clear(): void {
        if (isWeb) {
          globalThis.localStorage.clear();
        } else {
          mmkv?.clearAll();
        }
      },
      key(index: number): string | null {
        if (isWeb) return globalThis.localStorage.key(index);
        const allKeys = mmkv?.getAllKeys() ?? [];
        return allKeys[index] ?? null;
      },
      get length(): number {
        if (isWeb) return globalThis.localStorage.length;
        return mmkv?.getAllKeys().length ?? 0;
      },
    };

    return {
      getString: (key: string): string | undefined =>
        store.getItem(key) ?? undefined,
      setString: (key: string, value: string): void =>
        store.setItem(key, value),
      getNumber: (key: string): number | undefined => {
        const value = store.getItem(key);
        if (value === null) return undefined;
        return Number(value);
      },
      setNumber: (key: string, value: number): void =>
        store.setItem(key, String(value)),
      getBoolean: (key: string): boolean | undefined => {
        const value = store.getItem(key);
        if (value === null) return undefined;
        return value === 'true';
      },
      setBoolean: (key: string, value: boolean): void =>
        store.setItem(key, String(value)),
      getObject: <T>(key: string): T | undefined => {
        const value = store.getItem(key);
        if (value === null) return undefined;
        try {
          return JSON.parse(value) as T;
        } catch {
          return undefined;
        }
      },
      setObject: <T>(key: string, value: T): void =>
        store.setItem(key, JSON.stringify(value)),
      remove: (key: string): void => store.removeItem(key),
      clear: (): void => store.clear(),
      getAllKeys: (): string[] => {
        const keys: string[] = [];
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i);
          if (key !== null) keys.push(key);
        }
        return keys;
      },
      contains: (key: string): boolean => store.getItem(key) !== null,
    };
  } catch {
    if (typeof globalThis.localStorage !== 'undefined') {
      return localStorageAdapter;
    }
    return new MemoryKvAdapter();
  }
}

let currentAdapter: KvAdapter = createPlatformAdapter();

export function setKvAdapter(adapter: KvAdapter): void {
  currentAdapter = adapter;
}

export function resetKvAdapter(): void {
  currentAdapter = createPlatformAdapter();
}

export const kv = {
  getString: (key: string): string | undefined => {
    return currentAdapter.getString(key);
  },
  setString: (key: string, value: string): void => {
    currentAdapter.setString(key, value);
  },
  getNumber: (key: string): number | undefined => {
    return currentAdapter.getNumber(key);
  },
  setNumber: (key: string, value: number): void => {
    currentAdapter.setNumber(key, value);
  },
  getBoolean: (key: string): boolean | undefined => {
    return currentAdapter.getBoolean(key);
  },
  setBoolean: (key: string, value: boolean): void => {
    currentAdapter.setBoolean(key, value);
  },
  getObject: <T>(key: string): T | undefined => {
    return currentAdapter.getObject<T>(key);
  },
  setObject: <T>(key: string, value: T): void => {
    currentAdapter.setObject(key, value);
  },
  remove: (key: string): void => {
    currentAdapter.remove(key);
  },
  clear: (): void => {
    currentAdapter.clear();
  },
  getAllKeys: (): string[] => {
    return currentAdapter.getAllKeys();
  },
  contains: (key: string): boolean => {
    return currentAdapter.contains(key);
  },
};

export type Kv = typeof kv;
