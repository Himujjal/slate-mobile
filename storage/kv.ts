import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

const isWeb = Platform.OS === 'web';

const mmkv = !isWeb
  ? createMMKV({
      id: 'slate-storage',
    })
  : null;

const localStorage = {
  getItem: (key: string): string | null => {
    if (isWeb) {
      return globalThis.localStorage.getItem(key);
    }
    return mmkv?.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (isWeb) {
      globalThis.localStorage.setItem(key, value);
    } else {
      mmkv?.set(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isWeb) {
      globalThis.localStorage.removeItem(key);
    } else {
      mmkv?.remove(key);
    }
  },
  clear: (): void => {
    if (isWeb) {
      globalThis.localStorage.clear();
    } else {
      mmkv?.clearAll();
    }
  },
  key: (index: number): string | null => {
    if (isWeb) {
      return globalThis.localStorage.key(index);
    }
    const allKeys = mmkv?.getAllKeys() ?? [];
    return allKeys[index] ?? null;
  },
  get length(): number {
    if (isWeb) {
      return globalThis.localStorage.length;
    }
    return mmkv?.getAllKeys().length ?? 0;
  },
};

export const kv = {
  getString: (key: string): string | undefined => {
    return localStorage.getItem(key) ?? undefined;
  },
  setString: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  getNumber: (key: string): number | undefined => {
    const value = localStorage.getItem(key);
    if (value === null) return undefined;
    return Number(value);
  },
  setNumber: (key: string, value: number): void => {
    localStorage.setItem(key, String(value));
  },
  getBoolean: (key: string): boolean | undefined => {
    const value = localStorage.getItem(key);
    if (value === null) return undefined;
    return value === 'true';
  },
  setBoolean: (key: string, value: boolean): void => {
    localStorage.setItem(key, String(value));
  },
  getObject: <T>(key: string): T | undefined => {
    const value = localStorage.getItem(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },
  setObject: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  },
  contains: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },
};

export type Kv = typeof kv;
