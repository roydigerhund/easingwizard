import { encodeState } from 'easingwizard-core';
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.API_URL = 'https://api.easingwizard.com';
process.env.NODE_ENV = 'production';
process.env.MCP_ALLOWED_ORIGINS = 'https://studio.example';
process.env.MCP_ALLOWED_HOSTS = 'proxy.example, CUSTOM.EXAMPLE';
process.env.VERCEL_URL = 'easingwizard-preview.vercel.app';
process.env.MCP_REQUESTS_PER_MINUTE = '600';
const { default: app, createApp } = await import('../dist/app.js');

const modernVersion = '2026-07-28';
const legacyVersion = '2025-11-25';
const clientInfo = { name: 'easingwizard-api-test', version: '1.0.0' };
const accept = 'application/json, text/event-stream';
const publicUrl = 'https://api.easingwizard.com/mcp';
const foreignOrigin = 'https://ai.example';
let nextId = 1;

function assertCors(response, origin) {
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(response.headers.get('Access-Control-Allow-Credentials'), null);
}

function legacyMessage(method, params = {}) {
  return { jsonrpc: '2.0', id: nextId++, method, params };
}

function modernMessage(method, params = {}) {
  return legacyMessage(method, {
    ...params,
    _meta: {
      'io.modelcontextprotocol/protocolVersion': modernVersion,
      'io.modelcontextprotocol/clientInfo': clientInfo,
      'io.modelcontextprotocol/clientCapabilities': {},
    },
  });
}

function post(message, { headers = {}, target = app, url = '/mcp' } = {}) {
  return target.request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: accept, ...headers },
    body: JSON.stringify(message),
  });
}

function postModern(message, options = {}) {
  return post(message, {
    ...options,
    headers: {
      'MCP-Protocol-Version': modernVersion,
      'Mcp-Method': message.method,
      ...(message.params.name ? { 'Mcp-Name': message.params.name } : {}),
      ...options.headers,
    },
  });
}

async function rpc(response) {
  const text = await response.text();
  if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
    const messages = text
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => JSON.parse(line.slice(6)));
    const terminal = messages.findLast((message) => 'result' in message || 'error' in message);
    assert.ok(terminal, `No terminal JSON-RPC message: ${text}`);
    return terminal;
  }
  return JSON.parse(text);
}

