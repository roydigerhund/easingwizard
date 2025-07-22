import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  OvershootCurve,
  OvershootStyle,
  PreviewPlayMode,
  SpringCurve,
  WiggleCurve,
} from '~/types/enums';
import type { EasingState, EasingStateShareKey } from '~/types/types';

export const MINI_MAP: Record<EasingStateShareKey, string> = {
  // General
  easingType: 'a',
  // Bezier
  bezierStyle: 'b',
  bezierCurve: 'c',
  bezierX1: 'd',
  bezierY1: 'e',
  bezierX2: 'f',
  bezierY2: 'g',
  // Spring
  springCurve: 'h',
  springMass: 'i',
  springStiffness: 'j',
  springDamping: 'k',
  // Bounce
  bounceCurve: 'l',
  bounceBounces: 'm',
  bounceDamping: 'n',
  // Wiggle
  wiggleCurve: 'o',
  wiggleWiggles: 'p',
  wiggleDamping: 'q',
  // Overshoot
  overshootStyle: 'r',
  overshootCurve: 's',
  overshootMass: 't',
  overshootDamping: 'u',
  // Preview
  previewDuration: 'v',
  previewAnimationType: 'x',
  // Editor
  editorAccuracy: 'y',
};

export const REVERSE_MINI_MAP: Record<string, EasingStateShareKey> = Object.fromEntries(
  Object.entries(MINI_MAP).map(([key, value]) => [value, key as EasingStateShareKey]),
);

export const EASING_TYPE_IDX: Record<EasingType, number> = {
  [EasingType.BEZIER]: 0,
  [EasingType.SPRING]: 1,
  [EasingType.BOUNCE]: 2,
  [EasingType.WIGGLE]: 3,
  [EasingType.OVERSHOOT]: 4,
};

export const BEZIER_STYLE_IDX: Record<BezierStyle, number> = {
  [BezierStyle.IN]: 0,
  [BezierStyle.OUT]: 1,
  [BezierStyle.IN_OUT]: 2,
  [BezierStyle.OUT_IN]: 3,
};

export const BEZIER_CURVE_IDX: Record<BezierCurve, number> = {
  [BezierCurve.SINE]: 0,
  [BezierCurve.QUAD]: 1,
  [BezierCurve.CUBIC]: 2,
  [BezierCurve.QUART]: 3,
  [BezierCurve.QUINT]: 4,
  [BezierCurve.EXPO]: 5,
  [BezierCurve.CIRC]: 6,
  [BezierCurve.BACK]: 7,
  [BezierCurve.JUMP]: 8,
  [BezierCurve.ANTICIPATE]: 9,
};

export const SPRING_CURVE_IDX: Record<SpringCurve, number> = {
  [SpringCurve.HEAVY]: 0,
  [SpringCurve.BOUNCY]: 1,
  [SpringCurve.DROP]: 2,
  [SpringCurve.GLIDE]: 3,
  [SpringCurve.SNAP]: 4,
  [SpringCurve.LAZY]: 5,
  [SpringCurve.ELASTIC]: 6,
};

export const BOUNCE_CURVE_IDX: Record<BounceCurve, number> = {
  [BounceCurve.FIRM]: 0,
  [BounceCurve.SOFT]: 1,
  [BounceCurve.SHARP]: 2,
  [BounceCurve.SUBTLE]: 3,
  [BounceCurve.PLAYFUL]: 4,
  [BounceCurve.SPRINGY]: 5,
};

export const WIGGLE_CURVE_IDX: Record<WiggleCurve, number> = {
  [WiggleCurve.SUBTLE]: 0,
  [WiggleCurve.ENERGETIC]: 1,
  [WiggleCurve.PLAYFUL]: 2,
  [WiggleCurve.SHARP]: 3,
  [WiggleCurve.SMOOTH]: 4,
  [WiggleCurve.INTENSE]: 5,
  [WiggleCurve.DYNAMIC]: 6,
};

export const OVERSHOOT_STYLE_IDX: Record<OvershootStyle, number> = {
  [OvershootStyle.IN]: 0,
  [OvershootStyle.OUT]: 1,
  [OvershootStyle.IN_OUT]: 2,
};

export const OVERSHOOT_CURVE_IDX: Record<OvershootCurve, number> = {
  [OvershootCurve.SOFT]: 0,
  [OvershootCurve.FIRM]: 1,
  [OvershootCurve.SMOOTH]: 2,
  [OvershootCurve.DYNAMIC]: 3,
  [OvershootCurve.DRAMATIC]: 4,
};

