import { useState } from 'react';
import { classNames } from '~/utils/class-names';

type Props = {
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isStaticButton?: boolean;
  toast?: string;
  onClick: () => void;
};

export default function IconTextButton({ isActive, isStaticButton, text, icon, toast, onClick }: Props) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    onClick();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  return (
    <button
      className={classNames(
        'group relative z-0 flex items-center gap-2 rounded-xl px-4 py-2.5',
        isActive || isStaticButton ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-400',
        'ease-out-sine transition-all duration-300 will-change-transform',
        'rounded-xl outline-none',
        'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
        '[--shadow-retract:-0.6rem]',
      )}
      onClick={handleClick}
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
      {toast && (
        <span
          className={classNames(
            'will-change-transform',
            'pointer-events-none',
            'absolute bottom-full left-1/2 mb-2 -translate-x-1/2',
            'rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1',
            'whitespace-nowrap text-base text-zinc-100',
            'ease-overshoot transition-all duration-300',
            showToast ? 'opacity-100' : 'opacity-0',
            showToast ? 'translate-y-0' : 'translate-y-2',
          )}
        >
          {toast}
        </span>
      )}
    </button>
  );
}
