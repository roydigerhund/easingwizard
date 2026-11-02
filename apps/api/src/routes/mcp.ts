import { createEasingWizardMcpHandler } from '@easingwizard/mcp-server/http';
import type { Hono } from 'hono';
import { cors } from 'hono/cors';

const defaultOrigins = ['https://easingwizard.com', 'https://api.easingwizard.com'];

function isPublicBrowserOrigin(origin: string) {
  // Sandboxed webviews serialize their origin as "null". They may use this
  // public calculator too; it has no credentials, user data, or write actions.
  if (origin === 'null') return true;
  try {
    const url = new URL(origin);
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.origin === origin;
  } catch {
    return false;
  }
}

export function registerMcpRoutes(app: Hono) {
  const localHosts = ['localhost', '127.0.0.1', '[::1]'];
  const publicHosts = new Set([
    'api.easingwizard.com',
    ...(process.env.VERCEL_URL ? [process.env.VERCEL_URL.toLowerCase()] : []),
  ]);
  const allowedHosts = new Set([
    ...publicHosts,
    ...localHosts,
    ...(process.env.MCP_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  ]);
  const allowedOrigins = new Set([
    ...defaultOrigins,
    ...(process.env.NODE_ENV !== 'production'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
      : []),
    ...(process.env.MCP_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]);
  const corsOptions = {
    // Stateless GET/DELETE return 405. Let browser clients read that response
    // instead of turning an optional stream/session probe into a CORS error.
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'MCP-Protocol-Version',
      'Mcp-Method',
      'Mcp-Name',
      'Mcp-Session-Id',
      'Last-Event-ID',
    ],
    exposeHeaders: ['MCP-Protocol-Version', 'Mcp-Session-Id', 'Retry-After', 'Allow'],
    maxAge: 3600,
  };
  const publicCors = cors({ ...corsOptions, origin: '*' });
  const restrictedCors = cors({ ...corsOptions, origin: (origin) => (allowedOrigins.has(origin) ? origin : '') });
  const handler = createEasingWizardMcpHandler();
  const requestLimit = Number(process.env.MCP_REQUESTS_PER_MINUTE ?? 600);
  if (!Number.isSafeInteger(requestLimit) || requestLimit < 1) {
    throw new Error('MCP_REQUESTS_PER_MINUTE must be a positive integer');
  }
  // A fixed per-instance budget bounds work without trusting client-supplied IP
  // headers or retaining an unbounded map. Apply global/per-client limits at the
  // deployment edge as well when scaling to multiple instances.
  let windowStart = Date.now();
  let requests = 0;

  // Open browser access only on the public deployment. Local/custom hosts keep
  // their explicit Origin policy; Host validation also prevents DNS rebinding.
  app.use('/mcp', async (c, next) => {
    const url = new URL(c.req.url);
    const hostHeader = c.req.header('Host');
    let isPublicEndpoint = publicHosts.has(url.hostname.toLowerCase());
    if (!allowedHosts.has(url.hostname.toLowerCase())) {
      return c.json({ error: 'Host is not allowed' }, 403);
    }
    if (hostHeader) {
      try {
        const host = new URL(`http://${hostHeader}`);
        if (
          host.username ||
          host.password ||
          host.pathname !== '/' ||
          host.search ||
          host.hash ||
          !allowedHosts.has(host.hostname.toLowerCase())
        ) {
          return c.json({ error: 'Host is not allowed' }, 403);
        }
        isPublicEndpoint &&= publicHosts.has(host.hostname.toLowerCase());
      } catch {
        return c.json({ error: 'Host is not allowed' }, 403);
      }
    }
    const origin = c.req.header('Origin');
    if (origin !== undefined && !(isPublicEndpoint ? isPublicBrowserOrigin(origin) : allowedOrigins.has(origin))) {
      return c.json({ error: 'Origin is not allowed' }, 403);
    }
    return (isPublicEndpoint ? publicCors : restrictedCors)(c, next);
  });
  app.use('/mcp', async (c, next) => {
    if (c.req.method === 'POST') {
      const now = Date.now();
      if (now - windowStart >= 60_000) {
        windowStart = now;
        requests = 0;
      }
      if (requests >= requestLimit) {
        c.header('Retry-After', String(Math.max(1, Math.ceil((60_000 - (now - windowStart)) / 1000))));
        return c.json({ error: 'MCP request limit reached; retry later' }, 429);
      }
      requests++;
    }
    await next();
  });
  app.all('/mcp', (c) => handler.fetch(c.req.raw));
}
