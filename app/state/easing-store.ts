import { create } from 'zustand';
import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  PreviewPlayMode,
  SpringCurve,
  WiggleCurve,
} from '~/types-and-enums';
import { createBounceFunction, createSpringFunction, createWiggleFunction, generateLinearEasing } from '~/utils/easing';

export const bezierFunctions: Record<BezierStyle, Record<BezierCurve, [number, number, number, number]>> = {
  in: {
    default: [0.42, 0, 1, 1],
    sine: [0.47, 0, 0.745, 0.715],
    quad: [0.55, 0.085, 0.68, 0.53],
    cubic: [0.55, 0.055, 0.675, 0.19],
    quart: [0.895, 0.03, 0.685, 0.22],
    quint: [0.755, 0.05, 0.855, 0.06],
    expo: [0.95, 0.05, 0.795, 0.035],
    circ: [0.6, 0.04, 0.98, 0.335],
    back: [0.6, -0.28, 0.735, 0.045],
  },
  out: {
    default: [0, 0, 0.58, 1],
    sine: [0.39, 0.575, 0.565, 1],
    quad: [0.25, 0.46, 0.45, 0.94],
    cubic: [0.215, 0.61, 0.355, 1],
    quart: [0.165, 0.84, 0.44, 1],
    quint: [0.23, 1, 0.32, 1],
    expo: [0.19, 1, 0.22, 1],
    circ: [0.075, 0.82, 0.165, 1],
    back: [0.175, 0.885, 0.32, 1.275],
  },
  inOut: {
    default: [0.42, 0, 0.58, 1],
    sine: [0.445, 0.05, 0.55, 0.95],
    quad: [0.455, 0.03, 0.515, 0.955],
    cubic: [0.645, 0.045, 0.355, 1],
    quart: [0.77, 0, 0.175, 1],
    quint: [0.86, 0, 0.07, 1],
    expo: [1, 0, 0, 1],
    circ: [0.785, 0.135, 0.15, 0.86],
    back: [0.68, -0.55, 0.265, 1.55],
  },
};

export const defaultBezierFunction = bezierFunctions.in.default;

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

export const { easingValue: defaultSpringValue } = generateLinearEasing(
  createSpringFunction(defaultSpringFunction),
  LinearEasingAccuracy.HIGH,
);

export const { easingValue: defaultBounceValue } = generateLinearEasing(
  createBounceFunction(defaultBounceFunction),
  LinearEasingAccuracy.HIGH,
);

export const { easingValue: defaultWiggleValue } = generateLinearEasing(
  createWiggleFunction(defaultWiggleFunction),
  LinearEasingAccuracy.HIGH,
);

export type EasingState = {
  // General
  easingType: EasingType;
  animationDuration: number;
  // Bezier
  bezierStyle: BezierStyle;
  bezierCurve: BezierCurve;
  bezierValue: [number, number, number, number];
  // Spring
  springCurve: SpringCurve;
  springStiffness: number;
  springDamping: number;
  springInitialVelocity: number;
  springValue: string;
  // Bounce
  bounceCurve: BounceCurve;
  bounceBounces: number;
  bounceDamping: number;
  bounceValue: string;
  // Wiggle
  wiggleCurve: WiggleCurve;
  wiggleStiffness: number;
  wiggleDamping: number;
  wiggleInitialVelocity: number;
  wiggleValue: string;
  // Preview
  previewDuration: number;
  previewPlayMode: PreviewPlayMode;
  previewAnimationType: AnimationType;
  previewShowLinear: boolean;
};

type EasingAction = {
  setEasingType: (easingType: EasingType) => void;
  setState: (state: Partial<EasingState>) => void;
};

const defaultBezierState = {
  bezierStyle: BezierStyle.IN,
  bezierCurve: BezierCurve.DEFAULT,
  bezierValue: defaultBezierFunction,
};

const defaultSpringState = {
  springCurve: SpringCurve.DEFAULT,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springInitialVelocity: defaultSpringFunction.initialVelocity,
  springValue: defaultSpringValue,
};

const defaultBounceState = {
  bounceCurve: BounceCurve.DEFAULT,
  bounceBounces: defaultBounceFunction.bounces,
  bounceDamping: defaultBounceFunction.damping,
  bounceValue: defaultBounceValue,
};

const defaultWiggleState = {
  wiggleCurve: WiggleCurve.DEFAULT,
  wiggleStiffness: defaultWiggleFunction.stiffness,
  wiggleDamping: defaultWiggleFunction.damping,
  wiggleInitialVelocity: defaultWiggleFunction.initialVelocity,
  wiggleValue: defaultWiggleValue,
};

const defaultEasingContext: EasingState = {
  easingType: EasingType.BEZIER,
  animationDuration: 1500,
  previewDuration: 1500,
  previewPlayMode: PreviewPlayMode.INFINITE,
  previewAnimationType: AnimationType.MOVE,
  previewShowLinear: false,
  ...defaultBezierState,
  ...defaultSpringState,
  ...defaultBounceState,
  ...defaultWiggleState,
};

export const useEasingStore = create<EasingState & EasingAction>((set) => ({
  ...defaultEasingContext,
  setEasingType: (easingType: EasingType) => {
    switch (easingType) {
      case EasingType.BEZIER:
        set({ easingType, ...defaultBezierState });
        break;
      case EasingType.SPRING:
        set({ easingType, ...defaultSpringState });
        break;
      case EasingType.BOUNCE:
        set({ easingType, ...defaultBounceState });
        break;
      case EasingType.WIGGLE:
        set({ easingType, ...defaultWiggleState });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
}));
