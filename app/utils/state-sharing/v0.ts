import { defaultEasingContext, EasingState } from '~/state/easing-store';

// Replace the following with the fixed default values when V2 is introduced
export const DEFAULTS_V0 = defaultEasingContext;

export const EASING_STATE_SHARE_KEYS_V0 = [
  // Rest state keys
  'easingType',
  'previewDuration',
  'previewAnimationType',
  'editorAccuracy',
  // Bezier
  'bezierStyle',
  'bezierCurve',
  'bezierX1',
  'bezierY1',
  'bezierX2',
  'bezierY2',
  // Spring
  'springCurve',
  'springMass',
  'springStiffness',
  'springDamping',
  // Bounce
  'bounceCurve',
  'bounceBounces',
  'bounceDamping',
  // Wiggle
  'wiggleCurve',
  'wiggleWiggles',
  'wiggleDamping',
  // Overshoot
  'overshootStyle',
  'overshootCurve',
  'overshootMass',
  'overshootDamping',
] as const satisfies ReadonlyArray<keyof EasingState>;
