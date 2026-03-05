import { classNames } from '~/css/class-names';
import Tooltip from './Tooltip';

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
        'rounded-xl focus:outline-hidden outline-hidden',
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
      <Tooltip position={position}>{label}</Tooltip>
    </button>
  );
}
