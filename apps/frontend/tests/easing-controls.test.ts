import {
  createCurveResponseFromId,
  decodeState,
  defaultEasingState,
  encodeState,
  generateLinearEasing,
  overshootFunctions,
  reduceStateForShare,
  rehydrateShareState,
  suggestDuration,
} from 'easingwizard-core';
import assert from 'node:assert/strict';
import test from 'node:test';
import { useEasingStore } from '../app/state/easing-store';
import { getOvershootSelection } from '../app/utils/overshoot-selection';
import { parseSliderInput, stepPrecision } from '../app/utils/slider-input';

test('custom Overshoot style changes preserve controls, curve, duration, and share roundtrips', () => {
  for (const style of ['IN', 'OUT', 'IN_OUT'] as const) {
    for (const damping of [40, 0]) {
      const config = { style, mass: 2, damping, accuracy: 'HIGH' as const };
      const { restoreState, updateCurve, getCurrentState } = useEasingStore.getState();
      restoreState({ ...defaultEasingState, easingType: 'OVERSHOOT', editorAccuracy: config.accuracy });
      updateCurve(getOvershootSelection(config), { resetDuration: true });
      const state = getCurrentState();
      assert.equal(state.overshootMass, 2);
      assert.equal(state.overshootDamping, damping);
      assert.equal(state.overshootIsCustom, true);
      const expected = generateLinearEasing({ type: 'OVERSHOOT', ...config });
      assert.equal(state.overshootValue, expected.easingValue);
      assert.deepEqual(state.overshootPoints, expected.sampledPoints);
      const duration = suggestDuration('OVERSHOOT', config);
      assert.equal(state.previewDuration, Math.round((duration.min + duration.max) / 2 / 25) * 25);
      const restored = createCurveResponseFromId(encodeState(reduceStateForShare(state)));
      assert.equal(restored.output.css, state.overshootValue);
      assert.deepEqual(restored.input, config);
    }
  }
});

test('selecting an Overshoot preset replaces custom parameters consistently', () => {
  const curve = 'SOFT';
  const patch = getOvershootSelection({ style: 'IN', curve, mass: 4, damping: 12 });
  assert.equal(patch.overshootIsCustom, false);
  assert.equal(patch.overshootCurve, curve);
  assert.equal(patch.overshootMass, overshootFunctions.IN[curve].mass);
  assert.equal(patch.overshootDamping, overshootFunctions.IN[curve].damping);
  const { restoreState, updateCurve, getCurrentState } = useEasingStore.getState();
  restoreState({ ...defaultEasingState, easingType: 'OVERSHOOT', editorAccuracy: 'HIGH' });
  updateCurve(patch, { resetDuration: true });
  const state = getCurrentState();
  const restored = createCurveResponseFromId(encodeState(reduceStateForShare(state)));
  assert.equal(restored.output.css, state.overshootValue);
});

test('Spring edits update the suggested duration and preserve a manually set duration', () => {
  const { setEasingType, restoreState, updateCurve, setPreviewDuration, getCurrentState } = useEasingStore.getState();
  restoreState(defaultEasingState);
  setEasingType('SPRING');

  const initial = getCurrentState();
  updateCurve({ springMass: 4.5, springIsCustom: true });
  const state = getCurrentState();
  const { min, max } = suggestDuration(
    'SPRING',
    {
      mass: state.springMass,
      stiffness: state.springStiffness,
      damping: state.springDamping,
      accuracy: state.editorAccuracy,
    },
    state.springTotalTime,
  );
  assert.equal(state.previewDuration, Math.round((min + max) / 2 / 25) * 25);
  assert.notEqual(state.previewDuration, initial.previewDuration);

  setPreviewDuration(450);
  updateCurve({ springMass: 4.6 });
  updateCurve({ springStiffness: 40, springDamping: 12 });
  updateCurve({ editorAccuracy: 'ULTRA' });
  setEasingType('SPRING');
  assert.equal(getCurrentState().previewDuration, 450);
  assert.equal(getCurrentState().springMass, 4.6);

  assert.equal(useEasingStore.getState().previewDurationIsManual, true);
});

test('restored manual durations survive editing and reset on a new basis', () => {
  const { setEasingType, restoreState, updateCurve, setPreviewDuration, getCurrentState } = useEasingStore.getState();
  restoreState(defaultEasingState);
  setEasingType('SPRING');
  setPreviewDuration(450);
  const saved = encodeState(reduceStateForShare(getCurrentState()));
  restoreState(rehydrateShareState(decodeState(saved)));

  updateCurve({ springMass: 4.6, springIsCustom: true });
  assert.equal(getCurrentState().previewDuration, 450);
  updateCurve({ springMass: 1.5 }, { resetDuration: true });
  assert.equal(useEasingStore.getState().previewDurationIsManual, false);
  assert.notEqual(getCurrentState().previewDuration, 450);

  setPreviewDuration(1700);
  setEasingType('BOUNCE');
  assert.equal(useEasingStore.getState().previewDurationIsManual, false);
  assert.notEqual(getCurrentState().previewDuration, 1700);
});

const bezierInput = { min: -1, max: 2, step: 0.001 };

test('comma and dot decimal inputs emit the same numeric values', () => {
  for (const [comma, dot, expected] of [
    ['0,25', '0.25', 0.25],
    ['-0,25', '-0.25', -0.25],
    [',125', '.125', 0.125],
    ['-,125', '-.125', -0.125],
  ] as const) {
    assert.equal(parseSliderInput(comma, bezierInput)?.value, expected);
    assert.equal(parseSliderInput(dot, bezierInput)?.value, expected);
  }
});

test('typing negative decimals preserves incomplete input and trailing zeros', () => {
  for (const text of ['', '-', ',', '-,']) {
    assert.deepEqual(parseSliderInput(text, bezierInput), { text });
  }
  for (const text of ['-0', '-0,', '-0,0', '-0,00', '-0,001', '0,250', '1.']) {
    assert.equal(parseSliderInput(text, bezierInput)?.text, text);
  }
  assert.equal(parseSliderInput('-0,001', bezierInput)?.value, -0.001);
});

test('precision, step sizes, and bounds remain enforced without parsing malformed prefixes', () => {
  assert.equal(parseSliderInput('0,1234', bezierInput), null);
  for (const text of ['0,2.5', '1abc', '--1', 'NaN', 'Infinity', '1e3']) {
    assert.equal(parseSliderInput(text, bezierInput), null);
  }
  assert.deepEqual(parseSliderInput('5', bezierInput), { text: '2', value: 2 });
  assert.deepEqual(parseSliderInput('-5', bezierInput), { text: '-1', value: -1 });
  assert.deepEqual(parseSliderInput('0,23', { min: 0, max: 1, step: 0.05 }), { text: '0.25', value: 0.25 });
  assert.deepEqual(parseSliderInput('0', { min: 0, max: 100, step: 1 }), { text: '0', value: 0 });
  assert.equal(parseSliderInput('0,2', { min: 0, max: 100, step: 1 }), null);
  assert.equal(stepPrecision(0.001), 3);
  assert.equal(stepPrecision(1e-7), 7);
});
