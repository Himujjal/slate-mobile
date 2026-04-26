# Plan for Production-Grade Authentication System

## Problem Analysis

The current auth system (`server/auth-routes.ts`) uses mock data and has no:
- JWT token generation/verification
- Password hashing
- Token refresh
- Session management
- Client-side auth state management

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Client (Expo/React Native)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ui/                    flux/                    storage/               │
│  ├── auth-form.tsx      ├── auth-store.ts        └── token-storage.ts   │
│  ├── login-form.tsx    └── use-auth.tsx                              │
│  ├── protected-route.tsx                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ HTTP + JWT
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Server (Elysia.js)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  server/                                                              │
│  ├── auth-routes.ts    (login, register, logout, refresh, me)         │
│  ├── middlewares.ts    (jwt-verify, auth-checker)                       │
│  └── utils/           (jwt, password-hash)                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Server-Side Auth (server/)

- [x] 1. **`server/utils/jwt.ts`** — JWT utilities:
     - `signToken(payload, expiresIn)` - Create signed JWT
     - `verifyToken(token)` - Verify and decode JWT
     - `createTokens(user)` - Create access + refresh token pair

- [x] 2. **`server/utils/password.ts`** — Password hashing:
     - `hashPassword(password)` - Argon2id hash
     - `verifyPassword(password, hash)` - Verify password

- [x] 3. **`server/auth-routes.ts`** — Full auth routes:
     - `POST /auth/login` - Verify credentials, return tokens
     - `POST /auth/register` - Create user, return tokens
     - `POST /auth/refresh` - Refresh access token
     - `POST /auth/logout` - Invalidate refresh token
     - `GET /auth/me` - Get current user (protected)

- [x] 4. **`server/middlewares.ts`** — Auth middleware:
     - `jwtVerifier()` - Verify JWT on protected routes
     - Update `authChecker` to extract user from token

### Phase 2: Client-Side Auth State (flux/)

- [x] 5. **`flux/auth-store.ts`** — Auth state store:
     - `AuthState` interface (user, accessToken, refreshToken, isAuthenticated)
     - `createAuthStore()` - Create auth state store
     - Login/logout actions

- [x] 6. **`flux/auth-hooks.ts`** — Auth custom hooks:
     - `useAuth()` - Get auth state and actions
     - `useUser()` - Get current user
     - `useIsAuthenticated()` - Get auth status
     - `useAuthAction()` - Execute login/register/logout

### Phase 3: Client-Side Storage (storage/)

- [x] 7. **`lib/token-storage.ts`** — Token persistence:
     - `saveTokens(accessToken, refreshToken)` - Save to storage
     - `getTokens()` - Get stored tokens
     - `clearTokens()` - Clear tokens on logout

### Phase 4: UI Components (ui/)

- [x] 8. **`ui/auth/`]** — Auth UI components:
     - `login-form.tsx` - Login form with email/password
     - `register-form.tsx` - Registration form
     - `protected-route.tsx` - Route guard for protected screens
     - `auth-context.tsx` - Auth context provider

### Phase 5: Integration

- [x] 9. **API client wrapper** — HTTP client with auth:
     - `lib/api-client.ts` - Fetch wrapper that automatically:
       - Attaches Bearer token
       - Handles 401 (token expired) by refreshing
       - Returns typed responses

### Files Created

1. [x] `server/utils/jwt.ts` - JWT utilities
2. [x] `server/utils/password.ts` - Password hashing
3. [x] `flux/auth-store.ts` - Auth state store
4. [x] `flux/auth-hooks.ts` - Auth hooks
5. [x] `lib/token-storage.ts` - Token persistence
6. [x] `ui/auth/login-form.tsx` - Login form
7. [x] `ui/auth/register-form.tsx` - Register form
8. [x] `ui/auth/protected-route.tsx` - Protected route
9. [x] `ui/auth/auth-context.tsx` - Auth context
10. [x] `lib/api-client.ts` - API client with auth

### Files Modified

1. [x] `server/auth-routes.ts`
2. [x] `server/middlewares.ts`
3. [x] `package.json` (added jose dependency)

## Security Requirements

- Access tokens: Short-lived (15 min)
- Refresh tokens: Long-lived (7 days), stored securely
- Passwords: Argon2id hashing
- HTTPS only in production
- CSRF protection
- Rate limiting on auth endpoints

## Usage Examples

### Server (protected route)
```typescript
app.use(authRoutes).use(jwtVerifier()).get('/api/protected', ({ user }) => {
  return { user };
});
```

### Client (login)
```typescript
const { login } = useAuth();
await login({ email: 'user@example.com', password: 'password' });
const user = useUser();
```

### UI (protected route)
```tsx
<ProtectedRoute fallback="/login">
  <Dashboard />
</ProtectedRoute>
```

(End of file - total 137 lines)
