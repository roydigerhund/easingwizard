---
name: audit-easings
description: Review CSS, component styles, and Tailwind animations for inappropriate easing, inconsistent motion, and reduced-motion gaps. Return findings without editing files.
allowed-tools: mcp__plugin_easingwizard_easingwizard__get_presets, mcp__plugin_easingwizard_easingwizard__get_curve_by_id, mcp__plugin_easingwizard_easingwizard__create_bezier_curve, mcp__plugin_easingwizard_easingwizard__create_spring_curve, mcp__plugin_easingwizard_easingwizard__create_bounce_curve, mcp__plugin_easingwizard_easingwizard__create_wiggle_curve, mcp__plugin_easingwizard_easingwizard__create_overshoot_curve
disable-model-invocation: true
---

# Audit easings

Review the requested scope without modifying it. Search authored CSS/SCSS/Less, component styles, CSS-in-JS, and Tailwind transition/animation utilities. Exclude dependencies, generated output, and vendor files. Inspect surrounding code, keyframes, design tokens, framework configuration, and reduced-motion rules before judging a match.

Read the [motion guide](../../references/motion-design.md). A standard keyword or an omitted timing function is not itself a defect: determine the effective value from shorthands, cascade, inheritance where applicable, and framework defaults. Preserve intentional `linear` spinners, established motion tokens, and appropriate custom curves. Distinguish a demonstrable problem from an optional design alternative.

Prioritize findings that affect behavior: overshoot applied to a bounded property, inconsistent curves within one interaction, distracting repeated movement, a missing reduced-motion alternative, or an easing at odds with an explicit design goal. Check the target browser baseline before treating CSS `linear()` as available. Keep JavaScript animation-library migrations outside this CSS/Tailwind audit unless the user expands the scope.

For a finding that benefits from a replacement, call `get_presets` with the relevant type and reuse the returned `output.css`, `output.tailwind_css`, and `links.share_url`. Use `get_curve_by_id` for an existing Easing Wizard ID. Only create a custom curve when presets do not fit; pass only parameters in the advertised tool schema. Reuse one returned preset for repeated findings rather than generating it again.

Report the inspected scope and concrete findings with file/line, observed behavior, impact, and an actionable suggestion. Include a preview link when a curve is suggested. Keep optional alternatives separate from defects; an audit with no findings is valid. State whether the observations come from code inspection or a rendered animation, and list any material verification limits.
