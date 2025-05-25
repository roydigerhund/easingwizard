import { create } from 'zustand';
import {
  defaultBezierCurve,
  defaultBezierFunction,
  defaultBezierStyle,
  defaultBounceCurve,
  defaultBounceFunction,
  defaultBounceValue,
  defaultOvershootCurve,
  defaultOvershootFunction,
  defaultOvershootStyle,
  defaultOvershootValue,
  defaultSpringCurve,
  defaultSpringFunction,
  defaultSpringValue,
  defaultWiggleCurve,
  defaultWiggleFunction,
  defaultWiggleValue,
} from '~/data/easing';
import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  OvershootCurve,
  PreviewPlayMode,
  SpringCurve,
  WiggleCurve,
} from '~/types-and-enums';
import { createCubicBezierString } from '~/utils/easing';
import { BezierInput, BounceInput, OvershootInput, SpringInput, WiggleInput } from '~/validations/easing';

export type EasingState = {
  // General
  easingType: EasingType;
  // Bezier
  bezierStyle: BezierStyle;
  bezierCurve: BezierCurve;
  bezierX1: BezierInput['x1'];
  bezierY1: BezierInput['y1'];
  bezierX2: BezierInput['x2'];
  bezierY2: BezierInput['y2'];
  bezierValue: string;
  bezierIsCustom: boolean;
  // Spring
  springCurve: SpringCurve;
  springMass: SpringInput['mass'];
  springStiffness: SpringInput['stiffness'];
  springDamping: SpringInput['damping'];
  springValue: string;
  springIsCustom: boolean;
  // Bounce
  bounceCurve: BounceCurve;
  bounceBounces: BounceInput['bounces'];
  bounceDamping: BounceInput['damping'];
  bounceValue: string;
  bounceIsCustom: boolean;
  // Wiggle
  wiggleCurve: WiggleCurve;
  wiggleWiggles: WiggleInput['wiggles'];
  wiggleDamping: WiggleInput['damping'];
  wiggleValue: string;
  wiggleIsCustom: boolean;
  // Overeshoot
  overshootStyle: OvershootInput['style'];
  overshootCurve: OvershootCurve;
  overshootMass: OvershootInput['mass'];
  overshootDamping: OvershootInput['damping'];
  overshootValue: string;
  overshootIsCustom: boolean;
  // Preview
  previewDuration: number;
  previewPlayMode: PreviewPlayMode;
  previewAnimationType: AnimationType;
  previewShowLinear: boolean;
  // Editor
  editorExtraSpaceTop: boolean;
  editorExtraSpaceBottom: boolean;
  editorAccuracy: LinearEasingAccuracy;
  // Easter Egg
  foundEasterEgg: boolean;
};

type EasingStateBlock<Prefix extends string> = {
  [Key in keyof EasingState as Key extends `${Prefix}${string}` ? Key : never]: EasingState[Key];
};

type EasingAction = {
  setEasingType: (easingType: EasingType) => void;
  setState: (state: Partial<EasingState>) => void;
  getCurrentState: () => EasingState;
};

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

export const bezierStateKeys = Object.keys(defaultBezierState) as (keyof EasingState)[];

const defaultSpringState: EasingStateBlock<'spring'> = {
  springCurve: defaultSpringCurve,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springMass: defaultSpringFunction.mass,
  springValue: defaultSpringValue,
  springIsCustom: false,
};

export const springStateKeys = Object.keys(defaultSpringState) as (keyof EasingState)[];

const defaultBounceState: EasingStateBlock<'bounce'> = {
  bounceCurve: defaultBounceCurve,
  bounceBounces: defaultBounceFunction.bounces,
  bounceDamping: defaultBounceFunction.damping,
  bounceValue: defaultBounceValue,
  bounceIsCustom: false,
};

export const bounceStateKeys = Object.keys(defaultBounceState) as (keyof EasingState)[];

const defaultWiggleState: EasingStateBlock<'wiggle'> = {
  wiggleCurve: defaultWiggleCurve,
  wiggleDamping: defaultWiggleFunction.damping,
  wiggleWiggles: defaultWiggleFunction.wiggles,
  wiggleValue: defaultWiggleValue,
  wiggleIsCustom: false,
};

export const wiggleStateKeys = Object.keys(defaultWiggleState) as (keyof EasingState)[];

const defaultOvershootState: EasingStateBlock<'overshoot'> = {
  overshootStyle: defaultOvershootStyle,
  overshootCurve: defaultOvershootCurve,
  overshootDamping: defaultOvershootFunction.damping,
  overshootMass: defaultOvershootFunction.mass,
  overshootValue: defaultOvershootValue,
  overshootIsCustom: false,
};

export const overshootStateKeys = Object.keys(defaultOvershootState) as (keyof EasingState)[];

const defaultRestState = {
  easingType: EasingType.BEZIER,
  previewDuration: 750,
  previewAnimationType: AnimationType.MOVE_X,
  editorExtraSpaceTop: false,
  editorExtraSpaceBottom: false,
  editorAccuracy: LinearEasingAccuracy.HIGH,
};

export const restStateKeys = Object.keys(defaultRestState) as (keyof EasingState)[];

export const defaultEasingContext: EasingState = {
  previewPlayMode: PreviewPlayMode.INFINITE,
  previewShowLinear: false,
  foundEasterEgg: false,
  ...defaultRestState,
  ...defaultBezierState,
  ...defaultOvershootState,
  ...defaultSpringState,
  ...defaultBounceState,
  ...defaultWiggleState,
};

export const useEasingStore = create<EasingState & EasingAction>((set, get) => ({
  ...defaultEasingContext,
  setEasingType: (easingType: EasingType) => {
    switch (easingType) {
      case EasingType.BEZIER:
        set(({ bezierY1, bezierY2 }) => ({
          easingType,
          editorExtraSpaceTop: Math.max(bezierY1, bezierY2) > 1,
          editorExtraSpaceBottom: Math.min(bezierY1, bezierY2) < 0,
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
  getCurrentState: () => get(),
}));
