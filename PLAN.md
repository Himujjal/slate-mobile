# Flux Sync Engine — Analysis & Plan

## Goal

App layer uses state via simple `useFluxValue(store$.field)` and `useAuth()` calls without
worrying about tokens, persistence, KV writes, or server sync. Flux handles all of that.

## Philosophy

Flux is the **infrastructure layer**. It provides:
- **State** — store creators wrapping Legend-State
- **Persistence** — automatic via `ObservablePersistFlux`
- **Auth** — low-level primitives (`authStore$`, `useAuth`, `useUser`, OTP/Apple login)
- **API** — authenticated HTTP client with auto 401 → refresh → retry
- **Sync** — (planned) remote sync engine

Auth state, hooks, and API client are **flux primitives**, not app-level concerns.
The app simply uses them without knowing about tokens or KV writes.

## Current State

| Capability | Status | Notes |
|---|---|---|
| Store creation | Done | `createFluxStore`, `createKvStore`, `createTabularStore`, `createFluxAtom` |
| Local persistence | Done | `ObservablePersistFlux` → KV storage; `syncObservable` wires it up |
| React hooks | Done | `useFluxValue`, `useFluxObservable`, `observer` |
| Auth state (in-memory) | Done | `authState$` tracks user, tokens, loading, error |
| Auth hooks + API | Done | `useAuth()` exposes OTP/Apple login, logout, refresh |
| API client | Done | `api.get/post/put/delete` with auto Bearer + 401 refresh |
| Server sync engine | Missing | No remote sync (Legend-State `syncedFetch`, CRUD, retry) |
| Sync primitives | Missing | No `createSyncedStore()` or equivalent pre-configured helper |

## Internal Issues (flux bugs, not architectural)

These are implementation quality problems within flux — no architectural change needed:

### 1. Auth persistence is manual and duplicated

`auth-hooks.ts:handleAuthSuccess()` and `api-client.ts:refreshToken()` both manually call
`kv.setString/setObject`. The `authState$` observable should auto-persist via
`syncObservable` (like all other flux stores), removing the need for manual KV writes.

**Fix:** Make `authState$` use `createKvStore` with `name: 'auth'` so persistence is
automatic. Remove all manual `kv.setString/setObject/kv.remove` calls in auth code.

### 2. Token refresh is duplicated

`useAuth().refresh()` in `auth-hooks.ts` and `refreshToken()` in `api-client.ts`
implement the same `/auth/refresh` logic (hit endpoint, update state+Kv, clear on failure).

**Fix:** Keep only `api-client.ts`'s refresh. The `useAuth().refresh()` hook should
delegate to `apiClient`'s refresh internally (or be removed — the API client handles
refresh transparently on 401 anyway).

### 3. Auth hooks use raw `fetch` instead of `apiClient`

`auth-hooks.ts` has its own `fetchAuth()` helper that manually constructs fetch calls.
The `api` client already handles auth tokens, content-type headers, and error parsing.

**Fix:** Rewrite auth hooks to use `api.post('/auth/otp/request', {...})` etc.
This means auth endpoints go through the same authenticated path as data endpoints.

### 4. `authState$` doesn't use flux store creators

Created with raw `observable()` instead of `createKvStore()`, so it doesn't get the
auto-persistence wiring that every other flux store gets.

**Fix:** Use `createKvStore<AuthStateData>({ initial, name: 'auth' })`.

### 5. Auth barrel exports missing

`auth-store.ts` and `auth-hooks.ts` are not exported from `flux/index.ts`. App files
import from `@flux/auth-hooks` directly.

**Fix:** Add auth exports to `flux/index.ts` barrel.

## What's Actually Missing

### Sync Engine

No remote sync layer exists. A real sync engine needs:

1. **`flux/sync.ts`** — pre-configured sync helpers:
   - `createSyncedStore()` — wraps a store with remote fetch/set/CRUD via Legend-State's `syncObservable`
   - Auto-retry with backoff for offline support
   - Optimistic local-first updates
   - Uses `apiClient` under the hood (so auth is transparent)

2. **Sync-aware store creation** — apps can do:
   ```ts
   const posts$ = createSyncedStore<Post[]>({
     initial: [],
     name: 'posts',
     fetch: () => api.get('/posts'),
     create: (post) => api.post('/posts', post),
   });
   ```

### No app-level data stores exist

Beyond auth, no shared app stores exist. This is expected since features aren't built yet,
but the pattern needs to be established and validated end-to-end.

## Action Plan

### Phase 1: Fix Auth Internals (4 items, ~1 session)

1. **Swap `authState$` to use `createKvStore`** — auto-persists, no manual KV writes
2. **Rewrite auth hooks to use `apiClient`** — remove `fetchAuth()`, use `api.post()`
3. **Deduplicate token refresh** — keep `apiClient` refresh, remove `useAuth().refresh()`
4. **Export auth from `flux/index.ts`** barrel

### Phase 2: Build Sync Engine (~2 sessions)

5. **Create `flux/sync.ts`** with `createSyncedStore()` helper
6. **Validate end-to-end** with a real data store (e.g., a user profile or settings store)

### Phase 3: Cleanup

7. Update all imports across `app/` and `ui/` to use barrel exports
8. Remove any remaining manual KV writes outside of `flux/persistence.ts`

## Desired End State (App DX)

```typescript
// Auth — flux handles tokens, persistence, refresh transparently
import { useAuth } from '@flux';
const { user, isAuthenticated, logout } = useAuth();

// Data stores — flux handles local persistence + server sync
import { createSyncedStore } from '@flux';
export const posts$ = createSyncedStore<Post[]>({
  initial: [],
  name: 'posts',
  fetch: () => api.get('/posts'),
});

// API calls — auth tokens auto-attached
import { api } from '@flux';
await api.post('/posts', { title: 'Hello' });

// Components — just read state
import { useFluxValue } from '@flux';
const posts = useFluxValue(posts$.posts);
// That's it. No auth, no persistence, no sync, no KV concerns.
```