export const ANIMATION_TYPE_IDX: Record<AnimationType, number> = {
  [AnimationType.MOVE_X]: 0,
  [AnimationType.MOVE_Y]: 1,
  [AnimationType.WIDTH]: 2,
  [AnimationType.HEIGHT]: 3,
  [AnimationType.SCALE]: 4,
  [AnimationType.ROTATE]: 5,
  [AnimationType.OPACITY]: 6,
  [AnimationType.ROTATE_X]: 7,
  [AnimationType.ROTATE_Y]: 8,
  [AnimationType.SHAPE]: 9,
};

export const PREVIEW_PLAY_MODE_IDX: Record<PreviewPlayMode, number> = {
  [PreviewPlayMode.INFINITE]: 0,
  [PreviewPlayMode.ONCE]: 1,
};

export const LINEAR_EASING_ACCURACY_IDX: Record<LinearEasingAccuracy, number> = {
  [LinearEasingAccuracy.LOW]: 0,
  [LinearEasingAccuracy.MEDIUM]: 1,
  [LinearEasingAccuracy.HIGH]: 2,
  [LinearEasingAccuracy.ULTRA]: 3,
};

function reverse<T extends Record<string, number>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k])) as {
    [K in T[keyof T]]: keyof T;
  };
}

export const REVERSE_EASING_TYPE_IDX = reverse(EASING_TYPE_IDX);
export const REVERSE_BEZIER_STYLE_IDX = reverse(BEZIER_STYLE_IDX);
export const REVERSE_BEZIER_CURVE_IDX = reverse(BEZIER_CURVE_IDX);
export const REVERSE_OVERSHOOT_STYLE_IDX = reverse(OVERSHOOT_STYLE_IDX);
export const REVERSE_SPRING_CURVE_IDX = reverse(SPRING_CURVE_IDX);
export const REVERSE_BOUNCE_CURVE_IDX = reverse(BOUNCE_CURVE_IDX);
export const REVERSE_WIGGLE_CURVE_IDX = reverse(WIGGLE_CURVE_IDX);
export const REVERSE_OVERSHOOT_CURVE_IDX = reverse(OVERSHOOT_CURVE_IDX);
export const REVERSE_ANIMATION_TYPE_IDX = reverse(ANIMATION_TYPE_IDX);
export const REVERSE_PREVIEW_PLAY_MODE_IDX = reverse(PREVIEW_PLAY_MODE_IDX);
export const REVERSE_LINEAR_EASING_ACCURACY_IDX = reverse(LINEAR_EASING_ACCURACY_IDX);

export const easingStateEnumMaps: Partial<
  Record<keyof EasingState, { toIdx: Record<string, number>; toEnum: Record<number, string> }>
> = {
  easingType: { toIdx: EASING_TYPE_IDX, toEnum: REVERSE_EASING_TYPE_IDX },
  bezierStyle: { toIdx: BEZIER_STYLE_IDX, toEnum: REVERSE_BEZIER_STYLE_IDX },
  bezierCurve: { toIdx: BEZIER_CURVE_IDX, toEnum: REVERSE_BEZIER_CURVE_IDX },
  springCurve: { toIdx: SPRING_CURVE_IDX, toEnum: REVERSE_SPRING_CURVE_IDX },
  bounceCurve: { toIdx: BOUNCE_CURVE_IDX, toEnum: REVERSE_BOUNCE_CURVE_IDX },
  wiggleCurve: { toIdx: WIGGLE_CURVE_IDX, toEnum: REVERSE_WIGGLE_CURVE_IDX },
  overshootStyle: { toIdx: OVERSHOOT_STYLE_IDX, toEnum: REVERSE_OVERSHOOT_STYLE_IDX },
  overshootCurve: { toIdx: OVERSHOOT_CURVE_IDX, toEnum: REVERSE_OVERSHOOT_CURVE_IDX },
  previewAnimationType: { toIdx: ANIMATION_TYPE_IDX, toEnum: REVERSE_ANIMATION_TYPE_IDX },
  previewPlayMode: { toIdx: PREVIEW_PLAY_MODE_IDX, toEnum: REVERSE_PREVIEW_PLAY_MODE_IDX },
  editorAccuracy: { toIdx: LINEAR_EASING_ACCURACY_IDX, toEnum: REVERSE_LINEAR_EASING_ACCURACY_IDX },
};
