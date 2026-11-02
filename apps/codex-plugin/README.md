# Easing Wizard — Codex Plugin

A portable Agent Plugins package for CSS/Tailwind curve recommendations, animation reviews, and requested easing changes. It contains five skills and the same local MCP server used by the Claude Code plugin.

## Install from this repository

Requires Node.js 22.14 or newer and `npx` on your PATH. This plugin version **1.1.0** runs `@easingwizard/mcp-server@1.2.0`. That npm version must be published before installing the release package. The first start downloads it; curve generation then works locally without an API key or the hosted REST API.

The repository marketplace at `.agents/plugins/marketplace.json` points to `apps/codex-plugin`. Open the repository in the Codex desktop app, restart the app if needed, then open the Plugins Directory, select the repository marketplace, and install **Easing Wizard**. The repository catalog makes the plugin available; it does not install or enable it automatically.

For a checkout used as an explicit local marketplace, the CLI registration command is:

```bash
codex plugin marketplace add /absolute/path/to/easingwizard
```

Use the desktop app to install and test the plugin. If you only need its tools rather than skills, the independent MCP setup is:

```bash
codex mcp add easingwizard -- npx -y @easingwizard/mcp-server@1.2.0
codex mcp list
```

Choose one installation route for ordinary use to avoid duplicate servers. These commands configure your client only when you run them; building this repository does not change user configuration.

## Use

Mention **Easing Wizard** and describe the task, for example:

- “Recommend a calm entrance for this dropdown, with CSS and a preview link.”
- “Audit these animations, including the loading spinner and reduced-motion behavior.”
- “Improve the requested transition in Menu.css while keeping our motion tokens.”
- “Compare a spring with an ease-out for this interaction.”

The skills are `recommend-curve`, `audit-easings`, `improve-easings`, `easing-advice`, and `animation-expert`. Reviews and recommendations do not authorize file edits. The MCP tools return exact values; the coding assistant performs any requested edits using its own file tools. Standard easings, including constant-speed `linear` spinners, remain valid choices.

## Package and maintain

`plugin.json` and `mcp.json` use Agent Plugins 1.0.0 schemas. OpenAI presentation metadata is in `extensions.com.openai`; the package has no lifecycle hooks or Claude-specific agent configuration.

This directory's manifests, skills, reference, icon, and license are generated from `apps/claude-plugin` by `scripts/package-plugins.mjs`. The expert agent becomes a portable skill. Keep this README here; change shared guidance at its Claude source and regenerate:

```bash
node scripts/package-plugins.mjs --sync
node scripts/package-plugins.mjs --check
node --test tests/plugin-packaging.test.mjs
node scripts/package-plugins.mjs
```

The release ZIP is `dist/plugins/easingwizard-codex-1.1.0.zip`; `SHA256SUMS` accompanies both plugin archives. Creating these artifacts does not publish a package, install a plugin, or submit it for review. After updating a local plugin, refresh/reinstall its cached copy through the marketplace and test in a new session.

The plugin instructions and integration files use the included MIT license. The separately downloaded MCP engine has its own package license; this plugin does not relicense that engine.

## Public directory distribution

This stdio package supports local/repository distribution. Public local-MCP submissions currently require an approved submitting partner. A remote public variant can use the same skills with a deployed HTTPS Streamable HTTP endpoint in `mcp.json`, followed by the normal public submission/review process. Do not list a localhost or undeployed endpoint in a public package. No public directory approval or release is implied by this source tree.

Official documentation: [package a plugin](https://developers.openai.com/plugins/build/plugins), [MCP configuration](https://learn.chatgpt.com/docs/extend/mcp), [desktop-only submissions](https://developers.openai.com/plugins/deploy/desktop-only).
