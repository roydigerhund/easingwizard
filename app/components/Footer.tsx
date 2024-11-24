import { classNames } from '~/utils/class-names';
import BlueskyIcon from './icons/BlueskyIcon';
import XIcon from './icons/XIcon';

export default function Footer() {
  return (
    <div className="space-y-6">
      <hr
        className="my-5 border-t border-zinc-700"
        style={{
          maskImage: 'linear-gradient(to right,rgba(0,0,0,1),rgba(0,0,0,0.1))',
        }}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://bsky.app/profile/matthiasmartin.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={classNames('group p-1')}
          >
            <span className="sr-only">Profile on Bluesky</span>
            <BlueskyIcon
              className={classNames(
                'size-7 text-zinc-300 group-hover:text-grdt-to group-hover:drop-shadow-[0_0_0.5rem_var(--grdt-to)]',
                'transition-all duration-300 ease-out',
              )}
            />
          </a>
          <a
            href="https://x.com/RoyDigerhund"
            target="_blank"
            rel="noopener noreferrer"
            className={classNames('group p-1')}
          >
            <span className="sr-only">Profile on X</span>
            <XIcon
              className={classNames(
                'size-7 text-zinc-300 group-hover:text-grdt-to group-hover:drop-shadow-[0_0_0.5rem_var(--grdt-to)]',
                'transition-all duration-300 ease-out',
              )}
            />
          </a>
        </div>
        <div className="text-sm text-zinc-400">Made by Matthias Martin</div>
      </div>
    </div>
  );
}
