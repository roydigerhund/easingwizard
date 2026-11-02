# Easing Wizard API

Hono REST API and stateless Streamable HTTP MCP endpoint, sharing the same curve generation core.

- REST/OpenAPI documentation: [api.easingwizard.com/docs](https://api.easingwizard.com/docs), [OpenAPI](https://api.easingwizard.com/openapi).
- REST routes: `/v1/curves/:type` (POST), `/v1/curves/:id` (GET), `/v1/presets`, `/healthz` and `/v1/healthz`.
- MCP route: `/mcp`, serving protocol revisions 2026-07-28 and compatible 2025 clients.

## Local development

From the repository root, with Node 22.14+:

```bash
pnpm install --frozen-lockfile
pnpm build:api
API_URL=http://127.0.0.1:3000 pnpm dev:api
```

The development server binds to `127.0.0.1:3000`. `PORT` overrides the port. `src/app.ts` exports a listener-free app for tests and serverless hosting; `src/index.ts` runs the standalone Node listener when executed directly, including in production mode.

Connect a client:

```bash
codex mcp add easingwizard-local --url http://127.0.0.1:3000/mcp
claude mcp add --transport http easingwizard-local http://127.0.0.1:3000/mcp
```

The hosted URL is `https://api.easingwizard.com/mcp`. Native clients can omit Origin. The public calculator has no user data or write actions and does not require an account or OAuth.

## Use from a website or AI webview

Both the public MCP endpoint and REST API allow cross-origin browser requests with `Access-Control-Allow-Origin: *`. No API key, cookies, or other credentials are required. Use the browser's default credentials mode or `credentials: 'omit'`, not `credentials: 'include'`.

An AI platform connects directly to the `/mcp` URL using Streamable HTTP. Its tools calculate results in the shared core; they do not depend on browser access to REST. Sandboxed webviews whose Origin is `null` are supported by the public MCP endpoint too.

REST calls, for example from your own website:

```js
const response = await fetch('https://api.easingwizard.com/v1/curves/bezier', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'omit',
  body: JSON.stringify({ x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 }),
});
const curve = await response.json();
console.log(curve.output.css);
```

Cross-origin access also covers the REST discovery document at `/openapi` and the health endpoints. An embedding platform's own CSP or network restrictions can still prevent a connection independently of CORS.

## HTTP controls

- MCP request bodies are limited to 64 KiB, including legacy requests.
- On `api.easingwizard.com` and the current `VERCEL_URL`, MCP accepts syntactically valid HTTP(S) origins and the opaque origin `null`. Missing Origin headers remain supported for native clients. Malformed origins return 403.
- Local MCP targets and additional `MCP_ALLOWED_HOSTS` retain an explicit Origin allowlist: the production website/API origins, optional `MCP_ALLOWED_ORIGINS`, and development localhost origins outside production. Both the request URL and any Host header must identify a public host to receive the public MCP policy.
- Request hostname and any Host header are checked against `api.easingwizard.com`, localhost addresses, the current `VERCEL_URL`, and optional `MCP_ALLOWED_HOSTS` (hostnames only).
- MCP CORS permits POST/OPTIONS and the GET/DELETE probes used by generic clients, with current and legacy MCP headers. This stateless server still returns 405 for GET/DELETE; browsers can read that response and its `Allow` header. Protocol/session response headers and `Retry-After` are exposed to JavaScript.
- REST CORS permits GET, HEAD, POST, and OPTIONS on `/v1/*`, `/healthz`, and `/openapi`. Neither REST nor MCP enables credentialed CORS.
- `MCP_REQUESTS_PER_MINUTE` is a positive integer (default 600), counted per running instance. Excess calls return 429 and `Retry-After`. Preflight and rejected origins do not consume the budget. Set deployment-edge limits for global/per-client enforcement across serverless instances; this local budget is not a distributed rate limiter.
- No sessions or long-lived subscriptions are allocated. Hostnames remain explicitly allowlisted even though the public calculator intentionally permits cross-origin browser access.

See `.env.example` for settings. Vercel uses `api/index.js` with the Node request adapter and builds the core and MCP packages through workspace dependencies. Use `pnpm install --frozen-lockfile` on deployment.

## Tests

```bash
pnpm build:api
pnpm --filter easingwizard-api test
```

Tests cover real mounted REST/MCP routes, both protocol generations, invalid JSON/IDs, schema contracts, CORS/Host rules, request limits, and recovery. Release and production acceptance are described in [RELEASING.md](../../docs/RELEASING.md).
