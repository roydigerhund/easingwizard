import type { HealthCheckResponse } from 'easing-wizard-core';
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
