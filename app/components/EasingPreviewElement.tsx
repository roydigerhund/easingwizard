import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { AnimationType, EasingType, PreviewPlayMode } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';

export default function EasingPreviewElement({ counter }: { counter: number }) {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const overshootValue = useEasingStore((state) => state.overshootValue);
  const springValue = useEasingStore((state) => state.springValue);
  const bounceValue = useEasingStore((state) => state.bounceValue);
  const wiggleValue = useEasingStore((state) => state.wiggleValue);
  const previewDuration = useEasingStore((state) => state.previewDuration);
  const previewPlayMode = useEasingStore((state) => state.previewPlayMode);
  const previewAnimationType = useEasingStore((state) => state.previewAnimationType);
  const previewShowLinear = useEasingStore((state) => state.previewShowLinear);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const timeout = setTimeout(() => {
        setClicked(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [clicked]);

  const getValue = () => {
    switch (easingType) {
      case EasingType.BEZIER:
        return bezierValue;
      case EasingType.OVERSHOOT:
        return overshootValue;
      case EasingType.SPRING:
        return springValue;
      case EasingType.BOUNCE:
        return bounceValue;
      case EasingType.WIGGLE:
        return wiggleValue;
    }
  };

  const value = getValue();

  const animationStyles = (easing: string) => ({
    animationDuration: `${previewDuration * (previewPlayMode === PreviewPlayMode.INFINITE ? (easingType === EasingType.WIGGLE ? 2 : 4) : 1)}ms`,
    animationIterationCount: previewPlayMode === PreviewPlayMode.INFINITE ? 'infinite' : '1',
    animationTimingFunction: easing,
    animationName:
      easingType === EasingType.WIGGLE
        ? `${previewAnimationType}AnimationWiggle${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}${previewPlayMode === PreviewPlayMode.ONCE && counter % 2 === 1 ? 'Reverse' : ''}`
        : `${previewAnimationType}Animation${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}${previewPlayMode === PreviewPlayMode.ONCE && counter % 2 === 1 ? 'Reverse' : ''}`,
    animationFillMode: 'both',
    animationPlayState: clicked ? 'paused' : 'running',
  });

  return (
    <div
      className={classNames(
        'absolute inset-0 z-20 grid items-center justify-items-center',
        // TODO let the element wiggle, turn turquoise and explode when clicked
        clicked && 'opacity-50',
      )}
      style={{
        // settings for 3d perspective
        perspective: '250px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        role="button"
        tabIndex={-1}
        className="bg-grdt-from col-span-full row-span-full size-1/4 cursor-help rounded-xl !border-none"
        style={animationStyles(value)}
        onClick={() => setClicked(!clicked)}
        onKeyUp={(e) => e.key === 'Enter' && setClicked(!clicked)}
        aria-label='Easteregg'
      />

      <div
        className={classNames(
          'pointer-events-none col-span-full row-span-full grid size-full items-center justify-items-center',
          previewShowLinear && easingType !== EasingType.WIGGLE ? 'opacity-50' : 'opacity-0',
        )}
        style={{
          // settings for 3d perspective
          perspective: '500px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className={classNames(
            'border-grdt-to rounded-xl border',
            [AnimationType.ROTATE_X, AnimationType.ROTATE_Y].includes(previewAnimationType) ? 'size-3/6' : 'size-1/4',
          )}
          style={animationStyles('linear')}
        />
      </div>
    </div>
  );
}
