import { useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';
import { classNames } from '~/utils/class-names';

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
  const [copied, setCopied] = useState(false);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  };

  return (
    <div>
      {Object.values(CodeType).map((type) => (
        <button
          key={type}
          onClick={() => setCodeType(type)}
          className={`${codeType === type ? 'text-zinc-300' : 'text-zinc-500'} rounded-md px-3 py-1`}
        >
          {type}
        </button>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <code
          className={classNames(
            'selection:text-grdt-to select-all text-zinc-300 selection:bg-none',
            codeType === CodeType.TAILWIND_CSS && 'break-all',
          )}
        >
          {transformedValue}
        </code>
        <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
