import type { EasingState} from '~/state/easing-store';
import { useEasingStore } from '~/state/easing-store';
import { EasingType, LinearEasingAccuracy } from '~/types-and-enums';
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
  const wigglePoints = useEasingStore((state) => state.wigglePoints);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const setState = useEasingStore((state) => state.setState);

  const handleChange = (state: Partial<EasingState>) => {
    const newState: Partial<EasingState> = {
      wiggleWiggles,
      wiggleDamping,
      // If editorAccuracy is not provided, we assume it's a custom curve
      ...(state.editorAccuracy ? {} : { wiggleIsCustom: true }),
      ...state,
    };
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.WIGGLE,
      accuracy: newState.editorAccuracy || editorAccuracy,
      wiggles: newState.wiggleWiggles || wiggleWiggles,
      damping: newState.wiggleDamping || wiggleDamping,
    });
    setState({
      ...newState,
      wiggleValue: easingValue,
      wigglePoints: sampledPoints,
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
