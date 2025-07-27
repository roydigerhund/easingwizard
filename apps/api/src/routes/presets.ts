import {
  API_VERSION,
  EasingType,
  EasingTypeSchema,
  getAllPresets,
  getBezierPresets,
  getBouncePresets,
  getOvershootPresets,
  getSpringPresets,
  getWigglePresets,
  toScreamingSnakeCase,
  type EasingTypeKey,
  type ErrorResponse,
  type Preset,
  type PresetsResponse,
} from 'easing-wizard-core';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { getEnv } from '~/utils/env';
import { transformOtherError, transformZodError } from '~/utils/errors';

const app = new Hono();

const frontendUrl = getEnv().FRONTEND_URL;

// Enhanced preset data with API links
const enhancePresetWithApiData = (preset: Preset) => ({
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

const getPresetsByType = (type?: EasingTypeKey) => {
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
  const typeSearchParam = toScreamingSnakeCase(c.req.query('type'));

  try {
    const type = EasingTypeSchema.optional().parse(typeSearchParam);
    const presets = getPresetsByType(type);

    // Create version asynchronously
    const version = await createVersion(allPresets);

    return c.json<PresetsResponse>({
      version,
      presets,
      // HATEOAS
      links: {
        self: `${API_VERSION}/presets${type ? `?type=${type}` : ''}`,
        filter: `/${API_VERSION}/presets{?type}`, // RFC 6570 URI-Template
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json<ErrorResponse>({ errors: transformZodError(error) }, 400);
    }
    return c.json<ErrorResponse>({ errors: transformOtherError(error) }, 400);
  }
});

export default app;
