# Server (Elysia + Bun)

The server module is a Bun/Elysia API server providing auth, AI proxy, content generation, and utility endpoints.

## Quick Start

```bash
npm run dev:server     # Start on http://localhost:3000
```

## Architecture

```
server/
├── index.ts                       # Entry: create Elysia app, mount routes
├── constants.ts                   # NODE_ENV
├── middlewares.ts                  # rateLimiter, authChecker, jwtVerifier
├── auth-routes.ts                 # /auth/* endpoints
├── ai-routes.ts                   # /api/llm, /api/generate/*
├── content-routes.ts              # /api/generate/scene-*
├── orchestration-routes.ts        # /api/chat, /api/generate-classroom
├── utility-routes.ts              # /api/health, /api/parse-pdf, etc.
├── docs-routes.ts                 # /docs/* (serve markdown)
├── utils/
│   ├── jwt.ts                     # signToken, verifyToken, createTokens
│   ├── password.ts                # hashPassword, verifyPassword
│   └── db-setup.ts                # DB types, getDb, initDb (placeholder)
├── AGENTS.md                      # Server-specific agent guidelines
├── README.md                      # Server-specific docs
├── api.md                         # Full API reference
└── tsconfig.json                  # ES2022, ESNext, strict
```

## Route Groups

### Auth (`/auth/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account with `name`, `email`, `password` |
| POST | `/auth/login` | No | Login with `email`, `password` |
| POST | `/auth/refresh` | No | Refresh access token with `refreshToken` |
| POST | `/auth/logout` | Yes | Invalidate refresh token |
| GET | `/auth/me` | Yes | Get current user profile |

### AI (`/api/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/llm` | Yes | Proxy LLM requests (rate limited) |
| POST | `/api/generate/image` | Yes | Image generation (not implemented) |
| POST | `/api/generate/video` | Yes | Video generation (not implemented) |
| POST | `/api/generate/tts` | Yes | Text-to-speech (not implemented) |
| POST | `/api/transcription` | Yes | Speech-to-text (not implemented) |
| POST | `/api/web-search` | Yes | Web search (not implemented) |

### Content (`/api/generate/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/generate/scene-outlines-stream` | Yes | SSE stream for scene outlines (placeholder) |
| POST | `/api/generate/scene-content` | Yes | Scene content generation (not implemented) |
| POST | `/api/generate/scene-actions` | Yes | Scene actions (not implemented) |
| POST | `/api/generate/agent-profiles` | Yes | Agent profiles (not implemented) |

### Orchestration (`/api/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/chat` | Yes | Stateless chat SSE stream (placeholder) |
| POST | `/api/generate-classroom` | Yes | Start classroom generation job |
| GET | `/api/generate-classroom/:jobId` | Yes | Poll job status |

### Utility (`/api/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/parse-pdf` | No | Parse PDF (not implemented) |
| POST | `/api/quiz-grade` | No | Grade quiz (not implemented) |
| GET | `/api/server-providers` | No | List providers (not implemented) |
| POST | `/api/proxy-media` | No | Media proxy (not implemented) |
| POST | `/api/classroom` | No | Classroom (not implemented) |
| POST | `/api/verify-model` | No | Verify model (not implemented) |
| POST | `/api/verify-image-provider` | No | Verify image provider (not implemented) |
| POST | `/api/verify-video-provider` | No | Verify video provider (not implemented) |
| POST | `/api/verify-pdf-provider` | No | Verify PDF provider (not implemented) |

### Docs (`/docs/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/docs/` | No | List docs |
| GET | `/docs/:doc` | No | Get doc content (markdown) |

## Middleware

### `rateLimiter(maxRequests, windowMs)`

In-memory IP-based rate limiting.

```typescript
import { rateLimiter } from '../middlewares';

app.use(rateLimiter(10, 60000)); // 10 requests per minute
```

### `authChecker()`

Verifies `Authorization: Bearer <token>` header is present. Extracts token and passes to next handler.

```typescript
app.use(authChecker());
```

### `jwtVerifier()`

Verifies JWT token and extracts `{ userId, email }` payload. Must be used after `authChecker`.

```typescript
app.use(jwtVerifier());
```

## Utilities

### JWT (`utils/jwt.ts`)

```typescript
import { signToken, verifyToken, createTokens } from '../utils/jwt';

// Sign
const token = await signToken({ userId: '123', email: 'a@b.com' }, '15m');

// Verify
const payload = await verifyToken(token, 'access');

// Create pair
const { accessToken, refreshToken } = await createTokens({ userId: '123', email: 'a@b.com' });
```

- Uses `jose` library (HS256 algorithm)
- Access token: 15 minute expiry
- Refresh token: 7 day expiry
- Token type claim (`type: 'access' | 'refresh'`) for verification

### Password (`utils/password.ts`)

```typescript
import { hashPassword, verifyPassword } from '../utils/password';

const { hash, salt } = await hashPassword('user-password');
const isValid = await verifyPassword('user-password', hash, salt);
```

- SHA-256 with random 16-byte salt
- Salt stored alongside hash for verification

### Database (`utils/db-setup.ts`)

Currently a placeholder. Includes type definitions for `users`, `classrooms`, and `jobs` tables, but `getDb()` throws "Database not configured".

## Adding New Routes

1. Create a new file in `server/` (e.g., `server/items-routes.ts`):

```typescript
import { Elysia } from 'elysia';
import { authChecker } from './middlewares';

export const itemsRoutes = new Elysia({ prefix: '/api/items' })
  .use(authChecker())
  .get('/', () => {
    return { items: [] };
  })
  .post('/', ({ body }) => {
    return { created: body };
  });
```

2. Register in `server/index.ts`:

```typescript
import { itemsRoutes } from './items-routes';

const app = new Elysia()
  // ... existing routes
  .use(itemsRoutes);
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `AUTH_REDIRECT_URL` | No | OAuth redirect URL |
| `LLM_API_KEY` | No | API key for LLM proxy |
| `LLM_BASE_URL` | No | Base URL for LLM API |
| `NODE_ENV` | No | Defaults to 'development' |
