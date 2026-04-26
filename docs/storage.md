# Storage System

Cross-platform key-value storage abstraction. Uses MMKV on native (iOS/Android) and localStorage on web.

## Import

```typescript
import { kv } from '@storage/kv';
import { tokenStorage } from '@storage/token-storage';
```

## KV Storage (`@storage/kv`)

### API

| Method | Signature | Description |
|--------|-----------|-------------|
| `getString` | `(key: string) => string \| null` | Read string value |
| `setString` | `(key: string, value: string) => void` | Write string value |
| `getNumber` | `(key: string) => number \| null` | Read number value |
| `setNumber` | `(key: string, value: number) => void` | Write number value |
| `getBoolean` | `(key: string) => boolean \| null` | Read boolean value |
| `setBoolean` | `(key: string, value: boolean) => void` | Write boolean value |
| `getObject` | `<T>(key: string) => T \| null` | Read and JSON.parse an object |
| `setObject` | `<T>(key: string, value: T) => void` | JSON.stringify and write object |
| `remove` | `(key: string) => void` | Delete a key |
| `clear` | `() => void` | Delete all keys |
| `getAllKeys` | `() => string[]` | List all stored keys |
| `contains` | `(key: string) => boolean` | Check if key exists |

### Usage

```typescript
import { kv } from '@storage/kv';

// String
kv.setString('username', 'alice');
const name = kv.getString('username');

// Number
kv.setNumber('high_score', 1000);
const score = kv.getNumber('high_score');

// Boolean
kv.setBoolean('dark_mode', true);
const dark = kv.getBoolean('dark_mode');

// Object
kv.setObject('user_prefs', { theme: 'dark', lang: 'en' });
const prefs = kv.getObject<{ theme: string; lang: string }>('user_prefs');

// Utility
kv.contains('username');   // true
kv.getAllKeys();           // ['username', 'high_score', ...]
kv.remove('temp_key');
kv.clear();                // WARNING: removes everything
```

### Platform Details

| Platform | Backend | Notes |
|----------|---------|-------|
| iOS | MMKV | Native performance |
| Android | MMKV | Native performance |
| Web | localStorage | Synchronous, ~5MB limit |

The code auto-detects the platform and uses the appropriate backend. Same API everywhere.

## Token Storage (`@storage/token-storage`)

Dedicated storage for auth tokens, wrapping `@storage/kv`.

### API

| Method | Description |
|--------|-------------|
| `saveTokens(accessToken, refreshToken)` | Persist auth tokens |
| `getTokens()` | Get `{ accessToken, refreshToken } \| null` |
| `clearTokens()` | Remove stored tokens |
| `saveUser(user)` | Persist user object |
| `getUser()` | Get stored user object |
| `clearUser()` | Remove stored user |
| `clearAll()` | Remove all auth data (tokens + user) |
| `hasStoredAuth()` | Check if any auth data exists |

### Usage

```typescript
import { tokenStorage } from '@storage/token-storage';

// Save after login
tokenStorage.saveTokens(accessToken, refreshToken);
tokenStorage.saveUser({ id: '1', name: 'Alice', email: 'alice@example.com' });

// Check on app start
if (tokenStorage.hasStoredAuth()) {
  const tokens = tokenStorage.getTokens();
  const user = tokenStorage.getUser();
}

// Clear on logout
tokenStorage.clearAll();
```

## Integration with Flux Auth

The auth hooks in `@flux/auth-hooks` automatically use `tokenStorage` for persisting auth state. You generally don't need to interact with `tokenStorage` directly unless you're building custom auth logic.

## File Reference

| File | Exports |
|------|---------|
| `storage/kv.ts` | `kv` object with all KV methods |
| `storage/token-storage.ts` | `tokenStorage` object with auth-specific methods |
| `storage/index.ts` | Barrel export (currently empty) |
| `storage/table.ts` | Empty (placeholder for table storage) |
