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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const min = 0;
  const max = options.length - 1;
  const indexValue = options.findIndex((option) => option === value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>, isTextInput?: boolean) => {
    if ((e.key === 'ArrowLeft' && !isTextInput) || e.key === 'ArrowDown') {
      const newOption = options[Math.max(indexValue - 1, min)];
      onChange(newOption);
      e.preventDefault();
    } else if ((e.key === 'ArrowRight' && !isTextInput) || e.key === 'ArrowUp') {
      const newOption = options[Math.min(indexValue + 1, max)];
      onChange(newOption);
      e.preventDefault();
    }
  };

  return (
    <div className={classNames(className, 'group/all flex')}>
      <button
        tabIndex={-1}
        className={classNames(
          'mr-6 flex w-16 cursor-default items-center font-light tracking-wide text-zinc-500 group-focus-within/all:text-zinc-100 group-hover/all:text-zinc-100',
          shortTransition,
        )}
        onClick={() => buttonRef.current?.focus()}
      >
        {label}
      </button>
      <div className={classNames('group/input relative h-8 grow')}>
        <input
          tabIndex={-1}
          type="range"
          min={min}
          max={max}
          step={1}
          value={indexValue}
          onChange={(e) => {
            onChange(options[parseInt(e.target.value)]);
            buttonRef.current?.focus();
          }}
          onClick={() => buttonRef.current?.focus()}
          className={classNames('styled-slider', 'absolute inset-0 cursor-ew-resize rounded-xl px-1', 'opacity-0')}
        />
        <div className="pointer-events-none absolute inset-x-2 inset-y-0">
          <div
            className={classNames('absolute inset-x-0 inset-y-3 w-full rounded-l-lg bg-zinc-900')}
            style={{
              clipPath: `inset(0 ${100 - ((indexValue - min) / (max - min)) * 100}% 0 0)`,
            }}
          />
          <button
            ref={buttonRef}
            className={classNames(
              'absolute top-0.5 z-20 size-7 p-1.5 rounded-full bg-zinc-950',
              '-translate-x-1/2',
              'ease-out-sine transition-shadow duration-300 will-change-transform',
              'outline-none',
              'shadow-element_inactive group-hover/input:shadow-element_focused focus:shadow-element_focused',
            )}
            value={indexValue}
            onKeyDown={handleKeyDown}
            onClick={() => buttonRef.current?.focus()}
            style={{
              left: `${((indexValue - min) / (max - min)) * 100}%`,
            }}
          >
            <span className={classNames('rounded-full bg-zinc-100 size-full block')} />
          </button>
        </div>
        <span className="pointer-events-none absolute inset-0 flex w-full items-center justify-between">
          {options.map((option) => (
            <span
              key={option + ''}
              className={classNames(
                'h-4 w-4 rounded-full',
                indexValue > options.indexOf(option) ? 'border-[5px] border-zinc-950 bg-zinc-100' : 'bg-zinc-800',
              )}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
