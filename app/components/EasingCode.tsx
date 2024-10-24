import { useState } from 'react';
import { useEasingStore } from '~/state/easing-store';
import { EasingType } from '~/types-and-enums';

export default function EasingCode() {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierValue = useEasingStore((state) => state.bezierValue);
  const springValue = useEasingStore((state) => state.springValue);
  const bounceValue = useEasingStore((state) => state.bounceValue);
  const wiggleValue = useEasingStore((state) => state.wiggleValue);
  const [copied, setCopied] = useState(false);

  // TODO: bezierValue should be a string
  const value =
    easingType === EasingType.BEZIER
      ? `cubic-bezier(${bezierValue.join(', ')})`
      : easingType === EasingType.SPRING
        ? springValue
        : easingType === EasingType.BOUNCE
          ? bounceValue
          : wiggleValue;

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
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <code className='select-all'>{value}</code>
        <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
