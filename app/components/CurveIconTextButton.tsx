import { classNames } from '~/utils/class-names';
import IconTextButton, { IconTextButtonProps } from './IconTextButton';

export default function CurveIconTextButton({ isActive, icon, ...props }: IconTextButtonProps) {
  return (
    <IconTextButton
      {...props}
      isActive={isActive}
      icon={
        <svg
          viewBox="0 0 100 100"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={classNames(
            'size-6 overflow-visible',
            isActive ? 'stroke-[url(#curve-gradient)]' : 'stroke-current',
          )}
        >
          {icon}
        </svg>
      }
    />
  );
}
