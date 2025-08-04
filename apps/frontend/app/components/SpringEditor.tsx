import {
  type EasingState,
  EasingType,
  generateLinearEasing,
  generateSpringSVGPolyline,
  LinearEasingAccuracy,
} from 'easingwizard-core';
import { useEasingStore } from '~/state/easing-store';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function SpringEditor() {
  const springStiffness = useEasingStore((state) => state.springStiffness);
  const springDamping = useEasingStore((state) => state.springDamping);
  const springMass = useEasingStore((state) => state.springMass);
  const springPoints = useEasingStore((state) => state.springPoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (state: Partial<EasingState>) => {
    const newState: Partial<EasingState> = {
      springStiffness,
      springDamping,
      springMass,
      // If editorAccuracy is not provided, we assume it's a custom curve
      ...(state.editorAccuracy ? {} : { springIsCustom: true }),
      ...state,
    };
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.SPRING,
      accuracy: newState.editorAccuracy || editorAccuracy,
      stiffness: newState.springStiffness || springStiffness,
      damping: newState.springDamping || springDamping,
      mass: newState.springMass || springMass,
    });
    setState({
      ...newState,
      springValue: easingValue,
      springPoints: sampledPoints,
    });
  };

  return (
    <div className="relative col-span-2">
      <EditorBase>
        {/* Spring Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateSpringSVGPolyline(springPoints)} />
          <polyline strokeWidth="6" points={generateSpringSVGPolyline(springPoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Mass"
          value={springMass}
          onChange={(value) => handleChange({ springMass: value })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Stiffness"
          value={springStiffness}
          onChange={(value) => handleChange({ springStiffness: value })}
          min={0}
          max={100}
          step={1}
        />
        <Slider
          label="Damping"
          value={springDamping}
          onChange={(value) => handleChange({ springDamping: value })}
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
