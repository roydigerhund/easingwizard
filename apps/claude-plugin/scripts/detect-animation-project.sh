#!/usr/bin/env bash

# Detect if this project is relevant for easing/animation tools.
# Outputs structured JSON context if relevant, nothing otherwise.
#
# Logic:
# - New/empty projects (< 5 files): always show
# - Projects with CSS/Tailwind files: show
# - Otherwise: silent

CONTEXT='Easing Wizard provides CSS/Tailwind curve generation and preview links. Use /easingwizard:recommend-curve for recommendations, /easingwizard:audit-easings for a review, and /easingwizard:improve-easings for requested code changes. The animation-expert agent can compare motion choices. Use these capabilities when the current task needs an easing decision; preserve intentional standard easings, existing motion tokens, and reduced-motion behavior.'

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

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
