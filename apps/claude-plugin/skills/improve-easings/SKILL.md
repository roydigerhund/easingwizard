---
name: improve-easings
description: Implement requested CSS or Tailwind easing improvements in specified files while preserving design intent, motion tokens, and reduced-motion behavior.
allowed-tools: mcp__plugin_easingwizard_easingwizard__get_presets, mcp__plugin_easingwizard_easingwizard__get_curve_by_id, mcp__plugin_easingwizard_easingwizard__create_bezier_curve, mcp__plugin_easingwizard_easingwizard__create_spring_curve, mcp__plugin_easingwizard_easingwizard__create_bounce_curve, mcp__plugin_easingwizard_easingwizard__create_wiggle_curve, mcp__plugin_easingwizard_easingwizard__create_overshoot_curve
disable-model-invocation: true
---

# Improve easings

Apply the requested animation changes in the user's target files or interaction. Infer the target from supplied context; clarify an unresolved target before editing. A review-only request calls for findings, not changes.

Read the [motion guide](../../references/motion-design.md). Inspect the current behavior, animated properties, timing, design tokens, keyframes, and reduced-motion rules. Standard keywords and omitted timing functions can be intentional. Do not replace all defaults mechanically, change a constant-speed spinner to an eased loop, or override an established motion system merely to introduce a generated curve.

Use Easing Wizard MCP tools for exact values. Query `get_presets` with the relevant type, then reuse `output.css` and `output.tailwind_css` from the chosen preset. Resolve an existing curve ID with `get_curve_by_id`. Create a custom curve only when the requested feel requires it, using parameters from that tool's advertised schema. Preview links are returned as `links.share_url`; no additional flag is required.

Update only the relevant easing declarations, shorthand entries, or Tailwind classes. Preserve separate properties, delays, durations, animation names, iteration counts, directions, and responsive/state modifiers. For comma-separated animations, change the matching item. Prefer existing tokens or a shared token over duplicated long values when that fits the project. Check the project's browser baseline for `linear()` support and use its fallback conventions where needed.

Keep reduced-motion alternatives effective, including `prefers-reduced-motion` and Tailwind `motion-reduce`/`motion-safe`. When adding nonessential movement, provide an appropriate reduced-motion alternative. Do not add oscillation to opacity, color, or other bounded values; separate transform movement from a fade if the requested effect needs both.

Check the edited CSS or component with the project's existing checks and inspect the rendered interaction when available. Report what changed, why it fits, and what was actually verified. If no change is justified, explain why the current easing is suitable. This skill does not authorize publishing, deployment, or a migration to a JavaScript animation library.
