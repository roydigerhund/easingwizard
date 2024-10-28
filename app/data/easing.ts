import { bounceCalculations, springCalculations, wiggleCalculations } from '~/generated/linear-easings';
import { BezierCurve, BezierStyle, BezierValue, BounceCurve, SpringCurve, WiggleCurve } from '~/types-and-enums';

export const bezierStyleFunctions: Record<BezierStyle, BezierValue> = {
  in: [0.75, 0, 1, 1],
  out: [0, 0, 0.25, 1],
  inOut: [0.6, 0, 0.4, 1],
};

export const bezierFunctions: Record<BezierStyle, Record<BezierCurve, BezierValue>> = {
  in: {
    sine: [0.13, 0, 0.39, 0],
    quad: [0.11, 0, 0.5, 0],
    cubic:[0.32, 0, 0.67, 0],
    quart:[0.5, 0, 0.75, 0],
    quint:[0.64, 0, 0.78, 0],
    expo: [0.7, 0, 0.84, 0],
    circ: [0.55, 0, 1, 0.45],
    back: [0.36, 0, 0.66, -0.56],
  },
  out: {
    sine: [0.61, 1, 0.87, 1],
    quad: [0.5, 1, 0.89, 1],
    cubic: [0.33, 1, 0.68, 1],
    quart: [0.25, 1, 0.5, 1],
    quint: [0.22, 1, 0.36, 1],
    expo: [0.16, 1, 0.3, 1],
    circ: [0, 0.55, 0.45, 1],
    back: [0.34, 1.56, 0.64, 1],
  },
  inOut: {
    sine: [0.37, 0, 0.63, 1],
    quad: [0.44, 0, 0.56, 1],
    cubic: [0.65, -0.02, 0.35, 1.02],
    quart: [0.76, -0.04, 0.24, 1.04],
    quint: [0.84, -0.04, 0.16, 1.04],
    expo: [0.88, -0.04, 0.12, 1.04],
    circ: [0.85, 0.09, 0.15, 0.91],
    back: [0.68, -0.6, 0.32, 1.6],
  },
};

export const defaultBezierFunction = bezierFunctions.in.sine;

export const springFunctions: Record<SpringCurve, { stiffness: number; damping: number; initialVelocity: number }> = {
  default: { stiffness: 100, damping: 10, initialVelocity: 0 },
  wobbly: { stiffness: 170, damping: 26, initialVelocity: 0 },
  gentle: { stiffness: 120, damping: 14, initialVelocity: 0 },
  stiff: { stiffness: 210, damping: 20, initialVelocity: 0 },
};

export const defaultSpringFunction = springFunctions.default;

export const bounceFunctions: Record<BounceCurve, { bounces: number; damping: number }> = {
  default: { bounces: 4, damping: 0.5 },
  floppy: { bounces: 3, damping: 0.2 },
  relaxed: { bounces: 5, damping: 0.8 },
};

export const defaultBounceFunction = bounceFunctions.default;

export const wiggleFunctions: Record<WiggleCurve, { stiffness: number; damping: number; initialVelocity: number }> = {
  default: { stiffness: 100, damping: 10, initialVelocity: 0 },
  loose: { stiffness: 170, damping: 26, initialVelocity: 0 },
  tight: { stiffness: 120, damping: 14, initialVelocity: 0 },
};

export const defaultWiggleFunction = wiggleFunctions.default;

export const defaultSpringValue = springCalculations.default.easingValue;

export const defaultBounceValue = bounceCalculations.default.easingValue;

export const defaultWiggleValue = wiggleCalculations.default.easingValue;
