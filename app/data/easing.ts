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
} from '~/types-and-enums';
import { BezierInput } from '~/validations/easing';

export const bezierEasings: Record<
  BezierStyle,
  Partial<Record<BezierCurve, BezierInput & { mathFunction: (t: number) => number }>>
> = {
  in: {
    // In Sine
    sine: {
      x1: 0.13,
      y1: 0,
      x2: 0.39,
      y2: 0,
      mathFunction: function (x: number): number {
        return 1 - Math.cos(x * Math.PI * 0.5);
      },
    },
    // In Quad
    quad: {
      x1: 0.11,
      y1: 0,
      x2: 0.5,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 2);
      },
    },
    // In Cubic
    cubic: {
      x1: 0.32,
      y1: 0,
      x2: 0.67,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 3);
      },
    },
    // In Quart
    quart: {
      x1: 0.5,
      y1: 0,
      x2: 0.75,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 4);
      },
    },
    // In Quint
    quint: {
      x1: 0.64,
      y1: 0,
      x2: 0.78,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 5);
      },
    },
    // In Expo
    expo: {
      x1: 0.7,
      y1: 0,
      x2: 0.84,
      y2: 0,
      mathFunction: function (x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      },
    },
    // In Circ
    circ: {
      x1: 0.55,
      y1: 0,
      x2: 1,
      y2: 0.45,
      mathFunction: function (x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
      },
    },
    // In Back
    back: {
      x1: 0.36,
      y1: 0,
      x2: 0.66,
      y2: -0.56,
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
      x1: 0.36,
      y1: 0,
      x2: 0.64,
      y2: 1,
      mathFunction: function (x: number): number {
        return -(Math.cos(Math.PI * x) - 1) * 0.5;
      },
    },
    // In Out Quad
    quad: {
      x1: 0.44,
      y1: 0,
      x2: 0.56,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) * 0.5;
      },
    },
    // In Out Cubic
    cubic: {
      x1: 0.66,
      y1: 0,
      x2: 0.34,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) * 0.5;
      },
    },
    // In Out Quart
    quart: {
      x1: 0.78,
      y1: 0,
      x2: 0.22,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) * 0.5;
      },
    },
    // In Out Quint
    quint: {
      x1: 0.86,
      y1: 0,
      x2: 0.14,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) * 0.5;
      },
    },
    // In Out Expo
    expo: {
      x1: 0.9,
      y1: 0,
      x2: 0.1,
      y2: 1,
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
      x1: 0.85,
      y1: 0.09,
      x2: 0.15,
      y2: 0.91,
      mathFunction: function (x: number): number {
        return x < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) * 0.5
          : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) * 0.5;
      },
    },
    // In Out Jump
    jump: {
      x1: 1,
      y1: 0,
      x2: 0,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * x, 4))) * 0.5
          : (Math.sqrt(1 - Math.pow(-2 * x + 2, 4)) + 1) * 0.5;
      },
    },
    // In Out Anticipate
    anticipate: {
      x1: 0.8,
      y1: -0.4,
      x2: 0.5,
      y2: 1,
      mathFunction: function (x: number): number {
        return x;
      },
    },
  },
  // inverseInOut: {
  //   // Inverse In Out Sine
  //   sine: {
  //     x1: 0,
  //     y1: 0.36,
  //     x2: 1,
  //     y2: 0.64,
  //     mathFunction: function (x: number): number {
  //       return Math.asin(x * 2 - 1) / Math.PI + 0.5;
  //     },
  //   },
  // },
  out: {
    // Out Sine
    sine: {
      x1: 0.61,
      y1: 1,
      x2: 0.87,
      y2: 1,
      mathFunction: function (x: number): number {
        return Math.sin(x * Math.PI * 0.5);
      },
    },
    // Out Quad
    quad: {
      x1: 0.5,
      y1: 1,
      x2: 0.89,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 2);
      },
    },
    // Out Cubic
    cubic: {
      x1: 0.33,
      y1: 1,
      x2: 0.68,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 3);
      },
    },
    // Out Quart
    quart: {
      x1: 0.25,
      y1: 1,
      x2: 0.5,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 4);
      },
    },
    // Out Quint
    quint: {
      x1: 0.22,
      y1: 1,
      x2: 0.36,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 5);
      },
    },
    // Out Expo
    expo: {
      x1: 0.16,
      y1: 1,
      x2: 0.3,
      y2: 1,
      mathFunction: function (x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    },
    // Out Circ
    circ: {
      x1: 0,
      y1: 0.55,
      x2: 0.45,
      y2: 1,
      mathFunction: function (x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
      },
    },
    // Out Back
    back: {
      x1: 0.34,
      y1: 1.56,
      x2: 0.64,
      y2: 1,
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
      x1: 0.64,
      y1: 1,
      x2: 0.36,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sin(x * Math.PI) * 0.5 : 1 + Math.sin(x * Math.PI) * -0.5;
      },
    },
    // Out In Quad
    quad: {
      x1: 0.56,
      y1: 1,
      x2: 0.44,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? -2 * Math.pow(x, 2) + 2 * x : 2 * Math.pow(x, 2) - 2 * x + 1;
      },
    },
    // Out In Cubic
    cubic: {
      x1: 0.34,
      y1: 1,
      x2: 0.66,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 3) * 0.5 : Math.pow(2 * x - 1, 3) * 0.5 + 0.5;
      },
    },
    // Out In Quart
    quart: {
      x1: 0.22,
      y1: 1,
      x2: 0.78,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 4) * 0.5 : Math.pow(2 * x - 1, 4) * 0.5 + 0.5;
      },
    },
    // Out In Quint
    quint: {
      x1: 0.14,
      y1: 1,
      x2: 0.86,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 5) * 0.5 : Math.pow(2 * x - 1, 5) * 0.5 + 0.5;
      },
    },
    // Out In Expo
    expo: {
      x1: 0.1,
      y1: 1,
      x2: 0.9,
      y2: 0,
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
      x1: 0.15,
      y1: 0.91,
      x2: 0.85,
      y2: 0.09,
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5 : 1 - Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5;
      },
    },
    // Out In Jump
    jump: {
      x1: 0,
      y1: 1,
      x2: 1,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5
          ? Math.sqrt(1 - Math.pow(-2 * (x + 0.5) + 2, 4)) * 0.5
          : (1 - Math.sqrt(1 - Math.pow(2 * (x - 0.5), 4)) + 1) * 0.5;
      },
    },
  },
  // inverseOutIn: {
  //   // Inverse Out In Sine
  //   sine: {
  //     x1: 1,
  //     y1: 0.64,
  //     x2: 0,
  //     y2: 0.36,
  //     mathFunction: function (x: number): number {
  //       return x < 0.5 ? Math.asin((x + 0.5) * 2 - 1) / Math.PI : Math.asin((x - 0.5) * 2 - 1) / Math.PI + 1;
  //     },
  //   },
  // },
};

