import { createMcpHandler } from '@modelcontextprotocol/server';
import { createEasingWizardServer } from './server.js';

/**
 * Stateless Streamable HTTP handler for current and legacy MCP clients.
 * The hosting application must apply Origin/Host validation and rate limits.
 */
export function createEasingWizardMcpHandler() {
  return createMcpHandler(createEasingWizardServer, {
    responseMode: 'json',
    maxRequestBodySize: 64 * 1024,
    maxSubscriptions: 0,
  });
}
