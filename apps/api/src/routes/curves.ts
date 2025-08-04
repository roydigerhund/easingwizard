import {
  createCurveResponseFromId,
  createCurveResponseFromInput,
  EasingTypeSchema,
  toScreamingSnakeCase,
  type EasingCurveResponse,
  type ErrorResponse,
} from 'easingwizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { transformOtherError, transformZodError } from '~/utils/errors';

const app = new Hono();

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const response = createCurveResponseFromId(id);

    return c.json<EasingCurveResponse>(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json<ErrorResponse>({ errors: transformZodError(error) }, 400);
    }
    return c.json<ErrorResponse>({ errors: transformOtherError(error) }, 400);
  }
});

app.post('/:type', async (c) => {
  const config = await c.req.json();

  try {
    const type = EasingTypeSchema.parse(toScreamingSnakeCase(c.req.param('type')));

    const response = createCurveResponseFromInput({ type, config });

    return c.json<EasingCurveResponse>(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json<ErrorResponse>({ errors: transformZodError(error) }, 400);
    }
    return c.json<ErrorResponse>({ errors: transformOtherError(error) }, 400);
  }
});

export default app;
