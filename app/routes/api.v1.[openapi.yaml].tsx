import { apiDescription, apiRoot } from '~/data/globals';
import { EasingType } from '~/types-and-enums';

export async function loader() {
  // Minimal OpenAPI spec for the /api/v1/curves/{type} endpoint
  const openapi = {
    openapi: '3.1.1',
    info: {
      title: 'Easing Wizard API',
      version: '1.0.0',
      description: apiDescription,
    },
    servers: [
      {
        url: `${apiRoot}`,
      },
    ],
    paths: {
      '/curves/{type}': {
        post: {
          summary: 'Generate easing curve output',
          parameters: [
            {
              name: 'type',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: Object.values(EasingType),
              },
              description: 'Type of easing curve',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/BezierInput' },
                    { $ref: '#/components/schemas/SpringInput' },
                    { $ref: '#/components/schemas/BounceInput' },
                    { $ref: '#/components/schemas/WiggleInput' },
                    { $ref: '#/components/schemas/OvershootInput' },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Easing curve output',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/EasingCurveResponse' },
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      errors: {
                        type: 'array',
                        items: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        BezierInput: {
          type: 'object',
          properties: {
            x1: { type: 'number' },
            y1: { type: 'number' },
            x2: { type: 'number' },
            y2: { type: 'number' },
          },
          required: ['x1', 'y1', 'x2', 'y2'],
        },
        SpringInput: {
          type: 'object',
          properties: {
            mass: { type: 'number' },
            stiffness: { type: 'number' },
            damping: { type: 'number' },
            velocity: { type: 'number' },
          },
          required: ['mass', 'stiffness', 'damping', 'velocity'],
        },
        BounceInput: {
          type: 'object',
          properties: {
            bounces: { type: 'number' },
            stiffness: { type: 'number' },
          },
          required: ['bounces', 'stiffness'],
        },
        WiggleInput: {
          type: 'object',
          properties: {
            wiggles: { type: 'number' },
            amplitude: { type: 'number' },
          },
          required: ['wiggles', 'amplitude'],
        },
        OvershootInput: {
          type: 'object',
          properties: {
            overshoot: { type: 'number' },
            amplitude: { type: 'number' },
          },
          required: ['overshoot', 'amplitude'],
        },
        EasingCurveResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            generated_at: { type: 'string', format: 'date-time' },
            input: { type: 'object' },
            output: { type: 'object' },
            links: { type: 'object' },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(openapi, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
