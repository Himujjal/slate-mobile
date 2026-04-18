import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => {
    return { status: 'ok', message: 'Slate API is running' };
  })
  .listen(3000);

console.log(
  `🦊 Elysia server running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
