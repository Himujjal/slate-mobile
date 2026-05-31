# Flux - Agent Guidelines

Flux is the infrastructure layer that handles **state, persistence, auth, and sync** all in one.
The app layer simply defines stores and uses hooks — it never worries about tokens, KV writes,
or server communication.

- **State**: Legend-State observables with typed store creators
- **Persistence**: Automatic local persistence via `ObservablePersistFlux` (KV-backed)
- **Auth**: Built-in auth state, token management, and OTP/Apple login hooks
- **API Client**: Authenticated HTTP client with automatic 401 → refresh → retry
- **Sync**: (planned) Remote sync engine on top of Legend-State's sync plugins

## Core Concepts

### Stores

- **createTabularStore**: For JSON arrays (collections of records)
- **createKvStore**: Key-value store (settings, preferences)
- **createFluxStore**: Generic store
- **createFluxAtom**: Single observable value

```typescript
import { createTabularStore, createKvStore } from '@flux';

interface Todo { id: number; text: string; completed: boolean; }

export const todos$ = createTabularStore<Todo[]>({ initial: [], name: 'todos' });

export const settings$ = createKvStore<{ theme: 'light' | 'dark' }>({
  initial: { theme: 'light' },
  name: 'settings',
});
```

### Actions

- **createAction**: Simple action wrapper
- **createBatchAction**: Batched updates (single re-render)

```typescript
import { createBatchAction } from '@flux';

const addTodo = createBatchAction((text: string) => {
  todos$.todos.push({ id: Date.now(), text, completed: false });
});
```

### Hooks

- **useFluxValue**: Track observable changes
- **useFluxObservable**: Local component state
- **observer**: Merge multiple subscriptions

```typescript
const user = useFluxValue(store$.user);

const Component = observer(() => {
  const a = useFluxValue(store$.a);
  const b = useFluxValue(store$.b);
  return <Text>{a} {b}</Text>;
});
```

## File Structure

```
flux/
├── state.ts         # Store creators (createFluxStore, createKvStore, createTabularStore, createFluxAtom)
├── actions.ts       # Action helpers (createAction, createBatchAction)
├── hooks.ts         # React hooks (useFluxValue, useFluxObservable, observer)
├── persistence.ts   # ObservablePersistFlux — auto-persists stores to KV storage
├── auth-store.ts    # Auth state observable (user, tokens, loading, error)
├── auth-hooks.ts    # Auth React hooks (useAuth, useUser, useIsAuthenticated) + API logic
├── api-client.ts    # Authenticated HTTP client with auto 401 → refresh → retry
└── index.ts         # Barrel export
```

## Patterns

### Auth (flux provides the primitives)

Auth state, hooks, and API client are **flux-level primitives** — the app just uses them:

```typescript
import { useAuth, useUser } from '@flux';
import { api } from '@flux/api-client';

function ProfileScreen() {
  const { user, logout } = useAuth();
  // No token management, no KV writes, no refresh logic needed.
}
```

### App state (defined in app/)

App-specific data stores are defined in `app/state/` using flux store creators.
Give them a `name` for automatic persistence:

```typescript
// app/state/settings.store.ts
import { createKvStore } from '@flux';

export const settings$ = createKvStore<{ theme: 'light' | 'dark' }>({
  initial: { theme: 'light' },
  name: 'settings',  // auto-persists to KV — no manual save/load
});
```

### Data fetching (use the API client)

The `api` client handles auth tokens and 401 refresh automatically:

```typescript
import { api } from '@flux/api-client';

const posts = await api.get<Post[]>('/posts');
await api.post('/posts', { title: 'Hello' });
```