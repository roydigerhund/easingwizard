import { z } from 'zod/v4';
import { API_VERSION } from '~/data/globals';
import {
  BezierInputSchema,
  BounceInputSchema,
  EasingTypeSchema,
  OvershootInputSchema,
  SpringInputSchema,
  WiggleInputSchema,
} from './input';

// Response schemas
export const ResponseOutputSchema = z
  .object({
    css: z.string().meta({
      description: 'CSS easing function string',
      example: 'cubic-bezier(0.66, 0, 0.34, 1)',
    }),
    tailwind_css: z.string().meta({
      description: 'Tailwind CSS compatible easing string',
      example: 'ease-[cubic-bezier(0.66,0,0.34,1)]',
    }),
    svg_path: z.string().optional().meta({
      description: 'SVG path for bezier curves',
      example: 'M0,100 C66,100 34,0 100,0',
    }),
    svg_polyline: z.string().optional().meta({
      description: 'SVG polyline for linear easing curves',
      example: '0,75 15.2,39.6 32.8,21.75 50,18.45 100,25',
    }),
  })
  .meta({
    id: 'ResponseOutput',
    description: 'Generated easing function output',
  });

// TODO: move origins to a separate file
export const ResponseLinksSchema = z
  .object({
    self: z.url().meta({
      description: 'Link to this curve resource',
      example: `https://api.easingwizard.com/${API_VERSION}/curves/abc123def`,
    }),
    share_url: z.url().meta({
      description: 'Shareable URL for this curve',
      example: 'https://easingwizard.com/#abc123def',
    }),
    create: z.url().meta({
      description: 'Endpoint to create curves of this type',
      example: `https://api.easingwizard.com/${API_VERSION}/curves/bezier`,
    }),
  })
  .meta({
    id: 'ResponseLinks',
    description: 'HATEOAS navigation links for the easing curve',
  });

export const EasingCurveResponseSchema = z
  .object({
    id: z.string().meta({
      description: 'Unique identifier for the curve',
      example: 'abc123def',
    }),
    type: EasingTypeSchema.meta({
      description: 'Type of easing curve',
    }),
    generated_at: z.iso.datetime().meta({
      description: 'ISO 8601 timestamp when the curve was generated',
      example: '2025-07-03T12:00:00Z',
    }),
    input: z
      .union([BezierInputSchema, SpringInputSchema, BounceInputSchema, WiggleInputSchema, OvershootInputSchema])
      .meta({
        description: 'Input parameters used to generate the curve',
      }),
    output: ResponseOutputSchema,
    links: z
      .object({
        self: z.url().meta({
          description: 'Link to this curve resource',
          example: 'https://api.easingwizard.com/v1/curves/abc123def',
        }),
        share_url: z.url().meta({
          description: 'Shareable URL for this curve',
          example: 'https://easingwizard.com/#abc123def',
        }),
        create: z.url().meta({
          description: 'Endpoint to create curves of this type',
          example: 'https://api.easingwizard.com/v1/curves/bezier',
        }),
      })
      .meta({
        description: 'HATEOAS navigation links',
      }),
  })
  .meta({
    id: 'EasingCurveResponse',
    description: 'Complete easing curve response with metadata and links',
  });

export const PresetSchemaZ = z
  .object({
    id: z.string().meta({
      description: 'Unique preset identifier',
      example: 'abc123def',
    }),
    type: EasingTypeSchema,
    style: z.string().optional().meta({
      description: 'Style variant (for bezier and overshoot)',
      example: 'inOut',
    }),
    curve: z.string().optional().meta({
      description: 'Curve variant name',
      example: 'cubic',
    }),
    params: z
      .union([BezierInputSchema, SpringInputSchema, BounceInputSchema, WiggleInputSchema, OvershootInputSchema])
      .meta({
        description: 'Parameters for this preset',
      }),
    output: ResponseOutputSchema,
    links: z
      .object({
        self: z.url().meta({
          description: 'Link to this curve resource',
          example: `https://api.easingwizard.com/${API_VERSION}/curves/abc123def`,
        }),
        share_url: z.url().meta({
          description: 'Shareable URL for this curve',
          example: 'https://easingwizard.com/#abc123def',
        }),
        create: z.url().meta({
          description: 'Endpoint to create curves of this type',
          example: `https://api.easingwizard.com/${API_VERSION}/curves/bezier`,
        }),
      })
      .meta({
        description: 'HATEOAS navigation links',
      }),
  })
  .meta({
    id: 'PresetZ',
    description: 'Preset easing curve configuration',
  });

export const PresetsResponseSchema = z
  .object({
    version: z.string().meta({
      description: 'Version hash of the presets data',
      example: 'a1b2c3d4',
    }),
    presets: z.array(PresetSchemaZ).meta({
      description: 'Array of available presets',
    }),
    links: z
      .object({
        self: z.url().meta({
          description: 'Link to this presets collection',
          example: `https://api.easingwizard.com/${API_VERSION}/presets`,
        }),
        filter: z.string().meta({
          description: 'Template for filtering presets by type',
          example: '/api/v1/presets{?type}',
        }),
      })
      .meta({
        description: 'HATEOAS navigation links',
      }),
  })
  .meta({
    id: 'PresetsResponse',
    description: 'Collection of preset easing curves',
  });

export type PresetsResponse = z.infer<typeof PresetsResponseSchema>;

