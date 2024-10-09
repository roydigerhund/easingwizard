import { useContext, useEffect, useState } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createSpringFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';

export default function SpringEditor() {
  const {
    state: { springStiffness, springDamping, springInitialVelocity },
    saveState,
  } = useContext(EasingContext);
  const [accuracy, setAccuracy] = useState(LinearEasingAccuracy.HIGH);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [duration, setDuration] = useState(1000); // In milliseconds

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints, durationMilliSeconds } = generateLinearEasing(
      createSpringFunction({
        stiffness: springStiffness,
        damping: springDamping,
        initialVelocity: springInitialVelocity,
      }),
      accuracy,
    );
    setPoints(sampledPoints);
    setDuration(durationMilliSeconds);
    saveState({ springValue: easingValue });
  }, [springStiffness, springDamping, springInitialVelocity, accuracy, saveState]);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Spring Curve */}
        <svg
          className="absolute inset-0 z-20 overflow-visible from-blue-500 to-pink-500 dark:from-blue-600 dark:to-pink-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="url(#curve-gradient)"
          strokeLinecap="round"
        >
          <defs>
            <linearGradient id="curve-gradient">
              <stop offset="0%" stopColor="var(--tw-gradient-from)" />
              <stop offset="100%" stopColor="var(--tw-gradient-to)" />
            </linearGradient>
            <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={4} />
            </filter>
          </defs>
          <polyline strokeWidth="2" points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')} />
          <polyline
            className="opacity-50 dark:opacity-100"
            strokeWidth="6"
            points={points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ')}
            filter='url("#f1")'
          />
        </svg>
      </EditorBase>

      <div className="flex flex-col gap-4" style={{ marginBottom: '20px' }}>
        <label style={{ marginLeft: '10px' }}>
          Stiffness:
          <input
            type="range"
            value={springStiffness}
            onChange={(e) => saveState({ springStiffness: parseFloat(e.target.value) })}
            step="1"
            min="50"
            max="250"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Damping:
          <input
            type="range"
            value={springDamping}
            onChange={(e) => saveState({ springDamping: parseFloat(e.target.value) })}
            step="1"
            min="1"
            max="100"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Initial Velocity:
          <input
            type="range"
            value={springInitialVelocity}
            onChange={(e) => saveState({ springInitialVelocity: parseFloat(e.target.value) })}
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
