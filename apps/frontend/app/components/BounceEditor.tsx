import { generateBounceSVGPolyline, LinearEasingAccuracy } from 'easingwizard-core';
import { useEasingStore } from '~/state/easing-store';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function BounceEditor() {
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceMass = useEasingStore((state) => state.bounceMass);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const bouncePoints = useEasingStore((state) => state.bouncePoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const updateCurve = useEasingStore((state) => state.updateCurve);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bounce Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateBounceSVGPolyline(bouncePoints)} />
          <polyline strokeWidth="6" points={generateBounceSVGPolyline(bouncePoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Bounces"
          value={bounceBounces}
          onChange={(value) => updateCurve({ bounceBounces: value, bounceIsCustom: true })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Mass"
          hint="Affects duration"
          value={bounceMass}
          onChange={(value) => updateCurve({ bounceMass: value, bounceIsCustom: true })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={bounceDamping}
          onChange={(value) => updateCurve({ bounceDamping: value, bounceIsCustom: true })}
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
