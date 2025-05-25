import { useEffect, useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy, Point } from '~/types-and-enums';
import { generateLinearEasing } from '~/utils/easing';
import { generateBounceSVGPolyline } from '~/utils/svg';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function BounceEditor() {
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.BOUNCE,
      accuracy: editorAccuracy,
      bounces: bounceBounces,
      damping: bounceDamping,
    });
    setPoints(sampledPoints);
    setState({ bounceValue: easingValue });
  }, [editorAccuracy, bounceBounces, bounceDamping, setState]);

  const handleChange = (state: Partial<EasingState>) => {
    setState({ ...state, bounceIsCustom: true });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bounce Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateBounceSVGPolyline(points)} />
          <polyline strokeWidth="6" points={generateBounceSVGPolyline(points)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Bounces"
          value={bounceBounces}
          onChange={(value) => handleChange({ bounceBounces: value })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Damping"
          value={bounceDamping}
          onChange={(value) => handleChange({ bounceDamping: value })}
          min={-2}
          max={2}
          step={0.1}
        />

        <StepSlider
          label="Accuracy"
          value={editorAccuracy}
          options={Object.values(LinearEasingAccuracy).map((value) => value)}
          onChange={(value) => setState({ editorAccuracy: value })}
        />
      </InputGroup>
    </div>
  );
}
