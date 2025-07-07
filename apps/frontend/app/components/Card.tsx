import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className, children }: Props) {
  return (
    <div className={classNames('relative rounded-xl bg-zinc-950 p-px', 'animate-appear', className)}>
      <div className="relative z-10">{children}</div>
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg,hsla(0,0%,100%,.15),transparent 100%)',
          mask: 'linear-gradient(#000,#000) content-box,linear-gradient(#000,#000)',
          maskComposite: 'exclude',
        }}
      />
    </div>
  );
}
