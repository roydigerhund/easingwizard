import {
  type BezierCurveKey,
  type BezierStyleKey,
  type BounceCurveKey,
  type OvershootCurveKey,
  type OvershootStyleKey,
  type SpringCurveKey,
  type WiggleCurveKey,
} from '~/types/enums';
import type { BezierParams } from '~/validations/input';

export const bezierEasings: Record<
  BezierStyleKey,
  Partial<Record<BezierCurveKey, BezierParams & { mathFunction: (t: number) => number }>>
> = {
  IN: {
    // In Sine
    SINE: {
      x1: 0.13,
      y1: 0,
      x2: 0.39,
      y2: 0,
      mathFunction: function (x: number): number {
        return 1 - Math.cos(x * Math.PI * 0.5);
      },
    },
    // In Quad
    QUAD: {
      x1: 0.11,
      y1: 0,
      x2: 0.5,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 2);
      },
    },
    // In Cubic
    CUBIC: {
      x1: 0.32,
      y1: 0,
      x2: 0.67,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 3);
      },
    },
    // In Quart
    QUART: {
      x1: 0.5,
      y1: 0,
      x2: 0.75,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 4);
      },
    },
    // In Quint
    QUINT: {
      x1: 0.64,
      y1: 0,
      x2: 0.78,
      y2: 0,
      mathFunction: function (x: number): number {
        return Math.pow(x, 5);
      },
    },
    // In Expo
    EXPO: {
      x1: 0.7,
      y1: 0,
      x2: 0.84,
      y2: 0,
      mathFunction: function (x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      },
    },
    // In Circ
    CIRC: {
      x1: 0.55,
      y1: 0,
      x2: 1,
      y2: 0.45,
      mathFunction: function (x: number): number {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
      },
    },
    // In Back
    BACK: {
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
  IN_OUT: {
    // In Out Sine
    SINE: {
      x1: 0.36,
      y1: 0,
      x2: 0.64,
      y2: 1,
      mathFunction: function (x: number): number {
        return -(Math.cos(Math.PI * x) - 1) * 0.5;
      },
    },
    // In Out Quad
    QUAD: {
      x1: 0.44,
      y1: 0,
      x2: 0.56,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) * 0.5;
      },
    },
    // In Out Cubic
    CUBIC: {
      x1: 0.66,
      y1: 0,
      x2: 0.34,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) * 0.5;
      },
    },
    // In Out Quart
    QUART: {
      x1: 0.78,
      y1: 0,
      x2: 0.22,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) * 0.5;
      },
    },
    // In Out Quint
    QUINT: {
      x1: 0.86,
      y1: 0,
      x2: 0.14,
      y2: 1,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) * 0.5;
      },
    },
    // In Out Expo
    EXPO: {
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
    CIRC: {
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
    JUMP: {
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
    ANTICIPATE: {
      x1: 0.8,
      y1: -0.4,
      x2: 0.5,
      y2: 1,
      mathFunction: function (x: number): number {
        return x;
      },
    },
  },
  // INVERSE_IN_OUT: {
  //   // Inverse In Out Sine
  //   SINE: {
  //     x1: 0,
  //     y1: 0.36,
  //     x2: 1,
  //     y2: 0.64,
  //     mathFunction: function (x: number): number {
  //       return Math.asin(x * 2 - 1) / Math.PI + 0.5;
  //     },
  //   },
  // },
  OUT: {
    // Out Sine
    SINE: {
      x1: 0.61,
      y1: 1,
      x2: 0.87,
      y2: 1,
      mathFunction: function (x: number): number {
        return Math.sin(x * Math.PI * 0.5);
      },
    },
    // Out Quad
    QUAD: {
      x1: 0.5,
      y1: 1,
      x2: 0.89,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 2);
      },
    },
    // Out Cubic
    CUBIC: {
      x1: 0.33,
      y1: 1,
      x2: 0.68,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 3);
      },
    },
    // Out Quart
    QUART: {
      x1: 0.25,
      y1: 1,
      x2: 0.5,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 4);
      },
    },
    // Out Quint
    QUINT: {
      x1: 0.22,
      y1: 1,
      x2: 0.36,
      y2: 1,
      mathFunction: function (x: number): number {
        return 1 - Math.pow(1 - x, 5);
      },
    },
    // Out Expo
    EXPO: {
      x1: 0.16,
      y1: 1,
      x2: 0.3,
      y2: 1,
      mathFunction: function (x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    },
    // Out Circ
    CIRC: {
      x1: 0,
      y1: 0.55,
      x2: 0.45,
      y2: 1,
      mathFunction: function (x: number): number {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
      },
    },
    // Out Back
    BACK: {
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
  OUT_IN: {
    // Out In Sine
    SINE: {
      x1: 0.64,
      y1: 1,
      x2: 0.36,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sin(x * Math.PI) * 0.5 : 1 + Math.sin(x * Math.PI) * -0.5;
      },
    },
    // Out In Quad
    QUAD: {
      x1: 0.56,
      y1: 1,
      x2: 0.44,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? -2 * Math.pow(x, 2) + 2 * x : 2 * Math.pow(x, 2) - 2 * x + 1;
      },
    },
    // Out In Cubic
    CUBIC: {
      x1: 0.34,
      y1: 1,
      x2: 0.66,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 3) * 0.5 : Math.pow(2 * x - 1, 3) * 0.5 + 0.5;
      },
    },
    // Out In Quart
    QUART: {
      x1: 0.22,
      y1: 1,
      x2: 0.78,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 4) * 0.5 : Math.pow(2 * x - 1, 4) * 0.5 + 0.5;
      },
    },
    // Out In Quint
    QUINT: {
      x1: 0.14,
      y1: 1,
      x2: 0.86,
      y2: 0,
      mathFunction: function (x: number): number {
        return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 5) * 0.5 : Math.pow(2 * x - 1, 5) * 0.5 + 0.5;
      },
    },
    // Out In Expo
    EXPO: {
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
    CIRC: {
      x1: 0.15,
      y1: 0.91,
      x2: 0.85,
      y2: 0.09,
      mathFunction: function (x: number): number {
        return x < 0.5 ? Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5 : 1 - Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5;
      },
    },
    // Out In Jump
    JUMP: {
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
  // INVERSE_OUT_IN: {
  //   // Inverse Out In Sine
  //   SINE: {
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

export const bezierStyleFunctions: Record<BezierStyleKey, BezierParams> = {
  IN: { x1: 0.75, y1: 0, x2: 1, y2: 1 },
  OUT: { x1: 0, y1: 0, x2: 0.25, y2: 1 },
  IN_OUT: { x1: 0.6, y1: 0, x2: 0.4, y2: 1 },
  OUT_IN: { x1: 0.4, y1: 1, x2: 0.6, y2: 0 },
};
export const bezierFunctions: Record<BezierStyleKey, Partial<Record<BezierCurveKey, BezierParams>>> = {
  IN: Object.fromEntries(
    Object.entries(bezierEasings.IN).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  OUT: Object.fromEntries(
    Object.entries(bezierEasings.OUT).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  IN_OUT: Object.fromEntries(
    Object.entries(bezierEasings.IN_OUT).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
  OUT_IN: Object.fromEntries(
    Object.entries(bezierEasings.OUT_IN).map(([curve, { x1, y1, x2, y2 }]) => [curve, { x1, y1, x2, y2 }]),
  ),
};

export const springFunctions: Record<SpringCurveKey, { stiffness: number; damping: number; mass: number }> = {
  HEAVY: {
    mass: 3.5,
    stiffness: 20,
    damping: 26,
  },
  BOUNCY: {
    mass: 1.0,
    stiffness: 80,
    damping: 0,
  },
  DROP: {
    mass: 4,
    stiffness: 10,
    damping: 5,
  },
  GLIDE: {
    mass: 1.0,
    stiffness: 10,
    damping: 75,
  },
  SNAP: {
    mass: 1,
    stiffness: 90,
    damping: 95,
  },
  LAZY: {
    mass: 2.5,
    stiffness: 4,
    damping: 15,
  },
  ELASTIC: {
    mass: 1,
    stiffness: 30,
    damping: 50,
  },
};

export const bounceFunctions: Record<BounceCurveKey, { bounces: number; damping: number }> = {
  FIRM: {
    bounces: 4,
    damping: 60,
  },
  SOFT: {
    bounces: 2,
    damping: 75,
  },
  SHARP: {
    bounces: 3,
    damping: 85,
  },
  SUBTLE: {
    bounces: 1,
    damping: 55,
  },
  PLAYFUL: {
    bounces: 6,
    damping: 35,
  },
  SPRINGY: {
    bounces: 8,
    damping: 10,
  },
};

export const wiggleFunctions: Record<WiggleCurveKey, { wiggles: number; damping: number }> = {
  SUBTLE: {
    wiggles: 2,
    damping: 75,
  },
  ENERGETIC: {
    wiggles: 6,
    damping: 25,
  },
  PLAYFUL: {
    wiggles: 4,
    damping: 50,
  },
  SHARP: {
    wiggles: 3,
    damping: 90,
  },
  SMOOTH: {
    wiggles: 1,
    damping: 100,
  },
  INTENSE: {
    wiggles: 8,
    damping: 10,
  },
  DYNAMIC: {
    wiggles: 10,
    damping: 0,
  },
};

const overshootCurveFunctions: Record<OvershootCurveKey, { damping: number; mass: number }> = {
  SOFT: {
    mass: 2,
    damping: 60,
  },
  FIRM: {
    mass: 3,
    damping: 80,
  },
  SMOOTH: {
    mass: 3.5,
    damping: 70,
  },
  DYNAMIC: {
    mass: 4,
    damping: 20,
  },
  DRAMATIC: {
    mass: 5,
    damping: 0,
  },
};
export const overshootFunctions: Record<
  OvershootStyleKey,
  Record<OvershootCurveKey, { damping: number; mass: number }>
> = {
  IN: overshootCurveFunctions,
  OUT: overshootCurveFunctions,
  IN_OUT: overshootCurveFunctions,
};
