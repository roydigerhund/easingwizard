import WizardIcon from './icons/WizardIcon';

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-2">
      <div className="flex items-center">
        <WizardIcon className="size-24 text-grdt-to drop-shadow-[0_0_0.25rem_var(--grdt-to)]" />
        <div className="magic-wand flex flex-col gap-1 mr-8">
          <div className="h-1 shrink-0 rounded-t-sm bg-grdt-to shadow-[0_0_0.5rem_2px_var(--grdt-to)]" />
          <div className="grow rounded-b-sm bg-zinc-700" />
          <div className="particles">
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
          </div>
        </div>
        <h1 className="mt-4 text-5xl font-extrabold text-zinc-100">Easing Wizard</h1>
      </div>
      <p className="text-sm leading-6 text-zinc-400">
        Create and customize CSS easing functions with magical precision.
      </p>
    </header>
  );
}
