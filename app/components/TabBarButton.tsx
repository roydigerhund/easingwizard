import { classNames } from '~/utils/class-names';

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export default function TabBarButton({ isActive, children, icon, onClick }: Props) {
  return (
    <button
      className={classNames(
        'group relative z-0 flex items-center gap-2 py-2.5',
        isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-400',
        'ease-out-sine transition-all duration-300 will-change-transform',
        'rounded-xl focus:outline-none outline-none',
      )}
      onClick={onClick}
    >
      <span
        className={classNames(
          'absolute inset-x-0 -bottom-px h-px origin-top',
          'ease-out-sine transition-all duration-100',
          'group-hover:ease-in-sine group-hover:duration-200',
          'group-focus:ease-in-sine group-focus:duration-200',
          isActive
            ? 'bg-[--border-active] group-hover:scale-y-0 group-focus:scale-y-0'
            : 'bg-[--border-inactive] group-hover:scale-y-0 group-focus:scale-y-0',
        )}
      />
      <span
        className={classNames(
          'bg-grdt-to absolute inset-x-0 bottom-0 z-10 h-0.5 origin-bottom',
          'ease-out-sine transition-all duration-100',
          'group-hover:ease-in-sine group-hover:duration-200',
          'group-focus:ease-in-sine group-focus:duration-200',
          'scale-y-0 group-hover:scale-y-100 group-focus:scale-y-100',
        )}
      />
      <span
        className={classNames(
          'absolute inset-x-0 bottom-0 z-0 h-3',
          'ease-out-sine transition-all duration-300 will-change-transform',
          'shadow-[0_0_0_0_transparent]',
          'group-hover:shadow-[0_0_1.5rem_0_var(--grdt-to)]',
          'group-focus:shadow-[0_0_1.5rem_0_var(--grdt-to)]',
        )}
        style={{ clipPath: 'polygon(0 100%, 100% 100%, calc(100% + 2.5rem) 3rem, -2.5rem 3rem)' }}
      />
      {icon}
      <span className={classNames('tracking-wide whitespace-nowrap')}>{children}</span>
    </button>
  );
}
