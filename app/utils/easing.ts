import { LinearEasingAccuracy, Point } from '~/types-and-enums';
import { roundTo } from './numbers';

export function generateLinearEasing(
  easingFunction: (t: number) => number,
  accuracy: LinearEasingAccuracy,
  fixedTotalTime?: number,
) {
  const totalTime = fixedTotalTime || getTotalTime(easingFunction);
  const durationMilliSeconds = Math.round(totalTime * 1000);
  // Use the getKeyTimes function to get key times
  const keyTimes =
    accuracy === LinearEasingAccuracy.EVENLY
      ? getKeyTimesEvenly(totalTime, 100)
      : getKeyTimes(easingFunction, totalTime, accuracy);

  // Sample the bounce function at key times
  const easingValues: string[] = [];
  const sampledPoints: Point[] = [];

  for (const time of keyTimes) {
    const value = roundTo(easingFunction(time), 3);
    const timePercentage = roundTo((time / totalTime) * 100, 2);

    easingValues.push([0, 100].includes(timePercentage) ? `${value}` : `${value} ${timePercentage}%`);

    sampledPoints.push({
      x: (time / totalTime) * 100, // SVG width
      y: 100 - value * 100, // SVG height scaling (invert y-axis)
    });
  }

  // Generate the CSS linear easing function
  const easingValue = `linear(${easingValues.join(', ')})`;

  return { easingValue, sampledPoints, durationMilliSeconds };
}

// SPRING

// Function to create the spring function based on the parameters
export function createSpringFunction({
  stiffness,
  damping,
  initialVelocity = 0,
}: {
  stiffness: number;
  damping: number;
  initialVelocity?: number;
}) {
  const mass = 1;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = w0 * Math.sqrt(Math.abs(1 - zeta * zeta));
  const a = 1;
  const b = (zeta * w0 + -initialVelocity) / wd;

  return function (time: number) {
    if (zeta < 1) {
      // Underdamped
      return 1 - Math.exp(-zeta * w0 * time) * (a * Math.cos(wd * time) + b * Math.sin(wd * time));
    } else if (zeta === 1) {
      // Critically damped
      return 1 - Math.exp(-w0 * time) * (a + (-w0 * time + initialVelocity) * time);
    } else {
      // Overdamped
      const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
      const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
      const c1 = (initialVelocity - r2) / (r1 - r2);
      const c2 = 1 - c1;
      return 1 - c1 * Math.exp(r1 * time) - c2 * Math.exp(r2 * time);
    }
  };
}

// BOUNCE

// Function to create the bounce function based on the parameters
export function createBounceFunction({
  bounces,
  damping,
}: {
  bounces: number;
  damping: number;
}): (t: number) => number {
  const totalTime = 1; // Total time for the bounce function to settle

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
        Math.exp(-damping * normalizedTime);
    return position; // Round to two decimal places
  };
}

// WIGGLE

// Function to create the wiggle function based on the parameters
export function createWiggleFunction({
  mass = 1,
  stiffness,
  damping,
  initialVelocity = 0,
}: {
  mass?: number;
  stiffness: number;
  damping: number;
  initialVelocity?: number;
}) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = w0 * Math.sqrt(Math.abs(1 - zeta * zeta));
  const a = 0;
  const b = (zeta * w0 + -initialVelocity) / wd;

  return function (time: number) {
    if (zeta < 1) {
      // Underdamped
      return 1 - Math.exp(-zeta * w0 * time) * (a * Math.cos(wd * time) + b * Math.sin(wd * time));
    } else if (zeta === 1) {
      // Critically damped
      return 1 - Math.exp(-w0 * time) * (a + (-w0 * time + initialVelocity) * time);
    } else {
      // Overdamped
      const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
      const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
      const c1 = (initialVelocity - r2) / (r1 - r2);
      const c2 = 1 - c1;
      return 1 - c1 * Math.exp(r1 * time) - c2 * Math.exp(r2 * time);
    }
  };
}

// Function to estimate the total time for the animation to settle
function getTotalTime(springFunc: (t: number) => number) {
  let time = 0;
  const dt = 0.016; // Start with 60 FPS time step
  let value = springFunc(time);
  let velocity = 1;
  const epsilon = 0.0001; // Threshold for settling

  while (Math.abs(velocity) > epsilon) {
    time += dt;
    const newValue = springFunc(time);
    velocity = (newValue - value) / dt;
    value = newValue;

    // Avoid infinite loops after 25 seconds
    if (time > 25) {
      break;
    }
  }

  // if value is not 1, we need to continue until it reaches 1 (rounded to 2 decimal places)
  while (roundTo(value, 3) !== 1) {
    time += dt;
    value = roundTo(springFunc(time), 3);
  }

  return time;
}

// Function to get key times (times of peaks, troughs, and inflection points)
function getKeyTimes(springFunc: (t: number) => number, totalTime: number, accuracy: LinearEasingAccuracy): number[] {
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

// Function to get key times evenly
function getKeyTimesEvenly(totalTime: number, numPoints: number) {
  const times = [];

  // For underdamped, we can calculate peaks at specific intervals
  const numSamples = numPoints;
  const dt = totalTime / numSamples;

  for (let i = 0; i <= numSamples; i++) {
    const t = i * dt;
    times.push(t);
  }

  return times;
}

// Ramer–Douglas–Peucker algorithm implementation using iterative approach to save memory
function rdp(points: { t: number; y: number }[], epsilon: number): { t: number; y: number }[] {
  console.log('rdp function executed');
  const stack: { startIndex: number; endIndex: number }[] = [];
  const result = [];

  const startIndex = 0;
  const endIndex = points.length - 1;

  stack.push({ startIndex, endIndex });

  const marked = new Array(points.length).fill(false);
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
