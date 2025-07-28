import type { BezierParams, BounceParams, OvershootParams, SpringParams, WiggleParams } from '~/validations/input';
import type {
  AnimationTypeKey,
  BezierCurveKey,
  BezierStyleKey,
  BounceCurveKey,
  EasingTypeKey,
  LinearEasingAccuracyKey,
  OvershootCurveKey,
  PreviewPlayModeKey,
  SpringCurveKey,
  WiggleCurveKey,
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
  easingType: EasingTypeKey;
  // Bezier
  bezierStyle: BezierStyleKey;
  bezierCurve: BezierCurveKey;
  bezierX1: BezierParams['x1'];
  bezierY1: BezierParams['y1'];
  bezierX2: BezierParams['x2'];
  bezierY2: BezierParams['y2'];
  bezierValue: string;
  bezierIsCustom: boolean;
  // Spring
  springCurve: SpringCurveKey;
  springMass: SpringParams['mass'];
  springStiffness: SpringParams['stiffness'];
  springDamping: SpringParams['damping'];
  springValue: string;
  springPoints: Point[];
  springIsCustom: boolean;
  // Bounce
  bounceCurve: BounceCurveKey;
  bounceBounces: BounceParams['bounces'];
  bounceDamping: BounceParams['damping'];
  bounceValue: string;
  bouncePoints: Point[];
  bounceIsCustom: boolean;
  // Wiggle
  wiggleCurve: WiggleCurveKey;
  wiggleWiggles: WiggleParams['wiggles'];
  wiggleDamping: WiggleParams['damping'];
  wiggleValue: string;
  wigglePoints: Point[];
  wiggleIsCustom: boolean;
  // Overeshoot
  overshootStyle: OvershootParams['style'];
  overshootCurve: OvershootCurveKey;
  overshootMass: OvershootParams['mass'];
  overshootDamping: OvershootParams['damping'];
  overshootValue: string;
  overshootPoints: Point[];
  overshootIsCustom: boolean;
  // Preview
  previewDuration: number;
  previewPlayMode: PreviewPlayModeKey;
  previewAnimationType: AnimationTypeKey;
  previewShowLinear: boolean;
  // Editor
  editorExtraSpaceTop: boolean;
  editorExtraSpaceBottom: boolean;
  editorAccuracy: LinearEasingAccuracyKey;
  // Easter Egg
  foundEasterEgg: boolean;
};
