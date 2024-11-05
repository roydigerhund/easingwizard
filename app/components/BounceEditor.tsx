import { useEffect, useMemo, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createBounceFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function BounceEditor() {
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const setState = useEasingStore((state) => state.setState);
  const [accuracy, setAccuracy] = useState(LinearEasingAccuracy.HIGH);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const bounceFunc = useMemo(() => {
    return createBounceFunction({
      bounces: bounceBounces,
      damping: bounceDamping,
    });
  }, [bounceBounces, bounceDamping]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing(bounceFunc, accuracy, 1);
    setPoints(sampledPoints);
    setState({ bounceValue: easingValue });
  }, [accuracy, setState, bounceFunc]);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bounce Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={points.map((point) => `${point.x},${100 - point.y}`).join(' ')} />
          <polyline
            strokeWidth="6"
            points={points.map((point) => `${point.x},${100 - point.y}`).join(' ')}
            filter='url("#f1")'
          />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Bounces"
          value={bounceBounces}
          onChange={(value) => setState({ bounceBounces: value })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Damping"
          value={bounceDamping}
          onChange={(value) => setState({ bounceDamping: value })}
          min={-2}
          max={2}
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
