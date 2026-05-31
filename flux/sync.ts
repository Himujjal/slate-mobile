import { observable } from '@legendapp/state';
import { syncedCrud } from '@legendapp/state/sync-plugins/crud';
import { ObservablePersistFlux } from './persistence';

export interface SyncedStoreConfig<T extends { id: string | number }> {
  initial: T[];
  name: string;
  fetch: () => Promise<T[]>;
  create?: (item: T) => Promise<T>;
  update?: (id: string | number, changes: Partial<T>) => Promise<T>;
  delete?: (id: string | number) => Promise<void>;
}

export function createSyncedStore<T extends { id: string | number }>(
  config: SyncedStoreConfig<T>
) {
  const createFn = config.create;
  const updateFn = config.update;
  const deleteFn = config.delete;

  return observable(
    syncedCrud({
      list: config.fetch,
      create: createFn ? (item: T) => createFn(item) : undefined,
      update: updateFn
        ? (item: Partial<T> & { id: string | number }) =>
            updateFn(item.id, item)
        : undefined,
      delete: deleteFn
        ? (item: { id: string | number }) => deleteFn(item.id)
        : undefined,
      as: 'array' as const,
      initial: config.initial,
      persist: {
        name: config.name,
        plugin: ObservablePersistFlux,
      },
    })
  );
}
