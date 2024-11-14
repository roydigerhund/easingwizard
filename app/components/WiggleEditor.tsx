import { useEffect, useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createWiggleFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function WiggleEditor() {
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const setState = useEasingStore((state) => state.setState);
  const [accuracy, setAccuracy] = useState(LinearEasingAccuracy.HIGH);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing(
      createWiggleFunction({
        // stiffness: wiggleStiffness,
        damping: wiggleDamping,
        wiggles: wiggleWiggles,
      }),
      accuracy,
      1,
      0,
    );
    setPoints(sampledPoints);
    setState({ wiggleValue: easingValue });
  }, [wiggleDamping, wiggleWiggles, accuracy, setState]);

  const handleChange = (state: Partial<EasingState>) => {
    setState({ ...state, wiggleIsCustom: true });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Wiggle Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={points.map((point) => `${point.x},${point.y / 2}`).join(' ')} />
          <polyline
            strokeWidth="6"
            points={points.map((point) => `${point.x},${point.y / 2}`).join(' ')}
            filter='url("#f1")'
          />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Wiggles"
          value={wiggleWiggles}
          onChange={(value) => handleChange({ wiggleWiggles: value })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Damping"
          value={wiggleDamping}
          onChange={(value) => handleChange({ wiggleDamping: value })}
          min={0}
          max={20}
          step={0.1}
        />

        <StepSlider
          label="Accuracy"
          value={accuracy}
          options={Object.values(LinearEasingAccuracy).map((value) => value)}
          onChange={(value) => setAccuracy(value)}
        />
      </InputGroup>
    </div>
  );
}
