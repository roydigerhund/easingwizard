import {
  API_VERSION,
  decodeState,
  EasingTypeSchema,
  encodeState,
  getApiResponseFromInput,
  getApiResponseFromState,
  rehydrateShareState,
  type EasingState,
} from 'easing-wizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { getEnv } from '~/utils/env.js';

const app = new Hono();

const frontendUrl = getEnv().FRONTEND_URL;

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const decodedState = decodeState(id);
    const rehydratedState: EasingState = rehydrateShareState(decodedState);

    const { input, output } = getApiResponseFromState(rehydratedState);

    const type = rehydratedState.easingType;

    return c.json({
      // metadata
      id,
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${API_VERSION}/curves/${id}`,
        share_url: `${frontendUrl}/#${id}`,
        create: `${API_VERSION}/curves/${type}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ errors: error.issues }, 400);
    }
    return c.json(
      {
        error:
          typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'Invalid parameters',
      },
      400,
    );
  }
});

app.post('/:type', async (c) => {
  const config = await c.req.json();

  try {
    const type = EasingTypeSchema.parse(c.req.param('type'));

    const { input, output, shareState } = getApiResponseFromInput(type, config);

    const id = encodeState(shareState);

    return c.json({
      // metadata
      id,
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${API_VERSION}/curves/${id}`,
        share_url: `${frontendUrl}/#${id}`,
        create: `${API_VERSION}/curves/${type}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ errors: error.issues }, 400);
    }
    return c.json(
      {
        error:
          typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'Invalid parameters',
      },
      400,
    );
  }
});

export default app;
