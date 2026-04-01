---
name: improve-easings
description: Add or improve easing curves in specific CSS or Tailwind files. Use when asking "improve the transitions in this file", "replace the default ease", "add easing to my animations", or "make this animation snappier".
allowed-tools: mcp__easingwizard__get_presets, mcp__easingwizard__create_bezier_curve, mcp__easingwizard__create_spring_curve, mcp__easingwizard__create_bounce_curve, mcp__easingwizard__create_wiggle_curve, mcp__easingwizard__create_overshoot_curve
disable-model-invocation: true
---

# Apply Easing to Code

The user wants to add or improve easing in their CSS or Tailwind code.

## Step 1: Identify the Target

Read the file(s) the user specifies. If no file is specified, ask which file to modify.

Look for:
- CSS `transition` and `transition-timing-function` properties
- CSS `animation` and `animation-timing-function` properties
- Tailwind CSS `ease-*` and `ease-[...]` utility classes
- Tailwind CSS `transition-*` utilities without an easing class

## Step 2: Assess Current Easings

For each animation/transition found, categorize the current easing:
- **Browser default** — `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`, or no easing specified
- **Custom** — `cubic-bezier(...)`, `linear(...)`, or `ease-[...]` with custom values

## Step 3: Determine Replacements

For browser defaults or missing easings, determine the best replacement by analyzing:
- The CSS property being animated (opacity, transform, width, etc.)
- The context (hover state, modal, dropdown, page transition, etc.)
- The user's stated intent if provided (e.g., "make it bouncier")

Use the MCP tools to generate the appropriate curve. Prefer presets via `get_presets` before creating custom curves.

## Step 4: Apply Changes

Modify the code directly:
- For CSS: Replace or add the `transition-timing-function` or `animation-timing-function` value
- For CSS shorthand: Update the easing value within `transition: property duration easing` or `animation: name duration easing`
- For Tailwind: Replace or add the `ease-[...]` utility class

## Supported Formats

- CSS `transition-timing-function` / `animation-timing-function`
- CSS shorthand `transition` / `animation`
- Tailwind CSS `ease-*` and `ease-[...]` utilities

## Not Supported

- JavaScript animation libraries (Framer Motion, GSAP, anime.js) — not in scope for this version
