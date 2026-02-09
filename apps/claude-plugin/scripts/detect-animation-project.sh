#!/usr/bin/env bash

# Detect if this project is relevant for easing/animation tools.
# Outputs structured JSON context if relevant, nothing otherwise.
#
# Logic:
# - New/empty projects (< 5 files): always show
# - Projects with CSS/Tailwind files: show
# - Otherwise: silent

CONTEXT='[Easing Wizard plugin active] Easing Wizard is a motion design tool that generates professional CSS easing curves. It supports 5 curve types — Bezier, Spring, Bounce, Wiggle, and Overshoot — with ~40 presets covering common UI patterns. Output is provided as CSS (cubic-bezier/linear()) and Tailwind classes.\n\nAvailable commands:\n- /easingwizard:recommend-curve — Describe an animation feel (e.g. \"snappy dropdown\", \"gentle modal entrance\") and get a curve recommendation with CSS + Tailwind output and a preview link.\n- /easingwizard:improve-easings — Point at CSS/Tailwind files to replace browser-default easings (ease, linear, ease-in-out) with professional curves matched to context.\n- /easingwizard:audit-easings — Scan the project for animations using default or missing easings and get a prioritized improvement report.\n\nAn animation-expert agent is also available for questions about motion design principles, easing theory, animation choreography, or choosing between easing options. It has deep knowledge of perceptual psychology and UI animation best practices.\n\nWhen the user is working with CSS transitions, animations, or Tailwind motion utilities, suggest these commands if they could benefit from better easing curves.'

show_message() {
  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "${CONTEXT}"
  }
}
EOF
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
