import {
  bounceCalculations,
  overshootCalculations,
  springCalculations,
  wiggleCalculations,
} from '~/generated/linear-easings';
import {
  BezierCurve,
  BezierStyle,
  BezierValue,
  BounceCurve,
  OvershootCurve,
  OvershootStyle,
  SpringCurve,
  WiggleCurve,
} from '~/types-and-enums';

export const bezierEasings = {
  in: {
    // In Sine
    sine: {
      bezierValue: [0.13, 0, 0.39, 0],
      mathFunction: function (x: number): number {
        return 1 - Math.cos(x * Math.PI * 0.5);
      },
    },
    // In Quad
    quad: {
      bezierValue: [0.11, 0, 0.5, 0],
      mathFunction: function (x: number): number {
        return Math.pow(x, 2);
      },
    },
    // In Cubic
    cubic: {
      bezierValue: [0.32, 0, 0.67, 0],
      mathFunction: function (x: number): number {
        return Math.pow(x, 3);
      },
    },
    // In Quart
    quart: {
      bezierValue: [0.5, 0, 0.75, 0],
      mathFunction: function (x: number): number {
        return Math.pow(x, 4);
      },
    },
    // In Quint
    quint: {
      bezierValue: [0.64, 0, 0.78, 0],
      mathFunction: function (x: number): number {
        return Math.pow(x, 5);
      },
    },
    // In Expo
    expo: {
      bezierValue: [0.7, 0, 0.84, 0],
      mathFunction: function (x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      },
    },
    // In Circ
    circ: {
      bezierValue: [0.55, 0, 1, 0.45],
      mathFunction: function (x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
      },
    },
    // In Back
    back: {
      bezierValue: [0.36, 0, 0.66, -0.56],
      mathFunction: function (x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * Math.pow(x, 3) - c1 * Math.pow(x, 2);
      },
    },
  },
  inOut: {
    // In Out Sine
    sine: {
      bezierValue: [0.36, 0, 0.64, 1],
      mathFunction: function (x: number): number {
        return -(Math.cos(Math.PI * x) - 1) * 0.5;
      },
    },
    // In Out Quad
    quad: {
      bezierValue: [0.44, 0, 0.56, 1],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) * 0.5;
      },
    },
    // In Out Cubic
    cubic: {
      bezierValue: [0.66, 0, 0.34, 1],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) * 0.5;
      },
    },
    // In Out Quart
    quart: {
      bezierValue: [0.78, 0, 0.22, 1],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) * 0.5;
      },
    },
    // In Out Quint
    quint: {
      bezierValue: [0.86, 0, 0.14, 1],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) * 0.5;
      },
    },
    // In Out Expo
    expo: {
      bezierValue: [0.9, 0, 0.1, 1],
      mathFunction: function (x: number): number {
        return x === 0
          ? 0
          : x === 1
            ? 1
            : x < 0.5
              ? Math.pow(2, 20 * x - 10) * 0.5
              : (2 - Math.pow(2, -20 * x + 10)) * 0.5;
      },
    },
    // In Out Circ
    circ: {
      bezierValue: [0.85, 0.09, 0.15, 0.91],
      mathFunction: function (x: number): number {
        return x < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) * 0.5
          : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) * 0.5;
      },
    },
    // In Out Jump
    jump: {
      bezierValue: [1, 0, 0, 1],
      mathFunction: function (x: number): number {
        return x < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * x, 4))) * 0.5
          : (Math.sqrt(1 - Math.pow(-2 * x + 2, 4)) + 1) * 0.5;
      },
    },
    // In Out Anticipate
    anticipate: {
      bezierValue: [0.8, -0.4, 0.5, 1],
      mathFunction: function (x: number): number {
        return x;
      },
    },
  },
  inverseInOut: {
    // Inverse In Out Sine
    sine: {
      bezierValue: [0, 0.36, 1, 0.64],
      mathFunction: function (x: number): number {
        return Math.asin(x * 2 - 1) / Math.PI + 0.5;
      },
    },
  },
  out: {
    // Out Sine
    sine: {
      bezierValue: [0.61, 1, 0.87, 1],
      mathFunction: function (x: number): number {
        return Math.sin(x * Math.PI * 0.5);
      },
    },
    // Out Quad
    quad: {
      bezierValue: [0.5, 1, 0.89, 1],
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 2);
      },
    },
    // Out Cubic
    cubic: {
      bezierValue: [0.33, 1, 0.68, 1],
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 3);
      },
    },
    // Out Quart
    quart: {
      bezierValue: [0.25, 1, 0.5, 1],
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 4);
      },
    },
    // Out Quint
    quint: {
      bezierValue: [0.22, 1, 0.36, 1],
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 5);
      },
    },
    // Out Expo
    expo: {
      bezierValue: [0.16, 1, 0.3, 1],
      mathFunction: function (x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    },
    // Out Circ
    circ: {
      bezierValue: [0, 0.55, 0.45, 1],
      mathFunction: function (x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
      },
    },
    // Out Back
    back: {
      bezierValue: [0.34, 1.56, 0.64, 1],
      mathFunction: function (x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      },
    },
  },
  outIn: {
    // Out In Sine
    sine: {
      bezierValue: [0.64, 1, 0.36, 0],
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sin(x * Math.PI) * 0.5 : 1 + Math.sin(x * Math.PI) * -0.5;
      },
    },
    // Out In Quad
    quad: {
      bezierValue: [0.56, 1, 0.44, 0],
      mathFunction: function (x: number): number {
        return x < 0.5 ? -2 * Math.pow(x, 2) + 2 * x : 2 * Math.pow(x, 2) - 2 * x + 1;
      },
    },
    // Out In Cubic
    cubic: {
      bezierValue: [0.34, 1, 0.66, 0],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 3) * 0.5 : Math.pow(2 * x - 1, 3) * 0.5 + 0.5;
      },
    },
    // Out In Quart
    quart: {
      bezierValue: [0.22, 1, 0.78, 0],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 4) * 0.5 : Math.pow(2 * x - 1, 4) * 0.5 + 0.5;
      },
    },
    // Out In Quint
    quint: {
      bezierValue: [0.14, 1, 0.86, 0],
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 5) * 0.5 : Math.pow(2 * x - 1, 5) * 0.5 + 0.5;
      },
    },
    // Out In Expo
    expo: {
      bezierValue: [0.1, 1, 0.9, 0],
      mathFunction: function (x: number): number {
        return x === 0
          ? 0
          : x === 1
            ? 1
            : x < 0.5
              ? 0.5 - Math.pow(2, -20 * x) * 0.5
              : Math.pow(2, 20 * x - 20) * 0.5 + 0.5;
      },
    },
    // Out In Circ
    circ: {
      bezierValue: [0.15, 0.91, 0.85, 0.09],
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5 : 1 - Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5;
      },
    },
    // Out In Jump
    jump: {
      bezierValue: [0, 1, 1, 0],
      mathFunction: function (x: number): number {
        return x < 0.5
          ? Math.sqrt(1 - Math.pow(-2 * (x + 0.5) + 2, 4)) * 0.5
          : (1 - Math.sqrt(1 - Math.pow(2 * (x - 0.5), 4)) + 1) * 0.5;
      },
    },
  },
  inverseOutIn: {
    // Inverse Out In Sine
    sine: {
      bezierValue: [1, 0.64, 0, 0.36],
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.asin((x + 0.5) * 2 - 1) / Math.PI : Math.asin((x - 0.5) * 2 - 1) / Math.PI + 1;
      },
    },
  },
};

