import {
  EasingType,
  generateLinearEasing,
  overshootFunctions,
  suggestDuration,
  type EasingState,
  type LinearEasingAccuracyKey,
  type OvershootCurveKey,
  type OvershootStyleKey,
} from 'easingwizard-core';

export function getOvershootSelection({
  style,
  curve,
  mass,
  damping,
  accuracy,
}: {
  style: OvershootStyleKey;
  curve?: OvershootCurveKey;
  mass: number;
  damping: number;
  accuracy: LinearEasingAccuracyKey;
}): Partial<EasingState> {
  const parameters = curve ? overshootFunctions[style][curve] : { mass, damping };
  const config = { style, accuracy, ...parameters };
  const { easingValue, sampledPoints } = generateLinearEasing({ type: EasingType.OVERSHOOT, ...config });
  const duration = suggestDuration(EasingType.OVERSHOOT, config);

  return {
    overshootStyle: style,
    overshootMass: parameters.mass,
    overshootDamping: parameters.damping,
    ...(curve ? { overshootCurve: curve } : {}),
    overshootIsCustom: curve === undefined,
    overshootValue: easingValue,
    overshootPoints: sampledPoints,
    previewDuration: Math.round((duration.min + duration.max) / 2 / 25) * 25,
  };
}
