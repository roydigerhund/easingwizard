import {
  getAllPresets,
  getBezierPresets,
  getBouncePresets,
  getOvershootPresets,
  getSpringPresets,
  getWigglePresets,
} from 'easing-wizard-frontend/generated/preset-data.js';
import { EasingType } from 'easing-wizard-frontend/types-and-enums.js';
import { EasingTypeInputSchema } from 'easing-wizard-frontend/validations/easing.js';
import { Hono } from 'hono';
import { API_VERSION } from 'src/data/globals.js';
import { getEnv } from 'src/utils/env.js';
import { z } from 'zod/v4';

const app = new Hono();

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

const frontendUrl = getEnv().FRONTEND_URL;

// Enhanced preset data with API links
const enhancePresetWithApiData = (preset: PresetData) => ({
  ...preset,
  links: {
    self: `${API_VERSION}/curves/${preset.id}`,
    share_url: `${frontendUrl}/#${preset.id}`,
    create: `${API_VERSION}/curves/${preset.type}`,
  },
});

// Get all presets with enhanced API data
const allPresets = getAllPresets().map(enhancePresetWithApiData);

// Create a version string using Web Crypto API
const createVersion = async (data: unknown) => {
  const text = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 8);
};

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

app.get('/', async (c) => {
  const typeSearchParam = c.req.query('type');

  try {
    const type = typeSearchParam ? EasingTypeInputSchema.parse(typeSearchParam) : undefined;
    const presets = getPresetsByType(type);

    // Create version asynchronously
    const version = await createVersion(allPresets);

    return c.json({
      version,
      presets,
      // HATEOAS
      links: {
        create: `${API_VERSION}/presets${type ? `?type=${type}` : ''}`,
        filter: '/v1/presets{?type}', // RFC 6570 URI-Template
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
