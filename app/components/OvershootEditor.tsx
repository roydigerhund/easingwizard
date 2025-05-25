import { useEffect, useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy, Point } from '~/types-and-enums';
import { generateLinearEasing } from '~/utils/easing';
import { generateOvershootSVGPolyline } from '~/utils/svg';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function OvershootEditor() {
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootDamping = useEasingStore((state) => state.overshootDamping);
  const overshootMass = useEasingStore((state) => state.overshootMass);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.OVERSHOOT,
      accuracy: editorAccuracy,
      damping: overshootDamping,
      mass: overshootMass,
      style: overshootStyle,
    });
    setPoints(sampledPoints);
    setState({ overshootValue: easingValue });
  }, [overshootDamping, overshootMass, overshootStyle, editorAccuracy, setState]);

  const handleChange = (state: Partial<EasingState>) => {
    setState({ ...state, overshootIsCustom: true });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Overshoot Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateOvershootSVGPolyline(points)} />
          <polyline strokeWidth="6" points={generateOvershootSVGPolyline(points)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Mass"
          value={overshootMass}
          onChange={(value) => handleChange({ overshootMass: value })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={overshootDamping}
          onChange={(value) => handleChange({ overshootDamping: value })}
          min={50}
          max={100}
          step={1}
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
