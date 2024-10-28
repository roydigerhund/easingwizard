import { useEasingStore } from '~/state/easing-store';
import { EasingType, PreviewPlayMode } from '~/types-and-enums';
import MeshBase from './MeshBase';

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
    animationDuration: `${previewDuration * (previewPlayMode === PreviewPlayMode.INFINITE ? 4 : 1)}ms`,
    animationIterationCount: previewPlayMode === PreviewPlayMode.INFINITE ? 'infinite' : '1',
    animationTimingFunction: easing,
    animationName:
      previewAnimationType + 'Animation' + (previewPlayMode === PreviewPlayMode.INFINITE ? 'Infinite' : 'Once'),
    animationFillMode: 'both',
  });

  return (
    <MeshBase>
      <div className="absolute inset-0 z-10 grid items-center justify-items-center">
        <div
          className="col-span-full row-span-full h-1/4 w-1/4 rounded-xl !border-none bg-[--svg-line-gradient-from]"
          style={animationStyles(value)}
        />
        {previewShowLinear && (
          <div
            className="col-span-full row-span-full h-1/4 w-1/4 rounded-xl border border-[--svg-line-gradient-to] opacity-50"
            style={animationStyles('linear')}
          />
        )}
      </div>
    </MeshBase>
  );
}
