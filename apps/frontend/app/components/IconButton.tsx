import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  position?: 'left' | 'middle' | 'right';
};

export default function IconButton({
  className,
  label,
  isActive,
  disabled,
  onClick,
  children,
  position = 'middle',
}: Props) {
  return (
    <button
      className={classNames(
        className,
        'group relative flex size-10 select-none items-center justify-center',
        isActive ? 'text-zinc-100' : 'text-zinc-500',
        'shadow-element_inactive',
        !disabled && 'hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
        disabled && 'cursor-not-allowed',
        'rounded-xl focus:outline-none outline-none',
        'transition-all duration-300 ease-out-sine will-change-transform',
      )}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      aria-label={label}
    >
      {children}
      <span
        className={classNames(
          'absolute inset-0 rounded-xl',
          'transition-all duration-100 ease-out-sine',
          'group-hover:duration-200 group-hover:ease-in-sine',
          'group-focus:duration-200 group-focus:ease-in-sine',
          isActive
            ? 'shadow-element_border_active group-hover:shadow-element_border_inactive group-focus:shadow-element_border_inactive'
            : 'shadow-element_border_inactive',
        )}
      />
      <span
        className={classNames(
          'will-change-transform',
          'opacity-0 group-hover:opacity-100',
          'pointer-events-none',
          'absolute bottom-full mb-2',
          'translate-y-2 group-hover:translate-y-0',
          'rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1',
          'whitespace-nowrap text-base text-zinc-100',
          'transition-all duration-300 ease-overshoot',
          position === 'left' && 'left-0',
          position === 'middle' && 'left-1/2 -translate-x-1/2',
          position === 'right' && 'right-0',
        )}
      >
        {label}
      </span>
    </button>
  );
}
