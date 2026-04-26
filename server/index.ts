import { Elysia } from 'elysia';
import { aiRoutes } from './ai-routes';
import { authRoutes } from './auth-routes';
import { contentRoutes } from './content-routes';
import { docsRoutes } from './docs-routes';
import { orchestrationRoutes } from './orchestration-routes';
import { utilityRoutes } from './utility-routes';

const app = new Elysia()
  .use(authRoutes)
  .use(aiRoutes)
  .use(docsRoutes)
  .use(orchestrationRoutes)
  .use(contentRoutes)
  .use(utilityRoutes)
  .get('/', () => {
    return { status: 'ok', message: 'Slate API is running' };
  })
  .listen(3000);

console.log(
  `🦊 Elysia server running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
