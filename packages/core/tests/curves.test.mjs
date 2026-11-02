import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  BezierParamsSchema,
  EasingCurveResponseSchema,
  ParamsUnionSchema,
  PresetsResponseSchema,
  addCrc,
  createCurveResponseFromId,
  createCurveResponseFromInput,
  createPresetsResponse,
  decodeState,
  encodeState,
  generateLinearEasing,
} from '../dist/index.js';

const examples = [
  ['BEZIER', { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 }],
  ['SPRING', { mass: 2, stiffness: 50, damping: 50, accuracy: 'HIGH' }],
  ['BOUNCE', { bounces: 3, damping: 50, accuracy: 'HIGH' }],
  ['WIGGLE', { wiggles: 3, damping: 50, accuracy: 'HIGH' }],
  ['OVERSHOOT', { style: 'OUT', mass: 2, damping: 50, accuracy: 'HIGH' }],
];

test('all 68 published presets retain their CSS when read by ID and satisfy the response schemas', async () => {
  const response = await createPresetsResponse();
  assert.equal(response.presets.length, 68);
  assert.equal(PresetsResponseSchema.safeParse(response).success, true);
  for (const preset of response.presets) {
    const curve = createCurveResponseFromId(preset.id);
    assert.equal(curve.output.css, preset.output.css, preset.id);
    assert.equal(EasingCurveResponseSchema.safeParse(curve).success, true, preset.id);
  }
});

for (const [type, config] of examples) {
  test(`${type}: creation, shared ID, and union validation agree`, () => {
    const created = createCurveResponseFromInput({ type, config });
    const restored = createCurveResponseFromId(created.id);
    assert.deepEqual(restored.input, created.input);
    assert.deepEqual(restored.output, created.output);
    assert.equal(ParamsUnionSchema.safeParse(config).success, true);
    assert.equal(EasingCurveResponseSchema.safeParse(created).success, true);
  });
}

test('safeParse reports invalid numbers without throwing and preserves field paths', () => {
  for (const value of [undefined, null, '0.5', NaN, Infinity, -Infinity]) {
    const result = BezierParamsSchema.safeParse({ x1: value, y1: 0, x2: 1, y2: 1 });
    assert.equal(result.success, false);
    assert.deepEqual(result.error.issues[0].path, ['x1']);
  }
  assert.equal(ParamsUnionSchema.safeParse({}).success, false);
  assert.equal(BezierParamsSchema.parse({ x1: 0.12345, y1: 0, x2: 1, y2: 1 }).x1, 0.123);
});

test('legacy shared URLs keep omitted defaults, including bounce and wiggle mass', () => {
  assert.equal(createCurveResponseFromId('0a2m3n30y21E').input.mass, 1);
  assert.equal(createCurveResponseFromId('0a3p3q20y23U').input.mass, 1);
  assert.equal(createCurveResponseFromId('0a0d.25e.1f.75g.914').output.css, 'cubic-bezier(0.25, 0.1, 0.75, 0.9)');
  const precise = encodeState({ easingType: 'BEZIER', bezierX1: 0.12345 });
  assert.equal(decodeState(precise).bezierX1, 0.12345);
});

test('checksum-valid IDs reject out-of-range parameters and unknown enum values or versions', () => {
  for (const state of [
    { easingType: 'SPRING', springDamping: -1 },
    { easingType: 'BEZIER', bezierX1: -10, bezierX2: 5 },
    { easingType: 'BOUNCE', bounceBounces: 999 },
    { easingType: 'WIGGLE', wiggleMass: 0 },
    { easingType: 'OVERSHOOT', overshootMass: 100 },
  ]) {
    assert.throws(() => createCurveResponseFromId(encodeState(state)));
  }
  assert.throws(() => decodeState('0' + addCrc('a9')), /Invalid value/);
  assert.throws(() => decodeState('0' + addCrc('a1h99')), /Invalid value/);
  assert.throws(() => decodeState('1a0d.25e.1f.75g.914'), /Unsupported version/);
  assert.throws(() => decodeState('0a0d.25e.1f.75g.915'), /checksum/);
});

test('zero-mass and non-settling springs return errors without blocking the process', () => {
  const moduleUrl = new URL('../dist/index.js', import.meta.url).href;
  const program = `
    import assert from 'node:assert/strict';
    import { createCurveResponseFromId, encodeState, generateLinearEasing } from ${JSON.stringify(moduleUrl)};
    assert.throws(() => createCurveResponseFromId(encodeState({ easingType: 'SPRING', springMass: 0 })));
    assert.throws(() => generateLinearEasing({ type: 'SPRING', mass: 0, stiffness: 50, damping: 50, accuracy: 'HIGH' }), /non-finite/);
    assert.throws(() => generateLinearEasing({ type: 'SPRING', mass: 1e100, stiffness: 50, damping: 50, accuracy: 'HIGH' }), /did not settle/);
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', program], {
    timeout: 2000,
    encoding: 'utf8',
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr);
});

test('valid spring extremes still settle with finite CSS', () => {
  for (const mass of [1, 5]) {
    for (const stiffness of [0, 100]) {
      for (const damping of [0, 100]) {
        const result = generateLinearEasing({ type: 'SPRING', mass, stiffness, damping, accuracy: 'HIGH' });
        assert.ok(Number.isFinite(result.totalTime));
        assert.doesNotMatch(result.easingValue, /NaN|Infinity/);
        assert.match(result.easingValue, /, 1\)$/);
      }
    }
  }
});

test('API links include the published version prefix', async () => {
  const presets = await createPresetsResponse('BEZIER');
  assert.equal(presets.links.self, '/v1/presets?type=BEZIER');
  assert.equal(presets.links.filter, '/v1/presets{?type}');
  for (const preset of presets.presets) {
    assert.equal(preset.links.self, `/v1/curves/${preset.id}`);
    assert.equal(preset.links.create, '/v1/curves/bezier');
  }
  const curve = createCurveResponseFromInput({ type: examples[0][0], config: examples[0][1] });
  assert.equal(curve.links.self, `/v1/curves/${curve.id}`);
  assert.equal(curve.links.create, '/v1/curves/bezier');
});
