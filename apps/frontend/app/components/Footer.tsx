import { classNames } from '~/css/class-names';
import { apiDocsUrl, githubUrl, mcpNpmUrl, pluginUrl } from '~/data/globals';
import BlueskyIcon from './icons/BlueskyIcon';
import XIcon from './icons/XIcon';

const footerLink = classNames(
  'font-medium text-zinc-100 underline decoration-transparent underline-offset-0',
  'transition-all duration-200 ease-in-sine',
  'hover:text-grdt-to hover:decoration-grdt-to hover:underline-offset-4 hover:duration-200 hover:ease-out-sine',
);

export default function Footer() {
  return (
    <div className="space-y-7">
      <hr
        className="border-t border-zinc-700"
        style={{
          maskImage: 'linear-gradient(to right,rgba(0,0,0,1),rgba(0,0,0,0.1))',
        }}
      />
      <div className="flex flex-col items-center gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm">
          <a href={apiDocsUrl} target="_blank" rel="noopener noreferrer" className={footerLink}>
            API
          </a>
          <span aria-hidden="true" className="text-zinc-700">
            ·
          </span>
          <a href={mcpNpmUrl} target="_blank" rel="noopener noreferrer" className={footerLink}>
            MCP Server
          </a>
          <span aria-hidden="true" className="text-zinc-700">
            ·
          </span>
          <a href={pluginUrl} target="_blank" rel="noopener noreferrer" className={footerLink}>
            Claude Plugin
          </a>
          <span aria-hidden="true" className="text-zinc-700">
            ·
          </span>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={footerLink}>
            GitHub
          </a>
        </nav>
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
