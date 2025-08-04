import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import 'dotenv/config';
import { API_VERSION } from 'easingwizard-core';
import { Hono } from 'hono';

import curves from './routes/curves';
import healthz from './routes/healthz';
import openapi from './routes/openapi';
import presets from './routes/presets';

const app = new Hono();

app.get('/', (c) => {
  return c.redirect(`/docs`, 301);
});

app.route('/healthz', healthz);
app.route(`${API_VERSION}/healthz`, healthz);

app.route(`${API_VERSION}/curves`, curves);

app.route(`${API_VERSION}/presets`, presets);

app.route('/openapi', openapi);

app.get(
  '/docs',
  Scalar({
    url: '/openapi',
    customCss: '.section:focus { outline: none; } .section-flare { display: none; }',
    pageTitle: 'Easing Wizard API Documentation',
    // layout: 'classic',
    hideModels: true,
    theme: 'deepSpace',
    darkMode: true,
    metaData: {
      ogImage: 'https://api.easingwizard.com/share-image.png',
    },
    favicon: '/favicon.svg',
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
