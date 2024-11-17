import { useEasingStore } from '~/state/easing-store';
import { BezierValue } from '~/types-and-enums';
import { createCubicBezierString } from '~/utils/easing';
import { roundTo } from '~/utils/numbers';
import Drag from './Drag';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import Toggle from './Toggle';

export default function BezierEditor() {
  const bezierRawValue = useEasingStore((state) => state.bezierRawValue);
  const editorExtraSpaceTop = useEasingStore((state) => state.editorExtraSpaceTop);
  const editorExtraSpaceBottom = useEasingStore((state) => state.editorExtraSpaceBottom);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (value: BezierValue) => {
    setState({ bezierRawValue: value, bezierValue: createCubicBezierString(value), bezierIsCustom: true });
  };

  return (
    <div className="relative col-span-2">
      <EditorBase>
        {/* Bezier Curve */}
        <EditorBaseLine>
          <path
            d={`M0,100 C${bezierRawValue[0] * 100},${100 - bezierRawValue[1] * 100} ${bezierRawValue[2] * 100},${100 - bezierRawValue[3] * 100} 100,0`}
            strokeWidth="2"
          />
          <path
            d={`M0,100 C${bezierRawValue[0] * 100},${100 - bezierRawValue[1] * 100} ${bezierRawValue[2] * 100},${100 - bezierRawValue[3] * 100} 100,0`}
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
            x2={bezierRawValue[0] * 100}
            y2={100 - bezierRawValue[1] * 100}
            stroke="currentColor"
          />
          <line
            className="text-grdt-to"
            x1={100}
            y1={0}
            x2={bezierRawValue[2] * 100}
            y2={100 - bezierRawValue[3] * 100}
            stroke="currentColor"
          />
        </svg>
        {/* Handles */}
        <svg
          className="absolute inset-0 z-40 touch-none overflow-visible"
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
            x={bezierRawValue[0] * 100}
            y={100 - bezierRawValue[1] * 100}
            onChange={(x, y) =>
              handleChange([roundTo(x / 100, 3), roundTo(1 - y / 100, 3), bezierRawValue[2], bezierRawValue[3]])
            }
          />
          <Drag
            className="text-grdt-to"
            minX={0}
            minY={-100}
            maxX={100}
            maxY={200}
            x={bezierRawValue[2] * 100}
            y={100 - bezierRawValue[3] * 100}
            onChange={(x, y) =>
              handleChange([bezierRawValue[0], bezierRawValue[1], roundTo(x / 100, 3), roundTo(1 - y / 100, 3)])
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
          value={bezierRawValue[0]}
          onChange={(value) => handleChange([value, bezierRawValue[1], bezierRawValue[2], bezierRawValue[3]])}
          min={0}
          max={1}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="Y1"
          value={bezierRawValue[1]}
          onChange={(value) => handleChange([bezierRawValue[0], value, bezierRawValue[2], bezierRawValue[3]])}
          min={-1}
          max={2}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="X2"
          value={bezierRawValue[2]}
          onChange={(value) => handleChange([bezierRawValue[0], bezierRawValue[1], value, bezierRawValue[3]])}
          min={0}
          max={1}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="Y2"
          value={bezierRawValue[3]}
          onChange={(value) => handleChange([bezierRawValue[0], bezierRawValue[1], bezierRawValue[2], value])}
          min={-1}
          max={2}
          step={0.01}
          inputStep={0.001}
        />
      </InputGroup>
    </div>
  );
}
