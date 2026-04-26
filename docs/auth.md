# Authentication System

Full JWT-based authentication system spanning server (Bun/Elysia) and client (React Native/Web).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (app/)                      │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │AuthStore │  │ Auth Hooks │  │ Auth UI         │  │
│  │(flux/)   │  │ (flux/)    │  │ (ui/auth/)      │  │
│  │          │  │            │  │ LoginForm        │  │
│  │ tokens   │  │ useAuth()  │  │ RegisterForm     │  │
│  │ user     │  │ useUser()  │  │ ProtectedRoute   │  │
│  │ status   │  │ useIsAuth()│  │ AuthProvider     │  │
│  └────┬─────┘  └─────┬──────┘  └────────┬────────┘  │
│       │              │                   │           │
│       └──────────────┴───────────────────┘           │
│                              │                        │
│  ┌───────────────────────────▼──────────────────────┐ │
│  │           Token Storage (@storage/)               │ │
│  │   MMKV (native) / localStorage (web)             │ │
│  │   saveTokens / getTokens / clearTokens           │ │
│  └───────────────────────────────────────────────────┘ │
│                              │                          │
│  ┌───────────────────────────▼──────────────────────┐  │
│  │           API Client (@flux/api-client)           │  │
│  │   Auto Bearer token injection                    │  │
│  │   Auto 401 → refresh → retry                     │  │
│  └───────────────────────────────────────────────────┘  │
│                              │                            │
└──────────────────────────────┼────────────────────────────┘
                               │ HTTP
┌──────────────────────────────▼────────────────────────────┐
│                    Server (Bun/Elysia)                     │
│  ┌──────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │ Auth Routes   │  │ Middleware  │  │ Utils             │  │
│  │ /auth/register│  │ rateLimiter│  │ JWT (jose/HS256)  │  │
│  │ /auth/login   │  │ authChecker│  │ Password (SHA-256) │  │
│  │ /auth/refresh │  │ jwtVerifier│  │                    │  │
│  │ /auth/logout  │  │            │  │                    │  │
│  │ /auth/me      │  │            │  │                    │  │
│  └──────────────┘  └────────────┘  └───────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Client-Side: Flux Auth Store

**File:** `flux/auth-store.ts`

### State Shape

```typescript
interface AuthStateData {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Functions

| Function | Description |
|----------|-------------|
| `initializeAuth()` | Check stored tokens and restore session |
| `setAuthTokens(accessToken, refreshToken)` | Store tokens + persist to tokenStorage |
| `setAuthUser(user)` | Set user + persist to tokenStorage |
| `setAuthLoading(isLoading)` | Set loading state |
| `setAuthError(error)` | Set error state |
| `clearAuth()` | Clear all auth state + tokenStorage |

## Client-Side: Auth Hooks

**File:** `flux/auth-hooks.ts`

### `useAuth()`

```typescript
const {
  login,      // (email: string, password: string) => Promise<void>
  register,   // (name: string, email: string, password: string) => Promise<void>
  logout,     // () => Promise<void>
  refresh,    // () => Promise<void>
} = useAuth();
```

### Simple Hooks

```typescript
const user = useUser();                    // User | null
const isAuthenticated = useIsAuthenticated(); // boolean
const isLoading = useAuthLoading();        // boolean
const error = useAuthError();              // string | null
```

## Client-Side: API Client

**File:** `flux/api-client.ts`

```typescript
import { api } from '@flux/api-client';

// GET - auto-attaches Bearer token
const user = await api.get<User>('/auth/me');

// POST
const result = await api.post<LoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'secret',
});

// PUT
await api.put('/user/123', { name: 'New' });

// DELETE
await api.delete('/user/123');
```

### Auto-Refresh Logic

1. API call returns 401
2. API client calls `/auth/refresh` with stored refresh token
3. On success: retries the original request with new access token
4. On failure: clears auth state (force logout)

## Client-Side: UI Components

**Files:** `ui/auth/`

### AuthProvider

```typescript
import { AuthProvider } from '@ui/auth';

// Already in app/_layout.tsx
<AuthProvider>
  <Stack />
</AuthProvider>
```

### LoginForm

```typescript
import { LoginForm } from '@ui/auth';

<LoginForm onSuccess={() => router.replace('/(tabs)')} />
```

Features: email/password inputs, validation, error display, loading state.

### RegisterForm

```typescript
import { RegisterForm } from '@ui/auth';

<RegisterForm onSuccess={() => router.replace('/(tabs)')} />
```

Features: name/email/password/confirm inputs, validation, error display.

### ProtectedRoute

```typescript
import { ProtectedRoute } from '@ui/auth';

<ProtectedRoute fallback="/login">
  <SecretDashboard />
</ProtectedRoute>
```

Redirects to `/login` (or custom fallback) if not authenticated. Shows loading spinner while checking.

## Server-Side: Auth Routes

**File:** `server/auth-routes.ts`

### POST /auth/register

```json
// Request
{ "name": "Alice", "email": "alice@example.com", "password": "securepass123" }

// Response 201
{
  "user": { "id": "uuid", "name": "Alice", "email": "alice@example.com" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/login

```json
// Request
{ "email": "alice@example.com", "password": "securepass123" }

// Response 200
{
  "user": { "id": "uuid", "name": "Alice", "email": "alice@example.com" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/refresh

```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/logout (Protected)

```json
// Response 200
{ "message": "Logged out successfully" }
```

### GET /auth/me (Protected)

```json
// Response 200
{ "user": { "id": "uuid", "name": "Alice", "email": "alice@example.com" } }
```

## Server-Side: JWT Utils

**File:** `server/utils/jwt.ts`

- Algorithm: HS256 (using `jose` library)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token payload includes `type: 'access' | 'refresh'` for verification

```typescript
const { accessToken, refreshToken } = await createTokens({
  userId: user.id,
  email: user.email,
});
```

## Server-Side: Password Utils

**File:** `server/utils/password.ts`

- Hashing: SHA-256 with random 16-byte salt
- Salt is stored alongside hash for verification

```typescript
const { hash, salt } = await hashPassword(password);
const isValid = await verifyPassword(password, storedHash, storedSalt);
```

## Server-Side: Middleware

**File:** `server/middlewares.ts`

| Middleware | Usage | Description |
|------------|-------|-------------|
| `rateLimiter(max, windowMs)` | `.use(rateLimiter(10, 60000))` | IP-based rate limiting |
| `authChecker()` | `.use(authChecker())` | Verify Bearer token presence |
| `jwtVerifier()` | `.use(jwtVerifier())` | Verify JWT + extract payload |

## Security Notes

- Passwords are **not stored in plain text** (SHA-256 + salt)
- JWT secrets should be set via `JWT_SECRET` env var (not hardcoded)
- Refresh tokens are **single-use**: old ones are invalidated on each refresh
- In-memory storage is used for users/refresh tokens (no database dependency)
- For production, replace in-memory store with a proper database (see `server/utils/db-setup.ts`)
