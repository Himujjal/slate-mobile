import { type Observable, observable } from '@legendapp/state';
import type { RetryOptions } from '@legendapp/state';
import type { SyncedSubscribeParams } from '@legendapp/state/sync';
import {
  type CrudErrorParams,
  syncedCrud,
} from '@legendapp/state/sync-plugins/crud';
import { ObservablePersistFlux } from './persistence';

export interface SyncedStoreConfig<T extends { id: string | number }> {
  initial: T[];
  name: string;
  fetch: () => Promise<T[]>;
  create?: (item: T) => Promise<T>;
  update?: (id: string | number, changes: Partial<T>) => Promise<T>;
  delete?: (id: string | number) => Promise<void>;
  retry?: RetryOptions;
  onError?: (error: Error, params: CrudErrorParams) => void;
  retrySync?: boolean;
  subscribe?: (params: SyncedSubscribeParams<T[]>) => (() => void) | undefined;
}

export interface SyncedValueConfig<T> {
  initial: T;
  name: string;
  fetch: () => Promise<T | null>;
  create?: (item: T) => Promise<T>;
  update?: (changes: Partial<T>) => Promise<T>;
  delete?: () => Promise<void>;
  retry?: RetryOptions;
  onError?: (error: Error, params: CrudErrorParams) => void;
  retrySync?: boolean;
  subscribe?: (params: SyncedSubscribeParams<T>) => (() => void) | undefined;
}

const defaultRetry: RetryOptions = {
  times: 3,
  delay: 1000,
  backoff: 'exponential',
  maxDelay: 30000,
};

function buildPersistConfig(name: string, retrySync?: boolean) {
  return {
    name,
    plugin: ObservablePersistFlux,
    ...(retrySync ? { retrySync: true } : {}),
  };
}

export function createSyncedStore<T extends { id: string | number }>(
  config: SyncedStoreConfig<T>
): Observable<T[]> {
  const createFn = config.create;
  const updateFn = config.update;
  const deleteFn = config.delete;

  const synced = syncedCrud({
    list: config.fetch,
    create: createFn ? (item: T) => createFn(item) : undefined,
    update: updateFn
      ? (item: Partial<T> & { id: string | number }) => updateFn(item.id, item)
      : undefined,
    delete: deleteFn
      ? (item: { id: string | number }) => deleteFn(item.id)
      : undefined,
    as: 'array' as const,
    initial: config.initial,
    retry: config.retry ?? defaultRetry,
    onError: config.onError,
    // biome-ignore lint/suspicious/noExplicitAny: syncedCrud generics are too complex for wrapper inference
    // biome-ignore lint/suspicious/noExplicitAny: syncedCrud generics are too complex for wrapper inference
    subscribe: config.subscribe as any,
    persist: buildPersistConfig(config.name, config.retrySync),
    // biome-ignore lint/suspicious/noExplicitAny: syncedCrud generics are too complex for wrapper inference
  } as any) as T[];

  return observable(synced) as unknown as Observable<T[]>;
}

export function createSyncedValue<T>(
  config: SyncedValueConfig<T>
): Observable<T> {
  const synced = syncedCrud({
    get: () => config.fetch(),
    create: config.create ? (item: T) => config.create?.(item) : undefined,
    update: config.update
      ? (item: Partial<T>) => config.update?.(item)
      : undefined,
    delete: config.delete ? () => config.delete?.() : undefined,
    as: 'value' as const,
    initial: config.initial,
    retry: config.retry ?? defaultRetry,
    onError: config.onError,
    // biome-ignore lint/suspicious/noExplicitAny: syncedCrud generics are too complex for wrapper inference
    subscribe: config.subscribe as any,
    persist: buildPersistConfig(config.name, config.retrySync),
    // biome-ignore lint/suspicious/noExplicitAny: syncedCrud generics are too complex for wrapper inference
  } as any) as T;

  return observable(synced) as unknown as Observable<T>;
}
