import { LoaderFunctionArgs } from '@vercel/remix';
import { createHash } from 'crypto';
import { z } from 'zod/v4';
import { apiRoot, productionOrigin } from '~/data/globals';
import {
  getAllPresets,
  getBezierPresets,
  getBouncePresets,
  getOvershootPresets,
  getSpringPresets,
  getWigglePresets,
} from '~/generated/preset-data';
import { EasingType } from '~/types-and-enums';
import { EasingTypeInputSchema } from '~/validations/easing';

type PresetData = {
  id: string;
  type: string;
  style?: string;
  curve?: string;
  params: unknown;
  output: {
    css: string;
    tailwind_css: string;
    svg_path?: string;
    svg_polyline?: string;
  };
};

// Enhanced preset data with API links
const enhancePresetWithApiData = (preset: PresetData) => ({
  ...preset,
  links: {
    self: `${apiRoot}/curves/${preset.id}`,
    share_url: `${productionOrigin}/#${preset.id}`,
    create: `${apiRoot}/curves/${preset.type}`,
  },
});

// Get all presets with enhanced API data
const allPresets = getAllPresets().map(enhancePresetWithApiData);

// Create a version string based on allPresets data
const version = createHash('sha256').update(JSON.stringify(allPresets)).digest('hex').slice(0, 8);

const getPresetsByType = (type?: EasingType) => {
  if (!type) return allPresets;

  switch (type) {
    case EasingType.BEZIER:
      return getBezierPresets().map(enhancePresetWithApiData);
    case EasingType.SPRING:
      return getSpringPresets().map(enhancePresetWithApiData);
    case EasingType.BOUNCE:
      return getBouncePresets().map(enhancePresetWithApiData);
    case EasingType.WIGGLE:
      return getWigglePresets().map(enhancePresetWithApiData);
    case EasingType.OVERSHOOT:
      return getOvershootPresets().map(enhancePresetWithApiData);
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const typeSearchParam = url.searchParams.get('type');

  try {
    const type = typeSearchParam ? EasingTypeInputSchema.parse(typeSearchParam) : undefined;
    const presets = getPresetsByType(type);

    return {
      version,
      presets,
      // HATEOAS
      links: {
        create: `${apiRoot}/presets${type ? `?type=${type}` : ''}`,
        filter: '/api/v1/presets{?type}', // RFC 6570 URI-Template
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
