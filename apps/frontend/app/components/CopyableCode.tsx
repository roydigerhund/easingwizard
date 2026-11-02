import { useEffect, useRef, useState } from 'react';
import IconTextButton from './IconTextButton';
import ClipboardIcon from './icons/ClipboardIcon';

type Props = { value: string; label: string; buttonText?: string };

export default function CopyableCode({ value, label, buttonText = 'Copy command' }: Props) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    },
    [],
  );

  const copy = async () => {
    if (status === 'copying') return;
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
      resetTimeout.current = setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full min-w-0 space-y-3">
      <pre
        aria-label={label}
        className="rounded-xl bg-linear-to-r from-zinc-900 to-zinc-950 p-3.5 text-[13px] leading-relaxed break-all whitespace-pre-wrap text-zinc-200"
      >
        <code className="font-mono select-all">{value}</code>
      </pre>
      <IconTextButton
        text={status === 'copied' ? 'Copied!' : status === 'copying' ? 'Copying…' : buttonText}
        icon={<ClipboardIcon className="size-5" aria-hidden="true" />}
        isStaticButton
        onClick={copy}
        className="focus-visible:ring-2 focus-visible:ring-grdt-to focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none"
      />
      <p role="status" className={status === 'error' ? 'text-sm leading-relaxed text-zinc-400' : 'sr-only'}>
        {status === 'copied'
          ? `${label} copied to clipboard.`
          : status === 'error'
            ? 'Copy unavailable. Select and copy the text above.'
            : ''}
      </p>
    </div>
  );
}
