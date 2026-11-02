import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import test from 'node:test';

process.env.API_URL = 'https://api.easingwizard.com';
process.env.NODE_ENV = 'production';
process.env.MCP_REQUESTS_PER_MINUTE = '600';
const { default: listener } = await import('../api/index.js');

test('the production Node adapter serves REST and modern MCP over actual HTTP', async (t) => {
  const server = createServer(listener);
  t.after(async () => {
    server.closeAllConnections();
    if (server.listening) {
      await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
  });
  try {
    await new Promise((resolve, reject) => {
      const onError = (error) => reject(error);
      server.once('error', onError);
      server.listen(0, '127.0.0.1', () => {
        server.removeListener('error', onError);
        resolve();
      });
    });
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      t.skip(`Loopback binding is unavailable in this environment: ${error.code}`);
      return;
    }
    throw error;
  }
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, options = {}) =>
    fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(5000),
      ...options,
    });

  const health = await request('/healthz');
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');

  const invalidRest = await request('/v1/curves/bezier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(invalidRest.status, 400);
  assert.ok(Array.isArray((await invalidRest.json()).errors));

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    'MCP-Protocol-Version': '2026-07-28',
    'Mcp-Method': 'tools/call',
    'Mcp-Name': 'create_bezier_curve',
  };
  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'create_bezier_curve',
      arguments: { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 },
      _meta: {
        'io.modelcontextprotocol/protocolVersion': '2026-07-28',
        'io.modelcontextprotocol/clientInfo': { name: 'node-adapter-test', version: '1.0.0' },
        'io.modelcontextprotocol/clientCapabilities': {},
      },
    },
  });
  const mcp = await request('/mcp', { method: 'POST', headers, body });
  assert.equal(mcp.status, 200);
  const message = await mcp.json();
  assert.equal(message.result.resultType, 'complete');
  assert.notEqual(message.result.isError, true);
  assert.equal(message.result.structuredContent.output.css, 'cubic-bezier(0.25, 0.1, 0.75, 0.9)');

  // Fetch replaces a supplied Host with the URL authority; use Node's raw
  // request API to verify that an actual hostile Host reaches the adapter.
  const blocked = await new Promise((resolve, reject) => {
    const outgoing = httpRequest(
      `${base}/mcp`,
      {
        method: 'POST',
        headers: { ...headers, Host: 'attacker.example' },
        signal: AbortSignal.timeout(5000),
      },
      (response) => {
        let text = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          text += chunk;
        });
        response.on('error', reject);
        response.on('end', () => resolve({ status: response.statusCode, text }));
      },
    );
    outgoing.on('error', reject);
    outgoing.end(body);
  });
  assert.equal(blocked.status, 403);
  assert.match(JSON.parse(blocked.text).error, /Host/);
});
