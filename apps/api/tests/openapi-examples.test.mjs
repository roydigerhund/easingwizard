import assert from 'node:assert/strict';
import test from 'node:test';

process.env.API_URL = 'https://api.easingwizard.com';
process.env.NODE_ENV = 'production';
const { default: app } = await import('../dist/app.js');

async function requestJson(path, options) {
  const response = await app.request(path, options);
  assert.equal(response.status, 200, `${options?.method ?? 'GET'} ${path}`);
  return response.json();
}

const document = await requestJson('/openapi');
const server = new URL(document.servers[0].url);
const apiPath = (path) => `${server.pathname}${path}`;
const withoutTimestamp = ({ generated_at, ...curve }) => curve;
const responseMedia = (operation) => operation.responses['200'].content['application/json'];
const types = ['BEZIER', 'SPRING', 'BOUNCE', 'WIGGLE', 'OVERSHOOT'];

// Schema-based viewers may assemble a response from property examples instead
// of using the media example. Check those values against the real response too.
function assertSchemaExample(schema, expected) {
  assert.deepEqual(schema.example, expected);
  if (schema.properties && expected && typeof expected === 'object') {
    for (const [key, value] of Object.entries(expected)) {
      assertSchemaExample(schema.properties[key], value);
    }
  }
  if (Array.isArray(expected) && expected.length) {
    assertSchemaExample(schema.items, expected[0]);
  }
  if (expected?.type) {
    const alternatives = schema.anyOf ?? schema.oneOf;
    if (alternatives) {
      const variant = alternatives.find((entry) => entry.properties.type.const === expected.type);
      assert.ok(variant, `schema variant for ${expected.type}`);
      assertSchemaExample(variant, expected);
    }
  }
}

async function assertCurveLinks(curve) {
  assert.equal(curve.links.self, apiPath(`/curves/${curve.id}`));
  assert.equal(curve.links.create, apiPath(`/curves/${curve.type.toLowerCase()}`));
  const shared = new URL(curve.links.share_url);
  assert.equal(shared.origin, 'https://easingwizard.com');
  assert.equal(shared.pathname, '/');
  assert.equal(shared.hash.slice(1), curve.id);
  const restored = await requestJson(curve.links.self);
  assert.deepEqual(restored.input, curve.input ?? curve.params);
  assert.deepEqual(restored.output, curve.output);
}