export const ErrorResponseSchema = z
  .object({
    errors: z
      .array(
        z.object({
          code: z.string().meta({
            description: 'Error code',
            example: 'invalid_type',
          }),
          message: z.string().meta({
            description: 'Human-readable error message',
            example: 'Expected number, received string',
          }),
          path: z.array(z.union([z.string(), z.number()])).meta({
            description: 'Path to the field that caused the error',
            example: ['x1'],
          }),
        }),
      )
      .meta({
        description: 'Array of validation errors',
      }),
  })
  .meta({
    id: 'ErrorResponse',
    description: 'Error response with validation details',
  });

// Generate OpenAPI document using hybrid approach with zod-openapi v5
// export function generateOpenAPIDocument() {
//   // Generate a minimal document first to get schema generation working
//   const minimalDoc = {
//     openapi: '3.1.0' as const,
//     info: {
//       title: 'Easing Wizard API',
//       version: '1.0.0',
//       description: 'A comprehensive API for generating and managing easing curves',
//     },
//     paths: {
//       '/test': {
//         post: {
//           requestBody: {
//             content: {
//               'application/json': {
//                 schema: BezierInputSchema,
//               },
//             },
//           },
//           responses: {
//             '200': {
//               description: 'Success',
//               content: {
//                 'application/json': {
//                   schema: EasingCurveResponseSchema,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   };

//   // Generate with zod-openapi to get the schema components
//   const generated = createDocument(minimalDoc);

//   // Now create the full OpenAPI document manually using the generated schemas
//   const fullDocument = {
//     openapi: '3.1.0',
//     info: {
//       title: 'Easing Wizard API',
//       version: '1.0.0',
//       description: 'A comprehensive API for generating and managing easing curves',
//       contact: {
//         url: 'https://easingwizard.com',
//       },
//       license: {
//         name: 'MIT',
//       },
//     },
//     servers: [
//       {
//         url: 'https://easingwizard.com/api/v1',
//         description: 'Production API server',
//       },
//     ],
//     paths: {
//       '/curves/{id}': {
//         get: {
//           summary: 'Get curve by ID',
//           description: 'Retrieve a curve configuration by its encoded ID',
//           operationId: 'getCurve',
//           parameters: [
//             {
//               name: 'id',
//               in: 'path',
//               required: true,
//               schema: { type: 'string' },
//               description: 'Encoded curve ID',
//               example: 'abc123def',
//             },
//           ],
//           responses: {
//             '200': {
//               description: 'Curve configuration',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/EasingCurveResponse' },
//                 },
//               },
//             },
//             '400': {
//               description: 'Invalid ID or malformed request',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/ErrorResponse' },
//                 },
//               },
//             },
//           },
//           tags: ['Curves'],
//         },
//       },
//       '/curves/{type}': {
//         post: {
//           summary: 'Create curve from parameters',
//           description: 'Generate a new easing curve from input parameters',
//           operationId: 'createCurve',
//           parameters: [
//             {
//               name: 'type',
//               in: 'path',
//               required: true,
//               schema: { $ref: '#/components/schemas/EasingType' },
//               description: 'Type of easing curve to create',
//               example: 'bezier',
//             },
//           ],
//           requestBody: {
//             required: true,
//             content: {
//               'application/json': {
//                 schema: {
//                   oneOf: [
//                     { $ref: '#/components/schemas/BezierInput' },
//                     { $ref: '#/components/schemas/SpringInput' },
//                     { $ref: '#/components/schemas/BounceInput' },
//                     { $ref: '#/components/schemas/WiggleInput' },
//                     { $ref: '#/components/schemas/OvershootInput' },
//                   ],
//                 },
//               },
//             },
//           },
//           responses: {
//             '200': {
//               description: 'Generated curve',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/EasingCurveResponse' },
//                 },
//               },
//             },
//             '400': {
//               description: 'Invalid input parameters',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/ErrorResponse' },
//                 },
//               },
//             },
//           },
//           tags: ['Curves'],
//         },
//       },
//       '/presets': {
//         get: {
//           summary: 'Get preset curves',
//           description: 'Retrieve a collection of preset easing curves, optionally filtered by type',
//           operationId: 'getPresets',
//           parameters: [
//             {
//               name: 'type',
//               in: 'query',
//               required: false,
//               schema: { $ref: '#/components/schemas/EasingType' },
//               description: 'Filter presets by easing type',
//               example: 'bezier',
//             },
//           ],
//           responses: {
//             '200': {
//               description: 'Collection of presets',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/PresetsResponse' },
//                 },
//               },
//             },
//             '400': {
//               description: 'Invalid type parameter',
//               content: {
//                 'application/json': {
//                   schema: { $ref: '#/components/schemas/ErrorResponse' },
//                 },
//               },
//             },
//           },
//           tags: ['Presets'],
//         },
//       },
//       '/healthz': {
//         get: {
//           summary: 'Health check',
//           description: 'Check API health status',
//           operationId: 'healthCheck',
//           responses: {
//             '200': {
//               description: 'API is healthy',
//               content: {
//                 'application/json': {
//                   schema: {
//                     type: 'object',
//                     properties: {
//                       status: { type: 'string', example: 'ok' },
//                       timestamp: { type: 'string', format: 'date-time' },
//                     },
//                     required: ['status', 'timestamp'],
//                   },
//                 },
//               },
//             },
//           },
//           tags: ['Health'],
//         },
//       },
//     },
//     components: generated.components || { schemas: {} },
//     tags: [
//       {
//         name: 'Curves',
//         description: 'Operations for creating and retrieving easing curves',
//       },
//       {
//         name: 'Presets',
//         description: 'Operations for retrieving preset easing curves',
//       },
//       {
//         name: 'Health',
//         description: 'API health check endpoints',
//       },
//     ],
//   };

//   return fullDocument;
// }
