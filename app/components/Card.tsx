import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className, children }: Props) {
  return (
    <div className={classNames('relative rounded-xl backdrop-blur-sm', className)}>
      {children}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg,hsla(0,0%,100%,.2),transparent 100%)',
          mask: 'linear-gradient(#000,#000) content-box,linear-gradient(#000,#000)',
          maskComposite: 'exclude',
        }}
      />
    </div>
  );
}
