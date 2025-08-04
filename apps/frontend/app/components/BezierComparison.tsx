import {
  EasingType,
  LinearEasingAccuracy,
  bezierEasings,
  createCubicBezierString,
  generateLinearEasing,
  humanize,
  type BezierInput,
} from 'easingwizard-core';
import { useMemo, useState } from 'react';
import { classNames } from '~/css/class-names';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import MeshBase from './MeshBase';

const types = Object.keys(bezierEasings) as (keyof typeof bezierEasings)[];
const options = types.flatMap((type) => Object.values(bezierEasings[type]));
const names = types.flatMap((type) => Object.keys(bezierEasings[type]).map((name) => humanize(`${type}_${name}`)));

export default function BezierComparison() {
  const [bezierValue, setBezierValue] = useState<BezierInput>(bezierEasings.in.sine);
  const [selectedOption, setSelectedOption] = useState(0);

  const { mathFunction } = options[selectedOption];

  const { sampledPoints } = useMemo(
    () => generateLinearEasing({ type: EasingType.BEZIER, accuracy: LinearEasingAccuracy.HIGH, mathFunction }),
    [mathFunction],
  );

  const animationStyles = (easing: string) => ({
    animationDuration: `3000ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: easing,
    animationName: 'move' + 'Animation' + 'Infinite',
    animationFillMode: 'both',
  });

  return (
    <div className="flex items-start gap-8">
      <div className="w-[400px] shrink-0">
        <EditorBase>
          {/* Bézier Curve */}
          <EditorBaseLine>
            <path
              d={`M0,100 C${bezierValue.x1 * 100},${100 - bezierValue.y1 * 100} ${bezierValue.x2 * 100},${100 - bezierValue.y2 * 100} 100,0`}
              strokeWidth="1"
              stroke="rgba(255, 0, 255, 0.75)"
            />
            <polyline
              strokeWidth="1"
              points={sampledPoints.map((point) => `${point.x},${point.y}`).join(' ')}
              stroke="rgba(255, 255, 0, 0.75)"
            />
            {/* Dots */}
            <circle cx={bezierValue.x1 * 100} cy={100 - bezierValue.y1 * 100} r="1" stroke="none" fill="white" />
            <circle cx={bezierValue.x2 * 100} cy={100 - bezierValue.y2 * 100} r="1" stroke="none" fill="white" />
            {/* Lines to Dots */}
            <line
              x1="0"
              y1="100"
              x2={bezierValue.x1 * 100}
              y2={100 - bezierValue.y1 * 100}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.25}
            />
            <line
              x1="100"
              y1="0"
              x2={bezierValue.x2 * 100}
              y2={100 - bezierValue.y2 * 100}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.25}
            />
          </EditorBaseLine>
        </EditorBase>
        <input
          className="mt-8"
          value={JSON.stringify(bezierValue)}
          onChange={(e) => setBezierValue(JSON.parse(e.target.value))}
        />
        <textarea className="mt-8 h-32 w-full" value={mathFunction.toString()} />
      </div>
      {/* Buttons for all options */}
      <div className="flex flex-wrap items-start gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedOption(index);
              setBezierValue(options[index]);
            }}
            className={classNames(
              'px-3 py-2',
              selectedOption === index ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 text-zinc-500',
            )}
          >
            {names[index]}
          </button>
        ))}
        <MeshBase>
          <div className="absolute inset-0 z-10 grid items-center justify-items-center">
            <div
              className="col-span-full row-span-full size-1/4 rounded-xl border-none! bg-grdt-from"
              style={animationStyles(createCubicBezierString(bezierValue))}
            />
            <div
              className="col-span-full row-span-full size-1/4 rounded-xl border border-grdt-to opacity-50"
              style={animationStyles('linear')}
            />
          </div>
        </MeshBase>
      </div>
    </div>
  );
}