function assertCurveResult(message) {
  assert.equal(message.error, undefined);
  assert.notEqual(message.result.isError, true);
  assert.equal(message.result.structuredContent.type, 'BEZIER');
  assert.equal(message.result.structuredContent.output.css, 'cubic-bezier(0.25, 0.1, 0.75, 0.9)');
  assert.match(message.result.structuredContent.links.self, /^\/v1\/curves\//);
}

const curveCall = {
  name: 'create_bezier_curve',
  arguments: { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 },
};

test('mounted /mcp supports legacy initialization, tool listing, and native calls without Origin', async () => {
  const initialized = await post(
    legacyMessage('initialize', {
      protocolVersion: legacyVersion,
      clientInfo,
      capabilities: {},
    }),
  );
  assert.equal(initialized.status, 200);
  assert.equal(initialized.headers.get('Mcp-Session-Id'), null);
  const init = await rpc(initialized);
  assert.equal(init.result.protocolVersion, legacyVersion);
  assert.equal(init.result.serverInfo.name, 'easingwizard');
  assert.ok(init.result.capabilities.tools);

  const notification = await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
  assert.equal(notification.status, 202);

  const listed = await post(legacyMessage('tools/list'), {
    headers: { 'MCP-Protocol-Version': legacyVersion },
  });
  assert.equal(listed.status, 200);
  const tools = (await rpc(listed)).result.tools;
  assert.equal(tools.length, 7);
  assert.ok(tools.every((tool) => tool.annotations.readOnlyHint));
  const called = await post(legacyMessage('tools/call', curveCall), {
    headers: { 'MCP-Protocol-Version': legacyVersion },
  });
  assert.equal(called.status, 200);
  assertCurveResult(await rpc(called));
});

test('mounted /mcp supports modern discovery, listing, and calls with per-request envelopes', async () => {
  const discovered = await postModern(modernMessage('server/discover'));
  assert.equal(discovered.status, 200);
  assert.match(discovered.headers.get('Content-Type'), /application\/json/);
  const discovery = await rpc(discovered);
  assert.ok(discovery.result.supportedVersions.includes(modernVersion));
  assert.equal(discovery.result._meta['io.modelcontextprotocol/serverInfo'].name, 'easingwizard');
  assert.match(discovery.result.instructions, /easing/i);

  const listed = await postModern(modernMessage('tools/list'));
  assert.equal(listed.status, 200);
  assert.equal((await rpc(listed)).result.tools.length, 7);

  const called = await postModern(modernMessage('tools/call', curveCall));
  assert.equal(called.status, 200);
  const message = await rpc(called);
  assert.equal(message.result.resultType, 'complete');
  assertCurveResult(message);
});

test('modern requests reject missing envelopes and mismatched method/name headers', async () => {
  const missingEnvelope = await post(legacyMessage('tools/list'), {
    headers: { 'MCP-Protocol-Version': modernVersion, 'Mcp-Method': 'tools/list' },
  });
  assert.equal(missingEnvelope.status, 400);
  assert.ok((await rpc(missingEnvelope)).error);
  for (const headers of [{ 'Mcp-Method': 'tools/list' }, { 'Mcp-Name': 'get_presets' }]) {
    const response = await postModern(modernMessage('tools/call', curveCall), { headers });
    assert.equal(response.status, 400);
    assert.ok((await rpc(response)).error);
  }
});

test('private destinations retain their configured origin allowlist without credentials', async () => {
  for (const origin of ['https://easingwizard.com', 'https://api.easingwizard.com', 'https://studio.example']) {
    const response = await postModern(modernMessage('tools/list'), { headers: { Origin: origin } });
    assert.equal(response.status, 200, origin);
    assertCors(response, origin);
    assert.match(response.headers.get('Access-Control-Expose-Headers'), /MCP-Protocol-Version/i);
    await rpc(response);
  }
});

test('public API and preview destinations accept arbitrary web origins, opaque origins, and native clients', async () => {
  for (const url of [publicUrl, 'https://easingwizard-preview.vercel.app/mcp']) {
    for (const origin of [foreignOrigin, 'https://studio.example', 'http://localhost:5173', 'null', undefined]) {
      const response = await postModern(modernMessage('tools/list'), {
        url,
        headers: origin === undefined ? {} : { Origin: origin },
      });
      assert.equal(response.status, 200, `${url} from ${origin}`);
      assertCors(response, '*');
      assert.equal((await rpc(response)).result.tools.length, 7);
    }
  }
});

test('foreign browsers can discover and call modern MCP and complete the legacy handshake', async () => {
  const options = { url: publicUrl, headers: { Origin: foreignOrigin } };
  const discovery = await postModern(modernMessage('server/discover'), options);
  assert.equal(discovery.status, 200);
  assertCors(discovery, '*');
  assert.ok((await rpc(discovery)).result.supportedVersions.includes(modernVersion));
  const modernCall = await postModern(modernMessage('tools/call', curveCall), options);
  assert.equal(modernCall.status, 200);
  assertCors(modernCall, '*');
  assertCurveResult(await rpc(modernCall));

  const initialized = await post(
    legacyMessage('initialize', { protocolVersion: legacyVersion, clientInfo, capabilities: {} }),
    options,
  );
  assert.equal(initialized.status, 200);
  assertCors(initialized, '*');
  assert.equal((await rpc(initialized)).result.protocolVersion, legacyVersion);
  const notification = await post({ jsonrpc: '2.0', method: 'notifications/initialized' }, options);
  assert.equal(notification.status, 202);
  assertCors(notification, '*');
  const legacyCall = await post(legacyMessage('tools/call', curveCall), {
    ...options,
    headers: { ...options.headers, 'MCP-Protocol-Version': legacyVersion },
  });
  assert.equal(legacyCall.status, 200);
  assertCors(legacyCall, '*');
  assertCurveResult(await rpc(legacyCall));
});

test('public preflights allow standard MCP headers and let browsers read unsupported-method responses', async () => {
  const requestHeaders = [
    'content-type',
    'accept',
    'authorization',
    'mcp-protocol-version',
    'mcp-method',
    'mcp-name',
    'mcp-session-id',
    'last-event-id',
  ];
  for (const origin of [foreignOrigin, 'null']) {
    for (const method of ['POST', 'GET', 'DELETE']) {
      const response = await app.request(publicUrl, {
        method: 'OPTIONS',
        headers: {
          Origin: origin,
          'Access-Control-Request-Method': method,
          'Access-Control-Request-Headers': requestHeaders.join(','),
        },
      });
      assert.equal(response.status, 204);
      assertCors(response, '*');
      const methods = response.headers.get('Access-Control-Allow-Methods').split(/\s*,\s*/);
      for (const name of ['GET', 'POST', 'DELETE', 'OPTIONS']) assert.ok(methods.includes(name), name);
      const allowed = response.headers
        .get('Access-Control-Allow-Headers')
        .toLowerCase()
        .split(/\s*,\s*/);
      for (const name of requestHeaders) assert.ok(allowed.includes(name), name);
      assert.ok(!allowed.includes('*'), 'request headers remain explicit');
    }
  }
  for (const method of ['GET', 'DELETE']) {
    const response = await app.request(publicUrl, {
      method,
      headers: { Origin: foreignOrigin, Accept: accept, 'MCP-Protocol-Version': legacyVersion },
    });
    assert.equal(response.status, 405);
    assertCors(response, '*');
    const exposed = response.headers
      .get('Access-Control-Expose-Headers')
      .toLowerCase()
      .split(/\s*,\s*/);
    for (const name of ['mcp-protocol-version', 'mcp-session-id', 'retry-after', 'allow']) {
      assert.ok(exposed.includes(name), name);
    }
    assert.ok((await rpc(response)).error);
  }
});

test('public destinations reject malformed or non-web origins before CORS and MCP processing', async () => {
  for (const origin of [
    '',
    'not-an-origin',
    'file://',
    'ftp://example.com',
    'https://example.com/',
    'https://example.com/path',
    'https://user@example.com',
    'https://example.com:443',
    'https://EXAMPLE.com',
    'https://one.example https://two.example',
  ]) {
    for (const method of ['POST', 'OPTIONS']) {
      const response = await app.request(publicUrl, {
        method,
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        ...(method === 'POST' ? { body: JSON.stringify(legacyMessage('tools/list')) } : {}),
      });
      assert.equal(response.status, 403, `${method} from ${JSON.stringify(origin)}`);
      assertCors(response, null);
      assert.match((await response.json()).error, /Origin/);
    }
  }
});

test('public CORS cannot be enabled by mixing private URL and public Host, or vice versa', async () => {
  for (const host of ['localhost:3000', '127.0.0.1:3000', '[::1]:3000', 'proxy.example', 'custom.example']) {
    for (const [url, hostHeader] of [
      [`http://${host}/mcp`, host],
      [`http://${host}/mcp`, 'api.easingwizard.com'],
      [publicUrl, host],
    ]) {
      const response = await postModern(modernMessage('tools/list'), {
        url,
        headers: { Host: hostHeader, Origin: foreignOrigin },
      });
      assert.equal(response.status, 403, `${url} with Host ${hostHeader}`);
      assertCors(response, null);
      assert.match((await response.json()).error, /Origin/);
    }
  }
});

test('public protocol and body-limit errors remain readable without credentials', async () => {
  for (const [body, contentType, status] of [
    ['{', 'application/json', 400],
    [JSON.stringify(legacyMessage('tools/list')), 'text/plain', 415],
    [JSON.stringify(legacyMessage('tools/list', { padding: 'x'.repeat(64 * 1024) })), 'application/json', 413],
  ]) {
    const response = await app.request(publicUrl, {
      method: 'POST',
      headers: { Origin: foreignOrigin, Accept: accept, 'Content-Type': contentType },
      body,
    });
    assert.equal(response.status, status);
    assertCors(response, '*');
    assert.ok((await rpc(response)).error);
  }
});

test('private destinations reject unknown origins and local browser origins in production', async () => {
  for (const origin of ['https://attacker.example', 'null', 'http://localhost:3000']) {
    const response = await postModern(modernMessage('tools/list'), { headers: { Origin: origin } });
    assert.equal(response.status, 403, origin);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
    assert.match((await response.json()).error, /Origin/);
  }
});

test('private destination preflights allow MCP request headers only for approved origins', async () => {
  const response = await app.request('/mcp', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://easingwizard.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,mcp-protocol-version,mcp-method,mcp-name',
    },
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://easingwizard.com');
  assert.match(response.headers.get('Access-Control-Allow-Methods'), /POST/);
  const allowed = response.headers.get('Access-Control-Allow-Headers').toLowerCase();
  for (const name of ['content-type', 'mcp-protocol-version', 'mcp-method', 'mcp-name']) {
    assert.ok(allowed.includes(name), name);
  }
  const blocked = await app.request('/mcp', {
    method: 'OPTIONS',
    headers: { Origin: 'https://attacker.example', 'Access-Control-Request-Method': 'POST' },
  });
  assert.equal(blocked.status, 403);
});

test('createApp permits local browser origins during development', async () => {
  process.env.NODE_ENV = 'development';
  let developmentApp;
  try {
    developmentApp = createApp();
  } finally {
    process.env.NODE_ENV = 'production';
  }
  const response = await postModern(modernMessage('tools/list'), {
    target: developmentApp,
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5173');
  await rpc(response);
});

test('malformed JSON and non-JSON media types fail with protocol errors', async () => {
  const malformed = await app.request('/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: accept },
    body: '{',
  });
  assert.equal(malformed.status, 400);
  assert.equal((await rpc(malformed)).error.code, -32700);
  const wrongType = await app.request('/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain', Accept: accept },
    body: JSON.stringify(legacyMessage('tools/list')),
  });
  assert.equal(wrongType.status, 415);
  assert.ok((await rpc(wrongType)).error);
});

