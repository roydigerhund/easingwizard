/**
 * Lightweight CSS linter for the Animation Creator.
 *
 * Provides two linters:
 *  - `lintKeyframesCSS`  – validates a @keyframes block
 *  - `lintAnimationValue` – validates an animation shorthand value
 *
 * Each returns an array of `LintDiagnostic` objects which the CssEditor
 * component renders below the editor textarea.
 */

export interface LintDiagnostic {
  severity: 'error' | 'warning';
  line?: number;
  message: string;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Returns the 1-based line number of the character at position `index`. */
function lineOfIndex(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

// ---------------------------------------------------------------------------
// @keyframes linter
// ---------------------------------------------------------------------------
const VALID_CSS_PROPERTY = /^-?[a-z][a-z0-9-]*$/;
const VALID_PERCENTAGE = /^(from|to|\d{1,3}(\.\d+)?%)$/;

/** Validates a full @keyframes CSS block. */
export function lintKeyframesCSS(css: string): LintDiagnostic[] {
  const diags: LintDiagnostic[] = [];
  const trimmed = css.trim();

  if (!trimmed) {
    diags.push({ severity: 'error', message: 'Keyframes block is empty' });
    return diags;
  }

  // ── Brace balance ──────────────────────────────────────────────────────────
  let depth = 0;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    // Skip comments
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end >= 0 ? end + 1 : css.length;
      continue;
    }
    // Skip strings
    if (ch === '"' || ch === "'") {
      const close = css.indexOf(ch, i + 1);
      i = close >= 0 ? close : css.length;
      continue;
    }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth < 0) {
        diags.push({ severity: 'error', line: lineOfIndex(css, i), message: 'Unexpected "}"' });
        return diags; // Cannot reliably continue after unmatched }
      }
    }
  }
  if (depth > 0) {
    diags.push({ severity: 'error', line: css.split('\n').length, message: '"}" expected' });
  }

  // ── @keyframes rule ────────────────────────────────────────────────────────
  const atMatch = /(@keyframes)\s*/.exec(trimmed);
  if (!atMatch) {
    diags.push({ severity: 'error', line: 1, message: 'Expected a @keyframes rule' });
    return diags;
  }

  // Animation name must follow immediately after @keyframes whitespace
  const afterAt = trimmed.slice(atMatch.index + atMatch[0].length);
  const nameMatch = /^([\w-]+)/.exec(afterAt);
  if (!nameMatch) {
    diags.push({
      severity: 'error',
      line: lineOfIndex(css, (atMatch.index ?? 0) + atMatch[0].length),
      message: 'Missing animation name after @keyframes',
    });
  }

  // ── Keyframe stops ─────────────────────────────────────────────────────────
  // Extract the outer block content (between first { and last })
  const outerOpen = css.indexOf('{');
  const outerClose = css.lastIndexOf('}');
  if (outerOpen < 0 || outerClose < 0 || outerOpen >= outerClose) {
    // Brace errors already reported above
    return diags;
  }
  const outerBody = css.slice(outerOpen + 1, outerClose);

  // Find all stop blocks: selector { … }
  const stopBlockRe = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  let stopCount = 0;

  while ((match = stopBlockRe.exec(outerBody)) !== null) {
    stopCount++;
    const selectorPart = match[1].trim();
    const bodyPart = match[2];
    const stopLine = lineOfIndex(css, outerOpen + 1 + (match.index ?? 0));

    // Validate stop selector(s) — can be comma-separated
    for (const stopRaw of selectorPart.split(',')) {
      const stop = stopRaw.trim();
      if (!VALID_PERCENTAGE.test(stop)) {
        diags.push({
          severity: 'error',
          line: stopLine,
          message: `Invalid keyframe stop "${stop}" — use 0%, 50%, 100%, "from", or "to"`,
        });
      }
    }

    // Validate property declarations inside the stop block
    const declRe = /([^:;{}]+)(?::([^;{}]*))?;/g;
    let declMatch: RegExpExecArray | null;
    while ((declMatch = declRe.exec(bodyPart)) !== null) {
      const propRaw = declMatch[1].trim();
      if (!propRaw) continue;
      // Accept vendor-prefixed properties (e.g. -webkit-transform) and
      // skip them before running the stricter identifier regex
      if (propRaw.startsWith('-')) continue;
      if (!VALID_CSS_PROPERTY.test(propRaw)) {
        diags.push({
          severity: 'error',
          line: stopLine,
          message: `Invalid property name: "${propRaw}"`,
        });
      }
    }
  }

  if (stopCount === 0 && depth === 0) {
    diags.push({ severity: 'warning', message: 'No keyframe stops defined (e.g. 0% { } 100% { })' });
  }

  return diags;
}

// ---------------------------------------------------------------------------
// Animation shorthand linter
// ---------------------------------------------------------------------------

/** Validates an animation shorthand value (the part after "animation:"). */
export function lintAnimationValue(value: string): LintDiagnostic[] {
  const diags: LintDiagnostic[] = [];
  const trimmed = value.trim();

  if (!trimmed) {
    diags.push({ severity: 'error', message: 'Animation property is empty' });
    return diags;
  }

  // Tokenize, ignoring content inside parentheses (e.g. cubic-bezier(...))
  const tokens: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of trimmed) {
    if (ch === '(') { depth++; cur += ch; continue; }
    if (ch === ')') { depth--; cur += ch; continue; }
    if (depth > 0) { cur += ch; continue; }
    if (ch === ' ' || ch === '\t') {
      if (cur) { tokens.push(cur); cur = ''; }
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);

  if (tokens.length === 0) {
    diags.push({ severity: 'error', message: 'Animation property is empty' });
    return diags;
  }

  // There must be at least one time value for duration
  const timeRe = /^-?\d+(\.\d+)?(s|ms)$/;
  const hasTime = tokens.some((t) => timeRe.test(t) || t === '0');
  if (!hasTime) {
    diags.push({
      severity: 'warning',
      message: 'No duration found — add a time value like "3s" or "300ms"',
    });
  }

  // First token that is not a time value / CSS keyword is treated as the animation name
  const cssKeywords = new Set([
    'none', 'initial', 'inherit', 'unset', 'revert',
    'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear',
    'step-start', 'step-end', 'infinite', 'normal', 'reverse',
    'alternate', 'alternate-reverse', 'forwards', 'backwards',
    'both', 'paused', 'running',
  ]);
  const nameToken = tokens.find((t) => !timeRe.test(t) && t !== '0' && !cssKeywords.has(t) && !/^cubic-bezier/.test(t) && !/^steps/.test(t));
  if (!nameToken) {
    diags.push({
      severity: 'warning',
      message: 'No animation name found — add the @keyframes name (e.g. "CustomSlide")',
    });
  }

  return diags;
}
