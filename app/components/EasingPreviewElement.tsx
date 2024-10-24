import { useEasingStore } from '~/state/easing-store';
import { EasingType, PreviewPlayMode } from '~/types-and-enums';

export default function EasingPreviewElement() {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const springValue = useEasingStore((state) => state.springValue);
  const bounceValue = useEasingStore((state) => state.bounceValue);
  const wiggleValue = useEasingStore((state) => state.wiggleValue);
  const previewDuration = useEasingStore((state) => state.previewDuration);
  const previewPlayMode = useEasingStore((state) => state.previewPlayMode);
  const previewAnimationType = useEasingStore((state) => state.previewAnimationType);
  const previewShowLinear = useEasingStore((state) => state.previewShowLinear);

  // TODO: bezierValue should be a string
  const value =
    easingType === EasingType.BEZIER
      ? `cubic-bezier(${bezierValue.join(', ')})`
      : easingType === EasingType.SPRING
        ? springValue
        : easingType === EasingType.BOUNCE
          ? bounceValue
          : wiggleValue;

  const animationStyles = (easing: string) => ({
    animationDuration: `${previewDuration}ms`,
    animationIterationCount: previewPlayMode === PreviewPlayMode.INFINITE ? 'infinite' : '1',
    animationTimingFunction: easing,
    animationName: previewAnimationType + 'Animation',
    animationDirection: 'alternate',
    animationFillMode: 'both',
  });

  return (
    <div className="relative flex h-64 w-64 items-center justify-center shrink-0 grow-0">
      <svg
        className="absolute inset-0 w-full rounded-lg border border-zinc-800 text-zinc-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1="0" y1={(i + 1) * 12.5} x2="100" y2={(i + 1) * 12.5} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={(i + 1) * 12.5} y1="0" x2={(i + 1) * 12.5} y2="100" />
        ))}
      </svg>
      <div className="relative z-10 grid items-center justify-items-center">
        <div
          className="col-span-full row-span-full h-16 w-16 !border-none bg-[--svg-line-gradient-from]"
          style={animationStyles(value)}
        />
        {previewShowLinear && (
          <div
            className="col-span-full row-span-full h-16 w-16 border border-[--svg-line-gradient-to] opacity-50"
            style={animationStyles('linear')}
          />
        )}
      </div>
    </div>
  );
}
