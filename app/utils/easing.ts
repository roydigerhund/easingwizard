import { defaultBounceFunction, defaultSpringFunction } from '~/components/EasingSelection';
import { LinearEasingAccuracy, Point } from '~/types-and-enums';
import { roundTo } from './numbers';

export const { easingValue: defaultSpringValue } = generateLinearEasing(
  createSpringFunction(defaultSpringFunction),
  LinearEasingAccuracy.HIGH,
);

export const { easingValue: defaultBounceValue } = generateLinearEasing(
  createBounceFunction(defaultBounceFunction),
  LinearEasingAccuracy.HIGH,
);

export function generateLinearEasing(easingFunction: (t: number) => number, accuracy: LinearEasingAccuracy) {
  const totalTime = getTotalTime(easingFunction);
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

// BOUNCE

// Function to create the bounce function based on the parameters
export function createBounceFunction({
  bounces,
  restitution,
  initialHeight,
}: {
  bounces: number;
  restitution: number;
  initialHeight: number;
}): (t: number) => number {
  const g = 9.81; // Acceleration due to gravity (m/s^2)
  const times: number[] = []; // Times at which each bounce occurs
  const heights: number[] = []; // Maximum heights for each bounce

  // Calculate the times and heights for each bounce
  let h = initialHeight;
  let totalTime = 0;

  for (let i = 0; i < bounces; i++) {
    const tUp = Math.sqrt((2 * h) / g);
    const bounceTime = 2 * tUp; // Time up and down
    totalTime += bounceTime;
    times.push(totalTime);
    heights.push(h);

    // Update the height for the next bounce
    h *= restitution ** 2; // Energy loss on each bounce
  }

  // Return the bounce function
  return function (t: number): number {
    t = Math.max(0, Math.min(1, t)); // Clamp t between 0 and 1
    const scaledTime = t * totalTime;

    // Find which bounce we're in
    let cumulativeTime = 0;
    for (let i = 0; i < times.length; i++) {
      const hMax = heights[i];
      const tUp = Math.sqrt((2 * hMax) / g);
      const bounceTime = 2 * tUp;

      if (scaledTime <= cumulativeTime + bounceTime) {
        const timeSinceBounceStart = scaledTime - cumulativeTime;

        if (timeSinceBounceStart <= tUp) {
          // Ascending part
          const tAscend = timeSinceBounceStart;
          const v0 = Math.sqrt(2 * g * hMax);
          const y = v0 * tAscend - 0.5 * g * tAscend ** 2;
          const progress = 1 - y / initialHeight;
          return progress;
        } else {
          // Descending part
          const tDescend = timeSinceBounceStart - tUp;
          const y = hMax - 0.5 * g * tDescend ** 2;
          const progress = 1 - y / initialHeight;
          return progress;
        }
      }
      cumulativeTime += bounceTime;
    }

    // After the last bounce
    return 1;
  };
}

// SPRING

// Function to create the spring function based on the parameters
export function createSpringFunction({
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

// Ramer–Douglas–Peucker algorithm implementation
function rdp(points: { t: number; y: number }[], epsilon: number): { t: number; y: number }[] {
  if (points.length < 3) {
    return points;
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  let index = -1;
  let maxDistance = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], firstPoint, lastPoint);
    if (distance > maxDistance) {
      index = i;
      maxDistance = distance;
    }
  }

  if (maxDistance > epsilon) {
    // Recursive call
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);

    // Combine results, remove duplicate point at index
    return left.slice(0, left.length - 1).concat(right);
  } else {
    // No point is far enough to keep, return start and end points
    return [firstPoint, lastPoint];
  }
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
