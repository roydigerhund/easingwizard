import { EasingState, useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy } from '~/types-and-enums';
import { generateLinearEasing } from '~/utils/easing';
import { generateBounceSVGPolyline } from '~/utils/svg';
import EditorBase from './EditorBase';
import EditorBaseLine from './EditorBaseLine';
import InputGroup from './InputGroup';
import Slider from './Slider';
import StepSlider from './StepSlider';

export default function BounceEditor() {
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const bouncePoints = useEasingStore((state) => state.bouncePoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (state: Partial<EasingState>) => {
    const newState: Partial<EasingState> = {
      bounceBounces,
      bounceDamping,
      // If editorAccuracy is not provided, we assume it's a custom curve
      ...(state.editorAccuracy ? {} : { bounceIsCustom: true }),
      ...state,
    };
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.BOUNCE,
      accuracy: newState.editorAccuracy || editorAccuracy,
      bounces: newState.bounceBounces || bounceBounces,
      damping: newState.bounceDamping || bounceDamping,
    });
    setState({
      ...newState,
      bounceValue: easingValue,
      bouncePoints: sampledPoints,
    });
  };

  return (
    <div className="col-span-2">
      <EditorBase>
        {/* Bounce Curve */}
        <EditorBaseLine>
          <polyline strokeWidth="2" points={generateBounceSVGPolyline(bouncePoints)} />
          <polyline strokeWidth="6" points={generateBounceSVGPolyline(bouncePoints)} filter='url("#f1")' />
        </EditorBaseLine>
      </EditorBase>

      <InputGroup>
        <Slider
          label="Bounces"
          value={bounceBounces}
          onChange={(value) => handleChange({ bounceBounces: value })}
          min={1}
          max={10}
          step={1}
        />
        <Slider
          label="Damping"
          value={bounceDamping}
          onChange={(value) => handleChange({ bounceDamping: value })}
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
