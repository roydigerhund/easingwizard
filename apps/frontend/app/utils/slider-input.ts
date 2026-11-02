export function stepPrecision(step: number): number {
  const [coefficient, exponent = '0'] = step.toString().split('e');
  return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent));
}

/** Keep incomplete decimal input editable while only emitting finite numbers. */
export function parseSliderInput(
  text: string,
  { min, max, step }: { min: number; max: number; step: number },
): { text: string; value?: number } | null {
  if (!/^-?\d*(?:[.,]\d*)?$/.test(text)) return null;

  const normalized = text.replace(',', '.');
  const precision = stepPrecision(step);
  if ((normalized.split('.')[1]?.length ?? 0) > precision) return null;
  if (normalized.includes('.') && precision === 0) return null;
  if (!/\d/.test(normalized)) return { text };

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  const clamped = Math.min(Math.max(parsed, min), max);
  const snapped = Number((Math.round(clamped / step) * step).toFixed(precision));
  const value = Math.min(Math.max(snapped, min), max);

  // Preserve decimal commas, trailing zeros, and '-0,' while the user types.
  // If range/step correction was necessary, display the actual emitted value.
  return { text: value === parsed ? text : String(value), value };
}
