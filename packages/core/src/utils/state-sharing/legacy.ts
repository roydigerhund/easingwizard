import { defaultEasingState } from '~/state';
import { EasingType, type EasingState } from '~/types';
import { BounceInputSchema, OvershootInputSchema, SpringInputSchema, WiggleInputSchema } from '~/validations';
import { generateLinearEasing } from '../easing';
import { mapRange } from '../numbers';

// fromOld, toOld, fromNew, toNew
export const LEGACY_NUMBER_RANGE_MAPPINGS: Partial<Record<keyof EasingState, [number, number, number, number]>> = {
  springDamping: [5, 25, 0, 100],
  bounceDamping: [-2, 2, 0, 100],
  wiggleDamping: [0, 20, 0, 100],
  overshootDamping: [50, 100, 0, 100],
  springStiffness: [1, 500, 0, 100],
};

export function rehydrateShareStateLegacy(searchParams: URLSearchParams) {
  const newState: Record<string, unknown> = {};

  // adjust old damping values to new format
  const getValue = (key: keyof EasingState, value: string) => {
    const parsedValue = JSON.parse(value);
    if (key === 'editorAccuracy' && typeof parsedValue === 'string') {
      return parsedValue.toLowerCase();
    }
    if (typeof parsedValue !== 'number') {
      return parsedValue;
    }
    if (key in LEGACY_NUMBER_RANGE_MAPPINGS && LEGACY_NUMBER_RANGE_MAPPINGS[key]) {
      const [fromOld, toOld, fromNew, toNew] = LEGACY_NUMBER_RANGE_MAPPINGS[key];
      // all are integers, so we can round the result
      return Math.round(mapRange(parsedValue, fromOld, toOld, fromNew, toNew));
    }
    return parsedValue;
  };

  Array.from(searchParams.entries()).forEach(([key, value]) => {
    if (key in defaultEasingState || key === 'bezierRawValue') {
      if (key === 'bezierRawValue') {
        // special case for bezierRawValue, which is a stringified array
        // the value is now split into four parts
        const bezierValues = JSON.parse(value);
        if (Array.isArray(bezierValues) && bezierValues.length === 4) {
          newState['bezierX1'] = bezierValues[0];
          newState['bezierY1'] = bezierValues[1];
          newState['bezierX2'] = bezierValues[2];
          newState['bezierY2'] = bezierValues[3];
        }
      } else {
        newState[key] = getValue(key as keyof EasingState, value);
      }
    }
  });
  if (newState.easingType === EasingType.SPRING) {
    const values = SpringInputSchema.parse({
      mass: newState.springMass,
      stiffness: newState.springStiffness,
      damping: newState.springDamping,
      accuracy: newState.editorAccuracy,
    });
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: newState.easingType,
      accuracy: values.accuracy,
      mass: values.mass,
      stiffness: values.stiffness,
      damping: values.damping,
    });
    newState.springValue = easingValue;
    newState.springPoints = sampledPoints;
  }
  if (newState.easingType === EasingType.BOUNCE) {
    const values = BounceInputSchema.parse({
      bounces: newState.bounceBounces,
      damping: newState.bounceDamping,
      accuracy: newState.editorAccuracy,
    });
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: newState.easingType,
      accuracy: values.accuracy,
      bounces: values.bounces,
      damping: values.damping,
    });
    newState.bounceValue = easingValue;
    newState.bouncePoints = sampledPoints;
  }
  if (newState.easingType === EasingType.WIGGLE) {
    const values = WiggleInputSchema.parse({
      wiggles: newState.wiggleWiggles,
      damping: newState.wiggleDamping,
      accuracy: newState.editorAccuracy,
    });
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: newState.easingType,
      accuracy: values.accuracy,
      wiggles: values.wiggles,
      damping: values.damping,
    });
    newState.wiggleValue = easingValue;
    newState.wigglePoints = sampledPoints;
  }
  if (newState.easingType === EasingType.OVERSHOOT) {
    const values = OvershootInputSchema.parse({
      style: newState.overshootStyle,
      mass: newState.overshootMass,
      damping: newState.overshootDamping,
      accuracy: newState.editorAccuracy,
    });
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: newState.easingType,
      accuracy: values.accuracy,
      style: values.style,
      mass: values.mass,
      damping: values.damping,
    });
    newState.overshootValue = easingValue;
    newState.overshootPoints = sampledPoints;
  }

  return newState as Partial<EasingState>;
}
