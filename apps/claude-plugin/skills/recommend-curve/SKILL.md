---
name: recommend-curve
description: Recommend an easing curve for a specific animation feel or UI pattern. Use when asking "what easing for a dropdown?", "suggest a spring curve", "I want it to feel snappy", or describing how a transition should feel.
allowed-tools: mcp__easingwizard__get_presets, mcp__easingwizard__create_bezier_curve, mcp__easingwizard__create_spring_curve, mcp__easingwizard__create_bounce_curve, mcp__easingwizard__create_wiggle_curve, mcp__easingwizard__create_overshoot_curve
disable-model-invocation: true
---

# Animation Consultant

The user wants an easing curve recommendation. Follow this process:

## Step 1: Understand the Request

Ask the user (if not already clear) what animation they're building. What element is being animated? What feeling should it convey? (e.g., "snappy," "gentle," "playful," "professional")

## Step 2: Search Presets First

Use the `get_presets` tool to retrieve all available presets. Match the user's description to the most appropriate preset based on:

- **Type matching:** Snappy/responsive → SPRING. Bouncy/playful → BOUNCE. Oscillating/attention → WIGGLE. Overshoot/elastic → OVERSHOOT. Smooth/subtle → BEZIER.
- **Curve variant matching:** Match descriptive words to variant names (e.g., "snappy" → SNAP spring, "gentle" → SOFT overshoot, "subtle" → SUBTLE bounce).
- **Style matching (Bezier/Overshoot):** Entrance animations → OUT (decelerating). Exit animations → IN (accelerating). State changes → IN_OUT.

## Step 3: Recommend

If a preset matches well, recommend it with clear reasoning connecting the curve's physics to the desired feel.

Only generate a custom curve (via create tools) if no preset adequately matches the description.

Always call with `verbose: true` to include the preview link.

## Step 4: Output Format

Present the recommendation in this format:

**Recommendation:** [Preset name or "Custom curve"]
**Type:** [BEZIER/SPRING/BOUNCE/WIGGLE/OVERSHOOT]
**Why:** [1-2 sentences connecting the curve physics to the desired feel]

**CSS:**
```css
transition-timing-function: [value];
```

**Tailwind:**
```html
class="[ease-[...] class]"
```

**Preview:** [easingwizard.com share URL]

IMPORTANT: Always present CSS and Tailwind values inside fenced code blocks (triple backticks) with the appropriate language tag (css, html). This makes them easy to copy. Never output them as plain text.
