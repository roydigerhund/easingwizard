export const roundTo = (value: number, precision: number) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export function parseNumber(val: string | number | undefined | null, integer?: boolean): number | null;
export function parseNumber<T>(val: string | number | undefined | null, integer?: boolean, fallback?: T): number | T;
export function parseNumber<T>(
  val: string | number | undefined | null,
  integer?: boolean,
  fallback?: T,
): number | null | T {
  const returnFallback = arguments.length > 2 ? (fallback as T) : null;
  if (typeof val === 'number') return isNaN(val) ? returnFallback : integer ? Math.round(val) : val;
  if (typeof val !== 'string') return returnFallback;
  const parsed = integer ? parseInt(val, 10) : parseFloat(val);
  return isNaN(parsed) ? returnFallback : parsed;
}

export const floatSafeModulo = (val: number, step: number) => {
  if (!isFinite(val) || !isFinite(step)) {
    return NaN;
  }
  const valDecCount = (val.toString().split('.')[1] || '').length;
  const stepDecCount = (step.toString().split('.')[1] || '').length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace('.', ''), 10);
  const stepInt = parseInt(step.toFixed(decCount).replace('.', ''), 10);
  return (valInt % stepInt) / Math.pow(10, decCount);
};

export const trailingZeroRegex = /[.,].*?(0+)$/;
export const checkCommaRegex = (value: string) =>
  (value.match(/[.,]$/) && !value.match(/[.,].+/)) || value.match(/[.,]0+$/);

/**
 * Linearly maps a value from one range into another.
 *
 * @param value     The input number.
 * @param fromLow   Lower bound of the input range.
 * @param fromHigh  Upper bound of the input range.
 * @param toLow     Lower bound of the target range.
 * @param toHigh    Upper bound of the target range.
 * @param clamp     If true, clamp the result to [toLow, toHigh] (default true).
 *
 * @returns The mapped (and optionally clamped) value.
 *
 * @example
 *   // UI slider 0-100 → spring ζ 0-1
 *   const zeta = mapRange(37, 0, 100, 0, 1);          // ≈ 0.37
 *
 *   // reverse:  damping ratio back to slider
 *   const slider = mapRange(zeta, 0, 1, 0, 100);       // 37
 *
 *   // overshoot mass 1-5  → slider 0-100, clamped
 *   const slider2 = mapRange(6, 1, 5, 0, 100, true);   // 100
 */
export function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number,
  clamp: boolean = true,
): number {
  if (fromHigh === fromLow) {
    throw new Error("mapRange: 'from' range cannot be zero.");
  }

  const t = (value - fromLow) / (fromHigh - fromLow); // normalised 0-1
  const mapped = toLow + t * (toHigh - toLow);

  if (!clamp) return mapped;

  return toLow < toHigh ? Math.min(Math.max(mapped, toLow), toHigh) : Math.min(Math.max(mapped, toHigh), toLow);
}
