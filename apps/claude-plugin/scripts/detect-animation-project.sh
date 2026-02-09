#!/bin/bash

# Detect if this project is relevant for easing/animation tools.
# Outputs an availability message if relevant, nothing otherwise.
#
# Logic:
# - New/empty projects (< 5 files): always show
# - Projects with CSS/Tailwind files: show
# - Otherwise: silent

show_message() {
  cat <<'MSG'
[Easing Wizard plugin active] Easing Wizard is a motion design tool that generates professional CSS easing curves. It supports 5 curve types — Bezier, Spring, Bounce, Wiggle, and Overshoot — with ~40 presets covering common UI patterns. Output is provided as CSS (cubic-bezier/linear()) and Tailwind classes.

Available commands:
- /easingwizard:recommend-curve — Describe an animation feel (e.g. "snappy dropdown", "gentle modal entrance") and get a curve recommendation with CSS + Tailwind output and a preview link.
- /easingwizard:improve-easings — Point at CSS/Tailwind files to replace browser-default easings (ease, linear, ease-in-out) with professional curves matched to context.
- /easingwizard:audit-easings — Scan the project for animations using default or missing easings and get a prioritized improvement report.

An animation-expert agent is also available for questions about motion design principles, easing theory, animation choreography, or choosing between easing options. It has deep knowledge of perceptual psychology and UI animation best practices.

When the user is working with CSS transitions, animations, or Tailwind motion utilities, suggest these commands if they could benefit from better easing curves.
MSG
}

file_count=$(find . -maxdepth 3 -type f \
  ! -path '*/node_modules/*' \
  ! -path '*/.git/*' \
  ! -path '*/dist/*' \
  ! -path '*/build/*' \
  2>/dev/null | wc -l | tr -d ' ')

if [ "$file_count" -lt 5 ]; then
  show_message
  exit 0
fi

# Check for CSS/Tailwind files
if find . -maxdepth 4 -type f \( \
  -name "*.css" -o \
  -name "*.scss" -o \
  -name "*.sass" -o \
  -name "*.less" -o \
  -name "tailwind.config.*" -o \
  -name "postcss.config.*" \
  \) ! -path '*/node_modules/*' ! -path '*/.git/*' 2>/dev/null | head -1 | grep -q .; then
  show_message
  exit 0
fi

# Check for Tailwind in package.json
if [ -f "package.json" ] && grep -q "tailwindcss" package.json 2>/dev/null; then
  show_message
  exit 0
fi
