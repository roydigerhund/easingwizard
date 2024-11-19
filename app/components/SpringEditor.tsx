import { useEffect, useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createSpringFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function SpringEditor() {
  const springStiffness = useEasingStore((state) => state.springStiffness);
  const springDamping = useEasingStore((state) => state.springDamping);
  const springMass = useEasingStore((state) => state.springMass);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing(
      createSpringFunction({
        stiffness: springStiffness,
        damping: springDamping,
        mass: springMass,
      }),
      editorAccuracy,
    );
    setPoints(sampledPoints);
    setState({ springValue: easingValue });
  }, [springStiffness, springDamping, springMass, editorAccuracy, setState]);

  const handleChange = (state: Partial<EasingState>) => {
    setState({ ...state, springIsCustom: true });
  };

  return (
    <div className="relative col-span-2">
      <EditorBase>
        {/* Spring Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')} />
          <polyline
            strokeWidth="6"
            points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')}
            filter='url("#f1")'
          />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Mass"
          value={springMass}
          onChange={(value) => handleChange({ springMass: value })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Stiffness"
          value={springStiffness}
          onChange={(value) => handleChange({ springStiffness: value })}
          min={1}
          max={500}
          step={1}
        />
        <Slider
          label="Damping"
          value={springDamping}
          onChange={(value) => handleChange({ springDamping: value })}
          min={5}
          max={25}
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
