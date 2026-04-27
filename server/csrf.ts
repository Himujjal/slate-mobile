import { Elysia, t } from 'elysia';

const CSRF_TOKEN_LENGTH = 32;

function generateCsrfToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

export const csrfRoutes = new Elysia({ prefix: '/auth' }).get(
  '/csrf',
  async () => {
    return { csrfToken: generateCsrfToken() };
  }
);

export function validateCsrfToken(
  submittedToken: string | undefined,
  cookieToken: string | undefined
): boolean {
  if (!submittedToken || !cookieToken) return false;
  return submittedToken === cookieToken;
}
