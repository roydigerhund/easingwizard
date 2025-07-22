import { useState } from 'react';
import { classNames } from '~/css/class-names';

export type IconTextButtonProps = {
  className?: string;
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isStaticButton?: boolean;
  toast?: string;
  onClick: () => void;
};

export default function IconTextButton({ className, isActive, isStaticButton, text, icon, toast, onClick }: IconTextButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    onClick();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  return (
    <button
      className={classNames(
        'group relative z-0 flex items-center gap-2 px-4 py-2.5 select-none',
        isActive || isStaticButton ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-400',
        'transition-all duration-300 ease-out-sine will-change-transform',
        'rounded-xl focus:outline-hidden outline-hidden',
        'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
        '[--shadow-retract:-0.6rem]',
        className,
      )}
      onClick={handleClick}
    >
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
      {icon}
      <span className={classNames('text-xs uppercase tracking-widest whitespace-nowrap')}>{text}</span>
      {toast && (
        <span
          className={classNames(
            'will-change-transform',
            'pointer-events-none',
            'absolute bottom-full left-1/2 mb-2 -translate-x-1/2',
            'rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1',
            'whitespace-nowrap text-base text-zinc-100',
            'transition-all duration-300 ease-overshoot',
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
