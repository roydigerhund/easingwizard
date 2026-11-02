import { Scalar } from '@scalar/hono-api-reference';
import { API_VERSION } from 'easingwizard-core';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import curves from './routes/curves';
import healthz from './routes/healthz';
import { registerMcpRoutes } from './routes/mcp';
import openapi from './routes/openapi';
import presets from './routes/presets';

export function createApp() {
  const app = new Hono();
  registerMcpRoutes(app);

  // Public, credential-free REST calculations and their discovery document.
  // Keep this separate from MCP's public/loopback Origin and Host policy.
  const restCors = cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposeHeaders: ['Retry-After'],
    maxAge: 3600,
  });
  app.use(`${API_VERSION}/*`, restCors);
  app.use('/healthz', restCors);
  app.use('/openapi', restCors);

  app.get('/', (c) => {
    return c.redirect(`/docs`, 301);
  });

  app.route('/healthz', healthz);
  app.route(`${API_VERSION}/healthz`, healthz);

  app.route(`${API_VERSION}/curves`, curves);

  app.route(`${API_VERSION}/presets`, presets);

  app.route('/openapi', openapi);

  app.get(
    '/docs',
    Scalar({
      url: '/openapi',
      customCss: '.section:focus { outline: none; } .section-flare { display: none; }',
      pageTitle: 'Easing Wizard API Documentation',
      // layout: 'classic',
      hideModels: true,
      theme: 'deepSpace',
      darkMode: true,
      metaData: {
        ogImage: 'https://api.easingwizard.com/share-image.png',
      },
      favicon: '/favicon.svg',
      defaultOpenAllTags: true,
      hideClientButton: true,
    }),
  );

  return app;
}

export default createApp();
