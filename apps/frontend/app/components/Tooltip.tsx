import { classNames } from '~/css/class-names';

type Props = {
  children: React.ReactNode;
  visible?: boolean;
  position?: 'left' | 'middle' | 'right';
  /** CSS class of the group that triggers hover visibility (e.g. "group-hover/all"). Only used when `visible` is not provided. */
  groupHoverClass?: string;
};

export default function Tooltip({ children, visible, position = 'middle', groupHoverClass = 'group-hover' }: Props) {
  const isControlled = visible !== undefined;

  return (
    <span
      className={classNames(
        'will-change-transform',
        'pointer-events-none',
        'absolute bottom-full mb-2',
        'rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1',
        'whitespace-nowrap text-base text-zinc-100',
        'transition-all duration-300 ease-overshoot',
        position === 'left' && 'left-0',
        position === 'middle' && 'left-1/2 -translate-x-1/2',
        position === 'right' && 'right-0',
        isControlled
          ? classNames(visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')
          : classNames(
              'opacity-0 translate-y-2',
              `${groupHoverClass}:opacity-100 ${groupHoverClass}:translate-y-0`,
            ),
      )}
    >
      {children}
    </span>
  );
}
