import { useEasingStore } from '~/state/easing-store';
import { BezierValue } from '~/types-and-enums';
import { roundTo } from '~/utils/numbers';
import Drag from './Drag';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';

export default function BezierEditor() {
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const setState = useEasingStore((state) => state.setState);

  const onChange = (value: BezierValue) => {
    setState({ bezierValue: value });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bezier Curve */}
        <EditorBaseLine>
          <path
            d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
            strokeWidth="2"
          />
          <path
            className="opacity-100"
            d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
            strokeWidth="6"
            filter='url("#f1")'
          />
        </EditorBaseLine>
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
            className="text-[--svg-line-gradient-from]"
            x1={0}
            y1={100}
            x2={bezierValue[0] * 100}
            y2={100 - bezierValue[1] * 100}
            stroke="currentColor"
          />
          <line
            className="text-[--svg-line-gradient-to]"
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
            className="text-[--svg-line-gradient-from]"
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
            className="text-[--svg-line-gradient-to]"
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
        className="mt-8"
        value={bezierValue.join(', ')}
        onChange={(e) => {
          const values = e.target.value.split(', ').map(parseFloat);
          // TODO: Validate values
          onChange(values as BezierValue);
        }}
      />
    </div>
  );
}
