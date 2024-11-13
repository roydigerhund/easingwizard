import { classNames } from '~/utils/class-names';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function InputGroup({ className, children }: Props) {
  return <div className={classNames('relative z-10 mt-4 flex flex-col gap-6 px-6 py-5', className)}>{children}</div>;
}
