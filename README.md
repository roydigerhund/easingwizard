# Easing Wizard

A comprehensive toolkit for creating and using CSS easing curves. Generate Bézier, Spring, Bounce, Wiggle, and Overshoot animations with ease.

🌐 **Website**: [easingwizard.com](https://easingwizard.com)  
🛠️ **API**: [api.easingwizard.com](https://api.easingwizard.com)  
📦 **MCP Server**: [@easingwizard/mcp-server](https://www.npmjs.com/package/@easingwizard/mcp-server)  
🤖 **Agent plugins**: [Claude Code](apps/claude-plugin/README.md) · [Codex](apps/codex-plugin/README.md)

## What is Easing Wizard?

Easing Wizard helps developers create smooth, professional animations by providing:

- **Interactive curve editor** with real-time preview
- **Physics-based animations** (spring, bounce, overshoot)
- **CSS & Tailwind CSS output** ready to use
- **Shareable links** for collaboration
- **AI integration** via Model Context Protocol (MCP)

## Repository Structure

This is a monorepo containing multiple packages and applications:

### 🌍 Applications

- **[`apps/frontend/`](apps/frontend/)** - React Router web application ([easingwizard.com](https://easingwizard.com))
- **[`apps/api/`](apps/api/)** - Hono backend API for curve generation
- **[`apps/mcp/`](apps/mcp/)** - Model Context Protocol server for AI assistants
- **[`apps/claude-plugin/`](apps/claude-plugin/)** - Claude Code plugin and shared skill source
- **[`apps/codex-plugin/`](apps/codex-plugin/)** - Generated portable Codex plugin with five skills and MCP integration

### 📦 Packages

- **[`packages/core/`](packages/core/)** - Shared utilities, types, and curve generation logic

## 🚀 Quick Start

### For Developers

```bash
# Clone the repository
git clone https://github.com/roydigerhund/easingwizard.git
cd easingwizard

# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Or start individual apps
pnpm dev:frontend  # React app on http://localhost:5173
pnpm dev:api       # API server on http://localhost:3000
```

### For Claude Code

Install the current release from the Easing Wizard marketplace. In Claude Code:

```
/plugin marketplace add roydigerhund/easingwizard-claude-plugin
/plugin install easingwizard@easingwizard
```

Or from your terminal:

```bash
claude plugin marketplace add roydigerhund/easingwizard-claude-plugin
claude plugin install easingwizard@easingwizard
```

Then run `/reload-plugins` (or restart Claude Code) to activate it.

If you previously installed `easing-wizard@claude-community`, disable or uninstall that entry first to avoid duplicate skills and MCP servers. The community directory updates independently; this repository marketplace provides the current release directly.

This gives you 7 MCP tools, 4 skills, and an animation expert agent:

- `/easingwizard:recommend-curve` — Describe the feel you want, get a curve with CSS + Tailwind output
- `/easingwizard:improve-easings` — Improve selected animations while preserving suitable defaults, design tokens, and reduced-motion behavior
- `/easingwizard:audit-easings` — Review easing choices, durations, browser support, and reduced-motion behavior

### For Codex

Use the published MCP package directly (Node 22.14+):

```bash
codex mcp add easingwizard -- npx -y @easingwizard/mcp-server
```

For recommendations, animation reviews, and implementation workflows, use the [Codex plugin](apps/codex-plugin/README.md). Its repository marketplace is defined in `.agents/plugins/marketplace.json`. The plugin pins the published MCP 1.2.0 package.

### For Other MCP Clients (VS Code, Cursor, etc.)

Cursor and Claude Desktop use `mcpServers`:

```json
{
  "mcpServers": {
    "easingwizard": {
      "command": "npx",
      "args": ["-y", "@easingwizard/mcp-server"]
    }
  }
}
```

VS Code uses a `servers` object in `.vscode/mcp.json`. Full client-specific instructions, exact tool names, and local development setup are in the [MCP README](apps/mcp/README.md). Pin a published version when reproducibility matters.

The MCP server computes curves locally with the shared core; it does not call the REST API. The API also provides the Streamable HTTP endpoint `https://api.easingwizard.com/mcp` for URL-based connections without Node on the client. See [API setup](apps/api/README.md).

## Checks and releases

```bash
pnpm check             # types, regression/contract tests, plugin/version checks
pnpm build             # all applications and packages
pnpm plugins:sync      # regenerate Codex content after changing Claude skills
pnpm plugins:package   # validated reproducible plugin ZIPs
pnpm release:prepare   # checks/builds plus npm and plugin release artifacts
```

Follow [the release guide](docs/RELEASING.md) to publish npm, synchronize the separate Claude repository and marketplace pin, distribute the Codex plugin, and deploy the API in the right order. Prepared artifacts and a passing local build do not imply publication or deployment.

## 🎨 Examples

### Spring Animation

```css
.spring-curve {
  transition-timing-function: linear(
    0,
    0.053 0.8%,
    0.197 1.6%,
    1.267 5.5%,
    1.432 6.6%,
    1.484 7.6%,
    1.463 8.4%,
    1.386 9.3%,
    0.868 13.2%,
    0.794 14.2%,
    0.766 15.2%,
    0.774 16%,
    0.809 16.9%,
    1.065 20.9%,
    1.1 21.9%,
    1.113 22.9%,
    1.109 23.7%,
    1.092 24.6%,
    0.968 28.6%,
    0.945 30.5%,
    0.956 32.3%,
    1.016 36.3%,
    1.027 38.2%,
    0.987 45.9%,
    1.006 53.5%,
    0.997 61.2%,
    1
  );
}
```

**Tailwind CSS:**

```css
ease-[linear(0,0.053_0.8%,0.197_1.6%,1.267_5.5%,1.432_6.6%,1.484_7.6%,1.463_8.4%,1.386_9.3%,0.868_13.2%,0.794_14.2%,0.766_15.2%,0.774_16%,0.809_16.9%,1.065_20.9%,1.1_21.9%,1.113_22.9%,1.109_23.7%,1.092_24.6%,0.968_28.6%,0.945_30.5%,0.956_32.3%,1.016_36.3%,1.027_38.2%,0.987_45.9%,1.006_53.5%,0.997_61.2%,1)]
```

**Shareable Link:**  
https://easingwizard.com/#0a1i1j80k20y22u

---

Example Bézier Curve CSS:

```css
.bezier-curve {
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
```

**Tailwind CSS:**

```css
ease-[cubic-bezier(0.42,0,0.58,1)]
```

### Bézier Curve

```css
.bezier-curve {
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
}
```

**Tailwind CSS:**

```css
ease-[cubic-bezier(0.42,0,0.58,1)]
```

**Shareable Link:** [easingwizard.com/#0a0d.42e0f.58g13h](https://easingwizard.com/#0a0d.42e0f.58g13h)

### Bounce Animation

```css
.bounce-curve {
  transition-timing-function: linear(
    0,
    0.059 7.7%,
    0.113 12.8%,
    0.181 17.2%,
    0.27 21.2%,
    0.537 28.8%,
    1 37.8%,
    0.617 45.7%,
    0.531 48.8%,
    0.503 51.7%,
    0.529 54.5%,
    0.606 57.3%,
    0.998 65.5%,
    0.823 69.9%,
    0.781 71.9%,
    0.768 73.8%,
    0.779 75.6%,
    0.812 77.5%,
    1 84.5%,
    0.956 87.1%,
    0.943 89.6%,
    0.951 91.7%,
    0.993 96.9%,
    1
  );
}
```

**Shareable Link:** [easingwizard.com/#0a2m3n30y21E](https://easingwizard.com/#0a2m3n30y21E)

### Wiggle Effect

```css
.wiggle-curve {
  transition-timing-function: linear(
    0,
    0.72 8.4%,
    0.884 11.9%,
    0.925 13.6%,
    0.94 15.4%,
    0.929 16.9%,
    0.9 18.4%,
    0.785 21.5%,
    -0.196 36.6%,
    -0.371 40.6%,
    -0.457 44.5%,
    -0.468 46.1%,
    -0.465 47.7%,
    -0.422 51.1%,
    -0.046 64.6%,
    0.025 68.1%,
    0.066 71.5%,
    0.081 74.3%,
    0.081 77.4%,
    0.012 90.8%,
    0
  );
}
```

**Shareable Link:** [easingwizard.com/#0a3p3q20y23U](https://easingwizard.com/#0a3p3q20y23U)

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Zustand
- **Backend**: Hono v4, Node.js, OpenAPI with Zod
- **Core**: TypeScript, Zod v4 for validation
- **MCP**: Model Context Protocol SDK
- **Claude Plugin**: Skills, agent, hooks, MCP integration
- **Tools**: pnpm, Turbo, Prettier, ESBuild

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run `pnpm check`, `pnpm build`, and format the changed files
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under a custom license that allows use in larger projects but prevents direct commercialization. See the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [easingwizard.com](https://easingwizard.com)
- **API Documentation**: [api.easingwizard.com](https://api.easingwizard.com)
- **OpenAPI Docs**: [OpenAPI Documentation](https://api.easingwizard.com/openapi)
- **NPM Package**: [@easingwizard/mcp-server](https://www.npmjs.com/package/@easingwizard/mcp-server)
- **Claude Plugin**: [easingwizard-claude-plugin](https://github.com/roydigerhund/easingwizard-claude-plugin)
- **Issues**: [GitHub Issues](https://github.com/roydigerhund/easingwizard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/roydigerhund/easingwizard/discussions)
