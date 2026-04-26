# Architecture

## Core Concept: Copy-Pasteable Infrastructure

The Axion framework is designed around one principle: **you only build in `app/`**. Everything else—UI components, state management, storage, server—is pre-built infrastructure you import but never modify. This lets you build production apps fast without reinventing wheels.

### What's Copy-Pasteable

| Module | Contents | Why it's stable |
|--------|----------|-----------------|
| `ui/` | 20+ components (Button, Card, Input, Modal, etc.) + Theme + Demo system | Generic, app-agnostic UI primitives |
| `flux/` | Store creators, actions, hooks, auth store/hooks, API client | Pure state management logic |
| `storage/` | KV cross-platform storage, token storage | Infrastructure layer |
| `server/` | Elysia server, auth routes, AI routes, middleware, JWT utils | Backend API infrastructure |
| `constants/` | Theme colors, spacing, typography | Design system constants |
| `hooks/` | Custom hooks | Reusable logic |
| `scripts/` | Git hooks installer | Dev tooling |
| `assets/` | Images, fonts | Static resources |

### What's Dynamic

| Path | What you build |
|------|----------------|
| `app/` | Screens, layouts, features, navigation |
| `app/_layout.tsx` | Root layout defining your routes |
| `app/(tabs)/` | Tab-based navigation screens |
| `app/*.tsx` | Individual pages/screens |

## Module Design

### Data Flow

```
┌─────────┐     imports      ┌───────────┐
│  app/   │ ───────────────► │    ui/    │
│ (pages) │                  │(components)│
└────┬────┘                  └───────────┘
     │
     │ imports
     ▼
┌──────────┐     uses      ┌───────────┐
│  flux/   │ ◄───────────► │ storage/  │
│(state)   │               │  (KV)     │
└────┬─────┘               └───────────┘
     │
     │ HTTP requests
     ▼
┌──────────┐
│ server/  │
│(Elysia)  │
└──────────┘
```

1. **app/** imports **ui/** components and **flux/** stores
2. **flux/** stores persist to **storage/** (MMKV/localStorage)
3. **flux/api-client** makes HTTP requests to **server/**
4. **server/** uses **flux/** for JWT/password utilities (shared code)

### Path Aliases (from tsconfig.json)

```typescript
import { Button } from '@ui/button';           // → ui/button/button
import { useAuth } from '@flux/auth-hooks';    // → flux/auth-hooks
import { kv } from '@storage/kv';              // → storage/kv
import { Colors } from '@constants/theme';     // → constants/theme (not used - theme is at ui/theme)
```

Note: Theme imports use `@ui/theme` since the theme lives in the ui module.

## File Structure Rules

1. **Component per folder** in `ui/`: each component gets its own folder with component + demo:
   ```
   ui/button/
     button.tsx        # Component
     button-demo.tsx   # Demo for playground
   ```

2. **Feature per folder** in `app/`: organize by screen/feature:
   ```
   app/
     _layout.tsx       # Root layout (defines all routes)
     index.tsx         # Home screen
     (tabs)/
       _layout.tsx     # Tab layout
       index.tsx       # Tab 1
       explore.tsx     # Tab 2
     dev-tools/
       index.tsx       # Dev tools menu
       playground/
         _layout.tsx   # Playground with sidebar
         index.tsx     # Redirect to default component
   ```

3. **Flat modules** in `flux/` and `storage/`: single files per concept

## Adding New Routes

In `app/_layout.tsx`:
```typescript
// Add a new route definition
<Stack.Screen name="my-new-screen" />
```

Then create `app/my-new-screen.tsx` for the route.

## Adding New Components

In `ui/`:
1. Create `ui/component-name/component-name.tsx`
2. Create `ui/component-name/component-name-demo.tsx`
3. Export from component file
4. Add to `ui/playground.tsx` imports and component map
5. Add to `ui/index.tsx` barrel export
6. Add route in `app/dev-tools/playground/_layout.tsx`

See [UI docs](./ui.md) for detailed component creation guide.

## Adding New Server Routes

In `server/`:
1. Create `server/my-routes.ts`
2. Define Elysia routes
3. Import and mount in `server/index.ts`

See [Server docs](./server.md) for details.

## Environment Variables

The server expects these env vars (in `.env` at project root):
- `JWT_SECRET` - Secret for signing JWT tokens
- `AUTH_REDIRECT_URL` - OAuth redirect URL (optional)
- `LLM_API_KEY` - API key for LLM proxy (optional)
- `LLM_BASE_URL` - Base URL for LLM API (optional)
