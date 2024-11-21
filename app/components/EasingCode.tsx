import { useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { paragraph } from '~/utils/common-classes';
import CodeBlock from './CodeBlock';
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
      <div className="flex flex-col items-start justify-between gap-6 @md:flex-row">
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
      <div className="mt-3 flex flex-col items-start gap-4 @md:mt-6">
        {codeType === CodeType.CSS && (
          <>
            <CodeBlock>{transformedValue}</CodeBlock>
            <p className={paragraph}>
              In CSS, <code>{easingType === EasingType.BEZIER ? 'cubic-bezier' : 'linear'}</code> is used in
              the <code>transition-timing-function</code> or <code>animation-timing-function</code> property.
              <br />
              For a detailed explanation and interactive examples, check out the{' '}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function"
                target="_blank"
                rel="noreferrer noopener"
              >
                MDN Web Docs
              </a>
              .
            </p>
          </>
        )}
        {codeType === CodeType.TAILWIND_CSS && (
          <>
            <CodeBlock>{transformedValue}</CodeBlock>
            <p className={paragraph}>
              In Tailwind CSS, the <code>ease-</code> prefix is used to control the{' '}
              <code>transition-timing-function</code> property. For more information, check out the{' '}
              <a
                href="https://tailwindcss.com/docs/transition-timing-function"
                target="_blank"
                rel="noreferrer noopener"
              >
                Tailwind CSS documentation
              </a>
              .
            </p>

            <div className="my-8 w-full" />
          </>
        )}
      </div>
    </div>
  );
}

const icons: Record<CodeType, React.ReactNode> = {
  [CodeType.CSS]: <CSSIcon className="size-6" />,
  [CodeType.TAILWIND_CSS]: <TailwindCSSIcon className="size-6" />,
};
