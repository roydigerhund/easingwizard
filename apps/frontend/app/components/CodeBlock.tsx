import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/css/class-names';
import Tooltip from './Tooltip';
import ClipboardIcon from './icons/ClipboardIcon';

type Props = {
  children: string;
};

export default function CodeBlock({ children }: Props) {
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
      await navigator.clipboard.writeText(children);
      setFeedback('success');
      resetTimeout.current = setTimeout(() => setFeedback('idle'), 1000);
    } catch {
      setFeedback('error');
    } finally {
      pending.current = false;
    }
  };

  const feedbackText =
    feedback === 'error' ? 'Copy failed. Select and copy the code below.' : feedback === 'success' ? 'Copied!' : '';

  return (
    <div className={classNames('w-full', 'selection:bg-none', 'group relative')}>
      <button
        className={classNames(
          'absolute top-1.5 right-1.5 z-10 flex items-center justify-center gap-2 px-3 py-2.5 select-none',
          'bg-zinc-950 text-zinc-100',
          'transition-all duration-300 ease-out-sine will-change-transform',
          'rounded-lg outline-hidden focus:outline-hidden',
          'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
          '[--shadow-retract:-0.6rem]',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
        )}
        onClick={handleClick}
        aria-label="Copy to Clipboard"
      >
        <ClipboardIcon className="size-6" />
        <span className="contents" aria-hidden="true">
          <Tooltip visible={feedback !== 'idle'}>{feedback === 'error' ? 'Copy failed' : feedbackText}</Tooltip>
        </span>
      </button>
      <span role="status" className="sr-only">
        {feedbackText}
      </span>
      <div
        className={classNames(
          'relative break-all',
          'font-monospace text-zinc-400',
          'rounded-xl bg-linear-to-r from-zinc-900 to-zinc-950 p-4',
          'transition-all duration-300 ease-out-sine',
          'shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-zinc-950',
          'hover:text-zinc-300 hover:shadow-zinc-700',
          'focus:text-zinc-300 focus:shadow-zinc-700',
        )}
      >
        <p className="selection:bg-zinc-950/95 selection:text-grdt-to">{children}</p>
      </div>
    </div>
  );
}
