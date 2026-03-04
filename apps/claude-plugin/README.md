# Easing Wizard — Claude Code Plugin

Easing Wizard helps developers replace generic CSS easing defaults with professional motion design curves. It provides 7 MCP tools for generating Bezier, Spring, Bounce, Wiggle, and Overshoot curves with 68 presets covering common UI patterns. Output includes CSS (cubic-bezier/linear()), Tailwind classes, and interactive preview links. Three skills let you describe an animation feel and get a curve recommendation, scan files to upgrade default easings, or audit your entire project for animation improvements. An animation expert agent provides motion design advice grounded in perceptual psychology.

## Use Cases

1. **Describe the feel, get the curve.** A developer types `/easingwizard:recommend-curve snappy dropdown menu` and receives a Spring SNAP preset recommendation with ready-to-paste CSS, a Tailwind utility class, and a visual preview link — no manual curve tweaking needed.
2. **Upgrade easings in existing code.** A developer points `/easingwizard:improve-easings` at a component file full of `transition: all 0.3s ease`. The plugin analyzes each transition's context (hover state, modal entrance, toggle) and replaces browser defaults with matched professional curves directly in the file.
3. **Audit an entire project's animations.** Running `/easingwizard:audit-easings` scans all CSS, SCSS, and Tailwind files across the codebase, identifies every animation using default or missing easings, and produces a prioritized report with specific preset suggestions and preview links for each finding.

## Skills

- `/easingwizard:recommend-curve` — Describe the feel you want, get a curve recommendation with CSS + Tailwind output and a preview link
- `/easingwizard:improve-easings` — Add or improve easing in your CSS/Tailwind code
- `/easingwizard:audit-easings` — Scan your project for animation improvements

Claude also automatically suggests appropriate easing curves when you're writing CSS transitions or animations (via the `easing-advice` skill).

## MCP Tools

7 tools for generating Bezier, Spring, Bounce, Wiggle, and Overshoot curves with CSS and Tailwind output.

## Animation Expert Agent

A specialist agent with deep knowledge of motion design principles and perceptual psychology, automatically consulted for animation questions.
