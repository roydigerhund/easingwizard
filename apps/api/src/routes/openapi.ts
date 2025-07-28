import {
  API_VERSION,
  EasingCurveResponseSchema,
  EasingTypeLowerCaseSchema,
  EasingTypeSchema,
  ErrorResponseSchema,
  healthCheckSchema,
  ParamsUnionSchema,
  PresetsResponseSchema,
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
            id: z.string().describe('The ID of the easing curve'),
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
    '/curves/{type}': {
      post: {
        operationId: 'createCurve',
        summary: 'Create a New Curve',
        description: 'Generate a new easing curve based on input parameters',
        requestParams: {
          path: z.object({
            type: EasingTypeLowerCaseSchema,
          }),
        },
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: ParamsUnionSchema.describe('Input parameters for the easing curve'),
            },
          },
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
