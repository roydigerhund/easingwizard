import {
  bezierFunctions,
  bezierStyleFunctions,
  bounceFunctions,
  springFunctions,
  wiggleFunctions,
} from '~/data/easing';
import { bounceCalculations, springCalculations, wiggleCalculations } from '~/generated/linear-easings';
import { useEasingStore } from '~/state/easing-store';
import { BezierCurve, BezierStyle, BounceCurve, EasingType, SpringCurve, WiggleCurve } from '~/types-and-enums';
import { humanize } from '~/utils/string';
import IconButton from './IconButton';

export default function EasingSelection() {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierStyle = useEasingStore((state) => state.bezierStyle);
  const bezierCurve = useEasingStore((state) => state.bezierCurve);
  const springCurve = useEasingStore((state) => state.springCurve);
  const bounceCurve = useEasingStore((state) => state.bounceCurve);
  const wiggleCurve = useEasingStore((state) => state.wiggleCurve);
  const setState = useEasingStore((state) => state.setState);

  const onBezierValueChange = (style: BezierStyle, curve: BezierCurve) => {
    setState({
      bezierValue: bezierFunctions[style][curve],
      bezierStyle: style,
      bezierCurve: curve,
    });
  };

  const onSpringValueChange = (curve: SpringCurve) => {
    setState({
      springStiffness: springFunctions[curve].stiffness,
      springDamping: springFunctions[curve].damping,
      springInitialVelocity: springFunctions[curve].initialVelocity,
      springCurve: curve,
    });
  };

  const onBounceValueChange = (curve: BounceCurve) => {
    setState({
      bounceBounces: bounceFunctions[curve].bounces,
      bounceDamping: bounceFunctions[curve].damping,
      bounceCurve: curve,
    });
  };

  const onWiggleValueChange = (curve: WiggleCurve) => {
    setState({
      wiggleStiffness: wiggleFunctions[curve].stiffness,
      wiggleDamping: wiggleFunctions[curve].damping,
      wiggleInitialVelocity: wiggleFunctions[curve].initialVelocity,
      wiggleCurve: curve,
    });
  };

  return (
    <div>
      {easingType === EasingType.BEZIER && (
        <>
          <div className="flex flex-wrap gap-4">
            {Object.keys(bezierFunctions).map((style) => {
              const values = bezierStyleFunctions[style as BezierStyle];
              return (
                <IconButton
                  key={style}
                  isActive={bezierStyle === style}
                  onClick={() => {
                    onBezierValueChange(style as BezierStyle, bezierCurve);
                  }}
                  text={humanize(style)}
                  icon={
                    <path
                      d={`M0,100 C${values[0] * 100},${100 - values[1] * 100} ${values[2] * 100},${100 - values[3] * 100} 100,0`}
                    />
                  }
                />
              );
            })}
          </div>
          <hr
            className="my-5 border-t border-zinc-700"
            style={{
              maskImage: 'linear-gradient(to right,rgba(0,0,0,1),rgba(0,0,0,0.1))',
            }}
          />
        </>
      )}
      {easingType === EasingType.BEZIER && (
        <div className="flex flex-wrap gap-4">
          {Object.entries(bezierFunctions[bezierStyle]).map(([curve, values]) => (
            <IconButton
              key={curve}
              isActive={bezierCurve === curve}
              onClick={() => onBezierValueChange(bezierStyle, curve as BezierCurve)}
              text={humanize(curve)}
              icon={
                <path
                  d={`M0,100 C${values[0] * 100},${100 - values[1] * 100} ${values[2] * 100},${100 - values[3] * 100} 100,0`}
                />
              }
            />
          ))}
        </div>
      )}
      {easingType === EasingType.SPRING && (
        <div className="flex flex-wrap gap-4">
          {Object.keys(springFunctions).map((curve) => (
            <IconButton
              key={curve}
              isActive={springCurve === curve}
              onClick={() => onSpringValueChange(curve as SpringCurve)}
              text={humanize(curve)}
              icon={
                <polyline
                  points={springCalculations[curve as SpringCurve].sampledPoints
                    .map((point) => `${point.x},${point.y / 2 + 50}`)
                    .join(' ')}
                />
              }
            />
          ))}
        </div>
      )}
      {easingType === EasingType.BOUNCE && (
        <div className="flex flex-wrap gap-4">
          {Object.keys(bounceFunctions).map((curve) => (
            <IconButton
              key={curve}
              isActive={bounceCurve === curve}
              onClick={() => onBounceValueChange(curve as BounceCurve)}
              text={humanize(curve)}
              icon={
                <polyline
                  points={bounceCalculations[curve as BounceCurve].sampledPoints
                    .map((point) => `${point.x},${100 - point.y}`)
                    .join(' ')}
                />
              }
            />
          ))}
        </div>
      )}
      {easingType === EasingType.WIGGLE && (
        <div className="flex flex-wrap gap-4">
          {Object.keys(wiggleFunctions).map((curve) => (
            <IconButton
              key={curve}
              isActive={wiggleCurve === curve}
              onClick={() => onWiggleValueChange(curve as WiggleCurve)}
              text={humanize(curve)}
              icon={
                <polyline
                  points={wiggleCalculations[curve as WiggleCurve].sampledPoints
                    .map((point) => `${point.x},${point.y / 2 + 50}`)
                    .join(' ')}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
