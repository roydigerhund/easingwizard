import {
  defaultBezierCurve,
  defaultBezierFunction,
  defaultBezierStyle,
  defaultBounceCurve,
  defaultBounceFunction,
  defaultBouncePoints,
  defaultBounceValue,
  defaultOvershootCurve,
  defaultOvershootFunction,
  defaultOvershootPoints,
  defaultOvershootStyle,
  defaultOvershootValue,
  defaultSpringCurve,
  defaultSpringFunction,
  defaultSpringPoints,
  defaultSpringValue,
  defaultWiggleCurve,
  defaultWiggleFunction,
  defaultWigglePoints,
  defaultWiggleValue,
} from '~/data/easing-defaults';
import { EasingType, AnimationType, LinearEasingAccuracy, PreviewPlayMode } from '~/types/enums';
import type { EasingStateBlock, EasingState } from '~/types/types';
import { createCubicBezierString } from '~/utils/easing';


const defaultBezierState: EasingStateBlock<'bezier'> = {
  bezierX1: defaultBezierFunction.x1,
  bezierY1: defaultBezierFunction.y1,
  bezierX2: defaultBezierFunction.x2,
  bezierY2: defaultBezierFunction.y2,
  bezierStyle: defaultBezierStyle,
  bezierCurve: defaultBezierCurve,
  bezierValue: createCubicBezierString(defaultBezierFunction),
  bezierIsCustom: false,
};

export const bezierStateKeys = Object.keys(defaultBezierState) as (keyof typeof defaultBezierState)[];

const defaultSpringState: EasingStateBlock<'spring'> = {
  springCurve: defaultSpringCurve,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springMass: defaultSpringFunction.mass,
  springValue: defaultSpringValue,
  springPoints: defaultSpringPoints,
  springIsCustom: false,
};

export const springStateKeys = Object.keys(defaultSpringState) as (keyof typeof defaultSpringState)[];

const defaultBounceState: EasingStateBlock<'bounce'> = {
  bounceCurve: defaultBounceCurve,
  bounceBounces: defaultBounceFunction.bounces,
  bounceDamping: defaultBounceFunction.damping,
  bounceValue: defaultBounceValue,
  bouncePoints: defaultBouncePoints,
  bounceIsCustom: false,
};

export const bounceStateKeys = Object.keys(defaultBounceState) as (keyof typeof defaultBounceState)[];

const defaultWiggleState: EasingStateBlock<'wiggle'> = {
  wiggleCurve: defaultWiggleCurve,
  wiggleDamping: defaultWiggleFunction.damping,
  wiggleWiggles: defaultWiggleFunction.wiggles,
  wiggleValue: defaultWiggleValue,
  wigglePoints: defaultWigglePoints,
  wiggleIsCustom: false,
};

export const wiggleStateKeys = Object.keys(defaultWiggleState) as (keyof typeof defaultWiggleState)[];

const defaultOvershootState: EasingStateBlock<'overshoot'> = {
  overshootStyle: defaultOvershootStyle,
  overshootCurve: defaultOvershootCurve,
  overshootDamping: defaultOvershootFunction.damping,
  overshootMass: defaultOvershootFunction.mass,
  overshootValue: defaultOvershootValue,
  overshootPoints: defaultOvershootPoints,
  overshootIsCustom: false,
};

export const overshootStateKeys = Object.keys(defaultOvershootState) as (keyof typeof defaultOvershootState)[];

const defaultRestState = {
  easingType: EasingType.BEZIER,
  previewDuration: 750,
  previewAnimationType: AnimationType.MOVE_X,
  editorAccuracy: LinearEasingAccuracy.HIGH,
};

export const restStateKeys = Object.keys(defaultRestState) as (keyof typeof defaultRestState)[];

export const defaultOtherState = {
  editorExtraSpaceTop: false,
  editorExtraSpaceBottom: false,
  previewPlayMode: PreviewPlayMode.INFINITE,
  previewShowLinear: false,
  foundEasterEgg: false,
};

export const defaultEasingState: EasingState = {
  ...defaultOtherState,
  ...defaultRestState,
  ...defaultBezierState,
  ...defaultOvershootState,
  ...defaultSpringState,
  ...defaultBounceState,
  ...defaultWiggleState,
};