test('the mounted endpoint enforces the 64 KiB request-body limit', async () => {
  const boundaryMessage = legacyMessage('tools/list', { _meta: { padding: '' } });
  const overhead = Buffer.byteLength(JSON.stringify(boundaryMessage));
  boundaryMessage.params._meta.padding = 'x'.repeat(64 * 1024 - overhead);
  assert.equal(Buffer.byteLength(JSON.stringify(boundaryMessage)), 64 * 1024);
  const accepted = await post(boundaryMessage);
  assert.equal(accepted.status, 200);
  assert.equal((await rpc(accepted)).result.tools.length, 7);
  boundaryMessage.params._meta.padding += 'x';
  const rejected = await post(boundaryMessage);
  assert.equal(rejected.status, 413);
  assert.ok((await rpc(rejected)).error);
});

test('stateless HTTP rejects GET, DELETE, and PUT', async () => {
  for (const method of ['GET', 'DELETE', 'PUT']) {
    const response = await app.request('/mcp', { method, headers: { Accept: accept } });
    assert.equal(response.status, 405, method);
    assert.ok((await rpc(response)).error);
  }
});

test('invalid decoded IDs produce tool errors and subsequent requests remain usable', async () => {
  const invalidCall = {
    name: 'get_curve_by_id',
    arguments: { id: encodeState({ easingType: 'SPRING', springMass: 0 }) },
  };
  for (const send of [
    (method, params) => post(legacyMessage(method, params)),
    (method, params) => postModern(modernMessage(method, params)),
  ]) {
    const invalid = await send('tools/call', invalidCall);
    assert.equal(invalid.status, 200);
    const error = await rpc(invalid);
    assert.equal(error.error, undefined);
    assert.equal(error.result.isError, true);
    const recovery = await send('tools/call', curveCall);
    assert.equal(recovery.status, 200);
    assertCurveResult(await rpc(recovery));
  }
});

