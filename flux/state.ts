import {
  type ImmutableObservableBase,
  type Observable,
  type ObservableParam,
  observable,
} from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistFlux } from './persistence';

export type FluxObservable<T> = ImmutableObservableBase<T>;

export interface FluxStoreConfig<T> {
  initial: T;
  name?: string;
  keyExtractor?: (item: unknown) => string | number;
}

export type FluxStoreType = 'tabular' | 'kv';

function persistStore<T>(store$: Observable<T>, name: string): void {
  syncObservable(store$ as unknown as ObservableParam<T>, {
    persist: {
      name,
      plugin: ObservablePersistFlux,
    },
  });
}

export function createTabularStore<T>(
  config: FluxStoreConfig<T>
): Observable<T> {
  const store$ = observable(config.initial as T);

  if (config.name) {
    persistStore(store$, config.name);
  }

  return store$;
}

export function createKvStore<T>(config: FluxStoreConfig<T>): Observable<T> {
  const store$ = observable(config.initial as T);

  if (config.name) {
    persistStore(store$, config.name);
  }

  return store$;
}

export function createFluxStore<T>(config: FluxStoreConfig<T>): Observable<T> {
  const store$ = observable(config.initial as T);

  if (config.name) {
    persistStore(store$, config.name);
  }

  return store$;
}

export function createFluxAtom<T>(initial: T): Observable<T> {
  return observable(initial) as Observable<T>;
}

export { observable };