for (const type of types) {
  test(`${type} documented creation and lookup examples reproduce the actual response`, async () => {
    const path = `/curves/${type.toLowerCase()}`;
    const operation = document.paths[path].post;
    const request = operation.requestBody.content['application/json'];
    const response = responseMedia(operation);
    assertSchemaExample(request.schema, request.example);
    assertSchemaExample(response.schema, response.example);

    const actual = await requestJson(apiPath(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.example),
    });
    assert.deepEqual(withoutTimestamp(response.example), withoutTimestamp(actual));
    assert.equal(actual.type, type);
    assert.match(actual.output.css, type === 'BEZIER' ? /^cubic-bezier\(/ : /^linear\(/);
    assert.match(actual.output.tailwind_css, type === 'BEZIER' ? /^ease-\[cubic-bezier\(/ : /^ease-\[linear\(/);
    assert.ok(type === 'BEZIER' ? actual.output.svg_path : actual.output.svg_polyline);
    await assertCurveLinks(response.example);

    const lookup = responseMedia(document.paths['/curves/{id}'].get);
    const lookupExample = lookup.examples[type.toLowerCase()].value;
    assert.deepEqual(lookupExample, response.example);
    const variant = (lookup.schema.anyOf ?? lookup.schema.oneOf).find((entry) => entry.properties.type.const === type);
    assertSchemaExample(variant, lookupExample);
  });
}

test('the documented curve ID has a valid checksum and matches the default lookup example', async () => {
  const operation = document.paths['/curves/{id}'].get;
  const id = operation.parameters.find((parameter) => parameter.name === 'id').schema.example;
  const actual = await requestJson(apiPath(`/curves/${id}`));
  assert.deepEqual(withoutTimestamp(responseMedia(operation).schema.example), withoutTimestamp(actual));
});

test('the documented preset query returns the complete example, including version and links', async () => {
  const operation = document.paths['/presets'].get;
  const type = operation.parameters.find((parameter) => parameter.name === 'type').schema.example;
  const media = responseMedia(operation);
  const actual = await requestJson(apiPath(`/presets?type=${type}`));
  assert.deepEqual(media.example, actual);
  assertSchemaExample(media.schema, actual);
  assert.deepEqual(await requestJson(actual.links.self), actual);
  assert.equal(actual.links.filter, `${apiPath('/presets')}{?type}`);
  assert.equal(actual.presets.length, 33);
  for (const preset of actual.presets) await assertCurveLinks(preset);
});

for (const type of types) {
  test(`${type} preset schema examples describe an actual preset with matching output and links`, async () => {
    const media = responseMedia(document.paths['/presets'].get);
    const itemSchema = media.schema.properties.presets.items;
    const variant = (itemSchema.anyOf ?? itemSchema.oneOf).find((entry) => entry.properties.type.const === type);
    const { presets } = await requestJson(apiPath(`/presets?type=${type}`));
    const actual = presets.find((preset) => preset.id === variant.example.id);
    assert.ok(actual, 'example must belong to this preset collection');
    assertSchemaExample(variant, actual);
    await assertCurveLinks(actual);
  });
}

test('the OpenAPI document remains deterministic between requests', async () => {
  assert.deepEqual(await requestJson('/openapi'), document);
});

function assertPublicCors(response) {
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(response.headers.get('Access-Control-Allow-Credentials'), null);
}

test('foreign browsers can read REST presets, health, and OpenAPI without credentials', async () => {
  for (const origin of ['https://ai.example', 'http://localhost:5173', 'null']) {
    for (const path of [apiPath('/presets'), '/healthz', apiPath('/healthz'), '/openapi']) {
      const response = await app.request(new URL(path, server).href, { headers: { Origin: origin } });
      assert.equal(response.status, 200, `${path} from ${origin}`);
      assertPublicCors(response);
      assert.match(response.headers.get('Access-Control-Expose-Headers'), /Retry-After/i);
      const body = await response.json();
      if (path.endsWith('/healthz')) assert.equal(body.status, 'ok');
      else if (path.endsWith('/openapi')) assert.equal(body.openapi, '3.1.0');
      else assert.equal(body.presets.length, 68);
    }
  }
});

test('REST preflights permit public GET, HEAD, and POST with explicit request headers', async () => {
  for (const [method, path] of [
    ['POST', apiPath('/curves/bezier')],
    ['GET', apiPath('/presets')],
    ['HEAD', '/openapi'],
  ]) {
    const preflight = await app.request(new URL(path, server).href, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://ai.example',
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'content-type,accept,authorization',
      },
    });
    assert.equal(preflight.status, 204);
    assertPublicCors(preflight);
    const methods = preflight.headers.get('Access-Control-Allow-Methods').split(/\s*,\s*/);
    for (const allowed of ['GET', 'HEAD', 'POST', 'OPTIONS']) assert.ok(methods.includes(allowed), allowed);
    const headers = preflight.headers
      .get('Access-Control-Allow-Headers')
      .toLowerCase()
      .split(/\s*,\s*/);
    for (const allowed of ['content-type', 'accept', 'authorization']) assert.ok(headers.includes(allowed), allowed);
    assert.ok(!headers.includes('*'));
  }
});

test('foreign browsers can create curves, follow their self links, and read validation errors', async () => {
  const operation = document.paths['/curves/bezier'].post;
  const request = operation.requestBody.content['application/json'].example;
  const headers = { Origin: 'https://ai.example', 'Content-Type': 'application/json' };
  const path = new URL(apiPath('/curves/bezier'), server).href;
  const created = await app.request(path, { method: 'POST', headers, body: JSON.stringify(request) });
  assert.equal(created.status, 200);
  assertPublicCors(created);
  const curve = await created.json();
  assert.deepEqual(withoutTimestamp(curve), withoutTimestamp(responseMedia(operation).example));
  const restored = await app.request(new URL(curve.links.self, server).href, { headers: { Origin: headers.Origin } });
  assert.equal(restored.status, 200);
  assertPublicCors(restored);
  assert.deepEqual((await restored.json()).output, curve.output);
  for (const body of ['{', JSON.stringify({ ...request, x1: 'invalid' })]) {
    const invalid = await app.request(path, { method: 'POST', headers, body });
    assert.equal(invalid.status, 400);
    assertPublicCors(invalid);
    assert.ok(Array.isArray((await invalid.json()).errors));
  }
});
