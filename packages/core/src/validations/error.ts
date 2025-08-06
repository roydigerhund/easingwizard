import { z } from 'zod/v4';
import { EasingType } from '~/types/enums';

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
              example: [
                EasingType.BEZIER,
                EasingType.SPRING,
                EasingType.BOUNCE,
                EasingType.WIGGLE,
                EasingType.OVERSHOOT,
              ],
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
    description: 'Error response with validation details',
  });

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
