# Easing Wizard MCP Server

Generate CSS easing curves from an AI coding assistant: Bézier, Spring, Bounce, Wiggle, and Overshoot. The seven tools use the same calculation library as [Easing Wizard](https://easingwizard.com), returning CSS, Tailwind classes, SVG geometry, and share links.

The stdio server calculates everything locally. It does not call the REST API, need an account, or write files. The same tools can also run behind the API's Streamable HTTP endpoint.

## Requirements and release status

- Node.js **22.14 or later** for the local npm server.
- An MCP client supporting stdio or Streamable HTTP.
- This checkout targets MCP **2026-07-28**, with compatibility for clients using the 2025 `initialize` handshake.

The npm examples below run the latest **published** package. Publishing a new package and deploying the HTTP endpoint are separate release steps; use the local checkout instructions to test changes before release. For reproducible installations, replace `@easingwizard/mcp-server` with `@easingwizard/mcp-server@<published-version>`.

## Connect over stdio

The client launches and stops the process. A global npm installation or a separately running daemon is unnecessary.

### Codex

```sh
codex mcp add easingwizard -- npx -y @easingwizard/mcp-server
codex mcp list
```

Equivalent `~/.codex/config.toml` configuration:

```toml
[mcp_servers.easingwizard]
command = "npx"
args = ["-y", "@easingwizard/mcp-server"]
```

### Claude Code

```sh
claude mcp add --transport stdio --scope user easingwizard -- npx -y @easingwizard/mcp-server
claude mcp list
```

Run `/mcp` in Claude Code to check the connection. The [Claude plugin](../claude-plugin/README.md) adds workflows for recommending and auditing animation curves alongside the tools. Install either its bundled server or a standalone server entry to avoid duplicate tools.

### Claude Desktop

Add to `claude_desktop_config.json`, then restart the app:

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

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "easingwizard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@easingwizard/mcp-server"]
    }
  }
}
```

Other clients use their own configuration format. The common launch command is `npx -y @easingwizard/mcp-server`; `mcpServers` is not a universal configuration key.

## Connect over HTTP

The API application mounts a stateless Streamable HTTP handler at `/mcp`. After starting the local API, connect with:

```sh
codex mcp add easingwizard-http --url http://127.0.0.1:3000/mcp
claude mcp add --transport http --scope user easingwizard-http http://127.0.0.1:3000/mcp
```

Use your deployed HTTPS `/mcp` URL for remote access. The planned public address is `https://api.easingwizard.com/mcp`; it becomes available after the API deployment and is not enabled merely by publishing the npm package. HTTP clients need no local Node.js installation. The REST endpoints themselves are not MCP endpoints.

The handler supports both protocol generations. It uses bounded requests (64 KiB), returns JSON for current-protocol tool requests, and does not hold sessions or subscriptions. The API host supplies Origin validation, CORS, and request rate limits. There is no authentication because these tools only calculate public curves and access no private account data.

To embed it in another fetch-based server:

```ts
import { createEasingWizardMcpHandler } from '@easingwizard/mcp-server/http';

const mcp = createEasingWizardMcpHandler();
// Mount mcp.fetch(request) at /mcp behind Origin/Host checks and rate limits.
// Call await mcp.close() during shutdown.
```

`@easingwizard/mcp-server/server` also exports `createEasingWizardServer()` for hosts needing their own transport wiring.

## Tools

All tools are read-only and have no persistent side effects. Names are case-sensitive.

| Tool                     | Inputs                                                                         |
| ------------------------ | ------------------------------------------------------------------------------ |
| `get_presets`            | Optional `type`: `BEZIER`, `SPRING`, `BOUNCE`, `WIGGLE`, or `OVERSHOOT`        |
| `get_curve_by_id`        | `id`: curve ID returned by a tool or the visual editor                         |
| `create_bezier_curve`    | `x1`, `x2`: 0–1; `y1`, `y2`: −1–2                                              |
| `create_spring_curve`    | `mass`: 1–5; `stiffness`, `damping`: 0–100; `accuracy`                         |
| `create_bounce_curve`    | `bounces`: 1–10; optional `mass`: 1–5, default 1; `damping`: 0–100; `accuracy` |
| `create_wiggle_curve`    | `wiggles`: 1–10; optional `mass`: 1–5, default 1; `damping`: 0–100; `accuracy` |
| `create_overshoot_curve` | `style`: `IN`, `OUT`, or `IN_OUT`; `mass`: 1–5; `damping`: 0–100; `accuracy`   |

`accuracy` is `LOW`, `MEDIUM`, `HIGH`, or `ULTRA`; use `HIGH` for normal UI animations. Tools advertise their complete input and output schemas. Invalid arguments or curve IDs produce `isError: true` results so the assistant can correct the request.

Example `tools/call` parameters:

```json
{
  "name": "create_spring_curve",
  "arguments": {
    "mass": 2.5,
    "stiffness": 50,
    "damping": 50,
    "accuracy": "HIGH"
  }
}
```

Curve responses contain:

- `output.css`: ready-to-use `cubic-bezier()` or `linear()`.
- `output.tailwind_css`: Tailwind arbitrary easing class.
- `output.svg_path` or `output.svg_polyline`: curve geometry.
- `output.suggested_duration_ms`: suggested duration range for non-Bézier curves.
- `id`, normalized `input`, `type`, `generated_at`, and `links.share_url`.

Results include `structuredContent` and a JSON text fallback. Filter `get_presets` by type when possible to keep its response small. A curve ID encodes parameters; it does not reference a database record.

Try: “Create a subtle spring easing for a dropdown, return the Tailwind class and a suggested duration.”

## Local development and verification

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter easingwizard-core build
pnpm --filter @easingwizard/mcp-server build
pnpm --filter @easingwizard/mcp-server typecheck
pnpm --filter @easingwizard/mcp-server test
```

Test a checkout directly, using its absolute path:

```sh
codex mcp add easingwizard-local -- node /absolute/path/to/easingwizard/apps/mcp/dist/index.js
```

For interactive inspection:

```sh
pnpm --filter @easingwizard/mcp-server inspect
```

The contract tests run real stdio clients and in-process HTTP clients for both protocol generations. They exercise all seven tools, validate outputs against the advertised JSON Schemas, reconstruct curves from IDs, check invalid arguments and recovery, and enforce HTTP body limits. Test clients close their child processes when finished.

The build bundles the shared curve library while keeping the SDK and Zod as runtime dependencies. The server identity derives its version from `package.json`. Keep `dist` built before testing or publishing; changes to the shared core require rebuilding it first. `prepack` rebuilds both packages for publication.

## Protocol references

- [MCP versioning](https://modelcontextprotocol.io/docs/2026-07-28/learn/versioning)
- [TypeScript SDK: stdio](https://ts.sdk.modelcontextprotocol.io/v2/serving/stdio.html)
- [TypeScript SDK: HTTP](https://ts.sdk.modelcontextprotocol.io/v2/serving/http.html)
- [Protocol migration and compatibility](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28.html)
- [Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp)
- [Claude Code MCP configuration](https://code.claude.com/docs/en/mcp)

See [LICENSE](LICENSE) for the project's license and commercial-use conditions.
