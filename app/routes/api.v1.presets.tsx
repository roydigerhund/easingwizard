import { LoaderFunctionArgs } from '@vercel/remix';
import { createHash } from 'crypto';
import z from 'zod/v4';
import { bezierFunctions, bounceFunctions, overshootFunctions, springFunctions, wiggleFunctions } from '~/data/easing';
import { apiOrigin } from '~/data/globals';
import { EasingType } from '~/types-and-enums';
import { EasingTypeInput } from '~/validations/easing';

const bezierPresets = Object.entries(bezierFunctions).flatMap(([style, curves]) => {
  return Object.entries(curves).map(([curve, params]) => ({
    id: `${EasingType.BEZIER}.${style}.${curve}`,
    type: EasingType.BEZIER,
    style,
    curve,
    params,
    links: {
      self: `${apiOrigin}/curves/${EasingType.BEZIER}`,
    },
  }));
});

const springPresets = Object.entries(springFunctions).map(([curve, params]) => ({
  id: `${EasingType.SPRING}.${curve}`,
  type: EasingType.SPRING,
  curve,
  params,
  links: {
    self: `${apiOrigin}/curves/${EasingType.SPRING}`,
  },
}));

const bouncePresets = Object.entries(bounceFunctions).map(([curve, params]) => ({
  id: `${EasingType.BOUNCE}.${curve}`,
  type: EasingType.BOUNCE,
  curve,
  params,
  links: {
    self: `${apiOrigin}/curves/${EasingType.BOUNCE}`,
  },
}));

const wigglePresets = Object.entries(wiggleFunctions).map(([curve, params]) => ({
  id: `${EasingType.WIGGLE}.${curve}`,
  type: EasingType.WIGGLE,
  curve,
  params,
  links: {
    self: `${apiOrigin}/curves/${EasingType.WIGGLE}`,
  },
}));

const overshootPresets = Object.entries(overshootFunctions).flatMap(([style, curves]) => {
  return Object.entries(curves).map(([curve, params]) => ({
    id: `${EasingType.OVERSHOOT}.${style}.${curve}`,
    type: EasingType.OVERSHOOT,
    style,
    curve,
    params,
    links: {
      self: `${apiOrigin}/curves/${EasingType.OVERSHOOT}`,
    },
  }));
});

const allPresets = [...bezierPresets, ...springPresets, ...bouncePresets, ...wigglePresets, ...overshootPresets];
// Create a version string based on allPresets data
const version = createHash('sha256').update(JSON.stringify(allPresets)).digest('hex').slice(0, 8);

const getPresetsByType = (type?: EasingType) => {
  if (!type) return allPresets;

  switch (type) {
    case EasingType.BEZIER:
      return bezierPresets;
    case EasingType.SPRING:
      return springPresets;
    case EasingType.BOUNCE:
      return bouncePresets;
    case EasingType.WIGGLE:
      return wigglePresets;
    case EasingType.OVERSHOOT:
      return overshootPresets;
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const typeSearchParam = url.searchParams.get('type');

  try {
    const type = typeSearchParam ? EasingTypeInput.parse(typeSearchParam) : undefined;
    const presets = getPresetsByType(type);

    return {
      version,
      presets,
      // HATEOAS
      links: {
        self: `${apiOrigin}/presets${type ? `?type=${type}` : ''}`,
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
