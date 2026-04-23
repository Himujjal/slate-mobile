# Slate - Universal App Boilerplate Plan

## Overview

Transform this repo into a production-ready universal app boilerplate with:
- **Frontend**: Expo SPA (iOS, Android, Web)
- **Backend**: Bun/Elysia server serving the SPA as static assets
- **Shared**: TypeScript types, utilities between frontend and backend

---

## Current State Analysis

### Existing Structure

```
slate/
├── app/                    # expo-router pages
│   ├── _layout.tsx
│   ├── index.tsx
│   └── dev-tools/
├── flux/                   # state management (Legend-State wrapper)
│   ├── state.ts
│   ├── actions.ts
│   ├── hooks.ts
│   └── persistence.ts
├── ui/                     # UI components (partial)
│   ├── button/
│   ├── theme.tsx
│   └── index.tsx
├── hooks/                  # custom hooks
├── constants/             # app constants
├── server/                # Bun/Elysia API
│   ├── index.ts
│   ├── ai-routes.ts
│   ├── auth-routes.ts
│   └── ...
├── package.json            # single package.json
├── tsconfig.json          # single tsconfig
└── biome.json
```

### Issues to Address

1. **No SPA serving**: Server doesn't serve Expo web output
2. **Single package.json**: Both frontend and backend in one package
3. **Unclear separation**: No clear boundary between app code and library code
4. **Incomplete UI**: `ui/` mostly empty stubs
5. **No shared types**: Frontend/server types not shared

---

## Plan

### Phase 1: Project Structure

Organize as a monorepo with clear separation:

```
slate/
├── apps/
│   ├── web/               # Expo web output (built by expo)
│   └── server/            # Bun server
├── packages/
│   ├── app/              # React Native app (expo-router)
│   ├── ui/               # UI component library
│   ├── flux/             # State management
│   ├── shared/           # Shared types/utilities
│   └── server/           # Server library (routes, utils)
├── package.json          # Root workspace (optional)
├── biome.json
└── turbo.json            # Turborepo config (recommended)
```

**Recommendation**: Keep it simple first - don't over-structure. Use folder conventions instead of full monorepo until needed.

---

### Phase 2: Server SPA Integration

Configure Bun server to serve Expo web build:

1. **Build command**: Add `"build:web": "expo export --platform web"` to package.json
2. **Serve static**: Add static file serving to `server/index.ts`

```typescript
// server/index.ts - serve SPA
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: './apps/web',
    index: 'index.html',
  }))
  // ... routes
  .listen(3000);
```

3. **SPA fallback**: Handle client-side routing

```typescript
// Add wildcard route for SPA fallback
app.get('/*', () => {
  // Return index.html for all non-API routes
});
```

---

### Phase 3: Shared Types

Create `@shared` package for types used by both:

```typescript
// packages/shared/types.ts
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
}
```

Use path aliases:
- `@shared` → shared types
- `@server` → server utilities
- `@ui` → UI components

---

### Phase 4: UI Library Completeness

Build out `ui/` with essential components:

```
ui/
├── index.ts               # barrel exports
├── button/
├── input/
├── card/
├── text/
├── theme.tsx
└── provider.tsx
```

Components should be:
- Platform-aware (react-native + web)
- Theme-compatible
- Accessible

---

### Phase 5: Build Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:expo\"",
    "dev:server": "bun run --watch server/index.ts",
    "dev:expo": "expo start",
    "build": "npm run build:web && npm run build:server",
    "build:web": "expo export --platform web",
    "build:server": "bun build server/index.ts --outdir ./dist/server",
    "start": "bun ./dist/server/index.js"
  }
}
```

---

### Phase 6: Environment Management

```
.env                     # shared defaults
.app.env                # frontend vars (EXPO_PUBLIC_*)
.server.env            # server-only vars
```

Server should read `.server.env`, Frontend reads `.app.env` via `EXPO_PUBLIC_*` prefix.

---

## Recommended Implementation Order

1. **Server SPA serving** - Make server serve `dist/web` after `expo export`
2. **Shared types** - Create `shared/` with API response types
3. **Build scripts** - Add `build:web`, `build:server`, `start`
4. **UI components** - Fill out essential UI components
5. **Folder structure** - Optional: move to `apps/` + `packages/` if needed

---

## Key Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add build scripts |
| `server/index.ts` | Add static plugin + SPA fallback |
| `tsconfig.json` | Add path aliases |
| `biome.json` | Configure for monorepo |
| Create `shared/types.ts` | Shared type definitions |

---

## Current Strengths to Preserve

- Flux state management (Legend-State wrapper)
- expo-router for file-based routing
- Biome for linting (no changes needed)
- TypeScript strict mode
- Elysia server with clean route structure
- Both dev servers run in parallel via `npm run dev`

---

## Notes

- **No need for Turborepo yet**: Current single package.json works fine for now
- **Keep it simple**: Add complexity only when the codebase grows
- **Shared code**: Use folder conventions (`shared/`, `server/lib/`) over npm packages until publishing is needed