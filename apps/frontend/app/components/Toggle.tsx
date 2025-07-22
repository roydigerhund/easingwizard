import { useRef } from 'react';
import { classNames } from '~/css/class-names';
import { shortTransition } from '~/css/common-classes';

type Props = {
  className?: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function Toggle({ className, label, value, onChange }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={classNames(className, 'group/all relative flex')}>
      <button
        tabIndex={-1}
        className={classNames(
          'mr-6 flex grow cursor-default items-center font-light tracking-wide text-zinc-500 group-focus-within/all:text-zinc-100 group-hover/all:text-zinc-100',
          shortTransition,
        )}
        onClick={() => buttonRef.current?.focus()}
      >
        {label}
      </button>
      <div className="group select-none">
        <button
          ref={buttonRef}
          className={classNames(
            'relative block h-7 w-14 cursor-pointer rounded-full outline-hidden focus:outline-hidden',
            'shadow-element_inactive group-focus-within:shadow-element_focused group-hover:shadow-element_focused group-active:shadow-element_pressed',
            'transition-all duration-300 ease-out-sine will-change-transform',
          )}
          onClick={() => onChange(!value)}
          aria-label={label}
        >
          <span
            className={classNames(
              'absolute inset-0 rounded-full',
              'transition-all duration-100 ease-out-sine',
              'group-hover:duration-200 group-hover:ease-in-sine',
              'group-focus-within:duration-200 group-focus-within:ease-in-sine',
              value
                ? 'shadow-element_border_active group-focus-within:shadow-element_border_inactive group-hover:shadow-element_border_inactive'
                : 'shadow-element_border_inactive',
            )}
          />
          <span
            className={classNames(
              'absolute inset-1.5 rounded-full bg-zinc-900',
              value ? 'opacity-100' : 'opacity-0',
              shortTransition,
            )}
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
        </button>
      </div>
    </div>
  );
}
