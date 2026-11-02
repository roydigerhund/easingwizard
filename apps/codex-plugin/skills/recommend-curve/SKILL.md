---
name: recommend-curve
description: Recommend a CSS easing curve for a requested animation feel or UI interaction, with CSS, Tailwind output, and a preview link.
---

# Recommend a curve

Recommend motion for the element, animated property, and feeling the user describes. Use the supplied context; ask only when a missing detail changes the choice. A recommendation request alone does not authorize editing files.

Read the [motion guide](../../references/motion-design.md) for property limits, reduced motion, and common pattern choices. Keep a suitable existing easing or design token, including standard CSS keywords. Constant-speed spinners usually need `linear`.

Use the Easing Wizard MCP server to retrieve real values:

- Call `get_presets` with a relevant `type` (`BEZIER`, `SPRING`, `BOUNCE`, `WIGGLE`, or `OVERSHOOT`) when known; omit the filter only when comparing types.
- Select a preset by its returned `curve` and, where present, `style`. Use `output.css`, `output.tailwind_css`, and `links.share_url` directly. Presets already contain these values; do not regenerate them or invent extra arguments.
- For an existing curve ID, use `get_curve_by_id`. Call a `create_*_curve` tool only for a custom curve, using its advertised input schema.
- If the MCP tools are unavailable, report that limitation. Do not invent generated values or claim a preview was tested.

Present the curve and a short reason, followed by copyable CSS and Tailwind code blocks and the returned preview link. Treat `suggested_duration_ms`, when returned, as a starting range to preview in the actual UI, not a measured optimum. Mention reduced-motion behavior when recommending nonessential movement. Do not add unsupported scientific percentages or claim that a visual preview was inspected unless it was.
