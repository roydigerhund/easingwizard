import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown';
import { ErrorResponseSchema, healthCheckSchema } from 'easing-wizard-core';
import { Hono } from 'hono';
import { createDocument } from 'zod-openapi';

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
  },
  paths: {
    healthz: {
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
    // [`/${API_VERSION}/presets`]: {
    //   get: {
    //     operationId: 'getPresets',
    //     summary: 'Get Preset Curves',
    //     description: 'Retrieve a list of available preset easing curves',
    //     requestParams: { query: z.object({ type: EasingTypeSchema.optional() }) },
    //     responses: {
    //       '200': {
    //         description: '200 OK',
    //         content: {
    //           'application/json': { schema: PresetsResponseSchema },
    //         },
    //       },
    //       '400': badRequest,
    //     },
    //     tags: ['Curves'],
    //   },
    // },
    // [`/${API_VERSION}/curves/{id}`]: {
    //   get: {
    //     operationId: 'getCurveById',
    //     summary: 'Get Curve by ID',
    //     description: 'Retrieve a specific easing curve by its ID',
    //     requestParams: {
    //       path: z.object({
    //         id: z.string().describe('The ID of the easing curve'),
    //       }),
    //     },
    //     responses: {
    //       '200': {
    //         description: '200 OK',
    //         content: {
    //           'application/json': {
    //             schema: EasingCurveResponseSchema,
    //           },
    //         },
    //       },
    //       '400': badRequest,
    //     },
    //     tags: ['Curves'],
    //   },
    // },
    // [`/${API_VERSION}/curves/{type}`]: {
    //   post: {
    //     operationId: 'createCurve',
    //     summary: 'Create a New Curve',
    //     description: 'Generate a new easing curve based on input parameters',
    //     requestParams: {
    //       path: z.object({
    //         type: EasingTypeSchema,
    //       }),
    //     },
    //     requestBody: {
    //       required: true,
    //       content: {
    //         'application/json': {
    //           schema: InputUnionSchema.describe('Input parameters for the easing curve'),
    //         },
    //       },
    //     },
    //     responses: {
    //       '200': {
    //         description: '200 OK',
    //         content: {
    //           'application/json': {
    //             schema: EasingCurveResponseSchema,
    //           },
    //         },
    //       },
    //       '400': badRequest,
    //     },
    //     tags: ['Curves'],
    //   },
    // },
  },
  tags: [
    { name: 'Curves', description: 'Endpoints for managing easing curves' },
    { name: 'Health', description: 'Health check endpoint' },
  ],
});

export const llmMarkdown = await createMarkdownFromOpenApi(JSON.stringify(document));

const app = new Hono();

app.get('/', (c) => {
  return c.json(document);
});

export default app;
