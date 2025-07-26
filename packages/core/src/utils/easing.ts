import {
  EasingType,
  LinearEasingAccuracy,
  OvershootStyle,
  type LinearEasingAccuracyKey,
  type OvershootStyleKey,
} from '~/types/enums';
import type { Point } from '~/types/types';
import type { BezierInput, BounceInput, OvershootInput, SpringInput, WiggleInput } from '~/validations/input';
import { mapRange, roundTo } from './numbers';

export function createCubicBezierString({ x1, y1, x2, y2 }: BezierInput): string {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

type LinearEasingFunctionInputBezier = {
  type: typeof EasingType.BEZIER;
  accuracy: LinearEasingAccuracyKey;
  mathFunction: (t: number) => number;
}; // only used in BezierComparison component
type LinearEasingFunctionInputSpring = SpringInput & { type: typeof EasingType.SPRING; mathFunction?: never };
type LinearEasingFunctionInputBounce = BounceInput & { type: typeof EasingType.BOUNCE; mathFunction?: never };
type LinearEasingFunctionInputWiggle = WiggleInput & { type: typeof EasingType.WIGGLE; mathFunction?: never };
type LinearEasingFunctionInputOvershoot = OvershootInput & { type: typeof EasingType.OVERSHOOT; mathFunction?: never };

type LinearEasingFunctionInput =
  | LinearEasingFunctionInputBezier
  | LinearEasingFunctionInputSpring
  | LinearEasingFunctionInputBounce
  | LinearEasingFunctionInputWiggle
  | LinearEasingFunctionInputOvershoot;

const getEasingFunction = (config: LinearEasingFunctionInput) => {
  switch (config.type) {
    case EasingType.BEZIER:
      throw new Error('Bezier easing function requires a mathFunction to be provided.');
    case EasingType.SPRING:
      return createSpringFunction(config);
    case EasingType.BOUNCE:
      return createBounceFunction(config);
    case EasingType.WIGGLE:
      return createWiggleFunction(config);
    case EasingType.OVERSHOOT:
      return createOvershootFunction(config as any);
  }
};

export function generateLinearEasing(config: LinearEasingFunctionInput) {
  const { type, accuracy } = config;
  const easingFunction: (t: number) => number = config.mathFunction ?? getEasingFunction(config);

  const fixedTotalTime =
    type === EasingType.BEZIER ||
    type === EasingType.BOUNCE ||
    type === EasingType.WIGGLE ||
    type === EasingType.OVERSHOOT
      ? 1
      : undefined;
  const endValue = type === EasingType.WIGGLE ? 0 : undefined;

  const totalTime = fixedTotalTime || getTotalTime(easingFunction, endValue);
  // Use the getKeyTimes function to get key times
  const keyTimes = getKeyTimes(easingFunction, totalTime, accuracy);

  // Sample the bounce function at key times
  const easingValues: string[] = [];
  const sampledPoints: Point[] = [];

  for (const time of keyTimes) {
    const timePercentage = roundTo((time / totalTime) * 100, 2);
    const value = roundTo(easingFunction(time), 3);

    easingValues.push([0, 100].includes(timePercentage) ? `${Math.round(value)}` : `${value} ${timePercentage}%`);

    sampledPoints.push({
      x: timePercentage,
      y: roundTo(100 - value * 100, 2), // SVG height scaling (invert y-axis)
    });
  }

  // Generate the CSS linear easing function
  const easingValue = `linear(${easingValues.join(', ')})`;

  return { easingValue, sampledPoints };
}

// SPRING
export function createSpringFunction({
  stiffness,
  mass,
  damping,
}: {
  stiffness: number;
  mass: number;
  damping: number;
}): (t: number) => number {
  const k = mapRange(stiffness, 0, 100, 1, 500); // Spring constant
  const m = mass; // Mass
  const c = mapRange(damping, 0, 100, 5, 25); // Damping coefficient

  const omega0 = Math.sqrt(k / m); // Natural angular frequency
  const zeta = c / (2 * Math.sqrt(k * m)); // Damping ratio

  if (zeta < 1) {
    // Under-damped case
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta); // Damped angular frequency
    const sinCoeff = zeta / Math.sqrt(1 - zeta * zeta);

    return (t: number): number => {
      const envelope = Math.exp(-zeta * omega0 * t);
      const cosTerm = Math.cos(omegaD * t);
      const sinTerm = sinCoeff * Math.sin(omegaD * t);
      const x = 1 - envelope * (cosTerm + sinTerm);
      return x;
    };
  } else if (zeta === 1) {
    // Critically damped case
    return (t: number): number => {
      const envelope = Math.exp(-omega0 * t);
      const x = 1 - envelope * (1 + omega0 * t);
      return x;
    };
  } else {
    // Over-damped case
    const omega1 = omega0 * Math.sqrt(zeta * zeta - 1);
    const C1 = (omega1 + zeta * omega0) / (2 * omega1);
    const C2 = 1 - C1;

    return (t: number): number => {
      const expTerm1 = Math.exp((-zeta * omega0 + omega1) * t);
      const expTerm2 = Math.exp((-zeta * omega0 - omega1) * t);
      const x = 1 - C1 * expTerm1 - C2 * expTerm2;
      return x;
    };
  }
}

