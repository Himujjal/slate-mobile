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
│  │   onboardingStorage (onboarding status)          │ │
│  └───────────────────────────────────────────────────┘ │
│                              │                          │
│  ┌───────────────────────────▼──────────────────────┐  │
│  │           API Client (@flux/api-client)           │  │
│  │   Auto Bearer token injection                    │  │
│  │   Auto 401 → refresh → retry                     │  │
│  └───────────────────────────────────────────────────┘ │
│                              │                            │
└──────────────────────────────┼────────────────────────────┘
                                │ HTTP
┌──────────────────────────────▼────────────────────────────┐
│                    Server (Bun/Elysia)                     │
│  ┌──────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │ Auth Routes   │  │ Middleware  │  │ Utils             │  │
│  │ /auth/register│  │ rateLimiter│  │ JWT (jose/HS256)  │  │
│  │ /auth/login   │  │ authChecker│  │ Password (SHA-256)│  │
│  │ /auth/refresh │  │ jwtVerifier│  │                   │  │
│  │ /auth/logout  │  │            │  │                   │  │
│  │ /auth/me      │  │            │  │                   │  │
│  │ /auth/google  │  │            │  │                   │  │
│  └──────────────┘  └────────────┘  └───────────────────┘  │
│                              │                            │
│  ┌───────────────────────────▼──────────────────────────┐ │
│  │          Database (SQLite via Kysely)                 │ │
│  │  tables: users, refresh_tokens, sessions              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
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
| `setAuthTokens(accessToken, refreshToken)` | Store tokens (auto-persisted to KV) |
| `setAuthUser(user)` | Set user (auto-persisted to KV) |
| `setAuthLoading(isLoading)` | Set loading state |
| `setAuthError(error)` | Set error state |
| `clearAuth()` | Clear all auth state (auto-persisted to KV) |

## Client-Side: Auth Hooks

**File:** `flux/auth-hooks.ts`

### `useAuth()`

```typescript
const {
  login,          // (email: string, password: string) => Promise<void>
  register,       // (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle,// (idToken: string) => Promise<void>
  logout,         // () => Promise<void>
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

## Client-Side: Storage

**File:** `storage/index.ts`

### Token Storage

```typescript
import { tokenStorage } from '@storage/index';

tokenStorage.saveTokens(accessToken, refreshToken);
const tokens = tokenStorage.getTokens();
tokenStorage.clearAll();
const hasAuth = tokenStorage.hasStoredAuth();
```

### Onboarding Storage

```typescript
import { onboardingStorage } from '@storage/index';

const hasOnboarded = onboardingStorage.hasOnboarded();
onboardingStorage.completeOnboarding();
onboardingStorage.resetOnboarding();
```

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

<LoginForm onSuccess={() => router.replace('/home')} />
```

Features: email/password inputs, validation, error display, loading state, Google sign-in.

### RegisterForm

```typescript
import { RegisterForm } from '@ui/auth';

<RegisterForm onSuccess={() => router.replace('/home')} />
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

## Client-Side: App Routing

**File:** `app/index.tsx`

The index screen handles initial routing:

1. Check if user has onboarded
2. If not, redirect to `/onboarding`
3. Restore stored tokens from tokenStorage
4. If authenticated, redirect to `/home`
5. Otherwise, redirect to `/login`

### Onboarding Flow

**File:** `app/onboarding/index.tsx`

- One-time welcome screen
- Uses `onboardingStorage` to track completion
- On complete, redirects to login

### Login Flow

**File:** `app/login/index.tsx`

- Email/password authentication
- Google OAuth authentication
- On success, redirects to `/home`

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
  "refreshToken": "eyJ...",
  "expiresIn": 900
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
  "refreshToken": "eyJ...",
  "expiresIn": 900
}
```

### POST /auth/google

```json
// Request
{ "idToken": "eyJ..." }

// Response 200
{
  "user": { "id": "uuid", "name": "Alice", "email": "alice@example.com" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900
}
```

### POST /auth/refresh

```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900
}
```

### POST /auth/logout (Protected)

```json
// Request
{ "refreshToken": "eyJ..." }

// Response 200
{ "success": true }
```

### GET /auth/me (Protected)

```json
// Response 200
{ "id": "uuid", "email": "alice@example.com", "name": "Alice" }
```

## Server-Side: Database

**File:** `server/db/setup.ts`

SQLite database using Kysely ORM. Tables:

- **users**: id, email, name, password_hash, salt, google_id, avatar_url, created_at, updated_at
- **refresh_tokens**: id, user_id, token, expires_at, created_at
- **sessions**: id, user_id, device_info, last_active, created_at

### JWT Utils

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

### Password Utils

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
- Tokens stored in SQLite database with user association
- Token expiry is enforced at the database level
- Google OAuth uses `id_token` verification via Google's tokeninfo endpoint

## Environment Variables

### Server

- `JWT_SECRET` - JWT access token secret (required)
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret (required)

### Client

- `EXPO_PUBLIC_API_URL` - Server URL (default: `http://localhost:3000`)
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `EXPO_PUBLIC_GOOGLE_REDIRECT_URI` - Google OAuth redirect URI