export const bezierStyleFunctions: Record<BezierStyle, BezierValue> = {
  in: [0.75, 0, 1, 1],
  out: [0, 0, 0.25, 1],
  inOut: [0.6, 0, 0.4, 1],
  outIn: [0.4, 1, 0.6, 0],
};

export const bezierFunctions: Record<BezierStyle, Partial<Record<BezierCurve, BezierValue>>> = {
  in: Object.fromEntries(Object.entries(bezierEasings.in).map(([curve, { bezierValue }]) => [curve, bezierValue])),
  out: Object.fromEntries(Object.entries(bezierEasings.out).map(([curve, { bezierValue }]) => [curve, bezierValue])),
  inOut: Object.fromEntries(
    Object.entries(bezierEasings.inOut).map(([curve, { bezierValue }]) => [curve, bezierValue]),
  ),
  outIn: Object.fromEntries(
    Object.entries(bezierEasings.outIn).map(([curve, { bezierValue }]) => [curve, bezierValue]),
  ),
};

export const defaultBezierFunction = bezierFunctions.inOut.cubic as BezierValue;

export const overshootFunctions: Record<OvershootStyle, Record<OvershootCurve, { damping: number; mass: number }>> = {
  in: {
    default: { damping: 50, mass: 2 },
    overshoot: { damping: 10, mass: 2 },
    anticipate: { damping: 26, mass: 2 },
  },
  out: {
    default: { damping: 50, mass: 2 },
    overshoot: { damping: 10, mass: 2 },
    anticipate: { damping: 26, mass: 2 },
  },
  inOut: {
    default: { damping: 100, mass: 2 },
    overshoot: { damping: 100, mass: 2 },
    anticipate: { damping: 75, mass: 2 },
  },
};

export const defaultOvershootFunction = overshootFunctions.out.default;

export const springFunctions: Record<SpringCurve, { stiffness: number; damping: number; mass: number }> = {
  default: { stiffness: 100, damping: 10, mass: 1 },
  wobbly: { stiffness: 170, damping: 26, mass: 1 },
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  stiff: { stiffness: 210, damping: 20, mass: 1 },
};

export const defaultSpringFunction = springFunctions.default;

export const bounceFunctions: Record<BounceCurve, { bounces: number; damping: number }> = {
  default: { bounces: 4, damping: 0.5 },
  floppy: { bounces: 3, damping: 0.2 },
  relaxed: { bounces: 5, damping: 0.8 },
};

export const defaultBounceFunction = bounceFunctions.default;

export const wiggleFunctions: Record<WiggleCurve, { wiggles: number; damping: number }> = {
  default: { wiggles: 1, damping: 0.5 },
  loose: { wiggles: 1, damping: 26 },
  tight: { wiggles: 1, damping: 14 },
};

export const defaultWiggleFunction = wiggleFunctions.default;

export const defaultOvershootValue = overshootCalculations.out.default.easingValue;

export const defaultSpringValue = springCalculations.default.easingValue;

export const defaultBounceValue = bounceCalculations.default.easingValue;

export const defaultWiggleValue = wiggleCalculations.default.easingValue;
