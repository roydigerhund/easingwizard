import { create } from 'zustand';
import {
  defaultBezierFunction,
  defaultBounceFunction,
  defaultBounceValue,
  defaultSpringFunction,
  defaultSpringValue,
  defaultWiggleFunction,
  defaultWiggleValue,
} from '~/data/easing';
import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BezierValue,
  BounceCurve,
  EasingType,
  PreviewPlayMode,
  SpringCurve,
  WiggleCurve,
} from '~/types-and-enums';

export type EasingState = {
  // General
  easingType: EasingType;
  animationDuration: number;
  // Bezier
  bezierStyle: BezierStyle;
  bezierCurve: BezierCurve;
  bezierValue: BezierValue;
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
  bezierCurve: BezierCurve.SINE,
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
  animationDuration: 750,
  previewDuration: 750,
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
