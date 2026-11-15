import { generateWiggleSVGPolyline, LinearEasingAccuracy } from 'easingwizard-core';
import { useEasingStore } from '~/state/easing-store';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function WiggleEditor() {
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const wiggleMass = useEasingStore((state) => state.wiggleMass);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const wigglePoints = useEasingStore((state) => state.wigglePoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const updateCurve = useEasingStore((state) => state.updateCurve);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Wiggle Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateWiggleSVGPolyline(wigglePoints)} />
          <polyline strokeWidth="6" points={generateWiggleSVGPolyline(wigglePoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Wiggles"
          value={wiggleWiggles}
          onChange={(value) => updateCurve({ wiggleWiggles: value, wiggleIsCustom: true })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Mass"
          hint="Affects duration"
          value={wiggleMass}
          onChange={(value) => updateCurve({ wiggleMass: value, wiggleIsCustom: true })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={wiggleDamping}
          onChange={(value) => updateCurve({ wiggleDamping: value, wiggleIsCustom: true })}
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
