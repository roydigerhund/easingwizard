---
name: audit-easings
description: Scan your project's CSS and Tailwind for animation easing improvements
allowed-tools: mcp__easingwizard__get_presets, mcp__easingwizard__create_bezier_curve, mcp__easingwizard__create_spring_curve, mcp__easingwizard__create_bounce_curve, mcp__easingwizard__create_wiggle_curve, mcp__easingwizard__create_overshoot_curve
disable-model-invocation: true
---

# Easing Audit

The user wants a comprehensive review of their project's animation easings.

## Step 1: Scan the Project

Search for animation and transition properties across the codebase:

1. Search for CSS files (`.css`, `.scss`, `.sass`, `.less`) containing `transition` or `animation` properties
2. Search for component files (`.jsx`, `.tsx`, `.vue`, `.svelte`) containing Tailwind easing classes (`ease-`, `transition-`) or inline style animation properties
3. Search for CSS-in-JS patterns (`style=`, `css=`, `styled.`) with transition/animation values

## Step 2: Categorize Findings

For each animation/transition found, categorize:
- **Defaults** — Using `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out` (browser defaults, likely unintentional)
- **Custom** — Using `cubic-bezier(...)`, `linear(...)`, or Tailwind `ease-[...]` (intentional choices)
- **Missing** — Animations/transitions with no easing specified (falls back to browser default `ease`)

## Step 3: Generate Suggestions

For each default or missing easing, suggest a specific Easing Wizard curve replacement. Base suggestions on:
- The CSS property being animated (opacity → subtle, transform → responsive, etc.)
- The surrounding code context (hover → quick ease-out, modal → spring, etc.)
- Motion design best practices

Use `get_presets` with `verbose: true` to get share URLs for each suggested preset.

Only use curve creation tools if no preset is a good match.

## Step 4: Output the Report

Present findings as a structured markdown report:

```
## Easing Audit Report

### Summary
- **X** animations/transitions found
- **Y** using browser defaults
- **Z** with no easing specified
- **W** using custom easings

### Findings

| File | Line | Property | Current | Suggested | Reasoning | Preview |
|------|------|----------|---------|-----------|-----------|---------|
| src/App.css | 12 | transition | ease | Spring SNAP | Hover state benefits from responsive spring feel | [Preview](url) |
| ... | ... | ... | ... | ... | ... | ... |

### Recommendations
[Prioritized list of highest-impact improvements, starting with the most visible/frequently triggered animations]
```
