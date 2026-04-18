# Flux - Agent Guidelines

Flux is a state management library wrapping Legend-State with typed utilities.

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
├── state.ts       # Store creators
├── actions.ts    # Action helpers
├── hooks.ts      # React hooks
├── persistence.ts # SQLite persistence
└── index.ts      # Barrel export
```

## Pattern

Flux is a **library** - define app state in `app/` directory:

```typescript
// app/state.ts
import { createKvStore } from '@flux';

export const appState$ = createKvStore<{ user: string | null }>({
  initial: { user: null },
});