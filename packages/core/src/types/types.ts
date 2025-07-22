import type { BezierInput, BounceInput, OvershootInput, SpringInput, WiggleInput } from '~/validations';
import type {
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
} from './enums';

export type Point = {
  x: number;
  y: number;
};

export type EasingStateValue = string | number | boolean | Point[];

export type EasingStateShareKey = keyof EasingState &
  // Rest state keys
  (| 'easingType'
    | 'previewDuration'
    | 'previewAnimationType'
    | 'editorAccuracy'
    // Bezier
    | 'bezierStyle'
    | 'bezierCurve'
    | 'bezierX1'
    | 'bezierY1'
    | 'bezierX2'
    | 'bezierY2'
    // Spring
    | 'springCurve'
    | 'springMass'
    | 'springStiffness'
    | 'springDamping'
    // Bounce
    | 'bounceCurve'
    | 'bounceBounces'
    | 'bounceDamping'
    // Wiggle
    | 'wiggleCurve'
    | 'wiggleWiggles'
    | 'wiggleDamping'
    // Overshoot
    | 'overshootStyle'
    | 'overshootCurve'
    | 'overshootMass'
    | 'overshootDamping'
  );

export type EasingStateShare = Partial<Record<EasingStateShareKey, EasingStateValue>>;

export type EasingStateBlock<Prefix extends string> = {
  [Key in keyof EasingState as Key extends `${Prefix}${string}` ? Key : never]: EasingState[Key];
};

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
