import {
  createPresetsResponse,
  EasingTypeSchema,
  toScreamingSnakeCase,
  type ErrorResponse,
  type PresetsResponse,
} from 'easing-wizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { transformOtherError, transformZodError } from '~/utils/errors';

const app = new Hono();

app.get('/', async (c) => {
  const typeSearchParam = toScreamingSnakeCase(c.req.query('type'));

  try {
    const type = typeSearchParam ? EasingTypeSchema.parse(typeSearchParam) : undefined;
    const response = await createPresetsResponse(type);

    return c.json<PresetsResponse>(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json<ErrorResponse>({ errors: transformZodError(error) }, 400);
    }
    return c.json<ErrorResponse>({ errors: transformOtherError(error) }, 400);
  }
});

export default app;
