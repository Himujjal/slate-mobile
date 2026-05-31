import { type Change, applyChanges } from '@legendapp/state';
import type {
  ObservablePersistPlugin,
  ObservablePersistPluginOptions,
  PersistMetadata,
  PersistOptions,
} from '@legendapp/state/sync';
import { kv } from '../storage';

const METADATA_SUFFIX = '__m';

export class ObservablePersistFlux implements ObservablePersistPlugin {
  private data = new Map<string, unknown>();

  initialize(_config: ObservablePersistPluginOptions): void {}

  getTable<T = unknown>(
    table: string,
    init: object,
    _config: PersistOptions
  ): T {
    const cached = this.data.get(table);
    if (cached !== undefined) return cached as T;

    const stored = kv.getObject<T>(table);
    if (stored !== undefined) {
      this.data.set(table, stored);
      return stored;
    }

    return init as T;
  }

  getMetadata(table: string, _config: PersistOptions): PersistMetadata {
    const meta = kv.getObject<PersistMetadata>(table + METADATA_SUFFIX);
    return meta ?? {};
  }

  set(table: string, changes: Change[], _config: PersistOptions): void {
    const existing = this.data.get(table) ?? kv.getObject(table) ?? {};
    this.data.set(table, applyChanges(existing, changes));
    this.save(table);
  }

  setMetadata(
    table: string,
    metadata: PersistMetadata,
    _config: PersistOptions
  ): void {
    kv.setObject(table + METADATA_SUFFIX, metadata);
  }

  deleteTable(table: string, _config: PersistOptions): void {
    this.data.delete(table);
    kv.remove(table);
  }

  deleteMetadata(table: string, _config: PersistOptions): void {
    kv.remove(table + METADATA_SUFFIX);
  }

  private save(table: string): void {
    const value = this.data.get(table);
    if (value !== undefined && value !== null) {
      kv.setObject(table, value);
    } else {
      kv.remove(table);
    }
  }
}
