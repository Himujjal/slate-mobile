import {
  type Context,
  type Ref,
  type RefCallback,
  type RefObject,
  useCallback,
  useContext,
} from 'react';

/**
 * This hook is used to get the value of a context in a safe way.
 * It will throw an error if the context is not found.
 *
 * @param context The context to get the value from.
 * @param contextName The name of the context to use in the error message.
 * @returns The value of the context.
 */
export function useSafeContext<T>(
  context: Context<T>,
  contextName?: string
): NonNullable<T> {
  const value = useContext(context);
  if (value === null || value === undefined) {
    throw new Error(
      `${contextName || 'Context'} not found. Make sure to wrap your component with the provider.`
    );
  }
  return value as NonNullable<T>;
}

/**
 * This hook is used to create a callback that can be used to set multiple refs at once.
 * It will call the provided callback with the value of the first ref that is defined.
 *
 * @param refs The refs to set the value for.
 * @returns A callback that can be used to set multiple refs at once.
 */
export function useMultipleRefs<T>(
  ...refs: (Ref<T | null> | undefined)[]
): RefCallback<T> {
  return useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (!ref) return;
        if (typeof ref === 'function') {
          ref(value);
        } else {
          (ref as RefObject<T | null>).current = value;
        }
      }
    },
    [refs]
  );
}
