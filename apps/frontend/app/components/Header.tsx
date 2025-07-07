import WizardIcon from './icons/WizardIcon';

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-2">
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
