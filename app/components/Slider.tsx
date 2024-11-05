import { useEffect, useRef } from 'react';
import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

export default function Slider({ className, label, value, onChange, min, max, step }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--value', value.toString());
      inputRef.current.style.setProperty('--min', min.toString());
      inputRef.current.style.setProperty('--max', max.toString());
    }
  }, [value, min, max]);

  return (
    <div className="group/all flex">
      <label className={classNames(className, 'group flex grow')}>
        <button
          tabIndex={-1}
          className="mr-6 flex w-16 cursor-default items-center font-light tracking-wide text-zinc-500 transition-all duration-200 ease-in-out group-focus-within/all:text-zinc-400 group-hover/all:text-zinc-400"
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </button>
        <input
          ref={inputRef}
          className="styled-slider slider-progress grow transition-all duration-200 ease-in-out"
          type="range"
          value={value}
          onChange={(e) => {
            onChange(parseFloat(e.target.value));
            if (document.activeElement !== e.target) {
              e.target.focus();
            }
          }}
          onMouseUp={(e) => e.currentTarget.focus()}
          step={step}
          min={min}
          max={max}
        />
      </label>
      <input
        className={classNames(
          'ml-3 w-16 rounded-md border border-zinc-800 bg-transparent text-center text-zinc-300 transition-all duration-200 ease-in-out hover:border-zinc-700',
          'focus:ring-grdt-to focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950',
        )}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
