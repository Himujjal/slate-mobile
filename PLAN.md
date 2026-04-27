# Authentication Setup Review & Next Steps

## Testing Status: 5 PASSED ✓

All server auth tests pass: registration, login, validation, error handling.

---

## Security Issues Identified

### Critical Issues

1. **Weak Password Hashing** (`server/utils/password.ts`)
   - Uses basic SHA-256 without proper salting in a KDF
   - No memory/strain cost - vulnerable to brute-force
   - Should use bcrypt, argon2, or scrypt

2. **Missing Email Validation** (`server/auth-routes.ts:130`)
   - Only uses Elysia's built-in `{ format: 'email' }` which is weak
   - Accepts any string labeled as email - no real format validation

3. **No Account Lockout** 
   - Failed login attempts don't trigger lockout
   - Vulnerable to brute-force attacks

4. **Missing Rate Limiting on Auth Routes** (`server/middlewares.ts:20`)
   - Rate limiter only applies to `/api/llm`, not auth endpoints
   - Register/login vulnerable to abuse

### Medium Issues

5. **Token Rotation Not Implemented**
   - Refresh endpoint deletes old token but creates new one only
   - Should implement sliding window rotation

6. **Missing CSRF Protection**
   - No CSRF tokens for state-changing operations

7. **JWT Algorithm Not Explicitly Set**
   - Relies on jose default (should explicitly set HS256 in header)

8. **No Logging of Auth Events**
   - Failed login attempts not logged
   - Hard to detect attacks

### Low Issues

9. **Google OAuth Token Validation**
   - No verification that the token is intended for this app
   - Missing `audience` check on Google token

10. **Missing Input Sanitization**
    - Email/name not sanitized for XSS in stored data

---

## Recommended Test Cases

### Security Tests

- [ ] Password min length enforcement (min 8, recommend 12+)
- [ ] SQL injection via email field
- [ ] XSS via name field
- [ ] Rate limiting on login/register
- [ ] Account lockout after N attempts
- [ ] Token replay prevention
- [ ] Expired refresh token handling
- [ ] Invalid token types (access token used as refresh)
- [ ] Case sensitivity in email comparison
- [ ] Duplicate registration race condition

### Edge Cases

- [ ] Empty password
- [ ] Password with only spaces
- [ ] Very long passwords (DoS)
- [ ] Unicode in passwords
- [ ] Duplicate Google accounts
- [ ] Concurrent logout + refresh

---

## Testing Commands

```bash
bun test           # All tests
bun test:server    # Server tests only
bun test --watch   # Watch mode
```

---

## Files Tested/Changed

### Test Files Created
- `test/server/auth.test.ts` - Server auth tests
- `happydom.ts` - DOM setup for client tests

### Configuration
- `bunfig.toml` - Test configuration
- `package.json` - Added test scripts