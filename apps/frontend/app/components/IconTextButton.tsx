import { useState } from 'react';
import { classNames } from '~/css/class-names';
import Tooltip from './Tooltip';

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
      {toast && <Tooltip visible={showToast}>{toast}</Tooltip>}
    </button>
  );
}
