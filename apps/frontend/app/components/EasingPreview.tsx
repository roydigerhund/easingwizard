import { AnimationType, EasingType, humanize, PreviewPlayMode, type AnimationTypeKey } from 'easing-wizard-core';
import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import CardHeadline from './CardHeadline';
import EasingPreviewElement from './EasingPreviewElement';
import IconButton from './IconButton';
import InputGroup from './InputGroup';
import MeshBase from './MeshBase';
import Slider from './Slider';
import CloneIcon from './icons/CloneIcon';
import HeightIcon from './icons/HeightIcon';
import InfinityIcon from './icons/InfinityIcon';
import MoveXIcon from './icons/MoveXIcon';
import MoveYIcon from './icons/MoveYIcon';
import OpacityIcon from './icons/OpacityIcon';
import PlayIcon from './icons/PlayIcon';
import RotateIcon from './icons/RotateIcon';
import RotateXIcon from './icons/RotateXIcon';
import RotateYIcon from './icons/RotateYIcon';
import ScaleIcon from './icons/ScaleIcon';
import ShapeIcon from './icons/ShapeIcon';
import WidthIcon from './icons/WidthIcon';

export default function EasingPreview() {
  const setState = useEasingStore((state) => state.setState);
  const easingType = useEasingStore((state) => state.easingType);
  const previewDuration = useEasingStore((state) => state.previewDuration);
  const previewPlayMode = useEasingStore((state) => state.previewPlayMode);
  const previewShowLinear = useEasingStore((state) => state.previewShowLinear);
  const previewAnimationType = useEasingStore((state) => state.previewAnimationType);
  const [counter, setCounter] = useState(0);
  const [hidePreviewElement, setHidePreviewElement] = useState(false);
  const [previewHasRestarted, setPreviewHasRestarted] = useState(false);

  useEffect(() => {
    // hide preview during duration change
    const timeout = setTimeout(() => {
      setHidePreviewElement(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [previewDuration]);

  useEffect(() => {
    // hide preview during duration change
    if (previewHasRestarted) {
      const timeout = setTimeout(() => {
        setPreviewHasRestarted(false);
      }, previewDuration);
      return () => clearTimeout(timeout);
    }
  }, [previewHasRestarted, previewDuration]);

  const allowPreviewShowLinear = easingType !== EasingType.WIGGLE;

  return (
    <>
      <div className="px-6">
        <CardHeadline>Preview</CardHeadline>
      </div>

      <MeshBase>{!hidePreviewElement && <EasingPreviewElement counter={counter} />}</MeshBase>

      <InputGroup>
        <div className="flex justify-between">
          <IconButton
            label="Show Linear Comparison"
            disabled={!allowPreviewShowLinear}
            isActive={previewShowLinear && allowPreviewShowLinear}
            onClick={() => setState({ previewShowLinear: !previewShowLinear })}
            position="left"
          >
            <CloneIcon className="size-7" />
          </IconButton>
          <div className="flex gap-2">
            {previewPlayMode === PreviewPlayMode.ONCE && (
              <IconButton
                label="Play Again"
                isActive={previewHasRestarted}
                onClick={() => {
                  setCounter((prev) => prev + 1);
                  setPreviewHasRestarted(true);
                }}
              >
                <PlayIcon className="size-7" />
              </IconButton>
            )}
            <IconButton
              label="Play Preview Infinite"
              isActive={previewPlayMode === PreviewPlayMode.INFINITE}
              onClick={() =>
                setState({
                  previewPlayMode:
                    previewPlayMode === PreviewPlayMode.ONCE ? PreviewPlayMode.INFINITE : PreviewPlayMode.ONCE,
                })
              }
              position="right"
            >
              <InfinityIcon className="size-7" />
            </IconButton>
          </div>
        </div>
        <Slider
          label="Duration"
          value={previewDuration}
          onChange={(value) => {
            setHidePreviewElement(true);
            setCounter(0);
            setState({ previewDuration: value });
          }}
          min={100}
          max={2000}
          step={50}
        />
        <div className="relative grid grid-cols-5 gap-4 self-start">
          {Object.values(AnimationType).map((type) => (
            <IconButton
              key={type}
              label={humanize(type)}
              isActive={previewAnimationType === type}
              onClick={() => {
                if (type !== previewAnimationType) {
                  setCounter(0);
                }
                if (type === previewAnimationType && previewPlayMode === PreviewPlayMode.ONCE) {
                  setCounter((prev) => prev + 1);
                }
                setState({ previewAnimationType: type });
              }}
            >
              {icons[type]}
            </IconButton>
          ))}
        </div>
      </InputGroup>
    </>
  );
}

const icons: Record<AnimationTypeKey, React.ReactNode> = {
  [AnimationType.MOVE_X]: <MoveXIcon className="size-7" />,
  [AnimationType.MOVE_Y]: <MoveYIcon className="size-7" />,
  [AnimationType.WIDTH]: <WidthIcon className="size-7" />,
  [AnimationType.HEIGHT]: <HeightIcon className="size-7" />,
  [AnimationType.SCALE]: <ScaleIcon className="size-7" />,
  [AnimationType.ROTATE]: <RotateIcon className="size-7" />,
  [AnimationType.OPACITY]: <OpacityIcon className="size-7" />,
  [AnimationType.ROTATE_X]: <RotateXIcon className="size-7" />,
  [AnimationType.ROTATE_Y]: <RotateYIcon className="size-7" />,
  [AnimationType.SHAPE]: <ShapeIcon className="size-7" />,
};
