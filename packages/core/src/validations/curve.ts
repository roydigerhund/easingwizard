import { z } from 'zod/v4';
import { curveLinksResponseSchema } from './hateoas';
import { EasingTypeSchema, InputUnionSchema } from './input';
import { OutputUnionSchema } from './output';

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
    input: InputUnionSchema,
    output: OutputUnionSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'EasingCurveResponse',
    description: 'Complete easing curve response with metadata and links',
  });

export const ErrorResponseSchema = z
  .object({
    errors: z
      .array(
        z.object({
          expected: z
            .string()
            .meta({
              description: 'Expected type or value',
              example: 'number',
            })
            .optional(),
          values: z
            .array(z.string())
            .meta({
              description: 'List of valid values or types',
              example: ['BEZIER', 'SPRING', 'BOUNCE', 'WIGGLE', 'OVERSHOOT'],
            })
            .optional(),
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

export type EasingCurveResponse = z.infer<typeof EasingCurveResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

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
