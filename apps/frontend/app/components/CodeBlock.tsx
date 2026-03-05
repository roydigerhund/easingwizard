import { useState } from 'react';
import { classNames } from '~/css/class-names';
import Tooltip from './Tooltip';
import ClipboardIcon from './icons/ClipboardIcon';

type Props = {
  children: string;
};

export default function CodeBlock({ children }: Props) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(children);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  return (
    <div className={classNames('w-full', 'selection:bg-none', 'group relative')}>
      <button
        className={classNames(
          'absolute right-1.5 top-1.5 z-10 flex select-none items-center justify-center gap-2 px-3 py-2.5',
          'bg-zinc-950 text-zinc-100',
          'transition-all duration-300 ease-out-sine will-change-transform',
          'rounded-lg outline-hidden focus:outline-hidden',
          'shadow-element_inactive hover:shadow-element_focused focus:shadow-element_focused active:shadow-element_pressed',
          '[--shadow-retract:-0.6rem]',
          'opacity-0 group-hover:opacity-100',
        )}
        onClick={handleClick}
        aria-label="Copy to Clipboard"
      >
        <ClipboardIcon className="size-6" />
        <Tooltip visible={showToast}>Copied!</Tooltip>
      </button>
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
