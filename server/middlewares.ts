import { Elysia } from 'elysia';

const rateLimitStore: Map<string, number> = new Map();
const RATE_LIMIT_WINDOW = 1000;
const RATE_LIMIT_MAX = 1;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitStore.get(key) || 0;
  if (now - lastRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(key, now);
    return false;
  }
  return true;
}

export const rateLimiter = () =>
  new Elysia().on('beforeHandle', ({ headers, path }) => {
    if (path !== '/api/llm') return;
    const clientId =
      headers.authorization || headers['x-forwarded-for'] || 'anonymous';
    const key = `ratelimit:${clientId}`;
    if (isRateLimited(key)) {
      return new Response('Rate limited', { status: 429 });
    }
  });

export const authChecker = () =>
  new Elysia().derive(async ({ headers }) => {
    const authHeader = headers.authorization;
    const isAuthenticated = authHeader?.startsWith('Bearer ');
    return { isAuthenticated };
  });
