import type { Observable } from '@legendapp/state';
import { observer, useObservable, useValue } from '@legendapp/state/react';

export { useValue, observer };

export function useFluxValue<T>(selector: Observable<T> | (() => T)): T {
  return useValue(selector);
}

export function useFluxObservable<T>(initial: T | (() => T)) {
  return useObservable(initial);
}

export function useFluxComputed<T>(compute: () => T) {
  return useValue(compute);
}
