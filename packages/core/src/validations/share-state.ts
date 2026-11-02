import { z } from 'zod/v4';
import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  OvershootCurve,
  OvershootStyle,
  SpringCurve,
  WiggleCurve,
} from '~/types/enums';

// Shared URLs may omit any field: rehydration supplies the version's defaults.
// Validate without rounding so existing valid URLs retain their exact values.
export const ShareStateSchema = z
  .object({
    easingType: z.enum(EasingType),
    bezierStyle: z.enum(BezierStyle),
    bezierCurve: z.enum(BezierCurve),
    bezierX1: z.number().min(0).max(1),
    bezierY1: z.number().min(-1).max(2),
    bezierX2: z.number().min(0).max(1),
    bezierY2: z.number().min(-1).max(2),
    springCurve: z.enum(SpringCurve),
    springMass: z.number().min(1).max(5),
    springStiffness: z.number().min(0).max(100),
    springDamping: z.number().min(0).max(100),
    bounceCurve: z.enum(BounceCurve),
    bounceBounces: z.number().min(1).max(10),
    bounceMass: z.number().min(1).max(5),
    bounceDamping: z.number().min(0).max(100),
    wiggleCurve: z.enum(WiggleCurve),
    wiggleWiggles: z.number().min(1).max(10),
    wiggleMass: z.number().min(1).max(5),
    wiggleDamping: z.number().min(0).max(100),
    overshootStyle: z.enum(OvershootStyle),
    overshootCurve: z.enum(OvershootCurve),
    overshootMass: z.number().min(1).max(5),
    overshootDamping: z.number().min(0).max(100),
    previewDuration: z.number().nonnegative(),
    previewAnimationType: z.enum(AnimationType),
    editorAccuracy: z.enum(LinearEasingAccuracy),
  })
  .partial();
