import { z } from 'zod/v4';
import { EasingType, EasingTypeLowerCase, LinearEasingAccuracy, OvershootStyle } from '~/types/enums';
import { roundTo } from '~/utils/numbers';

export const EasingTypeSchema = z.enum(EasingType).meta({
  title: 'Easing Type',
  description: 'Type of easing function',
  example: EasingType.BEZIER,
});

export const EasingTypeLowerCaseSchema = z.enum(EasingTypeLowerCase).meta({
  title: 'Easing Type Lowercase',
  description: 'Type of easing function',
  example: EasingTypeLowerCase.BEZIER,
});

export const LinearAccuracySchema = z.enum(LinearEasingAccuracy).meta({
  description: 'Accuracy level for the linear easing approximation, HIGH is the best option for most cases.',
  example: LinearEasingAccuracy.HIGH,
});

const dampingFactorSchema = z
  // z.toJSONSchema does not support transform yet
  .preprocess((val) => roundTo(z.number().parse(val), 0), z.number().min(0).max(100))
  .meta({
    description: 'Damping (0-100)',
    example: 50,
  });

const stiffnessFactorSchema = z
  // z.toJSONSchema does not support transform yet
  .preprocess((val) => roundTo(z.number().parse(val), 0), z.number().min(0).max(100))
  .meta({
    description: 'Stiffness (0-100)',
    example: 50,
  });

const massFactorSchema = z
  // z.toJSONSchema does not support transform yet
  .preprocess((val) => roundTo(z.number().parse(val), 1), z.number().min(1).max(5))
  .meta({
    description: 'Mass (1-5)',
    example: 2.5,
  });

export const BezierParamsSchema = z
  .object({
    x1: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 3), z.number().min(0).max(1))
      .meta({
        description: 'First control point X coordinate (0-1)',
        example: 0.25,
      }),
    y1: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 3), z.number().min(-1).max(2))
      .meta({
        description: 'First control point Y coordinate (-1 to 2)',
        example: 0.1,
      }),
    x2: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 3), z.number().min(0).max(1))
      .meta({
        description: 'Second control point X coordinate (0-1)',
        example: 0.75,
      }),
    y2: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 3), z.number().min(-1).max(2))
      .meta({
        description: 'Second control point Y coordinate (-1 to 2)',
        example: 0.9,
      }),
  })
  .meta({
    title: 'Bézier Curve Parameters',
    description: 'Parameters for a cubic Bézier curve',
  });

export type BezierParams = z.infer<typeof BezierParamsSchema>;

export const SpringParamsSchema = z
  .object({
    mass: massFactorSchema,
    stiffness: stiffnessFactorSchema,
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    title: 'Spring Animation Parameters',
    description: 'Parameters for spring-based easing animations',
  });

export type SpringParams = z.infer<typeof SpringParamsSchema>;

export const BounceParamsSchema = z
  .object({
    bounces: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 0), z.number().min(1).max(10))
      .meta({
        description: 'Number of bounces (1-10)',
        example: 3,
      }),
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    title: 'Bounce Animation Parameters',
    description: 'Parameters for bounce-based easing animations',
  });

export type BounceParams = z.infer<typeof BounceParamsSchema>;

export const WiggleParamsSchema = z
  .object({
    wiggles: z
      // z.toJSONSchema does not support transform yet
      .preprocess((val) => roundTo(z.number().parse(val), 0), z.number().min(1).max(10))
      .meta({
        description: 'Number of wiggle oscillations (1-10)',
        example: 5,
      }),
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    title: 'Wiggle Animation Parameters',
    description: 'Parameters for wiggle-based easing animations',
  });

export type WiggleParams = z.infer<typeof WiggleParamsSchema>;

export const OvershootParamsSchema = z
  .object({
    style: z.enum(OvershootStyle).meta({
      description: 'Style of overshoot animation',
      example: OvershootStyle.OUT,
    }),
    mass: massFactorSchema,
    damping: dampingFactorSchema,
    accuracy: LinearAccuracySchema,
  })
  .meta({
    title: 'Overshoot Animation Parameters',
    description: 'Parameters for overshoot-based easing animations',
  });

export type OvershootParams = z.infer<typeof OvershootParamsSchema>;

export const ParamsUnionSchema = z
  .union([BezierParamsSchema, SpringParamsSchema, BounceParamsSchema, WiggleParamsSchema, OvershootParamsSchema])
  .meta({
    description: 'Parameters for easing function configurations',
  });

export type ParamsUnion = z.infer<typeof ParamsUnionSchema>;
