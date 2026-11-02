import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/css/class-names';
import Tooltip from './Tooltip';

export type IconTextButtonProps = {
  className?: string;
  text: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isStaticButton?: boolean;
  toast?: string;
  errorToast?: string;
  onClick?: () => void | Promise<void>;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export default function IconTextButton({
  className,
  isActive,
  isStaticButton,
  text,
  icon,
  toast,
  errorToast = 'Action failed. Please try again.',
  onClick,
  href,
  target,
  rel,
}: IconTextButtonProps) {
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const pending = useRef(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    },
    [],
  );

  const handleClick = async () => {
    if (pending.current) return;
    pending.current = true;
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    setFeedback('idle');
    try {
      await onClick?.();
      if (toast) {
        setFeedback('success');
        resetTimeout.current = setTimeout(() => setFeedback('idle'), 1000);
      }
    } catch {
      setFeedback('error');
    } finally {
      pending.current = false;
    }
  };

  const feedbackText = feedback === 'error' ? errorToast : feedback === 'success' ? toast : '';

  const sharedClassName = classNames(
    'group relative z-0 flex items-center gap-2 px-4 py-2.5 select-none',
    isActive || isStaticButton ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-400',
    'transition-all duration-300 ease-out-sine will-change-transform',
    'rounded-xl outline-hidden focus:outline-hidden',
    'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
    '[--shadow-retract:-0.6rem]',
    className,
  );

  const inner = (
    <>
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
      <span className={classNames('text-xs tracking-widest whitespace-nowrap uppercase')}>{text}</span>
      {(toast || feedback === 'error') && (
        <span className="contents" aria-hidden="true">
          <Tooltip visible={feedback !== 'idle'}>{feedbackText}</Tooltip>
        </span>
      )}
      <span role="status" className="sr-only">
        {feedbackText}
      </span>
    </>
  );

  if (href) {
    return (
      <a className={sharedClassName} href={href} target={target} rel={rel} onClick={handleClick} aria-label={text}>
        {inner}
      </a>
    );
  }

  return (
    <button className={sharedClassName} onClick={handleClick} aria-label={text}>
      {inner}
    </button>
  );
}
