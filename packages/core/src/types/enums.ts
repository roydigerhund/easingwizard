export const EasingType = {
  BEZIER: 'BEZIER',
  SPRING: 'SPRING',
  BOUNCE: 'BOUNCE',
  WIGGLE: 'WIGGLE',
  OVERSHOOT: 'OVERSHOOT',
} as const;
export type EasingTypeKey = keyof typeof EasingType;

export const EasingTypeLowerCase = {
  BEZIER: 'bezier',
  SPRING: 'spring',
  BOUNCE: 'bounce',
  WIGGLE: 'wiggle',
  OVERSHOOT: 'overshoot',
} as const;
export type EasingTypeLowerCaseKey = keyof typeof EasingTypeLowerCase;

export const BezierStyle = {
  IN: 'IN',
  OUT: 'OUT',
  IN_OUT: 'IN_OUT',
  OUT_IN: 'OUT_IN',
} as const;
export type BezierStyleKey = keyof typeof BezierStyle;

export const BezierCurve = {
  SINE: 'SINE',
  QUAD: 'QUAD',
  CUBIC: 'CUBIC',
  QUART: 'QUART',
  QUINT: 'QUINT',
  EXPO: 'EXPO',
  CIRC: 'CIRC',
  BACK: 'BACK',
  JUMP: 'JUMP',
  ANTICIPATE: 'ANTICIPATE',
} as const;
export type BezierCurveKey = keyof typeof BezierCurve;

export const OvershootStyle = {
  IN: 'IN',
  OUT: 'OUT',
  IN_OUT: 'IN_OUT',
} as const;
export type OvershootStyleKey = keyof typeof OvershootStyle;

export const SpringCurve = {
  HEAVY: 'HEAVY',
  BOUNCY: 'BOUNCY',
  DROP: 'DROP',
  GLIDE: 'GLIDE',
  SNAP: 'SNAP',
  LAZY: 'LAZY',
  ELASTIC: 'ELASTIC',
} as const;
export type SpringCurveKey = keyof typeof SpringCurve;

export const BounceCurve = {
  FIRM: 'FIRM',
  SOFT: 'SOFT',
  SHARP: 'SHARP',
  SUBTLE: 'SUBTLE',
  PLAYFUL: 'PLAYFUL',
  SPRINGY: 'SPRINGY',
} as const;
export type BounceCurveKey = keyof typeof BounceCurve;

export const WiggleCurve = {
  SUBTLE: 'SUBTLE',
  ENERGETIC: 'ENERGETIC',
  PLAYFUL: 'PLAYFUL',
  SHARP: 'SHARP',
  SMOOTH: 'SMOOTH',
  INTENSE: 'INTENSE',
  DYNAMIC: 'DYNAMIC',
} as const;
export type WiggleCurveKey = keyof typeof WiggleCurve;

export const OvershootCurve = {
  SOFT: 'SOFT',
  FIRM: 'FIRM',
  SMOOTH: 'SMOOTH',
  DYNAMIC: 'DYNAMIC',
  DRAMATIC: 'DRAMATIC',
} as const;
export type OvershootCurveKey = keyof typeof OvershootCurve;

export const AnimationType = {
  MOVE_X: 'MOVE_X',
  MOVE_Y: 'MOVE_Y',
  WIDTH: 'WIDTH',
  HEIGHT: 'HEIGHT',
  SCALE: 'SCALE',
  ROTATE: 'ROTATE',
  OPACITY: 'OPACITY',
  ROTATE_X: 'ROTATE_X',
  ROTATE_Y: 'ROTATE_Y',
  SHAPE: 'SHAPE',
} as const;
export type AnimationTypeKey = keyof typeof AnimationType;

export const PreviewPlayMode = {
  INFINITE: 'INFINITE',
  ONCE: 'ONCE',
} as const;
export type PreviewPlayModeKey = keyof typeof PreviewPlayMode;

export const LinearEasingAccuracy = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  ULTRA: 'ULTRA',
} as const;
export type LinearEasingAccuracyKey = keyof typeof LinearEasingAccuracy;