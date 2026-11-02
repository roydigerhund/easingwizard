# Easing Wizard — Claude Code Plugin

Choose CSS easing curves, review animations, and implement requested motion improvements. Seven MCP tools generate Bezier, Spring, Bounce, Wiggle, and Overshoot curves, return presets, and restore existing curve IDs. Results include CSS, Tailwind classes, and preview links.

The plugin preserves intentional standard easings, motion tokens, and reduced-motion behavior. Custom curves are an option, not an automatic upgrade for every animation.

## Installation

Requires Node.js 22.14 or newer and `npx` on your PATH. The plugin launches a pinned version of `@easingwizard/mcp-server`; the first start downloads it from npm. Curve computation then runs locally without an API key or a hosted REST API.

Install the published community release in Claude Code:

```text
/plugin install easing-wizard --marketplace anthropics/claude-plugins-community
```

The one-step command requires Claude Code 2.1.275 or later. The terminal equivalent requires 2.1.292 or later:

```bash
claude plugin install easing-wizard --marketplace anthropics/claude-plugins-community
```

For older clients, use the two-step flow:

```text
/plugin marketplace add anthropics/claude-plugins-community
/plugin install easing-wizard@claude-community
```

Run `/reload-plugins` in an existing session, then `/mcp` to confirm the bundled server is connected. The install ID is `easing-wizard`; the manifest's `easingwizard` name supplies the skill namespace.

This checkout prepares plugin **1.1.0**, pinned to MCP **1.2.0**. The community command installs the version its catalog currently references. Publish MCP 1.2.0, synchronize the separate plugin repository, and update the community catalog's commit pin before advertising this new release.

## Use

- `/easingwizard:recommend-curve snappy dropdown` recommends a curve with CSS, Tailwind output, and a preview link.
- `/easingwizard:improve-easings src/Menu.css` applies requested changes in the target while keeping appropriate existing motion.
- `/easingwizard:audit-easings` reviews authored styles and reports justified findings without editing files.

The `easing-advice` skill can help during relevant CSS/Tailwind work. The `animation-expert` agent handles curve comparisons, choreography, and reduced-motion alternatives. JavaScript animation-library migrations are outside these workflows.

## Develop and validate

From the monorepo root:

```bash
node scripts/package-plugins.mjs --sync
node scripts/package-plugins.mjs --check
claude plugin validate ./apps/claude-plugin --strict
node --test tests/plugin-packaging.test.mjs
node scripts/package-plugins.mjs
```

The final command creates deterministic ZIPs and `SHA256SUMS` in `dist/plugins/`. Build outputs are ignored by Git. Plugin validation checks manifests, MCP version pins, generated-file drift, tool namespaces, and packaged references; it does not prove a real model has completed the workflows correctly.

Once the pinned npm package is available, `claude --plugin-dir ./apps/claude-plugin` loads this directory for a development session without a marketplace installation. Exercise a recommendation, an audit of a `linear` spinner, and an explicitly requested improvement with reduced motion enabled. The optional startup hint uses Bash; the skills and MCP server do not depend on it.

## Shared source and releases

Author the four skills, `agents/animation-expert.md`, `references/`, icon, and version here. `scripts/package-plugins.mjs --sync` derives the portable Codex plugin from this source, converts the expert agent into a skill, and removes Claude-specific permission/model/invocation fields. The script does not copy Claude lifecycle hooks to Codex. Edit the generated Codex files only through this source and generator.

The separate distribution repository is [roydigerhund/easingwizard-claude-plugin](https://github.com/roydigerhund/easingwizard-claude-plugin). Version changes, source synchronization, npm publication, and marketplace updates are separate release steps; creating ZIPs does none of them.

The plugin instructions and integration files retain their MIT license in `LICENSE`. The separately downloaded MCP engine has its own license in the npm package; the plugin license does not relicense that engine.

Documentation: [Claude plugin installation](https://code.claude.com/docs/en/plugins/install), [plugin MCP naming](https://code.claude.com/docs/en/mcp#plugin-provided-mcp-servers), [manifest validation](https://code.claude.com/docs/en/plugins-reference).
