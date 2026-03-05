import {
  type EasingState,
  EasingType,
  generateLinearEasing,
  generateWiggleSVGPolyline,
  LinearEasingAccuracy,
  suggestDuration,
} from 'easingwizard-core';
import { useEasingStore } from '~/state/easing-store';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function WiggleEditor() {
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const wiggleMass = useEasingStore((state) => state.wiggleMass);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const wigglePoints = useEasingStore((state) => state.wigglePoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (state: Partial<EasingState>) => {
    const newState: Partial<EasingState> = {
      wiggleWiggles,
      wiggleMass,
      wiggleDamping,
      // If editorAccuracy is not provided, we assume it's a custom curve
      ...(state.editorAccuracy ? {} : { wiggleIsCustom: true }),
      ...state,
    };
    const config = {
      accuracy: newState.editorAccuracy || editorAccuracy,
      wiggles: newState.wiggleWiggles || wiggleWiggles,
      mass: newState.wiggleMass || wiggleMass,
      damping: newState.wiggleDamping || wiggleDamping,
    };
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.WIGGLE,
      ...config,
    });
    const duration = suggestDuration(EasingType.WIGGLE, config);
    setState({
      ...newState,
      wiggleValue: easingValue,
      wigglePoints: sampledPoints,
      previewDuration: Math.round((duration.min + duration.max) / 2 / 25) * 25,
    });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Wiggle Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateWiggleSVGPolyline(wigglePoints)} />
          <polyline strokeWidth="6" points={generateWiggleSVGPolyline(wigglePoints)} filter='url("#f1")' />
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
          label="Mass"
          hint="Affects duration"
          value={wiggleMass}
          onChange={(value) => handleChange({ wiggleMass: value })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={wiggleDamping}
          onChange={(value) => handleChange({ wiggleDamping: value })}
          min={0}
          max={100}
          step={1}
        />

        <StepSlider
          label="Accuracy"
          value={editorAccuracy}
          options={Object.values(LinearEasingAccuracy).map((value) => value)}
          onChange={(value) => handleChange({ editorAccuracy: value })}
        />
      </InputGroup>
    </div>
  );
}
