import { classNames } from '~/css/class-names';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function CardHeadline({ className, children }: Props) {
  return (
    <h2 className={classNames('mb-4.5 text-left text-xs font-normal uppercase tracking-widest text-zinc-500', className)}>
      {children}
    </h2>
  );
}
