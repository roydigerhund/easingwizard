import { EasingCurveResponseSchema, ErrorResponseSchema, encodeState } from 'easingwizard-core';
import assert from 'node:assert/strict';
import test from 'node:test';

process.env.API_URL = 'https://api.easingwizard.com';
process.env.NODE_ENV = 'production';
const { default: app } = await import('../dist/app.js');

for (const body of ['{', '', '{}', '{"x1":"invalid","y1":0,"x2":1,"y2":1}']) {
  test(`invalid JSON/input returns a structured 400: ${JSON.stringify(body)}`, async () => {
    const response = await app.request('/v1/curves/bezier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    assert.equal(response.status, 400);
    assert.match(response.headers.get('Content-Type'), /application\/json/);
    assert.equal(ErrorResponseSchema.safeParse(await response.json()).success, true);
  });
}

test('valid curve creation returns a followable self link and consistent output', async () => {
  const created = await app.request('/v1/curves/bezier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 }),
  });
  assert.equal(created.status, 200);
  const curve = await created.json();
  assert.equal(EasingCurveResponseSchema.safeParse(curve).success, true);
  const restored = await app.request(curve.links.self);
  assert.equal(restored.status, 200);
  assert.deepEqual((await restored.json()).output, curve.output);
});

test('preset self links resolve to the advertised versioned routes', async () => {
  const response = await app.request('/v1/presets?type=BEZIER');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal((await app.request(body.links.self)).status, 200);
  for (const preset of body.presets) {
    const resolved = await app.request(preset.links.self);
    assert.equal(resolved.status, 200, preset.id);
    assert.equal((await resolved.json()).output.css, preset.output.css);
  }
});

test('an out-of-range decoded curve ID returns 400', async () => {
  const id = encodeState({ easingType: 'BEZIER', bezierX1: -10, bezierX2: 5 });
  const response = await app.request(`/v1/curves/${id}`);
  assert.equal(response.status, 400);
  assert.equal(ErrorResponseSchema.safeParse(await response.json()).success, true);
});
