import { classNames } from '~/utils/class-names';
import { shortTransition } from '~/utils/common-classes';
import HeartIcon from './icons/HeartIcon';

export default function Footer() {
  return (
    <div className="flex items-center justify-center gap-3 text-center text-sm text-zinc-400">
      <span>Made with </span>
      <span className="sr-only">love</span>
      <HeartIcon className="size-6 text-grdt-to drop-shadow-[0_0_0.5rem_var(--grdt-to)]" />
      <span>
        by{' '}
        <a
          href="https://x.com/RoyDigerhund"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames('text-zinc-100 hover:text-grdt-to', shortTransition)}
        >
          Matthias Martin
        </a>
      </span>
    </div>
  );
}
