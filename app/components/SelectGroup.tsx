import { classNames } from '~/utils/class-names';

type Props<T> = {
  className?: string;
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
};

export default function SelectGroup<T>({ className, label, value, options, onChange }: Props<T>) {
  return (
    <div className={classNames(className, 'group relative flex')}>
      <button
        tabIndex={-1}
        className="mr-6 flex grow cursor-default items-center font-light tracking-wide text-zinc-500 transition-all duration-200 ease-in-out group-focus-within:text-zinc-400 group-hover:text-zinc-400"
      >
        {label}
      </button>
      <div className="flex relative">
        {options.map((option, index) => (
          <button
            key={option.label}
            className={classNames(
              'block px-3 py-1.5 cursor-pointer border border-zinc-800 transition-all duration-200 ease-in-out text-zinc-500',
              'focus:outline-none focus:ring-grdt-to focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:z-10',
              value === option.value && 'bg-zinc-800 text-white',
              index === 0 && 'rounded-l-full pl-4',
              index === options.length - 1 && 'rounded-r-full pr-4',
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
