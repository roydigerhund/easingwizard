import { useRef } from 'react';
import { classNames } from '~/utils/class-names';
import { shortTransition } from '~/utils/common-classes';

type Props<T> = {
  className?: string;
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
};

export default function StepSlider<T>({ className, label, value, options, onChange }: Props<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const min = 0;
  const max = options.length - 1;
  const indexValue = options.findIndex((option) => option === value);

  return (
    <label className={classNames(className, 'group flex py-1')}>
      <button
        tabIndex={-1}
        className={classNames(
          'mr-6 flex w-16 cursor-default items-center font-light tracking-wide text-zinc-500 group-focus-within:text-zinc-400 group-hover:text-zinc-400',
          shortTransition,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {label}
      </button>
      <span className="relative z-0 grid grow items-center justify-items-start">
        <input
          ref={inputRef}
          className={classNames('styled-step-slider relative z-30 col-span-full row-span-full w-full')}
          type="range"
          value={indexValue}
          onChange={(e) => {
            onChange(options[parseInt(e.target.value, 10)]);
            if (document.activeElement !== e.target) {
              e.target.focus();
            }
          }}
          onMouseUp={(e) => e.currentTarget.focus()}
          step={1}
          min={min}
          max={max}
        />
        <span
          className="relative z-10 col-span-full row-span-full h-0.5 rounded-lg bg-zinc-100"
          style={{ width: `${(indexValue / max) * 100}%` }}
        />
        <span className="relative z-20 col-span-full row-span-full flex w-full items-center justify-between">
          {options.map((option) => (
            <span
              key={option + ''}
              className={classNames(
                'h-4 w-4 rounded-full',
                indexValue === options.indexOf(option)
                  ? 'bg-zinc-100'
                  : indexValue > options.indexOf(option)
                    ? 'border-4 border-zinc-950 bg-zinc-400'
                    : 'bg-zinc-800',
              )}
            />
          ))}
        </span>
        <span className="relative col-span-full row-span-full h-0.5 w-full rounded-lg bg-zinc-800" />
      </span>
    </label>
  );
}
