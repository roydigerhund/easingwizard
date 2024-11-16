import {
  bezierFunctions,
  bezierStyleFunctions,
  bounceFunctions,
  overshootFunctions,
  springFunctions,
  wiggleFunctions,
} from '~/data/easing';
import {
  bounceCalculations,
  overshootCalculations,
  springCalculations,
  wiggleCalculations,
} from '~/generated/linear-easings';
import { useEasingStore } from '~/state/easing-store';
import {
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  OvershootCurve,
  OvershootStyle,
  SpringCurve,
  WiggleCurve,
} from '~/types-and-enums';
import { createCubicBezierString } from '~/utils/easing';
import { humanize } from '~/utils/string';
import CurveIconTextButton from './CurveIconTextButton';

export default function EasingSelection() {
  const easingType = useEasingStore((state) => state.easingType);
  const bezierStyle = useEasingStore((state) => state.bezierStyle);
  const bezierCurve = useEasingStore((state) => state.bezierCurve);
  const bezierIsCustom = useEasingStore((state) => state.bezierIsCustom);
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootIsCustom = useEasingStore((state) => state.overshootIsCustom);
  const overshootCurve = useEasingStore((state) => state.overshootCurve);
  const springCurve = useEasingStore((state) => state.springCurve);
  const springIsCustom = useEasingStore((state) => state.springIsCustom);
  const bounceCurve = useEasingStore((state) => state.bounceCurve);
  const bounceIsCustom = useEasingStore((state) => state.bounceIsCustom);
  const wiggleCurve = useEasingStore((state) => state.wiggleCurve);
  const wiggleIsCustom = useEasingStore((state) => state.wiggleIsCustom);
  const setState = useEasingStore((state) => state.setState);

  const onBezierValueChange = (style: BezierStyle, curve: BezierCurve) => {
    const value = bezierFunctions[style][curve]!;
    setState({
      bezierRawValue: value,
      bezierValue: createCubicBezierString(value),
      bezierStyle: style,
      bezierCurve: curve,
      bezierIsCustom: false,
      editorExtraSpaceTop: Math.max(value[1], value[3]) > 1,
      editorExtraSpaceBottom: Math.min(value[1], value[3]) < 0,
    });
  };

  const onOvershootValueChange = (style: OvershootStyle, curve: OvershootCurve) => {
    setState({
      overshootStyle: style,
      overshootDamping: overshootFunctions[style][curve].damping,
      overshootMass: overshootFunctions[style][curve].mass,
      overshootCurve: curve,
      overshootIsCustom: false,
    });
  };

  const onSpringValueChange = (curve: SpringCurve) => {
    setState({
      springStiffness: springFunctions[curve].stiffness,
      springDamping: springFunctions[curve].damping,
      springMass: springFunctions[curve].mass,
      springCurve: curve,
      springIsCustom: false,
    });
  };

  const onBounceValueChange = (curve: BounceCurve) => {
    setState({
      bounceBounces: bounceFunctions[curve].bounces,
      bounceDamping: bounceFunctions[curve].damping,
      bounceCurve: curve,
      bounceIsCustom: false,
    });
  };

  const onWiggleValueChange = (curve: WiggleCurve) => {
    setState({
      wiggleDamping: wiggleFunctions[curve].damping,
      wiggleWiggles: wiggleFunctions[curve].wiggles,
      wiggleCurve: curve,
      wiggleIsCustom: false,
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
                <CurveIconTextButton
                  key={style}
                  isActive={!bezierIsCustom && bezierStyle === style}
                  onClick={() => {
                    if (bezierCurve in bezierFunctions[style as BezierStyle]) {
                      onBezierValueChange(style as BezierStyle, bezierCurve);
                    } else {
                      onBezierValueChange(style as BezierStyle, BezierCurve.SINE);
                    }
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
            <CurveIconTextButton
              key={curve}
              isActive={!bezierIsCustom && bezierCurve === curve}
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
      {easingType === EasingType.OVERSHOOT && (
        <>
          <div className="flex flex-wrap gap-4">
            {Object.keys(overshootFunctions).map((style) => {
              return (
                <CurveIconTextButton
                  key={style}
                  isActive={!overshootIsCustom && overshootStyle === style}
                  onClick={() => {
                    if (overshootCurve in overshootFunctions[style as OvershootStyle]) {
                      onOvershootValueChange(style as OvershootStyle, overshootCurve);
                    } else {
                      onOvershootValueChange(style as OvershootStyle, OvershootCurve.DEFAULT);
                    }
                  }}
                  text={humanize(style)}
                  icon={
                    <polyline
                      points={overshootCalculations[style as OvershootStyle].default.sampledPoints
                        .map((point) => `${point.x},${point.y}`)
                        .join(' ')}
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
      {easingType === EasingType.OVERSHOOT && (
        <div className="flex flex-wrap gap-4">
          {Object.keys(overshootFunctions[overshootStyle]).map((curve) => (
            <CurveIconTextButton
              key={curve}
              isActive={!overshootIsCustom && overshootCurve === curve}
              onClick={() => onOvershootValueChange(overshootStyle, curve as OvershootCurve)}
              text={humanize(curve)}
              icon={
                <polyline
                  points={overshootCalculations[overshootStyle][curve as OvershootCurve].sampledPoints
                    .map((point) => `${point.x},${point.y}`)
                    .join(' ')}
                />
              }
            />
          ))}
        </div>
      )}
      {easingType === EasingType.SPRING && (
        <div className="flex flex-wrap gap-4">
          {Object.keys(springFunctions).map((curve) => (
            <CurveIconTextButton
              key={curve}
              isActive={!springIsCustom && springCurve === curve}
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
            <CurveIconTextButton
              key={curve}
              isActive={!bounceIsCustom && bounceCurve === curve}
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
            <CurveIconTextButton
              key={curve}
              isActive={!wiggleIsCustom && wiggleCurve === curve}
              onClick={() => onWiggleValueChange(curve as WiggleCurve)}
              text={humanize(curve)}
              icon={
                <polyline
                  points={wiggleCalculations[curve as WiggleCurve].sampledPoints
                    .map((point) => `${point.x},${point.y / 2}`)
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
