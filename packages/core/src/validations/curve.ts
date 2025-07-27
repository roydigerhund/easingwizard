import { z } from 'zod/v4';
import { curveLinksResponseSchema } from './hateoas';
import { 
  BezierInputSchema, 
  SpringInputSchema, 
  BounceInputSchema, 
  WiggleInputSchema, 
  OvershootInputSchema 
} from './input';
import { BezierEasingOutputSchema, LinearEasingOutputSchema } from './output';
import { EasingType } from '~/types/enums';

export const BaseEasingCurveResponseSchema = z
  .object({
    id: z.string().meta({
      description: 'Unique identifier for the curve',
      example: 'abc123def',
    }),
    generated_at: z.iso.datetime().meta({
      description: 'ISO 8601 timestamp when the curve was generated',
      example: '2025-07-03T12:00:00Z',
    }),
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'BaseEasingCurveResponse',
    title: 'Base Easing Curve Response',
    description: 'Base easing curve response with metadata and links',
  });

export const BezierEasingCurveResponseSchema = BaseEasingCurveResponseSchema.extend({
  type: z.literal(EasingType.BEZIER),
  input: BezierInputSchema,
  output: BezierEasingOutputSchema,
}).meta({
  id: 'BezierEasingCurveResponse',
  title: 'Bézier Easing Curve Response',
  description: 'Bézier easing curve response with specific input and output types',
});

export const SpringEasingCurveResponseSchema = BaseEasingCurveResponseSchema.extend({
  type: z.literal(EasingType.SPRING),
  input: SpringInputSchema,
  output: LinearEasingOutputSchema,
}).meta({
  id: 'SpringEasingCurveResponse',
  title: 'Spring Easing Curve Response',
  description: 'Spring easing curve response with specific input and output types',
});

export const BounceEasingCurveResponseSchema = BaseEasingCurveResponseSchema.extend({
  type: z.literal(EasingType.BOUNCE),
  input: BounceInputSchema,
  output: LinearEasingOutputSchema,
}).meta({
  id: 'BounceEasingCurveResponse',
  title: 'Bounce Easing Curve Response',
  description: 'Bounce easing curve response with specific input and output types',
});

export const WiggleEasingCurveResponseSchema = BaseEasingCurveResponseSchema.extend({
  type: z.literal(EasingType.WIGGLE),
  input: WiggleInputSchema,
  output: LinearEasingOutputSchema,
}).meta({
  id: 'WiggleEasingCurveResponse',
  title: 'Wiggle Easing Curve Response',
  description: 'Wiggle easing curve response with specific input and output types',
});

export const OvershootEasingCurveResponseSchema = BaseEasingCurveResponseSchema.extend({
  type: z.literal(EasingType.OVERSHOOT),
  input: OvershootInputSchema,
  output: LinearEasingOutputSchema,
}).meta({
  id: 'OvershootEasingCurveResponse',
  title: 'Overshoot Easing Curve Response',
  description: 'Overshoot easing curve response with specific input and output types',
});

// Union type for backwards compatibility
export const EasingCurveResponseSchema = z.union([
  BezierEasingCurveResponseSchema,
  SpringEasingCurveResponseSchema,
  BounceEasingCurveResponseSchema,
  WiggleEasingCurveResponseSchema,
  OvershootEasingCurveResponseSchema,
]).meta({
  id: 'EasingCurveResponse',
  title: 'Easing Curve Response',
  description: 'Complete easing curve response with metadata and links',
});

export type BaseEasingCurveResponse = z.infer<typeof BaseEasingCurveResponseSchema>;
export type BezierEasingCurveResponse = z.infer<typeof BezierEasingCurveResponseSchema>;
export type SpringEasingCurveResponse = z.infer<typeof SpringEasingCurveResponseSchema>;
export type BounceEasingCurveResponse = z.infer<typeof BounceEasingCurveResponseSchema>;
export type WiggleEasingCurveResponse = z.infer<typeof WiggleEasingCurveResponseSchema>;
export type OvershootEasingCurveResponse = z.infer<typeof OvershootEasingCurveResponseSchema>;
export type EasingCurveResponse = z.infer<typeof EasingCurveResponseSchema>;
