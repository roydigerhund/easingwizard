import { Link } from 'react-router';
import { handleIntegrationLinkClick } from '~/utils/integration-navigation';
import NodesIcon from './icons/NodesIcon';
import WizardIcon from './icons/WizardIcon';

export default function Header() {
  return (
    <header className="relative flex flex-col items-center gap-2">
      <Link
        to="#integrations"
        preventScrollReset
        onClick={handleIntegrationLinkClick}
        className="absolute top-5 right-0 hidden min-h-[42px] items-center justify-center gap-[9px] rounded-xl border border-[#303033] bg-zinc-950 px-4 py-2.5 text-[11px] leading-5 font-medium tracking-[1.2px] whitespace-nowrap text-zinc-200 uppercase transition-colors duration-150 hover:border-grdt-to hover:text-grdt-to focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-grdt-to motion-reduce:transition-none xl:inline-flex"
      >
        <NodesIcon className="size-[19px] shrink-0" aria-hidden="true" />
        <span>MCP &amp; Plugins</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="animate-appear-fast grid items-center justify-items-center [--animation-delay:0.25s]">
          <WizardIcon className="animate-path col-span-full row-span-full h-16 w-auto text-grdt-to drop-shadow-[0_0_0.25rem_var(--grdt-to)] min-[360px]:h-20" />
        </div>
        <div className="mt-2 space-y-1 min-[440px]:mt-4 min-[440px]:space-y-2">
          <h1 className="animate-appear text-3xl font-extrabold text-zinc-100 [--animation-delay:0.25s] min-[440px]:text-4xl sm:text-5xl">
            Easing Wizard
          </h1>
          <p className="animate-appear text-[13px] text-zinc-400 [--animation-delay:0.35s] min-[440px]:text-[15px]">
            CSS easing functions made easy
          </p>
        </div>
      </div>
    </header>
  );
}
