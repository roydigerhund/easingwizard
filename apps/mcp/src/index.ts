#!/usr/bin/env node

import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createEasingWizardServer } from './server.js';

const handle = serveStdio(createEasingWizardServer);

console.error('Easing Wizard MCP server running on stdio');

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void handle.close().catch((error: unknown) => {
      console.error('Failed to close Easing Wizard MCP server:', error);
      process.exitCode = 1;
    });
  });
}
