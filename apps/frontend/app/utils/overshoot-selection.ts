import {
  overshootFunctions,
  type EasingState,
  type OvershootCurveKey,
  type OvershootStyleKey,
} from 'easingwizard-core';

export function getOvershootSelection({
  style,
  curve,
  mass,
  damping,
}: {
  style: OvershootStyleKey;
  curve?: OvershootCurveKey;
  mass: number;
  damping: number;
}): Partial<EasingState> {
  const parameters = curve ? overshootFunctions[style][curve] : { mass, damping };

  return {
    overshootStyle: style,
    overshootMass: parameters.mass,
    overshootDamping: parameters.damping,
    ...(curve ? { overshootCurve: curve } : {}),
    overshootIsCustom: curve === undefined,
  };
}
