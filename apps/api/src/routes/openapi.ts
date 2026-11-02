import {
  API_VERSION,
  BezierEasingCurveResponseSchema,
  BezierParamsSchema,
  BounceEasingCurveResponseSchema,
  BounceParamsSchema,
  createCurveResponseFromInput,
  createPresetsResponse,
  CurveIdSchema,
  EasingCurveResponseSchema,
  EasingTypeSchema,
  endpointTexts,
  ErrorResponseSchema,
  healthCheckSchema,
  OvershootEasingCurveResponseSchema,
  OvershootParamsSchema,
  type Preset,
  PresetsResponseSchema,
  SpringEasingCurveResponseSchema,
  SpringParamsSchema,
  WiggleEasingCurveResponseSchema,
  WiggleParamsSchema,
} from 'easingwizard-core';
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
    type: 'BEZIER' as const,
    exampleInput: { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 },
    operationId: endpointTexts.createBezierCurve.id,
    title: endpointTexts.createBezierCurve.title,
    description: endpointTexts.createBezierCurve.description,
    requestBodySchema: BezierParamsSchema,
    responseSchema: BezierEasingCurveResponseSchema,
  },
  {
    path: '/curves/spring',
    type: 'SPRING' as const,
    exampleInput: { mass: 2.5, stiffness: 50, damping: 50, accuracy: 'HIGH' },
    operationId: endpointTexts.createSpringCurve.id,
    title: endpointTexts.createSpringCurve.title,
    description: endpointTexts.createSpringCurve.description,
    requestBodySchema: SpringParamsSchema,
    responseSchema: SpringEasingCurveResponseSchema,
  },
  {
    path: '/curves/bounce',
    type: 'BOUNCE' as const,
    exampleInput: { bounces: 3, mass: 2.5, damping: 50, accuracy: 'HIGH' },
    operationId: endpointTexts.createBounceCurve.id,
    title: endpointTexts.createBounceCurve.title,
    description: endpointTexts.createBounceCurve.description,
    requestBodySchema: BounceParamsSchema,
    responseSchema: BounceEasingCurveResponseSchema,
  },
  {
    path: '/curves/wiggle',
    type: 'WIGGLE' as const,
    exampleInput: { wiggles: 5, mass: 2.5, damping: 50, accuracy: 'HIGH' },
    operationId: endpointTexts.createWiggleCurve.id,
    title: endpointTexts.createWiggleCurve.title,
    description: endpointTexts.createWiggleCurve.description,
    requestBodySchema: WiggleParamsSchema,
    responseSchema: WiggleEasingCurveResponseSchema,
  },
  {
    path: '/curves/overshoot',
    type: 'OVERSHOOT' as const,
    exampleInput: { style: 'OUT', mass: 2.5, damping: 50, accuracy: 'HIGH' },
    operationId: endpointTexts.createOvershootCurve.id,
    title: endpointTexts.createOvershootCurve.title,
    description: endpointTexts.createOvershootCurve.description,
    requestBodySchema: OvershootParamsSchema,
    responseSchema: OvershootEasingCurveResponseSchema,
  },
];

// The documentation examples use the same calculation code as the endpoints.
// Only their timestamp is fixed so the OpenAPI document remains deterministic.
const curveExamples = createCurveEndpoints.map((endpoint) => ({
  ...endpoint,
  example: {
    ...createCurveResponseFromInput({ type: endpoint.type, config: endpoint.exampleInput }),
    generated_at: '2026-11-02T00:00:00.000Z',
  },
}));

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
      curveExamples.map((cfg) => [
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
                  example: cfg.example.input,
                },
              },
            },
            responses: {
              '200': {
                description: '200 OK',
                content: {
                  'application/json': {
                    schema: cfg.responseSchema,
                    example: cfg.example,
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

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function objectAt(value: unknown, ...keys: string[]): JsonObject {
  for (const key of keys) {
    if (!isObject(value)) throw new Error(`Missing OpenAPI object before ${key}`);
    value = value[key];
  }
  if (!isObject(value)) throw new Error(`Missing OpenAPI object: ${keys.join('.')}`);
  return value;
}

// Scalar can display either a complete response example or examples assembled
// from individual schema properties. Keep both views tied to the same values.
function applySchemaExample(schema: unknown, example: unknown) {
  if (!isObject(schema)) return;
  schema.example = example;
  if (isObject(schema.properties) && isObject(example)) {
    for (const [key, value] of Object.entries(example)) {
      applySchemaExample(schema.properties[key], value);
    }
  }
  const alternatives = schema.anyOf ?? schema.oneOf;
  if (Array.isArray(alternatives) && isObject(example) && typeof example.type === 'string') {
    for (const alternative of alternatives) {
      if (objectAt(alternative, 'properties', 'type').const === example.type) {
        applySchemaExample(alternative, example);
      }
    }
  }
  if (Array.isArray(example) && example.length && isObject(schema.items)) {
    applySchemaExample(schema.items, example[0]);
  }
}

async function buildDocumentExamples() {
  for (const endpoint of curveExamples) {
    const operation = objectAt(document, 'paths', endpoint.path, 'post');
    applySchemaExample(
      objectAt(operation, 'requestBody', 'content', 'application/json').schema,
      endpoint.example.input,
    );
    applySchemaExample(objectAt(operation, 'responses', '200', 'content', 'application/json').schema, endpoint.example);
  }

  const curveMedia = objectAt(
    document,
    'paths',
    '/curves/{id}',
    'get',
    'responses',
    '200',
    'content',
    'application/json',
  );
  curveMedia.examples = Object.fromEntries(
    curveExamples.map(({ type, example }) => [
      type.toLowerCase(),
      {
        summary: `${type.toLowerCase()} curve`,
        value: example,
      },
    ]),
  );
  // Annotate every union member, while keeping the default example aligned with
  // the actual ID suggested by the GET path parameter.
  for (const { example } of [...curveExamples].reverse()) applySchemaExample(curveMedia.schema, example);

  const allPresets = await createPresetsResponse();
  const presetMedia = objectAt(document, 'paths', '/presets', 'get', 'responses', '200', 'content', 'application/json');
  const presetItemSchema = objectAt(presetMedia, 'schema', 'properties', 'presets', 'items');
  for (const { type } of [...curveExamples].reverse()) {
    const preset = allPresets.presets.find((entry: Preset) => entry.type === type);
    if (preset) applySchemaExample(presetItemSchema, preset);
  }
  // The optional filter's documented example is BEZIER, so the collection
  // example must contain the complete matching result, including its hash.
  const presetExample = await createPresetsResponse('BEZIER');
  presetMedia.example = presetExample;
  applySchemaExample(presetMedia.schema, presetExample);

  return JSON.stringify(document, null, 2);
}

let documentJson: Promise<string> | undefined;
const app = new Hono();

app.get('/', async () => {
  documentJson ??= buildDocumentExamples();
  return new Response(await documentJson, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
});

export default app;
