export const isNil = (val: unknown) => val === null || val === undefined;

export const isDefined = (val: unknown) => !isNil(val);

export function isAnyNil(...arr: unknown[]): boolean {
  return arr.some(isNil);
}

export function isAnyDefined(...arr: unknown[]): boolean {
  return arr.some(isDefined);
}

export function compareFlatObjects(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}
