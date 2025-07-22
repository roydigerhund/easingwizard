import { decodeState, encodeState } from 'easing-wizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { API_VERSION } from '~/data/globals.js';
import { getEnv } from '~/utils/env.js';
import { getApiResponseFromInput, getApiResponseFromState } from '../../../../frontend-old/app/utils/api.js';
import { rehydrateShareState } from '../../../../frontend-old/app/utils/state-sharing/state-serialization.js';
import { EasingTypeInputSchema } from '../../../../frontend-old/app/validations/easing.js';

const app = new Hono();

const frontendUrl = getEnv().FRONTEND_URL;

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const decodedState = decodeState(id);
    const rehydratedState = rehydrateShareState(decodedState);

    const { input, output } = getApiResponseFromState(rehydratedState);

    return c.json({
      // metadata
      id,
      type: rehydratedState.easingType,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${API_VERSION}/curves/${id}`,
        share_url: `${frontendUrl}/#${id}`,
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
    const type = EasingTypeInputSchema.parse(c.req.param('type'));

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
        preview_svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,100 C${config.x1 * 100},${100 - config.y1 * 100} ${config.x2 * 100},${100 - config.y2 * 100} 100,0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
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
