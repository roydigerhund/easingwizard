/**
 * Utilities for swapping the animated CSS property inside a @keyframes block
 * when the user changes the Preview animation type.
 *
 * Rule: only the property name / transform function changes; the argument
 * values inside each keyframe stop are preserved verbatim.
 *
 * Example (MOVE_X → OPACITY):
 *   transform: translateX(-100%)  →  opacity: -100%
 *
 * Example (MOVE_X → SCALE):
 *   transform: translateX(-100%)  →  transform: scale(-100%)
 */
import { AnimationType, type AnimationTypeKey } from 'easingwizard-core';

interface CssPattern {
  /**
   * Regex that matches the full CSS property expression (without the trailing
   * semicolon) and captures the value argument in group 1.
   *
   * Designed so that `body.replace(extractRe, format(match[1]))` substitutes
   * the property while leaving the semicolon and surrounding whitespace intact.
   */
  extractRe: RegExp;
  /** Produces the replacement property expression given the extracted value. */
  format: (value: string) => string;
}

/**
 * Priority-ordered patterns.  The first pattern that matches a keyframe stop
 * body is used; subsequent patterns are skipped for that stop.
 *
 * Negative lookbehind `(?<![a-zA-Z-])` prevents ambiguous matches such as
 * matching `width` inside `border-width` or `height` inside `min-height`.
 */
const PATTERNS: Record<AnimationTypeKey, CssPattern> = {
  [AnimationType.MOVE_X]: {
    extractRe: /transform\s*:\s*translateX\(([^)]*)\)/,
    format: (v) => `transform: translateX(${v})`,
  },
  [AnimationType.MOVE_Y]: {
    extractRe: /transform\s*:\s*translateY\(([^)]*)\)/,
    format: (v) => `transform: translateY(${v})`,
  },
  [AnimationType.SCALE]: {
    // Matches `scale(…)` but not `scaleX`, `scaleY`, `scale3d`
    extractRe: /transform\s*:\s*scale\(([^)]*)\)/,
    format: (v) => `transform: scale(${v})`,
  },
  [AnimationType.ROTATE]: {
    // Negative lookahead avoids matching `rotateX` / `rotateY` (case-insensitive for robustness)
    extractRe: /transform\s*:\s*rotate(?![XYxy])\(([^)]*)\)/i,
    format: (v) => `transform: rotate(${v})`,
  },
  [AnimationType.ROTATE_X]: {
    extractRe: /transform\s*:\s*rotateX\(([^)]*)\)/,
    format: (v) => `transform: rotateX(${v})`,
  },
  [AnimationType.ROTATE_Y]: {
    extractRe: /transform\s*:\s*rotateY\(([^)]*)\)/,
    format: (v) => `transform: rotateY(${v})`,
  },
  [AnimationType.OPACITY]: {
    // `(?<![a-zA-Z-])` prevents matching e.g. `-webkit-opacity`
    extractRe: /(?<![a-zA-Z-])opacity\s*:\s*([^;}\n]+)/,
    format: (v) => `opacity: ${v}`,
  },
  [AnimationType.WIDTH]: {
    // `(?<![a-zA-Z-])` prevents matching `border-width`, `min-width`, etc.
    extractRe: /(?<![a-zA-Z-])width\s*:\s*([^;}\n]+)/,
    format: (v) => `width: ${v}`,
  },
  [AnimationType.HEIGHT]: {
    extractRe: /(?<![a-zA-Z-])height\s*:\s*([^;}\n]+)/,
    format: (v) => `height: ${v}`,
  },
  [AnimationType.SHAPE]: {
    extractRe: /border-radius\s*:\s*([^;}\n]+)/,
    format: (v) => `border-radius: ${v}`,
  },
};

/**
 * Replaces the animated CSS property in every keyframe stop of a @keyframes
 * block with the property/function used by `toType`, while keeping the
 * existing argument values unchanged.
 *
 * Only the **first** recognised property in each stop block is replaced;
 * all other declarations (e.g. `border-width`, comments) are left intact.
 * If no known property is found in a stop, that stop is left unchanged.
 *
 * @param css    Full @keyframes CSS string authored in the Animation Creator.
 * @param toType Target AnimationTypeKey to switch to.
 * @returns Updated CSS string (original is returned if nothing was matched).
 */
export function swapKeyframesAnimationType(css: string, toType: AnimationTypeKey): string {
  const toPattern = PATTERNS[toType];

  // Match each keyframe stop block:
  //   `0% { … }`, `from { … }`, `50%, 100% { … }`, etc.
  // Capture groups:
  //   1 – opening part including `{`
  //   2 – stop body (content between braces, no nested braces)
  //   3 – closing `}`
  return css.replace(
    /((?:(?:\d+(?:\.\d+)?%|from|to)(?:\s*,\s*(?:\d+(?:\.\d+)?%|from|to))*)\s*\{)([^{}]*)(\})/g,
    (full, openTag: string, body: string, closeTag: string) => {
      for (const pattern of Object.values(PATTERNS)) {
        const match = pattern.extractRe.exec(body);
        if (!match) continue;

        const value = match[1].trim();
        // Replace only the matched property expression; the trailing semicolon
        // and surrounding whitespace are preserved automatically.
        const newBody = body.replace(pattern.extractRe, toPattern.format(value));
        return `${openTag}${newBody}${closeTag}`;
      }

      // No known property found in this stop – leave unchanged.
      return full;
    },
  );
}
