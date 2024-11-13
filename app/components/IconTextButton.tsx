import { classNames } from '~/utils/class-names';

type Props = {
  text: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export default function IconTextButton({ isActive, text, icon, onClick }: Props) {
  return (
    <button
      className={classNames(
        'group relative z-0 flex items-center gap-2 rounded-xl px-4 py-2.5',
        isActive ? 'text-zinc-100' : 'text-zinc-500',
        'ease-out-sine transition-all duration-300 will-change-transform',
        'rounded-xl outline-none',
        'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused',
      )}
      onClick={onClick}
    >
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
      <svg
        viewBox="0 0 100 100"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classNames('size-6 overflow-visible', isActive ? 'stroke-[url(#curve-gradient)]' : 'stroke-current')}
      >
        {icon}
      </svg>
      <span className={classNames('text-xs uppercase tracking-widest')}>{text}</span>
    </button>
  );
}
