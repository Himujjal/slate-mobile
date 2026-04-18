import { batch } from '@legendapp/state';

export type FluxAction<T extends (...args: never[]) => void> = T;

export function createAction<T extends (...args: never[]) => void>(
  action: T
): T {
  return action;
}

export function createBatchAction<T extends (...args: never[]) => void>(
  action: T
): T {
  const batchedAction = (...args: Parameters<T>) => {
    batch(() => {
      action(...args);
    });
  };
  return batchedAction as T;
}

export { batch };