// BOUNCE
export function createBounceFunction({
  bounces,
  damping,
}: {
  bounces: number;
  damping: number;
}): (t: number) => number {
  const totalTime = 1; // Total time for the bounce function to settle
  const normalizedDamping = mapRange(damping, 0, 100, -2, 2);

  // Start at 0 and bounce to 1
  return function (time: number) {
    // Normalize time to a value between 0 and 1
    let normalizedTime = time / totalTime;
    if (normalizedTime > 1) normalizedTime = 1; // Cap normalizedTime at 1 to ensure the function doesn't exceed totalTime

    // Mathematical approximation of the bounce with damping
    const position =
      1 -
      Math.pow(1 - normalizedTime, 1.5) *
        Math.abs(Math.cos(Math.pow(normalizedTime, 2) * (bounces + 0.5) * Math.PI)) *
        Math.exp(-normalizedDamping * normalizedTime);
    return position; // Round to two decimal places
  };
}

// WIGGLE
export function createWiggleFunction({
  wiggles,
  damping,
}: {
  wiggles: number; // Natural angular frequency
  damping: number; // Damping ratio
}): (t: number) => number {
  const totalTime = 1; // Total time for the wiggle function to settle
  const normalizedDampingRatio = mapRange(damping, 0, 100, 0, 0.2); // Clamp damping ratio between 0 and 0.2

  const omega0 = (wiggles * Math.PI) / totalTime;
  const zeta = normalizedDampingRatio;
  const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);

  // Amplitude normalization
  const tMax = Math.atan(omegaD / (zeta * omega0)) / omegaD;
  const A = 1 / (Math.exp(-zeta * omega0 * tMax) * Math.sin(omegaD * tMax));

  return (t: number): number => {
    if (t < 0 || t > totalTime) {
      return 0; // Outside the time interval
    }

    // Original wiggle function
    const envelope = Math.exp(-zeta * omega0 * t);
    const wiggle = A * envelope * Math.sin(omegaD * t);

    // Easing envelope function (e.g., Hann window)
    const easingEnvelope = 0.5 * (1 + Math.cos(Math.PI * (t / totalTime)));

    // Combine wiggle and easing envelope
    const x = wiggle * easingEnvelope;

    return x;
  };
}

// OVERSHOOT
export function createOvershootFunction({
  damping,
  mass,
  style,
}: {
  damping: number; // Controls the X position of the overshoot
  mass: number; // Controls the Y extension of the overshoot
  style: OvershootStyleKey; // Style of easing
}): (t: number) => number {
  // Adjust overshoot amount based on mass
  const overshoot = Math.min(Math.max(mass, 1), 10); // You can adjust this scaling as needed

  const normalizedDamping = mapRange(damping, 0, 100, 0.5, 1); // Normalize damping to a range between 0.5 and 1
  // Adjust time based on stiffness
  const adjustTime = (t: number): number => {
    // Non-linear time adjustment
    if (style === OvershootStyle.IN_OUT) {
      if (t < 0.5) {
        return Math.pow(t * 2, 1 / normalizedDamping) / 2;
      } else {
        return 1 - Math.pow((1 - t) * 2, 1 / normalizedDamping) / 2;
      }
    } else {
      return Math.pow(t, 1 / normalizedDamping);
    }
  };

  // Base easing functions with adjusted time and overshoot
  const easeIn = (t: number): number => {
    const tAdjusted = adjustTime(t);
    return tAdjusted * tAdjusted * ((overshoot + 1) * tAdjusted - overshoot);
  };

  const easeOut = (t: number): number => {
    // use easeIn function to get the easeOut function by flipping the time
    return 1 - easeIn(1 - t);
  };

  const easeInOut = (t: number): number => {
    let tAdjusted = adjustTime(t) * 2;
    if (tAdjusted < 1) {
      return 0.5 * (tAdjusted * tAdjusted * ((overshoot * 1.525 + 1) * tAdjusted - overshoot * 1.525));
    } else {
      tAdjusted -= 2;
      return 0.5 * (tAdjusted * tAdjusted * ((overshoot * 1.525 + 1) * tAdjusted + overshoot * 1.525) + 2);
    }
  };

  // Return the appropriate function based on the style
  switch (style) {
    case OvershootStyle.IN:
      return easeIn;
    case OvershootStyle.OUT:
      return easeOut;
    case OvershootStyle.IN_OUT:
      return easeInOut;
    default:
      throw new Error("Invalid style. Must be 'IN', 'OUT', or 'IN_OUT'.");
  }
}

