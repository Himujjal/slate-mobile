# Authentication Plan — Email/Password JWT (No Google OAuth)

## Overview

Strip Google OAuth, centralize all constants into `constants/constants.ts`, wire up JWT authorization middleware across server routes, and improve test coverage.

---

## Phase 1: Remove Google OAuth (Server)

### 1.1 Remove `/auth/google` endpoint
**File:** `server/auth-routes.ts:252-354`
- Delete the entire `POST '/google'` handler and its `t.Object` body schema
- Remove `cleanExpiredTokens` helper (only used by Google route; refresh token cleanup should be handled separately or removed)

### 1.2 Clean up database schema
**Files:** `server/db/database.ts`, `server/db/setup.ts`
- Remove `google_id` column from `users` table interface (`database.ts`)
- Remove `google_id` column from table creation (`setup.ts`)
- Remove `salt` column — bcrypt embeds salt in hash; it's already set to `null` everywhere
- Update `auth-routes.ts` insert to not include `google_id` or `salt`

### 1.3 Clean up auth-routes imports
**File:** `server/auth-routes.ts`
- Remove unused `UserRow` fields: `google_id`, `salt`
- Clean up unused imports if any

---

## Phase 2: Remove Google OAuth (Client)

### 2.1 Remove `loginWithGoogle` from auth hooks
**File:** `flux/auth-hooks.ts`
- Remove `GoogleCredentials` interface
- Remove `loginWithGoogle` function (lines 108-123)
- Remove `loginWithGoogle` from the return type and return object

### 2.2 Remove Google button from login form
**File:** `ui/auth/login-form.tsx`
- Remove `onGoogleSignIn` prop from `LoginFormProps`
- Remove the divider ("or") section (lines 102-106)
- Remove the "Continue with Google" button (lines 108-114)
- Remove `handleGooglePress` function

### 2.3 Remove Google logic from login screen
**File:** `app/login/index.tsx`
- Delete entire file content; rewrite as clean login screen with just `LoginForm` + title
- Remove `expo-web-browser` import and usage
- Remove `GOOGLE_CLIENT_ID`, `REDIRECT_URI` constants
- Remove `loginWithGoogle` from `useAuth()` destructuring
- Remove `handleGoogleSignIn` and `isGoogleLoading`

### 2.4 Remove `expo-web-browser` dependency
- Uninstall: `bun remove expo-web-browser`

### 2.5 Clean up `.env`
- Remove `EXPO_PUBLIC_GOOGLE_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_REDIRECT_URI`

---

## Phase 3: Centralize Constants

### 3.1 Populate `constants/constants.ts`
**File:** `constants/constants.ts`
```typescript
const env = process.env.NODE_ENV || 'development';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

export const AUTH = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
  BCRYPT_ROUNDS: 12,
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000,
  AUTH_RATE_LIMIT_WINDOW: 60 * 1000,
  AUTH_RATE_LIMIT_MAX: 10,
};

export const PATHS = {
  HOME: '/home',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  REGISTER: '/register',
};
```

### 3.2 Update client to use `@constants/constants`
**Files affected:**
- `flux/auth-hooks.ts` — Replace `process.env.EXPO_PUBLIC_API_URL` with `API_URL` import
- `flux/api-client.ts` — Replace `process.env.EXPO_PUBLIC_API_URL` with `API_URL` import
- `app/login/index.tsx` — Use `PATHS` from constants
- `app/register/index.tsx` — Use `PATHS` from constants
- `app/index.tsx` — Use `PATHS` from constants
- `app/home/index.tsx` — Use `PATHS` from constants
- `app/onboarding/index.tsx` — Use `PATHS` from constants

### 3.3 Update server to use constants (optional — server has its own config pattern)
- `server/utils/jwt.ts` — Use `AUTH.ACCESS_TOKEN_EXPIRY` / `AUTH.REFRESH_TOKEN_EXPIRY`
- `server/auth-routes.ts` — Use `AUTH.REFRESH_TOKEN_EXPIRY_MS`
- `server/utils/password.ts` — Use `AUTH.BCRYPT_ROUNDS`
- `server/utils/auth-security.ts` — Use `AUTH.MAX_FAILED_ATTEMPTS`, `AUTH.LOCKOUT_DURATION_MS`, `AUTH.AUTH_RATE_LIMIT_*`

---

## Phase 4: Wire Up JWT Authorization Middleware

### 4.1 Register `jwtVerifier` on server
**File:** `server/index.ts`
- Import and `.use(jwtVerifier())` to make `user` available on all routes

### 4.2 Use middleware in auth routes
**File:** `server/auth-routes.ts`
- The `GET /me` endpoint currently does inline JWT verification (lines 430-439)
- Replace with the shared `jwtVerifier` middleware via Elysia's group/derive pattern
- Apply `jwtVerifier` to `/me` and future protected routes

