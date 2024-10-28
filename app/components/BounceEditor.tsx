import { useEffect, useMemo, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createBounceFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';

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
            className="opacity-100"
            strokeWidth="6"
            points={points.map((point) => `${point.x},${100 - point.y}`).join(' ')}
            filter='url("#f1")'
          />
        </EditorBaseLine>
      </EditorBase>

      <div className="flex flex-col gap-4 pt-12" style={{ marginBottom: '20px' }}>
        <label style={{ marginLeft: '10px' }}>
          Bounces:
          <input
            type="range"
            value={bounceBounces}
            onChange={(e) => setState({ bounceBounces: parseFloat(e.target.value) })}
            step="1"
            min="1"
            max="10"
          />
          {bounceBounces}
        </label>
        <label style={{ marginLeft: '10px' }}>
          Damping:
          <input
            type="range"
            value={bounceDamping}
            onChange={(e) => setState({ bounceDamping: parseFloat(e.target.value) })}
            step="0.1"
            min="-2"
            max="2"
          />
          {bounceDamping}
        </label>
        <label style={{ marginLeft: '10px' }}>
          Accuracy:
          <select value={accuracy} onChange={(e) => setAccuracy(e.target.value as LinearEasingAccuracy)}>
            {Object.values(LinearEasingAccuracy).map((accuracy) => (
              <option key={accuracy} value={accuracy}>
                {accuracy}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
