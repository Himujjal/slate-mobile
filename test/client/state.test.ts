import { beforeEach, describe, expect, it } from 'bun:test';
import {
  createFluxAtom,
  createFluxStore,
  createKvStore,
  createTabularStore,
} from '../../flux/state';
import { MemoryKvAdapter, kv, setKvAdapter } from '../../storage';

let testCounter = 0;

function uniqueName(base: string): string {
  testCounter++;
  return `${base}_${testCounter}`;
}

async function waitForPersist(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
}

describe('flux state creators', () => {
  beforeEach(() => {
    setKvAdapter(new MemoryKvAdapter());
  });

  describe('createKvStore', () => {
    it('should set and get values in memory', () => {
      const store$ = createKvStore<{ count: number }>({
        initial: { count: 0 },
        name: uniqueName('counter'),
      });

      store$.count.set(42);

      expect(store$.count.peek()).toBe(42);
    });

    it('should hydrate existing KV data on creation', async () => {
      const name = uniqueName('counter');
      kv.setObject(name, { count: 99 });

      const store$ = createKvStore<{ count: number }>({
        initial: { count: 0 },
        name,
      });

      await waitForPersist();

      expect(store$.count.peek()).toBe(99);
    });

    it('should fall back to initial when no KV data exists', () => {
      const store$ = createKvStore<{ count: number }>({
        initial: { count: 0 },
        name: uniqueName('counter'),
      });

      expect(store$.count.peek()).toBe(0);
    });

    it('should not persist to KV when unnamed', () => {
      createKvStore<{ count: number }>({
        initial: { count: 0 },
      });

      expect(kv.getAllKeys()).toEqual([]);
    });
  });

  describe('createFluxAtom', () => {
    it('should create a simple observable without persistence', () => {
      const atom$ = createFluxAtom(0);
      expect(atom$.peek()).toBe(0);

      atom$.set(1);
      expect(atom$.peek()).toBe(1);
    });
  });

  describe('createFluxStore', () => {
    it('should hydrate existing KV data on creation', async () => {
      const name = uniqueName('generic');
      kv.setObject(name, { value: 'stored' });

      const store$ = createFluxStore<{ value: string }>({
        initial: { value: 'initial' },
        name,
      });

      await waitForPersist();

      expect(store$.value.peek()).toBe('stored');
    });

    it('should return initial value when no KV data', () => {
      const store$ = createFluxStore<{ value: string }>({
        initial: { value: 'initial' },
        name: uniqueName('generic'),
      });

      expect(store$.value.peek()).toBe('initial');
    });
  });

  describe('createTabularStore', () => {
    it('should hydrate existing array from KV on creation', async () => {
      const name = uniqueName('items');
      kv.setObject(name, [{ id: 1, text: 'stored item' }]);

      interface Item {
        id: number;
        text: string;
      }

      const store$ = createTabularStore<Item[]>({
        initial: [],
        name,
      });

      await waitForPersist();

      expect(store$.peek()).toHaveLength(1);
      expect(store$[0].text.peek()).toBe('stored item');
    });
  });
});
