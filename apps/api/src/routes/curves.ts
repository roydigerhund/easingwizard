import {
  decodeState,
  EasingTypeSchema,
  encodeState,
  getApiResponseFromInput,
  getApiResponseFromState,
  rehydrateShareState,
  toScreamingSnakeCase,
  type EasingCurveResponse,
  type EasingTypeKey,
  type ErrorResponse,
} from 'easing-wizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { getEnv } from '~/utils/env.js';
import { transformOtherError, transformZodError } from '~/utils/errors';

const app = new Hono();

const frontendUrl = getEnv().FRONTEND_URL;

const createCurveLinks = (id: string, type: EasingTypeKey) => ({
  self: `/curves/${id}`,
  share_url: `${frontendUrl}/#${id}`,
  create: `/curves/${type.toLowerCase()}`,
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const decodedState = decodeState(id);
    const rehydratedState = rehydrateShareState(decodedState);

    const { input, output } = getApiResponseFromState(rehydratedState);

    const type = rehydratedState.easingType;

    return c.json<EasingCurveResponse>({
      // metadata
      id,
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: createCurveLinks(id, type),
    });
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

    const { input, output, shareState } = getApiResponseFromInput(type, config);

    const id = encodeState(shareState);

    return c.json<EasingCurveResponse>({
      // metadata
      id,
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: createCurveLinks(id, type),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json<ErrorResponse>({ errors: transformZodError(error) }, 400);
    }
    return c.json<ErrorResponse>({ errors: transformOtherError(error) }, 400);
  }
});

export default app;
