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
import { createCubicBezierString } from '~/utils/easing';

export type EasingState = {
  // General
  easingType: EasingType;
  animationDuration: number;
  // Bezier
  bezierStyle: BezierStyle;
  bezierCurve: BezierCurve;
  bezierRawValue: BezierValue;
  bezierValue: string;
  bezierIsCustom: boolean;
  // Overeshoot
  overshootStyle: OvershootStyle;
  overshootCurve: OvershootCurve;
  overshootDamping: number;
  overshootMass: number;
  overshootValue: string;
  overshootIsCustom: boolean;
  // Spring
  springCurve: SpringCurve;
  springStiffness: number;
  springDamping: number;
  springMass: number;
  springValue: string;
  springIsCustom: boolean;
  // Bounce
  bounceCurve: BounceCurve;
  bounceBounces: number;
  bounceDamping: number;
  bounceValue: string;
  bounceIsCustom: boolean;
  // Wiggle
  wiggleCurve: WiggleCurve;
  wiggleDamping: number;
  wiggleWiggles: number;
  wiggleValue: string;
  wiggleIsCustom: boolean;
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
  bezierRawValue: defaultBezierFunction,
  bezierValue: createCubicBezierString(defaultBezierFunction),
  bezierIsCustom: false,
};

const defaultOvershootState = {
  overshootStyle: OvershootStyle.OUT,
  overshootCurve: OvershootCurve.DEFAULT,
  overshootDamping: defaultOvershootFunction.damping,
  overshootMass: defaultOvershootFunction.mass,
  overshootValue: defaultOvershootValue,
  overshootIsCustom: false,
};

const defaultSpringState = {
  springCurve: SpringCurve.DEFAULT,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springMass: defaultSpringFunction.mass,
  springValue: defaultSpringValue,
  springIsCustom: false,
};

const defaultBounceState = {
  bounceCurve: BounceCurve.DEFAULT,
  bounceBounces: defaultBounceFunction.bounces,
  bounceDamping: defaultBounceFunction.damping,
  bounceValue: defaultBounceValue,
  bounceIsCustom: false,
};

const defaultWiggleState = {
  wiggleCurve: WiggleCurve.DEFAULT,
  wiggleDamping: defaultWiggleFunction.damping,
  wiggleWiggles: defaultWiggleFunction.wiggles,
  wiggleValue: defaultWiggleValue,
  wiggleIsCustom: false,
};

const defaultEasingContext: EasingState = {
  easingType: EasingType.BEZIER,
  animationDuration: 750,
  previewDuration: 750,
  previewPlayMode: PreviewPlayMode.INFINITE,
  previewAnimationType: AnimationType.MOVE_X,
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
        set(({ bezierRawValue }) => ({
          easingType,
          editorExtraSpaceTop: Math.max(bezierRawValue[1], bezierRawValue[3]) > 1,
          editorExtraSpaceBottom: Math.min(bezierRawValue[1], bezierRawValue[3]) < 0,
        }));
        break;
      case EasingType.OVERSHOOT:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.SPRING:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.BOUNCE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.WIGGLE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
}));
