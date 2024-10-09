import { useContext, useEffect, useState } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { createBounceFunction, generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';

export default function BounceEditor() {
  const {
    state: { bounceBounces, bounceRestitution, bounceInitialHeight },
    saveState,
  } = useContext(EasingContext);
  const [accuracy, setAccuracy] = useState(LinearEasingAccuracy.HIGH);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [duration, setDuration] = useState(1000); // In milliseconds

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints, durationMilliSeconds } = generateLinearEasing(
      createBounceFunction({
        bounces: bounceBounces,
        restitution: bounceRestitution,
        initialHeight: bounceInitialHeight,
      }),
      accuracy,
    );
    setPoints(sampledPoints);
    setDuration(durationMilliSeconds);
    saveState({ bounceValue: easingValue });
  }, [bounceBounces, bounceRestitution, bounceInitialHeight, accuracy, saveState]);

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bounce Curve */}
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
          Bounces:
          <input
            type="range"
            value={bounceBounces}
            onChange={(e) => saveState({ bounceBounces: parseFloat(e.target.value) })}
            step="1"
            min="1"
            max="10"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Restitution:
          <input
            type="range"
            value={bounceRestitution}
            onChange={(e) => saveState({ bounceRestitution: parseFloat(e.target.value) })}
            step="0.1"
            min="0"
            max="0.9"
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Initial Height:
          <input
            type="range"
            value={bounceInitialHeight}
            onChange={(e) => saveState({ bounceInitialHeight: parseFloat(e.target.value) })}
            step="1"
            min="5"
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
