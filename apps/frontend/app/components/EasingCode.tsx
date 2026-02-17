import { EasingType, cssStringToTailwind, suggestDuration } from 'easingwizard-core';
import { useEffect, useMemo, useState } from 'react';
import { paragraph } from '~/css/common-classes';
import { useEasingStore } from '~/state/easing-store';
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
  const springMass = useEasingStore((state) => state.springMass);
  const springStiffness = useEasingStore((state) => state.springStiffness);
  const springDamping = useEasingStore((state) => state.springDamping);
  const springTotalTime = useEasingStore((state) => state.springTotalTime);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const bounceBounces = useEasingStore((state) => state.bounceBounces);
  const bounceDamping = useEasingStore((state) => state.bounceDamping);
  const wiggleWiggles = useEasingStore((state) => state.wiggleWiggles);
  const wiggleDamping = useEasingStore((state) => state.wiggleDamping);
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootMass = useEasingStore((state) => state.overshootMass);
  const overshootDamping = useEasingStore((state) => state.overshootDamping);

  const suggestedDuration = useMemo(() => {
    switch (easingType) {
      case EasingType.SPRING:
        return suggestDuration(EasingType.SPRING, { mass: springMass, stiffness: springStiffness, damping: springDamping, accuracy: editorAccuracy }, springTotalTime);
      case EasingType.BOUNCE:
        return suggestDuration(EasingType.BOUNCE, { bounces: bounceBounces, damping: bounceDamping, accuracy: editorAccuracy });
      case EasingType.WIGGLE:
        return suggestDuration(EasingType.WIGGLE, { wiggles: wiggleWiggles, damping: wiggleDamping, accuracy: editorAccuracy });
      case EasingType.OVERSHOOT:
        return suggestDuration(EasingType.OVERSHOOT, { style: overshootStyle, mass: overshootMass, damping: overshootDamping, accuracy: editorAccuracy });
      default:
        return null;
    }
  }, [easingType, springMass, springStiffness, springDamping, springTotalTime, editorAccuracy, bounceBounces, bounceDamping, wiggleWiggles, wiggleDamping, overshootStyle, overshootMass, overshootDamping]);

  const [codeType, setCodeType] = useState(CodeType.CSS);

  useEffect(() => {
    // check localStorage for the last selected code type
    const lastCodeType = localStorage.getItem('lastCodeType');
    if (lastCodeType && Object.values(CodeType).includes(lastCodeType as CodeType)) {
      setCodeType(lastCodeType as CodeType);
    }
  }, []);

  const handleSetCodeType = (type: CodeType) => {
    setCodeType(type);
    localStorage.setItem('lastCodeType', type);
  };

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
        return cssStringToTailwind(value);
    }
  };

  const transformedValue = transformValue();

  return (
    <div className="@container">
      <div className="flex flex-col items-start justify-between gap-6 @md:flex-row">
        <div className="flex gap-6">
          {Object.values(CodeType).map((type) => (
            <TabBarButton
              key={type}
              onClick={() => handleSetCodeType(type)}
              isActive={codeType === type}
              icon={icons[type]}
            >
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
            {suggestedDuration && (
              <p className={paragraph}>
                Suggested duration: <code>{suggestedDuration.min}ms</code> – <code>{suggestedDuration.max}ms</code>
              </p>
            )}
            <p className={paragraph}>
              In CSS, <code>{easingType === EasingType.BEZIER ? 'cubic-bezier' : 'linear'}</code> is used in the{' '}
              <code>transition-timing-function</code> or <code>animation-timing-function</code> property.
              <br />
              For a detailed explanation, check out the{' '}
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
            {suggestedDuration && (
              <p className={paragraph}>
                Suggested duration: <code>{suggestedDuration.min}ms</code> – <code>{suggestedDuration.max}ms</code>
              </p>
            )}
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
