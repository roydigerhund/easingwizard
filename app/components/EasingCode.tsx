import { useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';
import ClipboardIcon from './icons/ClipboardIcon';
import CSSIcon from './icons/CSSIcon';
import TailwindCSSIcon from './icons/TailwindCSSIcon';
import IconTextButton from './IconTextButton';
import TabBarButton from './TabBarButton';

export enum CodeType {
  CSS = 'CSS',
  TAILWIND_CSS = 'Tailwind CSS',
}

export default function EasingCode() {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const overshootValue = useEasingStore((state) => state.overshootValue);
  const springValue = useEasingStore((state) => state.springValue);
  const bounceValue = useEasingStore((state) => state.bounceValue);
  const wiggleValue = useEasingStore((state) => state.wiggleValue);

  const [codeType, setCodeType] = useState(CodeType.CSS);

  const getValue = () => {
    switch (easingType) {
      case EasingType.BEZIER:
        return bezierValue;
      case EasingType.OVERSHOOT:
        return overshootValue;
      case EasingType.SPRING:
        return springValue;
      case EasingType.BOUNCE:
        return bounceValue;
      case EasingType.WIGGLE:
        return wiggleValue;
    }
  };

  const value = getValue();

  const transformValue = () => {
    switch (codeType) {
      case CodeType.CSS:
        return value;
      case CodeType.TAILWIND_CSS:
        return `ease-[${value.replace(/ /g, '_')}]`;
    }
  };

  const transformedValue = transformValue();

  return (
    <div className="@container">
      <div className="@md:flex-row flex flex-col items-start justify-between gap-6">
        <div className="flex gap-6">
          {Object.values(CodeType).map((type) => (
            <TabBarButton key={type} onClick={() => setCodeType(type)} isActive={codeType === type} icon={icons[type]}>
              {type}
            </TabBarButton>
          ))}
        </div>
        <IconTextButton
          text="Copy to Clipboard"
          icon={<ClipboardIcon className="size-6" />}
          onClick={() => navigator.clipboard.writeText(transformedValue)}
          isStaticButton
          toast="Copied!"
        />
      </div>
      <div className="@md:mt-6 mt-3 flex flex-col items-start gap-4">
        <code
          className={classNames(
            codeType === CodeType.TAILWIND_CSS && 'break-all',
            'font-monospace text-zinc-300 selection:bg-none selection:text-grdt-to',
            'w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 p-4',
            'transition-all duration-300 ease-in-out',
            'shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-zinc-950',
            'hover:text-zinc-100 hover:shadow-zinc-700',
            'focus:text-zinc-100 focus:shadow-zinc-700',
          )}
        >
          {transformedValue}
        </code>
      </div>
    </div>
  );
}

const icons: Record<CodeType, React.ReactNode> = {
  [CodeType.CSS]: <CSSIcon className="size-6" />,
  [CodeType.TAILWIND_CSS]: <TailwindCSSIcon className="size-6" />,
};
