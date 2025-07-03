import { ActionFunctionArgs, LoaderFunctionArgs } from '@vercel/remix';
import z from 'zod/v4';
import { apiRoot, productionOrigin } from '~/data/globals';
import { getApiResponseFromInput, getApiResponseFromState } from '~/utils/api';
import { rehydrateShareState } from '~/utils/state-sharing/state-serialization';
import { decodeState, encodeState } from '~/utils/state-sharing/url-code';
import { EasingTypeInput } from '~/validations/easing';

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const id = params.type_or_id;

    if (!id) {
      throw new Error('Missing ID parameter');
    }

    const decodedState = decodeState(id);
    const rehydratedState = rehydrateShareState(decodedState);

    const { input, output } = getApiResponseFromState(rehydratedState);

    return {
      // metadata
      id,
      type: rehydratedState.easingType,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${apiRoot}/curves/${id}`,
        share_url: `${productionOrigin}/#${id}`,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.issues }), { status: 400 });
    }
    return new Response(
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Invalid parameters',
      { status: 400 },
    );
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const config = await request.json();

  try {
    const type = EasingTypeInput.parse(params.type_or_id);

    const { input, output, shareState } = getApiResponseFromInput(type, config);

    const id = encodeState(shareState);

    return {
      // metadata
      id,
      type,
      generated_at: new Date().toISOString(),
      input,
      output,
      // HATEOAS
      links: {
        self: `${apiRoot}/curves/${id}`,
        preview_svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,100 C${config.x1 * 100},${100 - config.y1 * 100} ${config.x2 * 100},${100 - config.y2 * 100} 100,0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
        share_url: `${productionOrigin}/#${id}`,
        create: `${apiRoot}/curves/${type}`,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.issues }), { status: 400 });
    }
    return new Response(
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Invalid parameters',
      { status: 400 },
    );
  }
}
