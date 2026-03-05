import {
  AnimationType,
  EasingType,
  humanize,
  PreviewPlayMode,
  suggestDuration,
  type AnimationTypeKey,
} from 'easingwizard-core';
import { useEffect, useMemo, useState } from 'react';
import { classNames } from '~/css/class-names';
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
  const springMass = useEasingStore((state) => state.springMass);
  const springStiffness = useEasingStore((state) => state.springStiffness);
  const springDamping = useEasingStore((state) => state.springDamping);
  const springTotalTime = useEasingStore((state) => state.springTotalTime);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceMass = useEasingStore((state) => state.bounceMass);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const wiggleMass = useEasingStore((state) => state.wiggleMass);
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootMass = useEasingStore((state) => state.overshootMass);
  const overshootDamping = useEasingStore((state) => state.overshootDamping);

  const suggestedRange = useMemo(() => {
    switch (easingType) {
      case EasingType.SPRING:
        return suggestDuration(
          EasingType.SPRING,
          { mass: springMass, stiffness: springStiffness, damping: springDamping, accuracy: editorAccuracy },
          springTotalTime,
        );
      case EasingType.BOUNCE:
        return suggestDuration(EasingType.BOUNCE, {
          bounces: bounceBounces,
          mass: bounceMass,
          damping: bounceDamping,
          accuracy: editorAccuracy,
        });
      case EasingType.WIGGLE:
        return suggestDuration(EasingType.WIGGLE, {
          wiggles: wiggleWiggles,
          mass: wiggleMass,
          damping: wiggleDamping,
          accuracy: editorAccuracy,
        });
      case EasingType.OVERSHOOT:
        return suggestDuration(EasingType.OVERSHOOT, {
          style: overshootStyle,
          mass: overshootMass,
          damping: overshootDamping,
          accuracy: editorAccuracy,
        });
      default:
        return undefined;
    }
  }, [
    easingType,
    springMass,
    springStiffness,
    springDamping,
    springTotalTime,
    editorAccuracy,
    bounceBounces,
    bounceMass,
    bounceDamping,
    wiggleWiggles,
    wiggleMass,
    wiggleDamping,
    overshootStyle,
    overshootMass,
    overshootDamping,
  ]);

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
            <IconButton
              className={classNames(previewPlayMode !== PreviewPlayMode.ONCE && 'pointer-events-none opacity-0')}
              label="Play Again"
              isActive={previewHasRestarted}
              onClick={() => {
                setCounter((prev) => prev + 1);
                setPreviewHasRestarted(true);
              }}
            >
              <PlayIcon className="size-7" />
            </IconButton>
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
          max={easingType === EasingType.SPRING ? 4000 : 2000}
          step={25}
          suggestedRange={suggestedRange}
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
