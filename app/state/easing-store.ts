import { create } from 'zustand';
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
} from '~/data/easing';
import {
  AnimationType,
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  OvershootCurve,
  Point,
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
  springPoints: Point[];
  springIsCustom: boolean;
  // Bounce
  bounceCurve: BounceCurve;
  bounceBounces: BounceInput['bounces'];
  bounceDamping: BounceInput['damping'];
  bounceValue: string;
  bouncePoints: Point[];
  bounceIsCustom: boolean;
  // Wiggle
  wiggleCurve: WiggleCurve;
  wiggleWiggles: WiggleInput['wiggles'];
  wiggleDamping: WiggleInput['damping'];
  wiggleValue: string;
  wigglePoints: Point[];
  wiggleIsCustom: boolean;
  // Overeshoot
  overshootStyle: OvershootInput['style'];
  overshootCurve: OvershootCurve;
  overshootMass: OvershootInput['mass'];
  overshootDamping: OvershootInput['damping'];
  overshootValue: string;
  overshootPoints: Point[];
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

export const defaultEasingContext: EasingState = {
  ...defaultOtherState,
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
  getCurrentState: () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setEasingType, setState, getCurrentState, ...rest } = get();
    return rest as EasingState;
  },
}));
