import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import { humanize } from '~/utils/string';

export default function EasingTypeSelectionCopy() {
  const easingType = useEasingStore((state) => state.easingType);
  const setEasingType = useEasingStore((state) => state.setEasingType);

  return (
    <div className="flex col-span-4">
      <div className="relative flex gap-8 p-1 backdrop-blur-[2px] rounded-full">
        <div
          className="absolute inset-0 rounded-full"
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
              'rounded-full relative p-px z-0',
              easingType === type ? 'text-zinc-300' : 'text-zinc-500 hover:text-zinc-300',
            )}
            onClick={() => setEasingType(type)}
          >
            <span
              className={classNames(
                'absolute -z-10 rounded-full p-0.5 inset-0 bg-gradient-to-tr from-[--svg-line-gradient-from] via-[--svg-line-gradient-via] to-[--svg-line-gradient-to]',
                easingType !== type && 'opacity-0',
              )}
              style={{
                mask: 'linear-gradient(#000,#000) content-box,linear-gradient(#000,#000)',
                maskComposite: 'exclude',
              }}
            />
            <span
              className={classNames('px-5 py-2 block rounded-full uppercase tracking-widest text-sm relative z-10')}
            >
              {humanize(type)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