### 4.3 Apply rate limiter to auth routes
**File:** `server/middlewares.ts`
- Extend `rateLimiter` to also cover `/auth/*` endpoints
- Or create a separate auth-specific rate limiter

---

## Phase 5: Clean Up & Fixes

### 5.1 Remove unused `sessions` table (if not planned)
**Files:** `server/db/database.ts`, `server/db/setup.ts`
- Remove `sessions` from the Database interface and table creation
- It's defined but never written to or read from

### 5.2 Fix server `auth-checker` middleware
**File:** `server/middlewares.ts`
- `authChecker` only checks `startsWith('Bearer ')` without verifying — misleading
- Either remove it or rename to `hasAuthHeader`

### 5.3 Remove `csrf.ts` (not used, no CSRF in mobile-first app)
**File:** `server/csrf.ts`
- Remove entire file — CSRF is unnecessary for token-based auth
- Mobile apps use native storage, not cookies

### 5.4 Remove `db-auth.ts` placeholder
**File:** `server/db/db-auth.ts`
- Remove or implement

---

## Phase 6: Tests

### 6.1 Rewrite auth tests to test real routes
**File:** `test/server/auth.test.ts`
- Replace mocked Elysia instances with actual `authRoutes` import
- Test real endpoints with real validation, rate limiting, lockout
- Add test for refresh token rotation

### 6.2 Add new test cases
- Password min length enforcement
- Lockout after N failed attempts
- Rate limiting on login/register
- Expired refresh token handling
- Invalid token types (access used as refresh)
- Case-insensitive email comparison
- Duplicate registration
- Token replay prevention

---

## Phase 7: Documentation

### 7.1 Update `docs/auth.md`
- Remove all Google OAuth references
- Update password hashing section (bcrypt, not SHA-256)
- Remove `/auth/google` endpoint docs
- Update the `loginWithGoogle` removal from hook docs
- Update middleware docs
- Update environment variable docs

---

## File Change Summary

| File | Action |
|------|--------|
| `server/auth-routes.ts` | Remove `/auth/google` endpoint, clean up UserRow type, remove unused helpers |
| `server/db/database.ts` | Remove `google_id`, `salt` from users; remove `sessions` table |
| `server/db/setup.ts` | Remove `google_id`, `salt`, `sessions` from table creation |
| `server/middlewares.ts` | Fix `authChecker`, extend rate limiter scope |
| `server/index.ts` | Add `.use(jwtVerifier())`, remove csrf import |
| `server/csrf.ts` | DELETE entire file |
| `server/db/db-auth.ts` | DELETE placeholder file |
| `server/utils/jwt.ts` | Import expiry from constants |
| `server/utils/password.ts` | Import bcrypt rounds from constants |
| `server/utils/auth-security.ts` | Import config from constants |
| `constants/constants.ts` | Populate with API_URL, AUTH config, PATHS |
| `flux/auth-hooks.ts` | Remove `loginWithGoogle`, import API_URL from constants |
| `flux/api-client.ts` | Import API_URL from constants |
| `flux/auth-store.ts` | Remove `google_id` from AuthUser if present (it's not) |
| `app/login/index.tsx` | Remove Google OAuth, import PATHS from constants |
| `ui/auth/login-form.tsx` | Remove Google button, remove `onGoogleSignIn` prop |
| `ui/auth/index.ts` | No change (LoginForm still exported) |
| `app/register/index.tsx` | Import PATHS from constants |
| `app/index.tsx` | Import PATHS from constants |
| `app/home/index.tsx` | Import PATHS from constants |
| `app/onboarding/index.tsx` | Import PATHS from constants |
| `test/server/auth.test.ts` | Rewrite to test real routes with DB |
| `docs/auth.md` | Remove Google OAuth, update password hashing, update env vars |
| `.env` | Remove `GOOGLE_CLIENT_ID`, `GOOGLE_REDIRECT_URI` |
| `package.json` | Remove `expo-web-browser` dependency |

---

## Already Implemented (No Changes Needed)

- ✅ User registration with email/password
- ✅ Login with email/password
- ✅ JWT creation (access + refresh tokens, HS256, jose library)
- ✅ Token type checking (`payload.type` must match `access`/`refresh`)
- ✅ Refresh token rotation (single-use, old deleted on refresh)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Input sanitization (HTML escaping)
- ✅ Email validation regex
- ✅ Account lockout (5 failed attempts, 15 min)
- ✅ Auth rate limiting (10 req/min)
- ✅ Auth event logging (in-memory buffer)
- ✅ Client-side token storage (MMKV/localStorage)
- ✅ API client with auto Bearer injection and 401 refresh-retry
- ✅ Auth React context provider
- ✅ Protected route component
- ✅ Login form, register form UI
- ✅ Onboarding flow
