import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function InputGroup({ className, children }: Props) {
  return <div className={classNames('relative z-10 flex flex-col gap-6 px-4 py-4 mt-4', className)}>{children}</div>;
}