test('configured public, preview, and loopback hostnames accept native MCP requests', async () => {
  for (const host of [
    'api.easingwizard.com',
    'api.easingwizard.com:443',
    'localhost:3000',
    '127.0.0.1:3000',
    '[::1]:3000',
    'proxy.example',
    'custom.example',
    'easingwizard-preview.vercel.app',
  ]) {
    const response = await postModern(modernMessage('tools/list'), {
      url: `http://${host}/mcp`,
      headers: { Host: host },
    });
    assert.equal(response.status, 200, host);
    assert.equal((await rpc(response)).result.tools.length, 7);
  }
});

test('unapproved request URLs remain blocked even with an allowed Host header', async () => {
  for (const url of ['https://attacker.example/mcp', 'http://api.easingwizard.com.attacker.example/mcp']) {
    const response = await postModern(modernMessage('tools/list'), {
      url,
      headers: { Host: 'api.easingwizard.com', Origin: foreignOrigin },
    });
    assert.equal(response.status, 403, url);
    assert.match((await response.json()).error, /Host/);
  }
});

test('malformed or unapproved Host headers cannot bypass the hostname allowlist', async () => {
  for (const host of [
    'attacker.example',
    'api.easingwizard.com.attacker.example',
    'api.easingwizard.com@attacker.example',
    'attacker@api.easingwizard.com',
    'http://api.easingwizard.com',
    'api.easingwizard.com/path',
    'api.easingwizard.com?next=attacker',
    'api.easingwizard.com#fragment',
    'api.easingwizard.com:99999',
    'api.easingwizard.com,attacker.example',
  ]) {
    const response = await postModern(modernMessage('tools/list'), {
      url: 'https://api.easingwizard.com/mcp',
      headers: { Host: host, Origin: foreignOrigin },
    });
    assert.equal(response.status, 403, host);
    assertCors(response, null);
    assert.match((await response.json()).error, /Host/);
  }
});

