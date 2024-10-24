import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createWiggleFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';

export default function WiggleEditor() {
  const wiggleStiffness = useEasingStore((state) => state.wiggleStiffness);
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const wiggleInitialVelocity = useEasingStore((state) => state.wiggleInitialVelocity);
  const setState = useEasingStore((state) => state.setState);
  const [accuracy, setAccuracy] = useState(LinearEasingAccuracy.HIGH);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [duration, setDuration] = useState(1000); // In milliseconds

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints, durationMilliSeconds } = generateLinearEasing(
      createWiggleFunction({
        stiffness: wiggleStiffness,
        damping: wiggleDamping,
        initialVelocity: wiggleInitialVelocity,
      }),
      accuracy,
    );
    setPoints(sampledPoints);
    setDuration(durationMilliSeconds);
    setState({ wiggleValue: easingValue });
  }, [wiggleStiffness, wiggleDamping, wiggleInitialVelocity, accuracy, setState]);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Wiggle Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')} />
          <polyline
            className="opacity-100"
            strokeWidth="6"
            points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')}
            filter='url("#f1")'
          />
        </EditorBaseLine>
      </EditorBase>

      <div className="flex flex-col gap-4" style={{ marginBottom: '20px' }}>
        <label style={{ marginLeft: '10px' }}>
          Stiffness:
          <input
            type="range"
            value={wiggleStiffness}
            onChange={(e) => setState({ wiggleStiffness: parseFloat(e.target.value) })}
            step="1"
            min="50"
            max="250"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Damping:
          <input
            type="range"
            value={wiggleDamping}
            onChange={(e) => setState({ wiggleDamping: parseFloat(e.target.value) })}
            step="1"
            min="1"
            max="100"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Initial Velocity:
          <input
            type="range"
            value={wiggleInitialVelocity}
            onChange={(e) => setState({ wiggleInitialVelocity: parseFloat(e.target.value) })}
            step="1"
            min="-50"
            max="50"
          />
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

      <div style={{ marginBottom: '20px' }}>
        <label>
          Duration (ms):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            step="100"
          />
        </label>
      </div>
    </div>
  );
}
