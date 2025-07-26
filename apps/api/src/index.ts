import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import 'dotenv/config';
import { API_VERSION } from 'easing-wizard-core';
import { Hono } from 'hono';
import curves from './routes/curves';
import openapi from './routes/openapi';
import presets from './routes/presets';

const app = new Hono().basePath(`/${API_VERSION}`);

app.get('/', (c) => {
  return c.json({ message: 'Welcome to the Easing Wizard API!' });
});

app.get('/healthz', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/curves', curves);

app.route('/presets', presets);

app.route('/openapi', openapi);

app.get('/docs', Scalar({ url: `/${API_VERSION}/openapi` }));

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
