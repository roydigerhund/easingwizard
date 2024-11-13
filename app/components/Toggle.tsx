import { useRef } from 'react';
import { classNames } from '~/utils/class-names';
import { shortTransition } from '~/utils/common-classes';

type Props = {
  className?: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function Toggle({ className, label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={classNames(className, 'group/all relative flex')}>
      <button
        tabIndex={-1}
        className={classNames(
          'mr-6 flex grow cursor-default items-center font-light tracking-wide text-zinc-500 group-focus-within/all:text-zinc-100 group-hover/all:text-zinc-100',
          shortTransition,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {label}
      </button>
      <label className="group">
        <input
          ref={inputRef}
          className="absolute opacity-0"
          type="checkbox"
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
        <span className="sr-only">{label}</span>
        <span
          className={classNames(
            'relative block h-7 w-14 cursor-pointer rounded-full',
            'shadow-element_inactive group-hover:shadow-element_focused group-focus-within:shadow-element_focused',
            'ease-out-sine transition-all duration-300 will-change-transform',
          )}
        >
          <span
            className={classNames(
              'absolute inset-0 rounded-full',
              'ease-out-sine transition-all duration-100',
              'group-hover:ease-in-sine group-hover:duration-200',
              'group-focus:ease-in-sine group-focus:duration-200',
              value
                ? 'shadow-element_border_active group-hover:shadow-element_border_inactive group-focus:shadow-element_border_inactive'
                : 'shadow-element_border_inactive',
            )}
          />
          <span
            className={classNames('absolute inset-1.5 rounded-full bg-zinc-900', value ? 'opacity-100' : 'opacity-0', shortTransition)}
          />
          <span
            className={classNames(
              'absolute top-1 mx-1 block h-5 w-5 rounded-full',
              shortTransition,
              value ? 'group-active:left-5 group-active:w-7' : 'group-active:w-7',
              value ? 'left-7' : 'left-0',
              value ? 'origin-right' : 'origin-left',
              value ? 'bg-zinc-100' : 'bg-zinc-500',
            )}
          />
        </span>
      </label>
    </div>
  );
}
