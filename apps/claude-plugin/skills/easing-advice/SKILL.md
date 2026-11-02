---
name: easing-advice
description: Choose suitable easing while working on CSS transitions, animations, or Tailwind motion utilities. Use for motion decisions within the requested work, not unrelated styling.
allowed-tools: mcp__plugin_easingwizard_easingwizard__get_presets, mcp__plugin_easingwizard_easingwizard__get_curve_by_id, mcp__plugin_easingwizard_easingwizard__create_bezier_curve, mcp__plugin_easingwizard_easingwizard__create_spring_curve, mcp__plugin_easingwizard_easingwizard__create_bounce_curve, mcp__plugin_easingwizard_easingwizard__create_wiggle_curve, mcp__plugin_easingwizard_easingwizard__create_overshoot_curve
---

# Easing advice

Use this guidance for a motion choice the current task actually needs. Respect the user's requested style and scope, existing motion tokens, intentional standard easings, and reduced-motion settings. Do not turn unrelated CSS work into an animation redesign.

Read the [motion guide](../../references/motion-design.md) when choosing between curve families, checking property limits, or considering accessibility. A calm interface may need a simple standard `ease-out`; a constant-speed spinner usually needs `linear`. Spring, bounce, and wiggle are alternatives for specific movement, not automatic upgrades.

When a generated curve helps, use the Easing Wizard MCP tools rather than approximating their values. Query `get_presets` filtered by type where possible. Reuse the preset's `output.css`, `output.tailwind_css`, and `links.share_url`; use `get_curve_by_id` to restore an existing ID, and the `create_*_curve` tools for custom parameters only. Follow the advertised input schema and report unavailable tools instead of inventing results.

For requested implementation, apply the returned value within the existing motion system and explain the choice briefly. For advice-only work, present a copyable example and preview link without changing files. Check `linear()` against the project's browser baseline and keep nonessential movement optional under reduced motion. JavaScript animation libraries need their own integration and are outside this skill's CSS/Tailwind scope.
