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
export const checkCommaRegex = (value: string) => (value.match(/[.,]$/) && !value.match(/[.,].+/)) || value.match(/[.,]0+$/);