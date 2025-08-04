import { FRONTEND_URL } from '~/data/globals';
import {
  getAllPresets,
  getBezierPresets,
  getBouncePresets,
  getOvershootPresets,
  getSpringPresets,
  getWigglePresets,
} from '~/generated/preset-data';
import { EasingType, type EasingTypeKey } from '~/types/enums';
import type { Preset, PresetsResponse } from '~/validations/preset';

// Enhanced preset data with API links
const enhancePresetWithApiData = (preset: Preset) => ({
  ...preset,
  links: {
    self: `/curves/${preset.id}`,
    share_url: `${FRONTEND_URL}/#${preset.id}`,
    create: `/curves/${preset.type.toLowerCase()}`,
  },
});

// Get all presets with enhanced API data
const allPresets = getAllPresets().map(enhancePresetWithApiData);

// Create a version string using Web Crypto API
export const createVersion = async (data: unknown) => {
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

export const createPresetsResponse = async (type?: EasingTypeKey): Promise<PresetsResponse> => {
  const presets = getPresetsByType(type);

  // Create version asynchronously
  const version = await createVersion(allPresets);

  return {
    version,
    presets,
    // HATEOAS
    links: {
      self: `/presets${type ? `?type=${type}` : ''}`,
      filter: '/presets{?type}', // RFC 6570 URI-Template
    },
  };
};
