import { generateOvershootSVGPolyline, LinearEasingAccuracy } from 'easingwizard-core';
import { useEasingStore } from '~/state/easing-store';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function OvershootEditor() {
  const overshootDamping = useEasingStore((state) => state.overshootDamping);
  const overshootMass = useEasingStore((state) => state.overshootMass);
  const overshootPoints = useEasingStore((state) => state.overshootPoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const updateCurve = useEasingStore((state) => state.updateCurve);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Overshoot Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateOvershootSVGPolyline(overshootPoints)} />
          <polyline strokeWidth="6" points={generateOvershootSVGPolyline(overshootPoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Mass"
          value={overshootMass}
          onChange={(value) => updateCurve({ overshootMass: value, overshootIsCustom: true })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={overshootDamping}
          onChange={(value) => updateCurve({ overshootDamping: value, overshootIsCustom: true })}
          min={0}
          max={100}
          step={1}
        />

        <StepSlider
          label="Accuracy"
          value={editorAccuracy}
          options={Object.values(LinearEasingAccuracy).map((value) => value)}
          onChange={(value) => updateCurve({ editorAccuracy: value })}
        />
      </InputGroup>
    </div>
  );
}
