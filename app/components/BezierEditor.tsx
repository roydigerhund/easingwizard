import { useContext } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { BezierValue } from '~/types-and-enums';
import { roundTo } from '~/utils/numbers';
import Drag from './Drag';
import EditorBase from './EditorBase';

export default function BezierEditor() {
  const {
    state: { bezierValue },
    saveState,
  } = useContext(EasingContext);

  const onChange = (value: BezierValue) => {
    saveState({ bezierValue: value });
    onChange(value);
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bezier Curve */}
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
          <path
            d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
            strokeWidth="2"
          />
          <path
            className="opacity-50 dark:opacity-100"
            d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
            strokeWidth="6"
            filter='url("#f1")'
          />
        </svg>
        {/* Handle Lines */}
        <svg
          className="absolute inset-0 z-30 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          strokeWidth="1"
        >
          <line
            className="text-blue-500 dark:text-blue-600"
            x1={0}
            y1={100}
            x2={bezierValue[0] * 100}
            y2={100 - bezierValue[1] * 100}
            stroke="currentColor"
          />
          <line
            className="text-pink-500 dark:text-pink-600"
            x1={100}
            y1={0}
            x2={bezierValue[2] * 100}
            y2={100 - bezierValue[3] * 100}
            stroke="currentColor"
          />
        </svg>
        {/* Handles */}
        <svg
          className="absolute inset-0 z-40 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <Drag
            className="fill-white dark:fill-gray-950 stroke-blue-500 dark:stroke-blue-600"
            minX={0}
            minY={-100}
            maxX={100}
            maxY={200}
            x={bezierValue[0] * 100}
            y={100 - bezierValue[1] * 100}
            onChange={(x, y) =>
              onChange([roundTo(x / 100, 3), roundTo(1 - y / 100, 3), bezierValue[2], bezierValue[3]])
            }
          />
          <Drag
            className="fill-white dark:fill-gray-950 stroke-pink-500 dark:stroke-pink-600"
            minX={0}
            minY={-100}
            maxX={100}
            maxY={200}
            x={bezierValue[2] * 100}
            y={100 - bezierValue[3] * 100}
            onChange={(x, y) =>
              onChange([bezierValue[0], bezierValue[1], roundTo(x / 100, 3), roundTo(1 - y / 100, 3)])
            }
          />
        </svg>
      </EditorBase>
      <input
        className="mt-4"
        value={bezierValue.join(', ')}
        onChange={(e) => {
          const values = e.target.value.split(', ').map(parseFloat);
          // TODO: Validate values
          onChange(values as [number, number, number, number]);
        }}
      />
    </div>
  );
}
