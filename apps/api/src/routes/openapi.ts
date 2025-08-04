import {
  API_VERSION,
  BezierEasingCurveResponseSchema,
  BezierParamsSchema,
  BounceEasingCurveResponseSchema,
  BounceParamsSchema,
  CurveIdSchema,
  EasingCurveResponseSchema,
  EasingTypeSchema,
  endpointTexts,
  ErrorResponseSchema,
  healthCheckSchema,
  OvershootEasingCurveResponseSchema,
  OvershootParamsSchema,
  PresetsResponseSchema,
  SpringEasingCurveResponseSchema,
  SpringParamsSchema,
  WiggleEasingCurveResponseSchema,
  WiggleParamsSchema,
} from 'easing-wizard-core';
import { Hono } from 'hono';
import { createDocument } from 'zod-openapi';
import z from 'zod/v4';
import { getEnv } from '~/utils/env';

const badRequest = {
  description: '400 Bad Request',
  content: {
    'application/json': {
      schema: ErrorResponseSchema,
    },
  },
};

const createCurveEndpoints = [
  {
    path: '/curves/bezier',
    operationId: endpointTexts.createBezierCurve.id,
    title: endpointTexts.createBezierCurve.title,
    description: endpointTexts.createBezierCurve.description,
    requestBodySchema: BezierParamsSchema,
    responseSchema: BezierEasingCurveResponseSchema,
  },
  {
    path: '/curves/spring',
    operationId: endpointTexts.createSpringCurve.id,
    title: endpointTexts.createSpringCurve.title,
    description: endpointTexts.createSpringCurve.description,
    requestBodySchema: SpringParamsSchema,
    responseSchema: SpringEasingCurveResponseSchema,
  },
  {
    path: '/curves/bounce',
    operationId: endpointTexts.createBounceCurve.id,
    title: endpointTexts.createBounceCurve.title,
    description: endpointTexts.createBounceCurve.description,
    requestBodySchema: BounceParamsSchema,
    responseSchema: BounceEasingCurveResponseSchema,
  },
  {
    path: '/curves/wiggle',
    operationId: endpointTexts.createWiggleCurve.id,
    title: endpointTexts.createWiggleCurve.title,
    description: endpointTexts.createWiggleCurve.description,
    requestBodySchema: WiggleParamsSchema,
    responseSchema: WiggleEasingCurveResponseSchema,
  },
  {
    path: '/curves/overshoot',
    operationId: endpointTexts.createOvershootCurve.id,
    title: endpointTexts.createOvershootCurve.title,
    description: endpointTexts.createOvershootCurve.description,
    requestBodySchema: OvershootParamsSchema,
    responseSchema: OvershootEasingCurveResponseSchema,
  },
];

const document = createDocument({
  openapi: '3.1.0' as const,
  info: {
    title: 'Easing Wizard API',
    description: 'API for generating CSS easing curves of types like Bézier, Spring, Bounce, Wiggle, and Overshoot.',
    version: '1.0.0',
    contact: {
      name: 'Matthias Martin',
      url: 'https://x.com/RoyDigerhund',
    },
  },
  servers: [
    {
      url: `${getEnv().API_URL}/${API_VERSION}`,
    },
  ],
  tags: [
    { name: 'Curves', description: 'Endpoints for managing easing curves' },
    { name: 'Health', description: 'Health check endpoint' },
  ],
  paths: {
    '/presets': {
      get: {
        operationId: endpointTexts.getPresets.id,
        summary: endpointTexts.getPresets.title,
        description: endpointTexts.getPresets.description,
        requestParams: { query: z.object({ type: EasingTypeSchema.optional() }) },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': { schema: PresetsResponseSchema },
            },
          },
          '400': badRequest,
        },
        tags: ['Curves'],
      },
    },
    '/curves/{id}': {
      get: {
        operationId: endpointTexts.getCurveById.id,
        summary: endpointTexts.getCurveById.title,
        description: endpointTexts.getCurveById.description,
        requestParams: { path: z.object({ id: CurveIdSchema }) },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: EasingCurveResponseSchema,
              },
            },
          },
          '400': badRequest,
        },
        tags: ['Curves'],
      },
    },
    ...Object.fromEntries(
      createCurveEndpoints.map((cfg) => [
        cfg.path,
        {
          post: {
            operationId: cfg.operationId,
            summary: cfg.title,
            description: cfg.description,
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: cfg.requestBodySchema,
                },
              },
            },
            responses: {
              '200': {
                description: '200 OK',
                content: {
                  'application/json': {
                    schema: cfg.responseSchema,
                  },
                },
              },
              '400': badRequest,
            },
            tags: ['Curves'],
          },
        },
      ]),
    ),
    '/healthz': {
      get: {
        servers: [{ url: getEnv().API_URL }],
        operationId: endpointTexts.healthCheck.id,
        summary: endpointTexts.healthCheck.title,
        description: endpointTexts.healthCheck.description,
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: healthCheckSchema,
              },
            },
          },
        },
        tags: ['Health'],
      },
    },
  },
});

const app = new Hono();

app.get('/', () => {
  return new Response(JSON.stringify(document, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
});

export default app;
