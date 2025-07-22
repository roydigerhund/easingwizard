import { type BezierInput, createCubicBezierString, generateBezierSVGPath, roundTo } from 'easing-wizard-core';
import { useEasingStore } from '~/state/easing-store';
import Drag from './Drag';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import Toggle from './Toggle';

export default function BezierEditor() {
  const bezierX1 = useEasingStore((state) => state.bezierX1);
  const bezierY1 = useEasingStore((state) => state.bezierY1);
  const bezierX2 = useEasingStore((state) => state.bezierX2);
  const bezierY2 = useEasingStore((state) => state.bezierY2);
  const editorExtraSpaceTop = useEasingStore((state) => state.editorExtraSpaceTop);
  const editorExtraSpaceBottom = useEasingStore((state) => state.editorExtraSpaceBottom);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = ({ x1, y1, x2, y2 }: BezierInput) => {
    setState({
      bezierX1: x1,
      bezierY1: y1,
      bezierX2: x2,
      bezierY2: y2,
      bezierValue: createCubicBezierString({ x1, y1, x2, y2 }),
      bezierIsCustom: true,
    });
  };

  return (
    <div className="relative col-span-2">
      <EditorBase>
        {/* Bezier Curve */}
        <EditorBaseLine>
          <path d={generateBezierSVGPath({ x1: bezierX1, y1: bezierY1, x2: bezierX2, y2: bezierY2 })} strokeWidth="2" />
          <path
            d={generateBezierSVGPath({ x1: bezierX1, y1: bezierY1, x2: bezierX2, y2: bezierY2 })}
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
            x2={bezierX1 * 100}
            y2={100 - bezierY1 * 100}
            stroke="currentColor"
          />
          <line
            className="text-grdt-to"
            x1={100}
            y1={0}
            x2={bezierX2 * 100}
            y2={100 - bezierY2 * 100}
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
            x={bezierX1 * 100}
            y={100 - bezierY1 * 100}
            onChange={(x, y) =>
              handleChange({ x1: roundTo(x / 100, 3), y1: roundTo(1 - y / 100, 3), x2: bezierX2, y2: bezierY2 })
            }
          />
          <Drag
            className="text-grdt-to"
            minX={0}
            minY={-100}
            maxX={100}
            maxY={200}
            x={bezierX2 * 100}
            y={100 - bezierY2 * 100}
            onChange={(x, y) =>
              handleChange({ x1: bezierX1, y1: bezierY1, x2: roundTo(x / 100, 3), y2: roundTo(1 - y / 100, 3) })
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
          value={bezierX1}
          onChange={(value) => handleChange({ x1: value, y1: bezierY1, x2: bezierX2, y2: bezierY2 })}
          min={0}
          max={1}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="Y1"
          value={bezierY1}
          onChange={(value) => handleChange({ x1: bezierX1, y1: value, x2: bezierX2, y2: bezierY2 })}
          min={-1}
          max={2}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="X2"
          value={bezierX2}
          onChange={(value) => handleChange({ x1: bezierX1, y1: bezierY1, x2: value, y2: bezierY2 })}
          min={0}
          max={1}
          step={0.01}
          inputStep={0.001}
        />
        <Slider
          label="Y2"
          value={bezierY2}
          onChange={(value) => handleChange({ x1: bezierX1, y1: bezierY1, x2: bezierX2, y2: value })}
          min={-1}
          max={2}
          step={0.01}
          inputStep={0.001}
        />
      </InputGroup>
    </div>
  );
}
