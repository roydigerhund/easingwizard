import {
  bounceCalculations,
  overshootCalculations,
  springCalculations,
  wiggleCalculations,
} from '~/generated/linear-easings';
import {
  BezierCurve,
  BezierStyle,
  BounceCurve,
  OvershootCurve,
  OvershootStyle,
  SpringCurve,
  WiggleCurve,
} from '~/types/enums';
import type { BezierInput } from '~/validations/input';
import {
  bezierFunctions,
  bounceFunctions,
  overshootFunctions,
  springFunctions,
  wiggleFunctions,
} from './easing-functions';

export const defaultBezierStyle = BezierStyle.IN_OUT;
export const defaultBezierCurve = BezierCurve.CUBIC;
export const defaultBezierFunction = bezierFunctions[defaultBezierStyle][defaultBezierCurve] as BezierInput;

export const defaultSpringCurve = SpringCurve.HEAVY;
export const defaultSpringFunction = springFunctions[defaultSpringCurve];
export const defaultSpringValue = springCalculations[defaultSpringCurve].easingValue;
export const defaultSpringPoints = springCalculations[defaultSpringCurve].sampledPoints;

export const defaultBounceCurve = BounceCurve.FIRM;
export const defaultBounceFunction = bounceFunctions[defaultBounceCurve];
export const defaultBounceValue = bounceCalculations[defaultBounceCurve].easingValue;
export const defaultBouncePoints = bounceCalculations[defaultBounceCurve].sampledPoints;

export const defaultWiggleCurve = WiggleCurve.SUBTLE;
export const defaultWiggleFunction = wiggleFunctions[defaultWiggleCurve];
export const defaultWiggleValue = wiggleCalculations[defaultWiggleCurve].easingValue;
export const defaultWigglePoints = wiggleCalculations[defaultWiggleCurve].sampledPoints;

export const defaultOvershootStyle = OvershootStyle.OUT;
export const defaultOvershootCurve = OvershootCurve.SOFT;
export const defaultOvershootFunction = overshootFunctions[defaultOvershootStyle][defaultOvershootCurve];
export const defaultOvershootValue = overshootCalculations[defaultOvershootStyle][defaultOvershootCurve].easingValue;
export const defaultOvershootPoints = overshootCalculations[defaultOvershootStyle][defaultOvershootCurve].sampledPoints;
