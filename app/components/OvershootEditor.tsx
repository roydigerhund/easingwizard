import type { EasingState} from '~/state/easing-store';
import { useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy } from '~/types-and-enums';
import { generateLinearEasing } from '~/utils/easing';
import { generateOvershootSVGPolyline } from '~/utils/svg';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function OvershootEditor() {
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootDamping = useEasingStore((state) => state.overshootDamping);
  const overshootMass = useEasingStore((state) => state.overshootMass);
  const overshootPoints = useEasingStore((state) => state.overshootPoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (state: Partial<EasingState>) => {
    const newState: Partial<EasingState> = {
      overshootMass,
      overshootDamping,
      // If editorAccuracy is not provided, we assume it's a custom curve
      ...(state.editorAccuracy ? {} : { overshootIsCustom: true }),
      ...state,
    };
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.OVERSHOOT,
      style: overshootStyle,
      accuracy: newState.editorAccuracy || editorAccuracy,
      mass: newState.overshootMass || overshootMass,
      damping: newState.overshootDamping || overshootDamping,
    });
    setState({
      ...newState,
      overshootValue: easingValue,
      overshootPoints: sampledPoints,
    });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Overshoot Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateOvershootSVGPolyline(overshootPoints)} />
          <polyline strokeWidth="6" points={generateOvershootSVGPolyline(overshootPoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Mass"
          value={overshootMass}
          onChange={(value) => handleChange({ overshootMass: value })}
          min={1}
          max={5}
          step={0.1}
        />
        <Slider
          label="Damping"
          value={overshootDamping}
          onChange={(value) => handleChange({ overshootDamping: value })}
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