export const bezierStyleFunctions: Record<BezierStyle, BezierInput> = {
  in: { x1: 0.75, y1: 0, x2: 1, y2: 1 },
  out: { x1: 0, y1: 0, x2: 0.25, y2: 1 },
  inOut: { x1: 0.6, y1: 0, x2: 0.4, y2: 1 },
  outIn: { x1: 0.4, y1: 1, x2: 0.6, y2: 0 },
};

export const bezierFunctions: Record<BezierStyle, Partial<Record<BezierCurve, BezierInput>>> = {
  in: Object.fromEntries(
    Object.entries(bezierEasings.in).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  out: Object.fromEntries(
    Object.entries(bezierEasings.out).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  inOut: Object.fromEntries(
    Object.entries(bezierEasings.inOut).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  outIn: Object.fromEntries(
    Object.entries(bezierEasings.outIn).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
};

export const defaultBezierStyle = BezierStyle.IN_OUT;
export const defaultBezierCurve = BezierCurve.CUBIC;
export const defaultBezierFunction = bezierFunctions[defaultBezierStyle][defaultBezierCurve] as BezierInput;

export const springFunctions: Record<SpringCurve, { stiffness: number; damping: number; mass: number }> = {
  heavy: {
    mass: 3.5,
    stiffness: 20,
    damping: 26,
  },
  bouncy: {
    mass: 1.0,
    stiffness: 80,
    damping: 0,
  },
  drop: {
    mass: 4,
    stiffness: 10,
    damping: 5,
  },
  glide: {
    mass: 1.0,
    stiffness: 10,
    damping: 75,
  },
  snap: {
    mass: 0.5,
    stiffness: 60,
    damping: 50,
  },
  lazy: {
    mass: 2.5,
    stiffness: 4,
    damping: 15,
  },
  elastic: {
    mass: 0.6,
    stiffness: 30,
    damping: 35,
  },
};

export const defaultSpringCurve = SpringCurve.HEAVY;
export const defaultSpringFunction = springFunctions[defaultSpringCurve];
export const defaultSpringValue = springCalculations[defaultSpringCurve].easingValue;
export const defaultSpringPoints = springCalculations[defaultSpringCurve].sampledPoints;

export const bounceFunctions: Record<BounceCurve, { bounces: number; damping: number }> = {
  firm: {
    bounces: 4,
    damping: 60,
  },
  soft: {
    bounces: 2,
    damping: 75,
  },
  sharp: {
    bounces: 3,
    damping: 85,
  },
  subtle: {
    bounces: 1,
    damping: 55,
  },
  playful: {
    bounces: 6,
    damping: 35,
  },
  springy: {
    bounces: 8,
    damping: 10,
  },
};

export const defaultBounceCurve = BounceCurve.FIRM;
export const defaultBounceFunction = bounceFunctions[defaultBounceCurve];
export const defaultBounceValue = bounceCalculations[defaultBounceCurve].easingValue;
export const defaultBouncePoints = bounceCalculations[defaultBounceCurve].sampledPoints;

export const wiggleFunctions: Record<WiggleCurve, { wiggles: number; damping: number }> = {
  subtle: {
    wiggles: 2,
    damping: 75,
  },
  energetic: {
    wiggles: 6,
    damping: 25,
  },
  playful: {
    wiggles: 4,
    damping: 50,
  },
  sharp: {
    wiggles: 3,
    damping: 90,
  },
  smooth: {
    wiggles: 1,
    damping: 100,
  },
  intense: {
    wiggles: 8,
    damping: 10,
  },
  dynamic: {
    wiggles: 10,
    damping: 0,
  },
};

export const defaultWiggleCurve = WiggleCurve.SUBTLE;
export const defaultWiggleFunction = wiggleFunctions[defaultWiggleCurve];
export const defaultWiggleValue = wiggleCalculations[defaultWiggleCurve].easingValue;
export const defaultWigglePoints = wiggleCalculations[defaultWiggleCurve].sampledPoints;

const overshootCurveFunctions: Record<OvershootCurve, { damping: number; mass: number }> = {
  soft: {
    mass: 2,
    damping: 60,
  },
  firm: {
    mass: 3,
    damping: 80,
  },
  smooth: {
    mass: 3.5,
    damping: 70,
  },
  dynamic: {
    mass: 4,
    damping: 20,
  },
  dramatic: {
    mass: 5,
    damping: 0,
  },
};
export const overshootFunctions: Record<OvershootStyle, Record<OvershootCurve, { damping: number; mass: number }>> = {
  in: overshootCurveFunctions,
  out: overshootCurveFunctions,
  inOut: overshootCurveFunctions,
};

export const defaultOvershootStyle = OvershootStyle.OUT;
export const defaultOvershootCurve = OvershootCurve.SOFT;
export const defaultOvershootFunction = overshootFunctions[defaultOvershootStyle][defaultOvershootCurve];
export const defaultOvershootValue = overshootCalculations[defaultOvershootStyle][defaultOvershootCurve].easingValue;
export const defaultOvershootPoints = overshootCalculations[defaultOvershootStyle][defaultOvershootCurve].sampledPoints;
