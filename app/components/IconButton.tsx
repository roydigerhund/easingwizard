import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function IconButton({ className, label, isActive, disabled, onClick, children }: Props) {
  return (
    <button
      className={classNames(
        className,
        'group relative flex size-10 items-center justify-center',
        isActive ? 'text-zinc-100' : 'text-zinc-500',
        'shadow-element_inactive',
        !disabled && 'hover:shadow-element_focused focus:shadow-element_focused',
        disabled && 'cursor-not-allowed',
        'rounded-xl outline-none',
        'ease-out-sine transition-all duration-300 will-change-transform',
      )}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
    >
      {children}
      <span
        className={classNames(
          'absolute inset-0 rounded-xl',
          'ease-out-sine transition-all duration-100',
          'group-hover:ease-in-sine group-hover:duration-200',
          'group-focus:ease-in-sine group-focus:duration-200',
          isActive
            ? 'shadow-element_border_active group-hover:shadow-element_border_inactive group-focus:shadow-element_border_inactive'
            : 'shadow-element_border_inactive',
        )}
      />
      <span
        className={classNames(
          'will-change-transform',
          'opacity-0 group-hover:opacity-100',
          'translate-y-2 group-hover:translate-y-0',
          'pointer-events-none absolute bottom-full mb-2',
          'rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1',
          'whitespace-nowrap text-base text-zinc-100',
          'ease-overshoot transition-all duration-300',
        )}
      >
        {label}
      </span>
    </button>
  );
}
