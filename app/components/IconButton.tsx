import { classNames } from '~/utils/class-names';

type Props = {
  text: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export default function IconButton({ isActive, text, icon, onClick }: Props) {
  return (
    <button
      className={classNames(
        'relative z-0 flex items-center gap-2 rounded-xl border px-4 py-2.5',
        isActive ? 'border-zinc-500 text-zinc-300' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300',
      )}
      onClick={onClick}
    >
      <span className={classNames(isActive ? 'fill-[url(#curve-gradient)]' : 'fill-current')}>{icon}</span>
      <span className={classNames('tracking-widest text-xs uppercase')}>{text}</span>
    </button>
  );
}
