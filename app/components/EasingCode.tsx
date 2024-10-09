import { useContext } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { EasingType } from '~/types-and-enums';

export default function EasingCode() {
  const {
    state: { easingType, bezierValue, springValue, bounceValue },
  } = useContext(EasingContext);

  // TODO: bezierValue should be a string
  const value =
    easingType === EasingType.BEZIER
      ? `cubic-bezier(${bezierValue.join(', ')})`
      : easingType === EasingType.SPRING
        ? springValue
        : bounceValue;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(
      () => {
        alert('Easing function copied to clipboard!');
      },
      (err) => {
        alert('Failed to copy!');
        console.error('Could not copy text: ', err);
      },
    );
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Easing Function:</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <code style={{ backgroundColor: '#f0f0f0', padding: '5px' }}>{value}</code>
        <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
