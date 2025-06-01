import { z } from 'zod/v4';
import { EasingType, LinearEasingAccuracy, OvershootStyle } from '~/types-and-enums';
import { roundTo } from '~/utils/numbers';

export const EasingTypeInput = z.enum(EasingType);

export const BezierInput = z.object({
  x1: z
    .number()
    .min(0)
    .max(1)
    .transform((val) => roundTo(val, 2)),
  y1: z
    .number()
    .min(-1)
    .max(2)
    .transform((val) => roundTo(val, 2)),
  x2: z
    .number()
    .min(0)
    .max(1)
    .transform((val) => roundTo(val, 2)),
  y2: z
    .number()
    .min(-1)
    .max(2)
    .transform((val) => roundTo(val, 2)),
});

export type BezierInput = z.infer<typeof BezierInput>;

export const SpringInput = z.object({
  mass: z
    .number()
    .min(1)
    .max(5)
    .transform((val) => roundTo(val, 1)),
  stiffness: z
    .number()
    .min(0)
    .max(100)
    .transform((val) => roundTo(val, 0)),
  damping: z
    .number()
    .min(0)
    .max(100)
    .transform((val) => roundTo(val, 0)),
  accuracy: z.enum(LinearEasingAccuracy),
});

export type SpringInput = z.infer<typeof SpringInput>;

export const BounceInput = z.object({
  bounces: z
    .number()
    .min(1)
    .max(10)
    .transform((val) => roundTo(val, 0)),
  damping: z
    .number()
    .min(0)
    .max(100)
    .transform((val) => roundTo(val, 1)),
  accuracy: z.enum(LinearEasingAccuracy),
});

export type BounceInput = z.infer<typeof BounceInput>;

export const WiggleInput = z.object({
  wiggles: z
    .number()
    .min(1)
    .max(10)
    .transform((val) => roundTo(val, 0)),
  damping: z
    .number()
    .min(0)
    .max(100)
    .transform((val) => roundTo(val, 1)),
  accuracy: z.enum(LinearEasingAccuracy),
});

export type WiggleInput = z.infer<typeof WiggleInput>;

export const OvershootInput = z.object({
  style: z.enum(OvershootStyle),
  mass: z
    .number()
    .min(1)
    .max(5)
    .transform((val) => roundTo(val, 1)),
  damping: z
    .number()
    .min(0)
    .max(100)
    .transform((val) => roundTo(val, 0)),
  accuracy: z.enum(LinearEasingAccuracy),
});

export type OvershootInput = z.infer<typeof OvershootInput>;
