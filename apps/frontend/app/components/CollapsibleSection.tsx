import { useState } from 'react';
import { classNames } from '~/css/class-names';
import ChevronDownIcon from './icons/ChevronDownIcon';

type Props = {
  title: string;
  /** Whether the section starts open. Defaults to true. */
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
};

/**
 * Accordion-style collapsible section with a clickable header and animated
 * open/close using the CSS grid-template-rows trick for smooth height transitions.
 */
export default function CollapsibleSection({ title, defaultOpen = true, children, className }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={classNames(
          'group/toggle mb-4.5 flex w-full items-center justify-between',
          'text-left text-xs font-normal uppercase tracking-widest text-zinc-500',
          'hover:text-zinc-300 focus-visible:text-zinc-300',
          'transition-colors duration-200 ease-out-sine',
          'outline-hidden focus:outline-hidden',
        )}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={classNames(
            'size-3.5 shrink-0 transition-transform duration-200 ease-out-sine',
            isOpen ? 'rotate-0' : '-rotate-90',
          )}
        />
      </button>

      {/* Grid-rows trick: animates height from 0fr → 1fr smoothly */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
