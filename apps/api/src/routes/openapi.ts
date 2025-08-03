import {
  API_VERSION,
  BezierEasingCurveResponseSchema,
  BezierParamsSchema,
  BounceEasingCurveResponseSchema,
  BounceParamsSchema,
  EasingCurveResponseSchema,
  EasingTypeSchema,
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
    operationId: 'createBezierCurve',
    name: 'Bézier',
    requestBodySchema: BezierParamsSchema,
    responseSchema: BezierEasingCurveResponseSchema,
  },
  {
    path: '/curves/spring',
    operationId: 'createSpringCurve',
    name: 'Spring',
    requestBodySchema: SpringParamsSchema,
    responseSchema: SpringEasingCurveResponseSchema,
  },
  {
    path: '/curves/bounce',
    operationId: 'createBounceCurve',
    name: 'Bounce',
    requestBodySchema: BounceParamsSchema,
    responseSchema: BounceEasingCurveResponseSchema,
  },
  {
    path: '/curves/wiggle',
    operationId: 'createWiggleCurve',
    name: 'Wiggle',
    requestBodySchema: WiggleParamsSchema,
    responseSchema: WiggleEasingCurveResponseSchema,
  },
  {
    path: '/curves/overshoot',
    operationId: 'createOvershootCurve',
    name: 'Overshoot',
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
    '/healthz': {
      get: {
        operationId: 'healthCheck',
        summary: 'Health Check',
        description: 'Check if the API is running',
        responses: {
          '200': {
            description: 'API is healthy',
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
    '/presets': {
      get: {
        operationId: 'getPresets',
        summary: 'Get Preset Curves',
        description: 'Retrieve a list of available preset easing curves',
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
        operationId: 'getCurveById',
        summary: 'Get Curve by ID',
        description: 'Retrieve a specific easing curve by its ID',
        requestParams: {
          path: z.object({
            id: z.string().meta({ description: 'The ID of the easing curve', example: '0a0d.25e.1f.75g.914' }),
          }),
        },
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
            summary: `Create ${cfg.name} Curve`,
            description: `Generate a ${cfg.name} easing curve based on input parameters`,
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
