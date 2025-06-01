import {
  bezierFunctions,
  bezierStyleFunctions,
  bounceFunctions,
  defaultOvershootCurve,
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
import { createCubicBezierString, generateLinearEasing } from '~/utils/easing';
import { humanize } from '~/utils/string';
import CardHeadline from './CardHeadline';
import CurveIconTextButton from './CurveIconTextButton';

export default function EasingSelection() {
  const easingType = useEasingStore((state) => state.easingType);
  const editorAccuracy = useEasingStore((state) => state.editorAccuracy);
  const bezierStyle = useEasingStore((state) => state.bezierStyle);
  const bezierCurve = useEasingStore((state) => state.bezierCurve);
  const bezierIsCustom = useEasingStore((state) => state.bezierIsCustom);
  const springCurve = useEasingStore((state) => state.springCurve);
  const springIsCustom = useEasingStore((state) => state.springIsCustom);
  const bounceCurve = useEasingStore((state) => state.bounceCurve);
  const bounceIsCustom = useEasingStore((state) => state.bounceIsCustom);
  const wiggleCurve = useEasingStore((state) => state.wiggleCurve);
  const wiggleIsCustom = useEasingStore((state) => state.wiggleIsCustom);
  const overshootStyle = useEasingStore((state) => state.overshootStyle);
  const overshootIsCustom = useEasingStore((state) => state.overshootIsCustom);
  const overshootCurve = useEasingStore((state) => state.overshootCurve);
  const setState = useEasingStore((state) => state.setState);

  const onBezierValueChange = (style: BezierStyle, curve: BezierCurve) => {
    const value = bezierFunctions[style][curve]!;
    setState({
      bezierX1: value.x1,
      bezierY1: value.y1,
      bezierX2: value.x2,
      bezierY2: value.y2,
      bezierValue: createCubicBezierString(value),
      bezierStyle: style,
      bezierCurve: curve,
      bezierIsCustom: false,
      editorExtraSpaceTop: Math.max(value.y1, value.y2) > 1,
      editorExtraSpaceBottom: Math.min(value.y1, value.y2) < 0,
    });
  };

  const onSpringValueChange = (curve: SpringCurve) => {
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.SPRING,
      accuracy: editorAccuracy,
      ...springFunctions[curve],
    });
    setState({
      springStiffness: springFunctions[curve].stiffness,
      springDamping: springFunctions[curve].damping,
      springMass: springFunctions[curve].mass,
      springCurve: curve,
      springValue: easingValue,
      springPoints: sampledPoints,
      springIsCustom: false,
    });
  };

  const onBounceValueChange = (curve: BounceCurve) => {
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.BOUNCE,
      accuracy: editorAccuracy,
      ...bounceFunctions[curve],
    });
    setState({
      bounceBounces: bounceFunctions[curve].bounces,
      bounceDamping: bounceFunctions[curve].damping,
      bounceCurve: curve,
      bounceValue: easingValue,
      bouncePoints: sampledPoints,
      bounceIsCustom: false,
    });
  };

  const onWiggleValueChange = (curve: WiggleCurve) => {
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.WIGGLE,
      accuracy: editorAccuracy,
      ...wiggleFunctions[curve],
    });
    setState({
      wiggleDamping: wiggleFunctions[curve].damping,
      wiggleWiggles: wiggleFunctions[curve].wiggles,
      wiggleCurve: curve,
      wiggleValue: easingValue,
      wigglePoints: sampledPoints,
      wiggleIsCustom: false,
    });
  };

  const onOvershootValueChange = (style: OvershootStyle, curve?: OvershootCurve) => {
    const { easingValue, sampledPoints } = generateLinearEasing({
      type: EasingType.OVERSHOOT,
      accuracy: editorAccuracy,
      style,
      ...overshootFunctions[style][curve || defaultOvershootCurve],
    });
    setState(
      curve
        ? {
            overshootStyle: style,
            overshootDamping: overshootFunctions[style][curve].damping,
            overshootMass: overshootFunctions[style][curve].mass,
            overshootCurve: curve,
            overshootValue: easingValue,
            overshootPoints: sampledPoints,
            overshootIsCustom: false,
          }
        : {
            overshootStyle: style,
            overshootValue: easingValue,
            overshootPoints: sampledPoints,
          },
    );
  };

  return (
    <>
      <CardHeadline>Basis</CardHeadline>
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
                      d={`M0,100 C${values.x1 * 100},${100 - values.y1 * 100} ${values.x2 * 100},${100 - values.y2 * 100} 100,0`}
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
                  d={`M0,100 C${values.x1 * 100},${100 - values.y1 * 100} ${values.x2 * 100},${100 - values.y2 * 100} 100,0`}
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
                  isActive={overshootStyle === style}
                  onClick={() => {
                    onOvershootValueChange(style as OvershootStyle, overshootIsCustom ? undefined : overshootCurve);
                  }}
                  text={humanize(style)}
                  icon={
                    <polyline
                      points={overshootCalculations[style as OvershootStyle][defaultOvershootCurve].sampledPoints
                        .map((point) => `${point.x},${point.y / 2 + 25}`)
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
                    .map((point) => `${point.x},${point.y / 2 + 25}`)
                    .join(' ')}
                />
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
