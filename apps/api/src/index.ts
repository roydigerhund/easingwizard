import { serve } from '@hono/node-server';
import 'dotenv/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app';

export default app;

// Vercel imports the app directly; standalone execution binds only to loopback.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  serve({ fetch: app.fetch, hostname: '127.0.0.1', port }, (info) => {
    console.log(`Easing Wizard API and MCP: http://127.0.0.1:${info.port}`);
  });
}
