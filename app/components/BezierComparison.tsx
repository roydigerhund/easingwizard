import { useMemo, useState } from 'react';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import MeshBase from './MeshBase';
import { bezierEasings } from '~/data/easing';
import { humanize } from '~/utils/string';


const types = Object.keys(bezierEasings) as (keyof typeof bezierEasings)[];
const options = types.flatMap((type) => Object.values(bezierEasings[type]));
const names = types.flatMap((type) => Object.keys(bezierEasings[type]).map((name) => humanize(`${type}_${name}`)));

console.log('options', options);

export default function BezierComparison() {
  const [bezierValue, setBezierValue] = useState(bezierEasings.in.sine.bezierValue);
  const [selectedOption, setSelectedOption] = useState(0);

  const { mathFunction } = options[selectedOption];

  const { sampledPoints } = useMemo(
    () => generateLinearEasing(mathFunction, LinearEasingAccuracy.ULTRA, 1),
    [mathFunction],
  );

  const animationStyles = (easing: string) => ({
    animationDuration: `3000ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: `cubic-bezier(${easing})`,
    animationName: 'move' + 'Animation' + 'Infinite',
    animationFillMode: 'both',
  });

  return (
    <div className="flex items-start gap-8">
      <div className="w-[400px] shrink-0">
        <EditorBase>
          {/* Bezier Curve */}
          <EditorBaseLine>
            <path
              d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
              strokeWidth="1"
              stroke="rgba(255, 0, 255, 0.75)"
            />
            <polyline
              strokeWidth="1"
              points={sampledPoints.map((point) => `${point.x},${point.y}`).join(' ')}
              stroke="rgba(255, 255, 0, 0.75)"
            />
            {/* Dots */}
            <circle cx={bezierValue[0] * 100} cy={100 - bezierValue[1] * 100} r="1" stroke="none" fill="white" />
            <circle cx={bezierValue[2] * 100} cy={100 - bezierValue[3] * 100} r="1" stroke="none" fill="white" />
            {/* Lines to Dots */}
            <line
              x1="0"
              y1="100"
              x2={bezierValue[0] * 100}
              y2={100 - bezierValue[1] * 100}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.25}
            />
            <line
              x1="100"
              y1="0"
              x2={bezierValue[2] * 100}
              y2={100 - bezierValue[3] * 100}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.25}
            />
          </EditorBaseLine>
        </EditorBase>
        <input
          className="mt-8"
          value={bezierValue.join(', ')}
          onChange={(e) => setBezierValue(e.target.value.split(',').map((value) => parseFloat(value)))}
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
              setBezierValue(options[index].bezierValue);
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
              className="col-span-full row-span-full size-1/4 rounded-xl !border-none bg-grdt-from"
              style={animationStyles(bezierValue.join(', '))}
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
