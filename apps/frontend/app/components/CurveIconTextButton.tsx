import { classNames } from '~/utils/class-names';
import type { IconTextButtonProps } from './IconTextButton';
import IconTextButton from './IconTextButton';

export default function CurveIconTextButton({ isActive, icon, ...props }: IconTextButtonProps) {
  return (
    <IconTextButton
      {...props}
      isActive={isActive}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={classNames(
            'size-6 overflow-visible',
            'stroke-[url(#curve-gradient)]',
            'transition-all duration-300 ease-linear will-change-transform',
            isActive ? 'saturate-100' : 'saturate-0 opacity-50 group-hover:opacity-100',
          )}
          fill="none"
        >
          {icon}
        </svg>
      }
    />
  );
}
