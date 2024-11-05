import { useEasingStore } from '~/state/easing-store';
import { BezierValue } from '~/types-and-enums';
import { roundTo } from '~/utils/numbers';
import Drag from './Drag';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import Toggle from './Toggle';

export default function BezierEditor() {
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const editorExtraSpaceTop = useEasingStore((state) => state.editorExtraSpaceTop);
  const editorExtraSpaceBottom = useEasingStore((state) => state.editorExtraSpaceBottom);
  const setState = useEasingStore((state) => state.setState);

  const onChange = (value: BezierValue) => {
    setState({ bezierValue: value });
  };

  return (
    <div className="relative col-span-2">
      <EditorBase>
        {/* Bezier Curve */}
        <EditorBaseLine>
          <path
            d={`M0,100 C${bezierValue[0] * 100},${100 - bezierValue[1] * 100} ${bezierValue[2] * 100},${100 - bezierValue[3] * 100} 100,0`}
            strokeWidth="2"
          />
          <path
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
            className="text-grdt-from"
            x1={0}
            y1={100}
            x2={bezierValue[0] * 100}
            y2={100 - bezierValue[1] * 100}
            stroke="currentColor"
          />
          <line
            className="text-grdt-to"
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
            className="text-grdt-from"
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
            className="text-grdt-to"
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

      <InputGroup>
        <Toggle
          label="Extra Space Top"
          value={editorExtraSpaceTop}
          onChange={(value) => setState({ editorExtraSpaceTop: value })}
        />
        <Toggle
          label="Extra Space Bottom"
          value={editorExtraSpaceBottom}
          onChange={(value) => setState({ editorExtraSpaceBottom: value })}
        />
        <Slider
          label="X1"
          value={bezierValue[0]}
          onChange={(value) => setState({ bezierValue: [value, bezierValue[1], bezierValue[2], bezierValue[3]] })}
          min={0}
          max={1}
          step={0.01}
        />
        <Slider
          label="Y1"
          value={bezierValue[1]}
          onChange={(value) => setState({ bezierValue: [bezierValue[0], value, bezierValue[2], bezierValue[3]] })}
          min={-1}
          max={2}
          step={0.01}
        />
        <Slider
          label="X2"
          value={bezierValue[2]}
          onChange={(value) => setState({ bezierValue: [bezierValue[0], bezierValue[1], value, bezierValue[3]] })}
          min={0}
          max={1}
          step={0.01}
        />
        <Slider
          label="Y2"
          value={bezierValue[3]}
          onChange={(value) => setState({ bezierValue: [bezierValue[0], bezierValue[1], bezierValue[2], value] })}
          min={-1}
          max={2}
          step={0.01}
        />
      </InputGroup>
    </div>
  );
}
