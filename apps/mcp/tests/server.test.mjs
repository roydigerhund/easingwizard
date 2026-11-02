import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import addFormats from 'ajv-formats';
import Ajv2020 from 'ajv/dist/2020.js';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createEasingWizardMcpHandler } from '../dist/http.js';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const serverPath = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const cases = [
  ['create_bezier_curve', { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 }],
  ['create_spring_curve', { mass: 2.5, stiffness: 50, damping: 50, accuracy: 'HIGH' }],
  ['create_bounce_curve', { bounces: 3, damping: 50, accuracy: 'HIGH' }],
  ['create_wiggle_curve', { wiggles: 5, damping: 50, accuracy: 'HIGH' }],
  ['create_overshoot_curve', { style: 'OUT', mass: 2.5, damping: 50, accuracy: 'HIGH' }],
  ['get_presets', {}],
];

function createClient(era) {
  return new Client(
    { name: 'easingwizard-contract-test', version: '1.0.0' },
    {
      versionNegotiation: { mode: era === 'modern' ? { pin: '2026-07-28' } : 'legacy' },
      supportedProtocolVersions: [era === 'modern' ? '2026-07-28' : '2025-06-18'],
    },
  );
}

async function checkToolContracts(client) {
  assert.equal(client.getServerVersion().version, packageJson.version);
  assert.match(client.getInstructions(), /without network access/);

  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((tool) => tool.name).sort(), [...cases.map(([name]) => name), 'get_curve_by_id'].sort());

  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  const validators = new Map();
  for (const tool of tools) {
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.destructiveHint, false);
    assert.equal(tool.annotations.openWorldHint, false);
    assert.equal(tool.inputSchema.type, 'object');
    assert.equal(tool.inputSchema.additionalProperties, false);
    validators.set(tool.name, ajv.compile(tool.outputSchema));
  }

  for (const [name, args] of cases) {
    const response = await client.callTool({ name, arguments: args });
    assert.notEqual(response.isError, true, `${name}: ${JSON.stringify(response)}`);
    const validate = validators.get(name);
    assert.equal(validate(response.structuredContent), true, JSON.stringify(validate.errors));
    assert.deepEqual(JSON.parse(response.content[0].text), response.structuredContent);
    if (name.startsWith('create_')) {
      const reconstructed = await client.callTool({
        name: 'get_curve_by_id',
        arguments: { id: response.structuredContent.id },
      });
      const validateReconstructed = validators.get('get_curve_by_id');
      assert.equal(
        validateReconstructed(reconstructed.structuredContent),
        true,
        JSON.stringify(validateReconstructed.errors),
      );
      assert.equal(reconstructed.structuredContent.output.css, response.structuredContent.output.css);
      assert.deepEqual(reconstructed.structuredContent.input, response.structuredContent.input);
    }
  }

  const invalidCases = [
    ['get_presets', { type: false }],
    ['get_presets', { type: 'NOT_A_CURVE' }],
    ['create_bezier_curve', { x1: 5, y1: 0, x2: 1, y2: 1 }],
    ['create_bezier_curve', { x1: 0 }],
    ['create_spring_curve', { mass: 0, stiffness: 50, damping: 50, accuracy: 'HIGH' }],
    ['create_bounce_curve', { bounces: 3, damping: 50, accuracy: 'NOT_AN_ACCURACY' }],
    ['get_curve_by_id', { id: 'invalid' }],
    ['get_presets', { unexpected: true }],
  ];
  for (const [name, args] of invalidCases) {
    const response = await client.callTool({ name, arguments: args });
    assert.equal(response.isError, true, `${name}: ${JSON.stringify(response)}`);
    assert.ok(response.content.some((item) => item.type === 'text' && item.text.length > 0));
  }

  // A bad call must not poison the server for subsequent valid requests.
  const recovered = await client.callTool({ name: 'get_presets', arguments: { type: 'BEZIER' } });
  assert.notEqual(recovered.isError, true);
  assert.ok(recovered.structuredContent.presets.every((preset) => preset.type === 'BEZIER'));
}

test('HTTP rejects oversized bodies before parsing in either protocol era', async (t) => {
  const handler = createEasingWizardMcpHandler();
  t.after(() => handler.close());
  for (const modern of [false, true]) {
    const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
    const params = { name: 'get_presets', arguments: { padding: 'x'.repeat(65 * 1024) } };
    if (modern) {
      headers['MCP-Protocol-Version'] = '2026-07-28';
      headers['Mcp-Method'] = 'tools/call';
      headers['Mcp-Name'] = 'get_presets';
      params._meta = {
        'io.modelcontextprotocol/protocolVersion': '2026-07-28',
        'io.modelcontextprotocol/clientInfo': { name: 'body-limit-test', version: '1.0.0' },
        'io.modelcontextprotocol/clientCapabilities': {},
      };
    }
    const response = await handler.fetch(
      new Request('http://localhost/mcp', {
        method: 'POST',
        headers,
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params }),
      }),
    );
    assert.equal(response.status, 413);
  }
});

for (const era of ['legacy', 'modern']) {
  test(
    `stdio: ${era} clients can use all seven tools and recover from invalid input`,
    { timeout: 20_000 },
    async (t) => {
      const client = createClient(era);
      const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath], stderr: 'pipe' });
      t.after(() => client.close());
      await client.connect(transport);
      assert.equal(client.getProtocolEra(), era);
      await checkToolContracts(client);
    },
  );

  test(`HTTP: ${era} clients use the same stateless tool contracts`, { timeout: 20_000 }, async (t) => {
    const handler = createEasingWizardMcpHandler();
    const client = createClient(era);
    t.after(async () => {
      await client.close();
      await handler.close();
    });
    const transport = new StreamableHTTPClientTransport(new URL('http://localhost/mcp'), {
      fetch: (url, init) => handler.fetch(new Request(url, init)),
    });
    await client.connect(transport);
    assert.equal(client.getProtocolEra(), era);
    await checkToolContracts(client);
  });
}
