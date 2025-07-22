import {
  bezierFunctions,
  bounceFunctions,
  overshootFunctions,
  springFunctions,
  wiggleFunctions,
} from '~/data/easing-functions';
import { restStateKeys } from '~/state';
import { EasingType } from '~/types/enums';
import type { EasingState, EasingStateShare, EasingStateShareKey } from '~/types/types';
import type { BezierInput } from '~/validations';
import { createCubicBezierString, generateLinearEasing } from '../easing';
import { isAnyDefined } from '../values';
import { DEFAULTS_V0 } from './v0';

export function reduceStateForShare(state: EasingState): EasingStateShare {
  const reducedState: EasingStateShare = {};
  // Add restStateKeys
  for (const key of restStateKeys) {
    reducedState[key] = state[key];
  }

  // Choose required keys by EasingType
  switch (state.easingType) {
    case EasingType.BEZIER: {
      // editorAccuracy is not used in BEZIER
      delete reducedState.editorAccuracy;
      const requiredBezierStateKeys: EasingStateShareKey[] = state.bezierIsCustom
        ? ['bezierX1', 'bezierX2', 'bezierY1', 'bezierY2']
        : ['bezierStyle', 'bezierCurve'];
      for (const key of requiredBezierStateKeys) {
        reducedState[key] = state[key];
      }
      break;
    }
    case EasingType.SPRING: {
      const requiredSpringStateKeys: EasingStateShareKey[] = state.springIsCustom
        ? ['springMass', 'springStiffness', 'springDamping']
        : ['springCurve'];
      for (const key of requiredSpringStateKeys) {
        reducedState[key] = state[key];
      }
      break;
    }
    case EasingType.BOUNCE: {
      const requiredBounceStateKeys: EasingStateShareKey[] = state.bounceIsCustom
        ? ['bounceBounces', 'bounceDamping']
        : ['bounceCurve'];
      for (const key of requiredBounceStateKeys) {
        reducedState[key] = state[key];
      }
      break;
    }
    case EasingType.WIGGLE: {
      const requiredWiggleStateKeys: EasingStateShareKey[] = state.wiggleIsCustom
        ? ['wiggleWiggles', 'wiggleDamping']
        : ['wiggleCurve'];
      for (const key of requiredWiggleStateKeys) {
        reducedState[key] = state[key];
      }
      break;
    }
    case EasingType.OVERSHOOT: {
      const requiredOvershootStateKeys: EasingStateShareKey[] = state.overshootIsCustom
        ? ['overshootMass', 'overshootDamping', 'overshootStyle']
        : ['overshootStyle', 'overshootCurve'];
      for (const key of requiredOvershootStateKeys) {
        reducedState[key] = state[key];
      }
      break;
    }
  }
  // Remove keys that are equal to DEFAULTS_V=
  for (const key of Object.keys(state) as EasingStateShareKey[]) {
    if (state[key] === DEFAULTS_V0[key]) delete reducedState[key];
  }
  return reducedState;
}

export function rehydrateShareState(state: EasingStateShare, version: number = 0): EasingState {
  // If other versions are added, this function can be extended with more base defaults.
  const getDefaults = (version: number): EasingState => {
    switch (version) {
      case 0:
        return DEFAULTS_V0;
      default:
        throw new Error(`Unsupported version: ${version}`);
    }
  };
  const base = getDefaults(version);
  const fullState = { ...base, ...state } as EasingState;

  const easingType = (state.easingType || base.easingType) as EasingType;

  switch (easingType) {
    case EasingType.BEZIER: {
      fullState.bezierIsCustom = isAnyDefined(state.bezierX1, state.bezierX2, state.bezierY1, state.bezierY2);
      if (!fullState.bezierIsCustom) {
        const bezierFunction = bezierFunctions[fullState.bezierStyle][fullState.bezierCurve] as BezierInput;
        fullState.bezierX1 = bezierFunction.x1;
        fullState.bezierY1 = bezierFunction.y1;
        fullState.bezierX2 = bezierFunction.x2;
        fullState.bezierY2 = bezierFunction.y2;
      }
      fullState.bezierValue = createCubicBezierString({
        x1: fullState.bezierX1,
        y1: fullState.bezierY1,
        x2: fullState.bezierX2,
        y2: fullState.bezierY2,
      });
      fullState.editorExtraSpaceTop = Math.max(fullState.bezierY1, fullState.bezierY2) > 1;
      fullState.editorExtraSpaceBottom = Math.min(fullState.bezierY1, fullState.bezierY2) < 0;
      break;
    }
    case EasingType.SPRING: {
      fullState.springIsCustom = isAnyDefined(state.springMass, state.springStiffness, state.springDamping);
      if (!fullState.springIsCustom) {
        const springFunction = springFunctions[fullState.springCurve];
        fullState.springMass = springFunction.mass;
        fullState.springStiffness = springFunction.stiffness;
        fullState.springDamping = springFunction.damping;
      }
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: easingType,
        accuracy: fullState.editorAccuracy,
        mass: fullState.springMass,
        stiffness: fullState.springStiffness,
        damping: fullState.springDamping,
      });
      fullState.springValue = easingValue;
      fullState.springPoints = sampledPoints;
      break;
    }
    case EasingType.BOUNCE: {
      fullState.bounceIsCustom = isAnyDefined(state.bounceBounces, state.bounceDamping);
      if (!fullState.bounceIsCustom) {
        const bounceFunction = bounceFunctions[fullState.bounceCurve];
        fullState.bounceBounces = bounceFunction.bounces;
        fullState.bounceDamping = bounceFunction.damping;
      }
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: easingType,
        accuracy: fullState.editorAccuracy,
        bounces: fullState.bounceBounces,
        damping: fullState.bounceDamping,
      });
      fullState.bounceValue = easingValue;
      fullState.bouncePoints = sampledPoints;
      break;
    }
    case EasingType.WIGGLE: {
      fullState.wiggleIsCustom = isAnyDefined(state.wiggleWiggles, state.wiggleDamping);
      if (!fullState.wiggleIsCustom) {
        const wiggleFunction = wiggleFunctions[fullState.wiggleCurve];
        fullState.wiggleWiggles = wiggleFunction.wiggles;
        fullState.wiggleDamping = wiggleFunction.damping;
      }
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: easingType,
        accuracy: fullState.editorAccuracy,
        wiggles: fullState.wiggleWiggles,
        damping: fullState.wiggleDamping,
      });
      fullState.wiggleValue = easingValue;
      fullState.wigglePoints = sampledPoints;
      break;
    }
    case EasingType.OVERSHOOT: {
      fullState.overshootIsCustom = isAnyDefined(state.overshootMass, state.overshootDamping);
      if (!fullState.overshootIsCustom) {
        const overshootFunction = overshootFunctions[fullState.overshootStyle][fullState.overshootCurve];
        fullState.overshootMass = overshootFunction.mass;
        fullState.overshootDamping = overshootFunction.damping;
      }
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: easingType,
        accuracy: fullState.editorAccuracy,
        style: fullState.overshootStyle,
        mass: fullState.overshootMass,
        damping: fullState.overshootDamping,
      });
      fullState.overshootValue = easingValue;
      fullState.overshootPoints = sampledPoints;
      break;
    }
  }
  return fullState;
}
