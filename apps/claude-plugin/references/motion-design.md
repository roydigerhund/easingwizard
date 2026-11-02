# Motion choices for Easing Wizard

These are starting points for CSS and Tailwind work. The user's design direction, existing motion tokens, and actual interaction take precedence over a preset mapping.

| Purpose | Starting point | Check before applying |
| --- | --- | --- |
| An element arrives and settles | Standard ease-out, Bezier CUBIC/QUART OUT, or Spring GLIDE | Distance, duration, and surrounding motion |
| An element exits | Short ease-in or Bezier CUBIC IN | Feedback must still be immediate |
| A state or position changes | Bezier SINE/CUBIC IN_OUT | Coordinate related elements; stagger only when it conveys order |
| A small menu or control moves | Spring SNAP or short ease-out | Spring motion is optional and should suit the style |
| A transform needs a playful settle | Overshoot SOFT OUT or Bounce SUBTLE | Keep amplitude modest; separate from opacity/color |
| A continuous spinner rotates | Standard `linear` | Preserve constant angular speed across loop boundaries |
| Validation needs emphasis | Text/icon feedback; optional Wiggle SUBTLE | Do not rely on movement alone; provide reduced motion |
| A subtle fade or color changes | Standard easing or Bezier SINE/QUAD | Bounded values can clamp overshoot |

Bezier `IN`, `OUT`, and `IN_OUT` describe acceleration, deceleration, and a combination. Choose for the actual start/end behavior rather than a universal entrance/exit rule. Springs can be critically damped and need not bounce. Generated CSS timing functions are fixed curves; they do not automatically preserve velocity when a user interrupts an animation as a runtime physics engine might.

## Respect constraints

- Preserve intentional `ease`, `linear`, `ease-in`, `ease-out`, and `ease-in-out`, custom values, and shared tokens. Standard keywords are valid design choices.
- Inspect the cascade and framework defaults. A missing easing declaration does not prove that the author forgot one.
- Respect `prefers-reduced-motion` or existing Tailwind `motion-reduce`/`motion-safe` patterns. Removing or simplifying nonessential movement can be more appropriate than merely changing easing. Keep essential state feedback visible.
- Overshoot and oscillation fit movement such as translation or carefully bounded scaling. Opacity, colors, and constrained dimensions can clamp or behave unexpectedly. Use separate timing for a fade and a transform where necessary.
- Avoid `transition: all` when only specific properties should animate. Do not introduce layout animation when a transform achieves the intended result more directly.
- CSS `linear()` differs from the `linear` keyword. Check supported browsers and embedded WebViews before using piecewise linear timing functions, and follow the project's fallback conventions.
- Duration depends on distance, context, input, and user preference. Returned `suggested_duration_ms` values are preview starting ranges, not accessibility rules or scientific optima. Avoid unsupported percentages about perceived speed.

## Use real tool output

`get_presets` returns `presets`, whose entries contain `id`, `type`, `curve`, optional `style`, `params`, `output`, and `links`. Filter by `type` when the curve family is known. Presets already provide `output.css`, `output.tailwind_css`, and `links.share_url`.

Use `get_curve_by_id` with a returned ID when restoring a curve. Use a `create_*_curve` tool only for custom input and follow its advertised schema. MCP tools compute locally in stdio mode; they do not inspect or edit user code. The assistant performs authorized edits separately. A share URL is a link to the visual editor, not evidence that someone inspected the animation.

Put CSS in a fenced `css` block and Tailwind classes in an `html` block. Reuse exact strings rather than reconstructing or rounding them. Keep the chosen curve's ID and preview link associated with those values.
