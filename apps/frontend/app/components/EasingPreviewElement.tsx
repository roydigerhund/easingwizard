import { AnimationType, EasingType, PreviewPlayMode, screamingSnakeToCamelCase } from 'easing-wizard-core';
import { useEffect, useState } from 'react';
import { classNames } from '~/css/class-names';
import { useEasingStore } from '~/state/easing-store';

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
  const setState = useEasingStore((state) => state.setState);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  useEffect(() => {
    if (clicked) {
      const timeout = setTimeout(() => {
        setClicked(false);
        setState({ foundEasterEgg: true });
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [clicked, setState]);

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
        ? `${screamingSnakeToCamelCase(previewAnimationType)}AnimationWiggle${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}${previewPlayMode === PreviewPlayMode.ONCE && counter % 2 === 1 ? 'Reverse' : ''}`
        : `${screamingSnakeToCamelCase(previewAnimationType)}Animation${previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'}${previewPlayMode === PreviewPlayMode.ONCE && counter % 2 === 1 ? 'Reverse' : ''}`,
    animationFillMode: 'both',
    animationPlayState: clicked ? 'paused' : 'running',
  });

  return (
    <>
      {/* Easter egg */}
      {clicked && (
        <div className="absolute inset-0 z-10 grid items-center justify-items-center overflow-hidden">
          <div className="animate-easteregg col-span-full row-span-full size-1/4">
            <div className="easteregg-rotate size-full">
              <div className="easteregg-shape size-full rounded-xl bg-grdt-from" />
            </div>
          </div>
        </div>
      )}
      <div
        className={classNames(
          'absolute inset-0 z-20 grid items-center justify-items-center',
          'transition-all duration-300',
          'outline-hidden focus:outline-hidden',
          clicked ? 'scale-0 opacity-0 ease-[cubic-bezier(0.55,0,1,0.45)]' : 'ease-[cubic-bezier(0,0.55,0.45,1)]',
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
          className="relative z-10 col-span-full row-span-full size-1/4 cursor-help rounded-xl border-none! bg-grdt-from"
          style={animationStyles(value)}
          onClick={handleClick}
          onKeyUp={(e) => e.key === 'Enter' && handleClick()}
          aria-label="Easteregg"
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
              'rounded-xl border border-grdt-to',
              ([AnimationType.ROTATE_X, AnimationType.ROTATE_Y] as string[]).includes(previewAnimationType)
                ? 'size-3/6'
                : 'size-1/4',
            )}
            style={animationStyles('linear')}
          />
        </div>
      </div>
    </>
  );
}
