import { useRef } from 'react';
import { classNames } from '~/utils/class-names';

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
        className="mr-6 flex grow cursor-default items-center font-light tracking-wide text-zinc-500 transition-all duration-200 ease-in-out group-focus-within/all:text-zinc-400 group-hover/all:text-zinc-400"
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
            'relative block h-7 w-14 cursor-pointer rounded-full border border-zinc-800 transition-all duration-200 ease-in-out',
            'group-focus-within:ring-grdt-to group-focus-within:ring-2 group-focus-within:ring-offset-2 group-focus-within:ring-offset-zinc-950',
            value && 'bg-zinc-800',
          )}
        >
          <span
            className={classNames(
              'absolute top-0.5 mx-0.5 block h-[1.375rem] w-[1.375rem] rounded-full transition-all duration-200 ease-in-out',
              value ? 'group-active:left-[1.375rem] group-active:w-7' : 'group-active:w-7',
              value ? 'left-7' : 'left-0',
              value ? 'origin-right' : 'origin-left',
              value ? 'bg-white' : 'bg-zinc-500',
            )}
          />
        </span>
      </label>
    </div>
  );
}
