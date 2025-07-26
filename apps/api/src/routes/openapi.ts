import { API_VERSION, EasingTypeSchema, PresetsResponseSchema } from 'easing-wizard-core';
import { Hono } from 'hono';
import { createDocument } from 'zod-openapi';
import z from 'zod/v4';

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'My API',
    version: '1.0.0',
  },
  paths: {
    [`/${API_VERSION}/presets`]: {
      get: {
        requestParams: { query: z.object({ type: EasingTypeSchema.optional() }) },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': { schema: PresetsResponseSchema },
            },
          },
        },
      },
    },
  },
});

const app = new Hono();

app.get('/', (c) => {
  return c.json(document);
});

export default app;
