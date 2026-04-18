import {
  type ImmutableObservableBase,
  type Observable,
  observable,
} from '@legendapp/state';

export type FluxObservable<T> = ImmutableObservableBase<T>;

export interface FluxStoreConfig<T> {
  initial: T;
  name?: string;
  keyExtractor?: (item: unknown) => string | number;
}

export type FluxStoreType = 'tabular' | 'kv';

export function createTabularStore<T>(
  config: FluxStoreConfig<T>
): Observable<T> {
  const store$ = observable({
    ...config.initial,
  } as T);

  return store$;
}

export function createKvStore<T>(config: FluxStoreConfig<T>): Observable<T> {
  const store$ = observable({
    ...config.initial,
  } as T);

  return store$;
}

export function createFluxStore<T>(config: FluxStoreConfig<T>): Observable<T> {
  const store$ = observable({
    ...config.initial,
  } as T);

  return store$;
}

export function createFluxAtom<T>(initial: T): Observable<T> {
  return observable(initial) as Observable<T>;
}

export { observable };
