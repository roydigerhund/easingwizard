import { serve } from '@hono/node-server';
import 'dotenv/config';
import { Hono } from 'hono';
import curves from './routes/curves';
import presets from './routes/presets';

const app = new Hono().basePath('/v1');

app.get('/', (c) => {
  return c.json({ message: 'Welcome to the Easing Wizard API!' });
});

// Your API endpoints
app.get('/healthz', (c) => {
  return c.json({ status: 'ok' });
});

// Your API endpoints
app.route('/curves', curves);

app.get('/curves/spring', (c) => {
  return c.json({ type: 'spring', message: 'Spring curves endpoint' });
});

app.route('/presets', presets);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
