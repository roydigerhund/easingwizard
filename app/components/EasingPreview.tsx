import { useContext, useState } from 'react';
import { EasingContext } from '~/contexts/easing-context';
import { AnimationType, EasingType, PreviewLayout, PreviewPlayMode } from '~/types-and-enums';

export default function EasingPreview() {
  const {
    state: { easingType, bezierValue, springValue, bounceValue },
  } = useContext(EasingContext);
  const [duration, setDuration] = useState(1000); // Duration in milliseconds
  const [playMode, setPlayMode] = useState(PreviewPlayMode.INFINITE);
  const [layout, setLayout] = useState(PreviewLayout.HORIZONTAL);
  const [animationType, setAnimationType] = useState(AnimationType.MOVE);

  // TODO: bezierValue should be a string
  const value = easingType === EasingType.BEZIER ? `cubic-bezier(${bezierValue.join(', ')})` : easingType === EasingType.SPRING ? springValue : bounceValue;

  const animationStyles = (easing: string) => ({
    animationDuration: `${duration}ms`,
    animationIterationCount: playMode === PreviewPlayMode.INFINITE ? 'infinite' : '1',
    animationTimingFunction: easing,
    animationName: animationType + 'Animation',
    animationDirection: 'alternate',
  });

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Duration (ms):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>

        <label style={{ marginLeft: '20px' }}>
          Play Mode:
          <select value={playMode} onChange={(e) => setPlayMode(e.target.value as PreviewPlayMode)}>
            <option value="once">Play Once</option>
            <option value="infinite">Play Infinite</option>
          </select>
        </label>

        <label style={{ marginLeft: '20px' }}>
          Layout:
          <select value={layout} onChange={(e) => setLayout(e.target.value as PreviewLayout)}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>

        <label style={{ marginLeft: '20px' }}>
          Animation Type:
          <select value={animationType} onChange={(e) => setAnimationType(e.target.value as AnimationType)}>
            <option value="move">Move</option>
            <option value="width">Width</option>
            <option value="height">Height</option>
            <option value="scale">Scale</option>
            <option value="rotate">Rotate</option>
            <option value="opacity">Opacity</option>
            <option value="rotateX">RotateX</option>
            <option value="rotateY">RotateY</option>
          </select>
        </label>
      </div>

      {/* Preview Elements */}
      <div
        style={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          justifyContent: 'space-around',
        }}
      >
        {/* Linear Animation */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>Linear</div>
          <div className="w-12 h-12 bg-blue-500" style={animationStyles('linear')}></div>
        </div>

        {/* Custom Easing Animation */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>Custom Easing</div>
          <div className="w-12 h-12 bg-blue-500" style={animationStyles(value)}></div>
        </div>
      </div>
    </div>
  );
}
