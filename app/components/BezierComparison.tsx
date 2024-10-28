import { useMemo, useState } from 'react';
import { LinearEasingAccuracy } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { generateLinearEasing } from '~/utils/easing';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import MeshBase from './MeshBase';
const easings = {
  // In Sine
  easeInSine: {
    bezierValue: [0.13, 0, 0.39, 0],
    mathFunction: function (x: number): number {
      return 1 - Math.cos(x * Math.PI * 0.5);
    },
  },
  // Out Sine
  easeOutSine: {
    bezierValue: [0.61, 1, 0.87, 1],
    mathFunction: function (x: number): number {
      return Math.sin(x * Math.PI * 0.5);
    },
  },
  // In Out Sine
  easeInOutSine: {
    bezierValue: [0.36, 0, 0.64, 1],
    mathFunction: function (x: number): number {
      return -(Math.cos(Math.PI * x) - 1) * 0.5;
    },
  },
  // Inverse In Out Sine
  easeInverseInOutSine: {
    bezierValue: [0, 0.36, 1, 0.64],
    mathFunction: function (x: number): number {
      return Math.asin(x * 2 - 1) / Math.PI + 0.5;
    },
  },
  // Out In Sine
  easeOutInSine: {
    bezierValue: [0.64, 1, 0.36, 0],
    mathFunction: function (x: number): number {
      return x < 0.5 ? Math.sin(x * Math.PI) * 0.5 : 1 + Math.sin(x * Math.PI) * -0.5;
    },
  },
  // Inverse Out In Sine
  easeInverseOutInSine: {
    bezierValue: [1, 0.64, 0, 0.36],
    mathFunction: function (x: number): number {
      return x < 0.5 ? Math.asin((x + 0.5) * 2 - 1) / Math.PI : Math.asin((x - 0.5) * 2 - 1) / Math.PI + 1;
    },
  },
  // In Quad
  easeInQuad: {
    bezierValue: [0.11, 0, 0.5, 0],
    mathFunction: function (x: number): number {
      return Math.pow(x, 2);
    },
  },
  // Out Quad
  easeOutQuad: {
    bezierValue: [0.5, 1, 0.89, 1],
    mathFunction: function (x: number): number {
      return 1 - Math.pow(1 - x, 2);
    },
  },
  // In Out Quad
  easeInOutQuad: {
    bezierValue: [0.44, 0, 0.56, 1],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - Math.pow(-2 * x + 2, 2) * 0.5;
    },
  },
  // Out In Quad
  easeOutInQuad: {
    bezierValue: [0.56, 1, 0.44, 0],
    mathFunction: function (x: number): number {
      return x < 0.5 ? -2 * Math.pow(x, 2) + 2 * x : 2 * Math.pow(x, 2) - 2 * x + 1;
    },
  },
  // In Cubic
  easeInCubic: {
    bezierValue: [0.32, 0, 0.67, 0],
    mathFunction: function (x: number): number {
      return Math.pow(x, 3);
    },
  },
  // Out Cubic
  easeOutCubic: {
    bezierValue: [0.33, 1, 0.68, 1],
    mathFunction: function (x: number): number {
      return 1 - Math.pow(1 - x, 3);
    },
  },
  // In Out Cubic
  easeInOutCubic: {
    bezierValue: [0.65, -0.02, 0.35, 1.02],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) * 0.5;
    },
  },
  // Out In Cubic
  easeOutInCubic: {
    bezierValue: [0.35, 1.02, 0.65, -0.02],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 3) * 0.5 : Math.pow(2 * x - 1, 3) * 0.5 + 0.5;
    },
  },
  // In Quart
  easeInQuart: {
    bezierValue: [0.5, 0, 0.75, 0],
    mathFunction: function (x: number): number {
      return Math.pow(x, 4);
    },
  },
  // Out Quart
  easeOutQuart: {
    bezierValue: [0.25, 1, 0.5, 1],
    mathFunction: function (x: number): number {
      return 1 - Math.pow(1 - x, 4);
    },
  },
  // In Out Quart
  easeInOutQuart: {
    bezierValue: [0.76, -0.04, 0.24, 1.04],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) * 0.5;
    },
  },
  // Out In Quart
  easeOutInQuart: {
    bezierValue: [0.24, 1.04, 0.76, -0.04],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 4) * 0.5 : Math.pow(2 * x - 1, 4) * 0.5 + 0.5;
    },
  },
  // In Quint
  easeInQuint: {
    bezierValue: [0.64, 0, 0.78, 0],
    mathFunction: function (x: number): number {
      return Math.pow(x, 5);
    },
  },
  // Out Quint
  easeOutQuint: {
    bezierValue: [0.22, 1, 0.36, 1],
    mathFunction: function (x: number): number {
      return 1 - Math.pow(1 - x, 5);
    },
  },
  // In Out Quint
  easeInOutQuint: {
    bezierValue: [0.84, -0.04, 0.16, 1.04],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) * 0.5;
    },
  },
  // Out In Quint
  easeOutInQuint: {
    bezierValue: [0.16, 1.04, 0.84, -0.04],
    mathFunction: function (x: number): number {
      return x < 0.5 ? 0.5 - Math.pow(1 - 2 * x, 5) * 0.5 : Math.pow(2 * x - 1, 5) * 0.5 + 0.5;
    },
  },
  // In Expo
  easeInExpo: {
    bezierValue: [0.7, 0, 0.84, 0],
    mathFunction: function (x: number): number {
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    },
  },
  // Out Expo
  easeOutExpo: {
    bezierValue: [0.16, 1, 0.3, 1],
    mathFunction: function (x: number): number {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
  },
  // In Out Expo
  easeInOutExpo: {
    bezierValue: [0.88, -0.04, 0.12, 1.04],
    mathFunction: function (x: number): number {
      return x === 0
        ? 0
        : x === 1
          ? 1
          : x < 0.5
            ? Math.pow(2, 20 * x - 10) * 0.5
            : (2 - Math.pow(2, -20 * x + 10)) * 0.5;
    },
  },
  // Out In Expo
  easeOutInExpo: {
    bezierValue: [0.12, 1.04, 0.88, -0.04],
    mathFunction: function (x: number): number {
      return x === 0
        ? 0
        : x === 1
          ? 1
          : x < 0.5
            ? 0.5 - Math.pow(2, -20 * x) * 0.5
            : Math.pow(2, 20 * x - 20) * 0.5 + 0.5;
    },
  },
  // In Circ
  easeInCirc: {
    bezierValue: [0.55, 0, 1, 0.45],
    mathFunction: function (x: number): number {
      return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
  },
  // Out Circ
  easeOutCirc: {
    bezierValue: [0, 0.55, 0.45, 1],
    mathFunction: function (x: number): number {
      return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
  },
  // In Out Circ
  easeInOutCirc: {
    bezierValue: [0.85, 0.09, 0.15, 0.91],
    mathFunction: function (x: number): number {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) * 0.5
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) * 0.5;
    },
  },
  // Out In Circ
  easeOutInCirc: {
    bezierValue: [0.15, 0.91, 0.85, 0.09],
    mathFunction: function (x: number): number {
      return x < 0.5 ? Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5 : 1 - Math.sqrt(1 - Math.pow(2 * x - 1, 2)) * 0.5;
    },
  },
  // In Back
  easeInBack: {
    bezierValue: [0.36, 0, 0.66, -0.56],
    mathFunction: function (x: number): number {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * Math.pow(x, 3) - c1 * Math.pow(x, 2);
    },
  },
  // Out Back
  easeOutBack: {
    bezierValue: [0.34, 1.56, 0.64, 1],
    mathFunction: function (x: number): number {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
  },
  // In Out Back
  easeInOutBack: {
    // Bezier value is not accurate and has no smooth increase/decrease
    bezierValue: [0.68, -0.6, 0.32, 1.6],
    mathFunction: function (x: number): number {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
  },
  // Out In Back
  easeOutInBack: {
    // Math function has a bump in the middle which is unwanted and not represented in the bezier value
    bezierValue: [0.32, 1.6, 0.68, -0.6],
    mathFunction: function (x: number): number {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return x < 0.5
        ? (Math.pow(2 * (x + 0.5) - 2, 2) * ((c2 + 1) * ((x + 0.5) * 2 - 2) + c2) + 2) / 2 - 0.5
        : (Math.pow(2 * (x - 0.5), 2) * ((c2 + 1) * 2 * (x - 0.5) - c2)) / 2 + 0.5;
    },
  },
  easeAnticipateIn: {
    bezierValue: [0.8, -0.4, 0.5, 1],
    // bezierValue: [0.68, -0.55, 0.27, 1.55],
    mathFunction: function (x: number): number {
      return x;
    },
  },
  easeAnticipateOut: {
    bezierValue: [0.5, 0, 0.2, 1.4],
    mathFunction: function (x: number): number {
      return x;
    },
  },
};

const options = Object.keys(easings) as (keyof typeof easings)[];

export default function BezierComparison() {
  const [bezierValue, setBezierValue] = useState(easings.easeInSine.bezierValue);
  const [selectedOption, setSelectedOption] = useState<keyof typeof easings>(options[0]);

  const { mathFunction } = easings[selectedOption];

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
            <line x1="0" y1="100" x2={bezierValue[0] * 100} y2={100 - bezierValue[1] * 100} stroke="rgba(255,255,255,0.5)" strokeWidth={0.25} />
            <line x1="100" y1="0" x2={bezierValue[2] * 100} y2={100 - bezierValue[3] * 100} stroke="rgba(255,255,255,0.5)" strokeWidth={0.25} />
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
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              setSelectedOption(option);
              setBezierValue(easings[option].bezierValue);
            }}
            className={classNames(
              'px-3 py-2',
              selectedOption === option ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 text-zinc-500',
            )}
          >
            {option}
          </button>
        ))}
        <MeshBase>
          <div className="absolute inset-0 z-10 grid items-center justify-items-center">
            <div
              className="col-span-full row-span-full h-1/4 w-1/4 rounded-xl !border-none bg-[--svg-line-gradient-from]"
              style={animationStyles(bezierValue.join(', '))}
            />
            <div
              className="col-span-full row-span-full h-1/4 w-1/4 rounded-xl border border-[--svg-line-gradient-to] opacity-50"
              style={animationStyles('linear')}
            />
          </div>
        </MeshBase>
      </div>
    </div>
  );
}