// Function to estimate the total time for the animation to settle
function getTotalTime(springFunc: (t: number) => number, endValue?: number): number {
  let time = 0;
  const dt = 0.016; // Start with 60 FPS time step
  let value = springFunc(time);
  let velocity = 1;
  const epsilon = 0.005; // Threshold for settling

  let endFrames = 0;

  while (Math.abs(velocity) > epsilon || endFrames < 25) {
    time += dt;
    const newValue = springFunc(time);
    velocity = (newValue - value) / dt;
    value = newValue;

    if (Math.abs(velocity) < epsilon) {
      endFrames++;
    } else {
      endFrames = 0;
    }

    // Avoid infinite loops after 100 seconds
    if (time > 25) {
      break;
    }
  }

  // if value is not 1, we need to continue until it reaches 1 (rounded to 2 decimal places)
  while (roundTo(value, 2) !== (endValue ?? 1)) {
    time += dt;
    value = roundTo(springFunc(time), 2);
  }

  // round to step of 100ms
  return Math.round(time * 10) / 10;
}

// Function to get key times (times of peaks, troughs, and inflection points)
function getKeyTimes(
  springFunc: (t: number) => number,
  totalTime: number,
  accuracy: LinearEasingAccuracyKey,
): number[] {
  // Define initial number of samples and tolerance based on accuracy level
  let initialSamples: number;
  let tolerance: number;

  switch (accuracy) {
    case LinearEasingAccuracy.LOW:
      initialSamples = 250;
      tolerance = 0.04; // Higher tolerance, fewer points
      break;
    case LinearEasingAccuracy.MEDIUM:
      initialSamples = 500;
      tolerance = 0.02;
      break;
    case LinearEasingAccuracy.HIGH:
      initialSamples = 1000;
      tolerance = 0.005;
      break;
    case LinearEasingAccuracy.ULTRA:
      initialSamples = 1000;
      tolerance = 0.001; // Lower tolerance, more points
      break;
    default:
      initialSamples = 500;
      tolerance = 0.02;
  }

  // Sample the spring function at equally spaced times
  const times: number[] = [];
  const points: { t: number; y: number }[] = [];

  for (let i = 0; i <= initialSamples; i++) {
    const t = (i / initialSamples) * totalTime;
    const y = springFunc(t);
    times.push(t);
    points.push({ t: t, y: y });
  }

  // Apply Ramer–Douglas–Peucker algorithm to reduce points
  const reducedPoints = rdp(points, tolerance);

  // Ensure the first and last points are included
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (reducedPoints[0].t !== firstPoint.t) {
    reducedPoints.unshift(firstPoint);
  }
  if (reducedPoints[reducedPoints.length - 1].t !== lastPoint.t) {
    reducedPoints.push(lastPoint);
  }

  // Extract the times from the reduced points and sort them
  const keyTimes = reducedPoints.map((point) => point.t).sort((a, b) => a - b);

  return keyTimes;
}

// Ramer–Douglas–Peucker algorithm implementation using iterative approach to save memory
function rdp(points: { t: number; y: number }[], epsilon: number): { t: number; y: number }[] {
  console.log('rdp function executed');
  const stack: { startIndex: number; endIndex: number }[] = [];
  const result = [];

  const startIndex = 0;
  const endIndex = points.length - 1;

  stack.push({ startIndex, endIndex });

  const marked = Array.from({ length: points.length }).fill(false);
  marked[startIndex] = true;
  marked[endIndex] = true;

  while (stack.length > 0) {
    const { startIndex, endIndex } = stack.pop()!;
    let maxDistance = 0;
    let index = -1;

    for (let i = startIndex + 1; i < endIndex; i++) {
      const distance = perpendicularDistance(points[i], points[startIndex], points[endIndex]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }

    if (maxDistance > epsilon && index !== -1) {
      marked[index] = true;
      stack.push({ startIndex, endIndex: index });
      stack.push({ startIndex: index, endIndex });
    }
  }

  for (let i = 0; i < marked.length; i++) {
    if (marked[i]) {
      result.push(points[i]);
    }
  }

  // Sort the result by time
  result.sort((a, b) => a.t - b.t);

  return result;
}

// Function to calculate the perpendicular distance from a point to a line segment
function perpendicularDistance(
  point: { t: number; y: number },
  lineStart: { t: number; y: number },
  lineEnd: { t: number; y: number },
): number {
  const x0 = point.t;
  const y0 = point.y;
  const x1 = lineStart.t;
  const y1 = lineStart.y;
  const x2 = lineEnd.t;
  const y2 = lineEnd.y;

  const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  return numerator / denominator;
}

export function cssStringToTailwind(cssString: string): string {
  // Convert CSS string to Tailwind CSS format
  return `ease-[${cssString.replace(/, /g, ',').replace(/ /g, '_')}]`;
}
