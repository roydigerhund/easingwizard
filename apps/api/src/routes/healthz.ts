import type { HealthCheckResponse } from 'easingwizard-core';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  return c.json<HealthCheckResponse>(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    200,
  );
});

export default app;
