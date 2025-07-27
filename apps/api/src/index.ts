import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import 'dotenv/config';
import { API_VERSION } from 'easing-wizard-core';
import { Hono } from 'hono';

import curves from './routes/curves';
import healthz from './routes/healthz';
import openapi, { llmMarkdown } from './routes/openapi';
import presets from './routes/presets';

const app = new Hono();

app.get('/', (c) => {
  return c.redirect(`/docs`, 301);
});

app.route('/healthz', healthz);

app.route(`${API_VERSION}/curves`, curves);

app.route(`${API_VERSION}/presets`, presets);

app.route('/openapi', openapi);

app.get('/llms.txt', async (c) => {
  return c.text(llmMarkdown);
});

app.get(
  '/docs',
  Scalar({
    url: '/openapi',
    layout: 'classic',
    theme: 'deepSpace',
    darkMode: true,
    metaData: {
      ogImage: 'https://api.easing-wizard.com/share-image.png',
    },
    favicon: '/favicon.svg',
    withDefaultFonts: false,
    defaultOpenAllTags: true,
    hideClientButton: true,
  }),
);

// Export the app for Vercel
export default app;

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
}
