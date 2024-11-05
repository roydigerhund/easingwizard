import { create } from 'zustand';
import {
  defaultBezierFunction,
  defaultBounceFunction,
  defaultBounceValue,
  defaultOvershootFunction,
  defaultOvershootValue,
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
  OvershootCurve,
  OvershootStyle,
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
  // Overeshoot
  overshootStyle: OvershootStyle;
  overshootCurve: OvershootCurve;
  overshootDamping: number;
  overshootMass: number;
  overshootValue: string;
  // Spring
  springCurve: SpringCurve;
  springStiffness: number;
  springDamping: number;
  springMass: number;
  springValue: string;
  // Bounce
  bounceCurve: BounceCurve;
  bounceBounces: number;
  bounceDamping: number;
  bounceValue: string;
  // Wiggle
  wiggleCurve: WiggleCurve;
  wiggleDamping: number;
  wiggleWiggles: number;
  wiggleValue: string;
  // Preview
  previewDuration: number;
  previewPlayMode: PreviewPlayMode;
  previewAnimationType: AnimationType;
  previewShowLinear: boolean;
  // Editor
  editorExtraSpaceTop: boolean;
  editorExtraSpaceBottom: boolean;
};

type EasingAction = {
  setEasingType: (easingType: EasingType) => void;
  setState: (state: Partial<EasingState>) => void;
};

const defaultBezierState = {
  bezierStyle: BezierStyle.IN_OUT,
  bezierCurve: BezierCurve.CUBIC,
  bezierValue: defaultBezierFunction,
};

const defaultOvershootState = {
  overshootStyle: OvershootStyle.OUT,
  overshootCurve: OvershootCurve.DEFAULT,
  overshootDamping: defaultOvershootFunction.damping,
  overshootMass: defaultOvershootFunction.mass,
  overshootValue: defaultOvershootValue,
};

const defaultSpringState = {
  springCurve: SpringCurve.DEFAULT,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springMass: defaultSpringFunction.mass,
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
  wiggleDamping: defaultWiggleFunction.damping,
  wiggleWiggles: defaultWiggleFunction.wiggles,
  wiggleValue: defaultWiggleValue,
};

const defaultEasingContext: EasingState = {
  easingType: EasingType.BEZIER,
  animationDuration: 750,
  previewDuration: 750,
  previewPlayMode: PreviewPlayMode.INFINITE,
  previewAnimationType: AnimationType.MOVE,
  previewShowLinear: false,
  editorExtraSpaceTop: false,
  editorExtraSpaceBottom: false,
  ...defaultBezierState,
  ...defaultOvershootState,
  ...defaultSpringState,
  ...defaultBounceState,
  ...defaultWiggleState,
};

export const useEasingStore = create<EasingState & EasingAction>((set) => ({
  ...defaultEasingContext,
  setEasingType: (easingType: EasingType) => {
    switch (easingType) {
      case EasingType.BEZIER:
        set({ easingType, ...defaultBezierState, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.OVERSHOOT:
        set({ easingType, ...defaultBezierState, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.SPRING:
        set({ easingType, ...defaultSpringState, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.BOUNCE:
        set({ easingType, ...defaultBounceState, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.WIGGLE:
        set({ easingType, ...defaultWiggleState, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
}));
