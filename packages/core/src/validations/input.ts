import { z } from 'zod/v4';
import { EasingType, EasingTypeLowerCase, LinearEasingAccuracy, OvershootStyle } from '~/types/enums';
import { roundTo } from '~/utils/numbers';

export const EasingTypeSchema = z.enum(EasingType).meta({
  id: 'EasingTypeInput',
  description: 'Type of easing function',
  example: 'BEZIER',
});

export const EasingTypeLowerCaseSchema = z.enum(EasingTypeLowerCase).meta({
  id: 'EasingTypeLowerCaseInput',
  description: 'Type of easing function',
  example: 'bezier',
});

export const LinearAccuracySchema = z.enum(LinearEasingAccuracy).meta({
  id: 'LinearAccuracyInput',
  description: 'Accuracy level for the linear easing approximation',
  example: 'high',
});

const dampingFactorSchema = z
  .number()
  .min(0)
  .max(100)
  .multipleOf(1)
  .transform((val) => roundTo(val, 0))
  .meta({
    description: 'Damping (0-100)',
    example: 50,
  });

const stiffnessFactorSchema = z
  .number()
  .min(0)
  .max(100)
  .multipleOf(1)
  .transform((val) => roundTo(val, 0))
  .meta({
    description: 'Stiffness (0-100)',
    example: 50,
  });

const massFactorSchema = z
  .number()
  .min(1)
  .max(5)
  .multipleOf(0.1)
  .transform((val) => roundTo(val, 1))
  .meta({
    description: 'Mass (1-5)',
    example: 2.5,
  });

export const BezierInputSchema = z
  .object({
    x1: z
      .number()
      .min(0)
      .max(1)
      .multipleOf(0.01)
      .transform((val) => roundTo(val, 2))
      .meta({
        description: 'First control point X coordinate (0-1)',
        example: 0.25,
      }),
    y1: z
      .number()
      .min(-1)
      .max(2)
      .multipleOf(0.01)
      .transform((val) => roundTo(val, 2))
      .meta({
        description: 'First control point Y coordinate (-1 to 2)',
        example: 0.1,
      }),
    x2: z
      .number()
      .min(0)
      .max(1)
      .multipleOf(0.01)
      .transform((val) => roundTo(val, 2))
      .meta({
        description: 'Second control point X coordinate (0-1)',
        example: 0.75,
      }),
    y2: z
      .number()
      .min(-1)
      .max(2)
      .multipleOf(0.01)
      .transform((val) => roundTo(val, 2))
      .meta({
        description: 'Second control point Y coordinate (-1 to 2)',
        example: 0.9,
      }),
  })
  .meta({
    id: 'BezierInput',
    title: 'Bézier Curve Input',
    description: 'Input parameters for a cubic Bézier curve',
  });

export type BezierInput = z.infer<typeof BezierInputSchema>;

export const SpringInputSchema = z
  .object({
    mass: massFactorSchema,
    stiffness: stiffnessFactorSchema,
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    id: 'SpringInput',
    title: 'Spring Animation Input',
    description: 'Input parameters for spring-based easing animations',
  });

export type SpringInput = z.infer<typeof SpringInputSchema>;

export const BounceInputSchema = z
  .object({
    bounces: z
      .number()
      .min(1)
      .max(10)
      .multipleOf(1)
      .transform((val) => roundTo(val, 0))
      .meta({
        description: 'Number of bounces (1-10)',
        example: 3,
      }),
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    id: 'BounceInput',
    title: 'Bounce Animation Input',
    description: 'Input parameters for bounce-based easing animations',
  });

export type BounceInput = z.infer<typeof BounceInputSchema>;

export const WiggleInputSchema = z
  .object({
    wiggles: z
      .number()
      .min(1)
      .max(10)
      .multipleOf(1)
      .transform((val) => roundTo(val, 0))
      .meta({
        description: 'Number of wiggle oscillations (1-10)',
        example: 5,
      }),
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    id: 'WiggleInput',
    title: 'Wiggle Animation Input',
    description: 'Input parameters for wiggle-based easing animations',
  });

export type WiggleInput = z.infer<typeof WiggleInputSchema>;

export const OvershootInputSchema = z
  .object({
    style: z.enum(OvershootStyle).meta({
      description: 'Style of overshoot animation',
      example: 'out',
    }),
    mass: massFactorSchema,
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    id: 'OvershootInput',
    title: 'Overshoot Animation Input',
    description: 'Input parameters for overshoot-based easing animations',
  });

export type OvershootInput = z.infer<typeof OvershootInputSchema>;

export const InputUnionSchema = z
  .union([BezierInputSchema, SpringInputSchema, BounceInputSchema, WiggleInputSchema, OvershootInputSchema])
  .meta({
    description: 'Input parameters for easing function configurations',
  });

export type InputUnion = z.infer<typeof InputUnionSchema>;
