import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { humanize } from '~/utils/string';

export default function EasingTypeSelection() {
  const easingType = useEasingStore((state) => state.easingType);
  const setEasingType = useEasingStore((state) => state.setEasingType);

  return (
    <div
      className={classNames(
        'animate-appear [--animation-delay:0.25s]',
        'relative mx-auto flex items-center justify-between gap-2 rounded-full p-1',
        'max-sm:max-w-96 max-sm:flex-wrap max-sm:justify-center max-sm:gap-3',
        'md:gap-4 lg:gap-8 lg:bg-zinc-950',
      )}
    >
      <div
        className="absolute inset-0 rounded-full max-sm:hidden"
        style={{
          padding: '1px',
          background: 'linear-gradient(175deg,hsla(0,0%,100%,.15),transparent 100%)',
          mask: 'linear-gradient(#000,#000) content-box,linear-gradient(#000,#000)',
          maskComposite: 'exclude',
        }}
      />
      {Object.values(EasingType).map((type) => (
        <button
          key={type}
          className={classNames(
            'group relative z-0 rounded-full p-0.5 outline-hidden focus:outline-hidden',
            'transition-all duration-200 ease-linear',
            // somehow fixes a UI bug in safari when the stars are not visible
            'max-lg:will-change-transform',
            easingType === type ? 'text-zinc-300' : 'text-zinc-500 hover:text-zinc-300',
          )}
          onClick={() => setEasingType(type)}
        >
          <span
            className={classNames(
              'absolute inset-0 -z-10 rounded-full bg-linear-to-tr from-grdt-from via-grdt-via to-grdt-to',
              'transition-all duration-200 ease-linear',
              easingType === type
                ? 'opacity-100'
                : 'scale-x-105 scale-y-110 opacity-0 group-focus:scale-100 group-focus:opacity-100',
            )}
          />
          <span className={classNames('absolute inset-0 -z-20 rounded-full bg-zinc-950')} />
          <span
            className={classNames(
              'absolute inset-0 -z-30 rounded-full bg-linear-to-tr from-grdt-from via-grdt-via to-grdt-to blur-[0.5rem]',
              'transition-all duration-200 ease-linear',
              easingType === type ? 'opacity-100' : 'opacity-0 group-focus:opacity-100',
            )}
          />
          <span
            className={classNames(
              'relative z-10 block rounded-full bg-zinc-950 px-4 py-2 text-xs uppercase tracking-widest min-[360px]:text-sm md:px-5',
            )}
          >
            {type === EasingType.BEZIER ? 'Bézier' : humanize(type)}
          </span>
        </button>
      ))}
    </div>
  );
}
