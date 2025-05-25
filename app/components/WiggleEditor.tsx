import { useEffect, useState } from 'react';
import { EasingState, useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy, Point } from '~/types-and-enums';
import { generateLinearEasing } from '~/utils/easing';
import { generateWiggleSVGPolyline } from '~/utils/svg';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function WiggleEditor() {
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // Recalculate when parameters change
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.WIGGLE,
      accuracy: editorAccuracy,
      wiggles: wiggleWiggles,
      damping: wiggleDamping,
    });
    setPoints(sampledPoints);
    setState({ wiggleValue: easingValue });
  }, [wiggleDamping, wiggleWiggles, editorAccuracy, setState]);

  const handleChange = (state: Partial<EasingState>) => {
    setState({ ...state, wiggleIsCustom: true });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Wiggle Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateWiggleSVGPolyline(points)} />
          <polyline strokeWidth="6" points={generateWiggleSVGPolyline(points)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Wiggles"
          value={wiggleWiggles}
          onChange={(value) => handleChange({ wiggleWiggles: value })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Damping"
          value={wiggleDamping}
          onChange={(value) => handleChange({ wiggleDamping: value })}
          min={0}
          max={20}
          step={0.1}
        />

        <StepSlider
          label="Accuracy"
          value={editorAccuracy}
          options={Object.values(LinearEasingAccuracy).map((value) => value)}
          onChange={(value) => setState({ editorAccuracy: value })}
        />
      </InputGroup>
    </div>
  );
}
