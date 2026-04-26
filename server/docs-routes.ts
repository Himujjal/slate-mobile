import * as fs from 'node:fs';
import * as path from 'node:path';
import { Elysia } from 'elysia';
import { markdownToHtml } from './utils/markdown-to-html';

const DOCS_DIR = path.join(process.cwd(), 'docs');

function getDocFiles(): Record<string, { markdown: string; title: string }> {
  const files: Record<string, { markdown: string; title: string }> = {};

  if (!fs.existsSync(DOCS_DIR)) {
    return files;
  }

  const entries = fs.readdirSync(DOCS_DIR);
  for (const entry of entries) {
    if (entry.endsWith('.md')) {
      const filePath = path.join(DOCS_DIR, entry);
      const key = entry.replace('.md', '').toLowerCase();
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const firstLine = markdown.split('\n')[0];
      const title = firstLine?.startsWith('# ')
        ? firstLine.slice(2).trim()
        : key;
      files[key] = { markdown, title };
    }
  }

  return files;
}

const docsCache = getDocFiles();

export const docsRoutes = new Elysia({ prefix: '/docs' })
  .get('/', ({ redirect }) => {
    return redirect('/docs/readme');
  })
  .get('/:doc/llm.md', ({ params, set }) => {
    const doc = params.doc.toLowerCase();
    const entry = docsCache[doc];

    if (!entry) {
      return new Response('Doc not found', { status: 404 });
    }

    set.headers['content-type'] = 'text/markdown; charset=utf-8';
    return entry.markdown;
  })
  .get('/:doc', ({ params, query, set }) => {
    const doc = params.doc.toLowerCase().replace('.html', '');
    const entry = docsCache[doc];

    if (!entry) {
      return new Response('Doc not found', { status: 404 });
    }

    if (query.format === 'md') {
      set.headers['content-type'] = 'text/markdown; charset=utf-8';
      return entry.markdown;
    }

    set.headers['content-type'] = 'text/html; charset=utf-8';
    return markdownToHtml(entry.markdown, entry.title);
  });

export type DocsRoutes = typeof docsRoutes;