for (const { label, url, origin, expectedOrigin, blockedOrigin } of [
  {
    label: 'private',
    url: '/mcp',
    origin: 'https://easingwizard.com',
    expectedOrigin: 'https://easingwizard.com',
    blockedOrigin: foreignOrigin,
  },
  {
    label: 'public',
    url: publicUrl,
    origin: foreignOrigin,
    expectedOrigin: '*',
    blockedOrigin: 'https://example.com/path',
  },
]) {
  test(`${label} request budget excludes rejected origins and preflights, exposes 429, and recovers`, async (t) => {
    let now = 1_800_000_000_000;
    t.mock.method(Date, 'now', () => now);
    process.env.MCP_REQUESTS_PER_MINUTE = '2';
    let limitedApp;
    let otherApp;
    try {
      limitedApp = createApp();
      otherApp = createApp();
    } finally {
      process.env.MCP_REQUESTS_PER_MINUTE = '600';
    }
    const options = { target: limitedApp, url, headers: { Origin: origin } };
    const rejectedOrigin = await postModern(modernMessage('tools/list'), {
      target: limitedApp,
      url,
      headers: { Origin: blockedOrigin },
    });
    assert.equal(rejectedOrigin.status, 403);
    assertCors(rejectedOrigin, null);
    const preflight = await limitedApp.request(url, {
      method: 'OPTIONS',
      headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(preflight.status, 204);
    assertCors(preflight, expectedOrigin);
    for (let i = 0; i < 2; i++) {
      const accepted = await postModern(modernMessage('tools/list'), options);
      assert.equal(accepted.status, 200);
      assertCors(accepted, expectedOrigin);
      await rpc(accepted);
    }
    const rejected = await postModern(modernMessage('tools/list'), options);
    assert.equal(rejected.status, 429);
    assert.equal(rejected.headers.get('Retry-After'), '60');
    assertCors(rejected, expectedOrigin);
    assert.match(rejected.headers.get('Access-Control-Expose-Headers'), /Retry-After/i);
    assert.match((await rejected.json()).error, /limit/);
    now += 59_001;
    const almostReset = await postModern(modernMessage('tools/list'), options);
    assert.equal(almostReset.status, 429);
    assert.equal(almostReset.headers.get('Retry-After'), '1');
    assertCors(almostReset, expectedOrigin);
    const independent = await postModern(modernMessage('tools/list'), { ...options, target: otherApp });
    assert.equal(independent.status, 200);
    await rpc(independent);
    now += 999;
    const recovered = await postModern(modernMessage('tools/list'), options);
    assert.equal(recovered.status, 200);
    assert.equal(recovered.headers.get('Retry-After'), null);
    assertCors(recovered, expectedOrigin);
    await rpc(recovered);
  });
}

test('invalid request-limit configuration fails at application creation', () => {
  try {
    for (const limit of ['', '0', '-1', '1.5', 'invalid', 'Infinity', '9007199254740992']) {
      process.env.MCP_REQUESTS_PER_MINUTE = limit;
      assert.throws(() => createApp(), /MCP_REQUESTS_PER_MINUTE must be a positive integer/, limit);
    }
  } finally {
    process.env.MCP_REQUESTS_PER_MINUTE = '600';
  }
});
