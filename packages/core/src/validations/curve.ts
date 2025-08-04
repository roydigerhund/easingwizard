import { z } from 'zod/v4';
import { EasingType } from '~/types/enums';
import { curveLinksResponseSchema } from './hateoas';
import {
  BezierParamsSchema,
  BounceParamsSchema,
  OvershootParamsSchema,
  ParamsUnionSchema,
  SpringParamsSchema,
  WiggleParamsSchema,
} from './input';
import { BezierEasingOutputSchema, LinearEasingOutputSchema, OutputUnionSchema } from './output';

export const CurveIdSchema = z.string().meta({
  description: 'The ID of the easing curve',
  example: '0a1b2c3xy',
});

export const generatedAtSchema = z.string().meta({
  description: 'ISO 8601 timestamp when the curve was generated',
  example: '2025-07-03T12:00:00Z',
  format: 'date-time',
});

export const BezierEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.BEZIER),
    generated_at: generatedAtSchema,
    input: BezierParamsSchema,
    output: BezierEasingOutputSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'BezierEasingCurveResponse',
    title: 'Bézier Easing Curve Response',
    description: 'Bézier easing curve response with specific input and output types',
  });

export const SpringEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.SPRING),
    generated_at: generatedAtSchema,
    input: SpringParamsSchema,
    output: LinearEasingOutputSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'SpringEasingCurveResponse',
    title: 'Spring Easing Curve Response',
    description: 'Spring easing curve response with specific input and output types',
  });

export const BounceEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.BOUNCE),
    generated_at: generatedAtSchema,
    input: BounceParamsSchema,
    output: LinearEasingOutputSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'BounceEasingCurveResponse',
    title: 'Bounce Easing Curve Response',
    description: 'Bounce easing curve response with specific input and output types',
  });

export const WiggleEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.WIGGLE),
    generated_at: generatedAtSchema,
    input: WiggleParamsSchema,
    output: LinearEasingOutputSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'WiggleEasingCurveResponse',
    title: 'Wiggle Easing Curve Response',
    description: 'Wiggle easing curve response with specific input and output types',
  });

export const OvershootEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.literal(EasingType.OVERSHOOT),
    generated_at: generatedAtSchema,
    input: OvershootParamsSchema,
    output: LinearEasingOutputSchema,
    links: curveLinksResponseSchema,
  })
  .meta({
    id: 'OvershootEasingCurveResponse',
    title: 'Overshoot Easing Curve Response',
    description: 'Overshoot easing curve response with specific input and output types',
  });

export const EasingCurveResponseSchema = z
  .union([
    BezierEasingCurveResponseSchema,
    SpringEasingCurveResponseSchema,
    BounceEasingCurveResponseSchema,
    WiggleEasingCurveResponseSchema,
    OvershootEasingCurveResponseSchema,
  ])
  .meta({
    id: 'EasingCurveResponse',
    title: 'Easing Curve Response',
    description: 'Complete easing curve response with metadata and links',
  });

export const NonUnionEasingCurveResponseSchema = z
  .object({
    id: CurveIdSchema,
    type: z.enum(EasingType),
    generated_at: generatedAtSchema,
    input: ParamsUnionSchema,
    output: OutputUnionSchema,
    links: curveLinksResponseSchema,
  })

export type BezierEasingCurveResponse = z.infer<typeof BezierEasingCurveResponseSchema>;
export type SpringEasingCurveResponse = z.infer<typeof SpringEasingCurveResponseSchema>;
export type BounceEasingCurveResponse = z.infer<typeof BounceEasingCurveResponseSchema>;
export type WiggleEasingCurveResponse = z.infer<typeof WiggleEasingCurveResponseSchema>;
export type OvershootEasingCurveResponse = z.infer<typeof OvershootEasingCurveResponseSchema>;
export type EasingCurveResponse = z.infer<typeof EasingCurveResponseSchema>;
