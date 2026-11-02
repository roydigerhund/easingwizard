# Easing Wizard API

Hono REST API and stateless Streamable HTTP MCP endpoint, sharing the same curve generation core.

- REST/OpenAPI documentation: [api.easingwizard.com/docs](https://api.easingwizard.com/docs), [OpenAPI](https://api.easingwizard.com/openapi).
- REST routes: `/v1/curves/:type` (POST), `/v1/curves/:id` (GET), `/v1/presets`, `/healthz` and `/v1/healthz`.
- MCP route: `/mcp`, serving protocol revisions 2026-07-28 and compatible 2025 clients. The updated API must be deployed before the public route is available.

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

The hosted URL after deployment is `https://api.easingwizard.com/mcp`. Native clients can omit Origin. The public calculator has no user data or write actions and does not require an account or OAuth.

## HTTP controls

- MCP request bodies are limited to 64 KiB, including legacy requests.
- Origin is checked against the production website/API origins, optional `MCP_ALLOWED_ORIGINS`, and development localhost origins outside production. Unknown origins return 403.
- Request hostname and any Host header are checked against `api.easingwizard.com`, localhost addresses, the current `VERCEL_URL`, and optional `MCP_ALLOWED_HOSTS` (hostnames only).
- CORS permits POST and OPTIONS with MCP headers. GET/DELETE session operations are not supported by this stateless server.
- `MCP_REQUESTS_PER_MINUTE` is a positive integer (default 600), counted per running instance. Excess calls return 429 and `Retry-After`. Preflight and rejected origins do not consume the budget. Set deployment-edge limits for global/per-client enforcement across serverless instances; this local budget is not a distributed rate limiter.
- No sessions or long-lived subscriptions are allocated. Browser origins/hostnames are explicit allowlists; do not configure a wildcard.

See `.env.example` for settings. Vercel uses `api/index.js` with the Node request adapter and builds the core and MCP packages through workspace dependencies. Use `pnpm install --frozen-lockfile` on deployment.

## Tests

```bash
pnpm build:api
pnpm --filter easingwizard-api test
```

Tests cover real mounted REST/MCP routes, both protocol generations, invalid JSON/IDs, schema contracts, CORS/Host rules, request limits, and recovery. Release and production acceptance are described in [RELEASING.md](../../docs/RELEASING.md).
