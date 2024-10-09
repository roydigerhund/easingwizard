import { useContext } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { BezierCurve, BezierStyle, BounceCurve, EasingType, SpringCurve } from '~/types-and-enums';
import { humanize } from '~/utils/string';

const bezierFunctions: Record<BezierStyle, Record<BezierCurve, [number, number, number, number]>> = {
  in: {
    default: [0.42, 0, 1, 1],
    sine: [0.47, 0, 0.745, 0.715],
    quad: [0.55, 0.085, 0.68, 0.53],
    cubic: [0.55, 0.055, 0.675, 0.19],
    quart: [0.895, 0.03, 0.685, 0.22],
    quint: [0.755, 0.05, 0.855, 0.06],
    expo: [0.95, 0.05, 0.795, 0.035],
    circ: [0.6, 0.04, 0.98, 0.335],
    back: [0.6, -0.28, 0.735, 0.045],
  },
  out: {
    default: [0, 0, 0.58, 1],
    sine: [0.39, 0.575, 0.565, 1],
    quad: [0.25, 0.46, 0.45, 0.94],
    cubic: [0.215, 0.61, 0.355, 1],
    quart: [0.165, 0.84, 0.44, 1],
    quint: [0.23, 1, 0.32, 1],
    expo: [0.19, 1, 0.22, 1],
    circ: [0.075, 0.82, 0.165, 1],
    back: [0.175, 0.885, 0.32, 1.275],
  },
  inOut: {
    default: [0.42, 0, 0.58, 1],
    sine: [0.445, 0.05, 0.55, 0.95],
    quad: [0.455, 0.03, 0.515, 0.955],
    cubic: [0.645, 0.045, 0.355, 1],
    quart: [0.77, 0, 0.175, 1],
    quint: [0.86, 0, 0.07, 1],
    expo: [1, 0, 0, 1],
    circ: [0.785, 0.135, 0.15, 0.86],
    back: [0.68, -0.55, 0.265, 1.55],
  },
};

export const defaultBezierFunction = bezierFunctions.in.default;

const springFunctions: Record<SpringCurve, { stiffness: number; damping: number; initialVelocity: number }> = {
  default: { stiffness: 100, damping: 10, initialVelocity: 0 },
  wobbly: { stiffness: 170, damping: 26, initialVelocity: 0 },
  gentle: { stiffness: 120, damping: 14, initialVelocity: 0 },
  stiff: { stiffness: 210, damping: 20, initialVelocity: 0 },
};

export const defaultSpringFunction = springFunctions.default;

const bounceFunctions: Record<BounceCurve, { bounces: number; restitution: number; initialHeight: number }> = {
  default: { bounces: 4, restitution: 0.5, initialHeight: 10 },
  floppy: { bounces: 3, restitution: 0.2, initialHeight: 10 },
  relaxed: { bounces: 5, restitution: 0.8, initialHeight: 10 },
};

export const defaultBounceFunction = bounceFunctions.default;

export default function EasingSelection() {
  const {
    state: { easingType, bezierStyle, bezierCurve, springCurve, bounceCurve },
    saveState,
  } = useContext(EasingContext);

  const onBezierValueChange = (style: BezierStyle, curve: BezierCurve) => {
    saveState({
      bezierValue: bezierFunctions[style][curve],
      bezierStyle: style,
      bezierCurve: curve,
    });
  };

  const onSpringValueChange = (curve: SpringCurve) => {
    saveState({
      springStiffness: springFunctions[curve].stiffness,
      springDamping: springFunctions[curve].damping,
      springInitialVelocity: springFunctions[curve].initialVelocity,
      springCurve: curve,
    });
  };

  const onBounceValueChange = (curve: BounceCurve) => {
    saveState({
      bounceBounces: bounceFunctions[curve].bounces,
      bounceRestitution: bounceFunctions[curve].restitution,
      bounceInitialHeight: bounceFunctions[curve].initialHeight,
      bounceCurve: curve,
    });
  };

  return (
    <div className="col-span-4 flex">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Type</h2>
        <div className="flex flex-col gap-4">
          {Object.values(EasingType).map((type) => (
            <button
              key={type}
              className={`rounded-md px-4 py-2 ${
                easingType === type ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-100'
              }`}
              onClick={() => saveState({ easingType: type })}
            >
              {humanize(type)}
            </button>
          ))}
        </div>
      </div>
      {easingType === EasingType.BEZIER && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Style</h2>
          <div className="flex flex-col gap-4">
            {Object.keys(bezierFunctions).map((style) => (
              <button
                key={style}
                className={`rounded-md px-4 py-2 ${
                  bezierStyle === style ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-100'
                }`}
                onClick={() => {
                  onBezierValueChange(style as BezierStyle, bezierCurve);
                }}
              >
                {humanize(style)}
              </button>
            ))}
          </div>
        </div>
      )}
      {easingType === EasingType.BEZIER && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Curve</h2>
          <div className="flex flex-col gap-4">
            {Object.keys(bezierFunctions[bezierStyle]).map((curve) => (
              <button
                key={curve}
                className={`rounded-md px-4 py-2 ${
                  bezierCurve === curve ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-100'
                }`}
                onClick={() => onBezierValueChange(bezierStyle, curve as BezierCurve)}
              >
                {humanize(curve)}
              </button>
            ))}
          </div>
        </div>
      )}
      {easingType === EasingType.SPRING && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Curve</h2>
          <div className="flex flex-col gap-4">
            {Object.keys(springFunctions).map((curve) => (
              <button
                key={curve}
                className={`rounded-md px-4 py-2 ${
                  springCurve === curve ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-100'
                }`}
                onClick={() => onSpringValueChange(curve as SpringCurve)}
              >
                {humanize(curve)}
              </button>
            ))}
          </div>
        </div>
      )}
      {easingType === EasingType.BOUNCE && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Curve</h2>
          <div className="flex flex-col gap-4">
            {Object.keys(bounceFunctions).map((curve) => (
              <button
                key={curve}
                className={`rounded-md px-4 py-2 ${
                  bounceCurve === curve ? 'bg-blue-500 text-white' : 'text-gray-800 dark:text-gray-100'
                }`}
                onClick={() => onBounceValueChange(curve as BounceCurve)}
              >
                {humanize(curve)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
