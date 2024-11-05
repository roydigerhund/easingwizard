import { useEffect, useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { EasingType, PreviewPlayMode } from '~/types-and-enums';
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

  // TODO: bezierValue should be a string
  const value =
    easingType === EasingType.BEZIER
      ? `cubic-bezier(${bezierValue.join(', ')})`
      : easingType === EasingType.OVERSHOOT
        ? overshootValue
        : easingType === EasingType.SPRING
          ? springValue
          : easingType === EasingType.BOUNCE
            ? bounceValue
            : wiggleValue;

  const animationStyles = (easing: string) => ({
    animationDuration: `${previewDuration * (previewPlayMode === PreviewPlayMode.INFINITE ? 4 : 1)}ms`,
    animationIterationCount: previewPlayMode === PreviewPlayMode.INFINITE ? 'infinite' : '1',
    animationTimingFunction: easing,
    animationName:
      easingType === EasingType.WIGGLE
        ? `${previewAnimationType}AnimationWiggle${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}`
        : `${previewAnimationType}Animation${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}${previewPlayMode === PreviewPlayMode.ONCE && counter % 2 === 1 ? 'Reverse' : ''}`,
    animationFillMode: 'both',
    animationPlayState: clicked ? 'paused' : 'running',
  });

  return (
    <div
      className={classNames(
        'absolute inset-0 z-10 grid items-center justify-items-center',
        // TODO let the element wiggle, turn turquoise and explode when clicked
        clicked && 'opacity-50',
      )}
    >
      <button
        tabIndex={-1}
        className="bg-grdt-from col-span-full row-span-full size-1/4 cursor-help rounded-xl !border-none"
        style={animationStyles(value)}
        onClick={() => setClicked(!clicked)}
      />

      <div
        className={classNames(
          'border-grdt-to pointer-events-none col-span-full row-span-full size-1/4 rounded-xl border',
          previewShowLinear ? 'opacity-50' : 'opacity-0',
        )}
        style={animationStyles('linear')}
      />
    </div>
  );
}
