import type { Observable } from '@legendapp/state';
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite';
import { configureSynced, syncObservable } from '@legendapp/state/sync';

export interface FluxPersistConfig {
  name: string;
}

export interface FluxPersistOptions {
  persist: FluxPersistConfig;
}

export function createSqlitePersistence() {
  return configureSynced({
    persist: {
      plugin: observablePersistSqlite,
    },
  });
}

export function persistFlux<T>(
  store: Observable<T>,
  config: FluxPersistConfig
) {
  syncObservable(store, {
    persist: {
      name: config.name,
      plugin: observablePersistSqlite,
    },
  });
}

export { syncObservable, configureSynced };
