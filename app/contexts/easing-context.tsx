import { createContext, ReactNode, useCallback, useState } from 'react';
import { defaultBezierFunction, defaultBounceFunction, defaultSpringFunction } from '~/components/EasingSelection';
import {
  BezierCurve,
  BezierStyle,
  BounceCurve,
  EasingType,
  LinearEasingAccuracy,
  SpringCurve,
} from '~/types-and-enums';
import { defaultBounceValue, defaultSpringValue } from '~/utils/easing';

type EasingContextType = {
  easingType: EasingType;
  bezierStyle: BezierStyle;
  bezierCurve: BezierCurve;
  bezierValue: [number, number, number, number];
  springCurve: SpringCurve;
  springStiffness: number;
  springDamping: number;
  springInitialVelocity: number;
  springAccuracy: LinearEasingAccuracy;
  springValue: string;
  bounceCurve: BounceCurve;
  bounceBounces: number;
  bounceRestitution: number;
  bounceInitialHeight: number;
  bounceValue: string;
  animationDuration: number;
};

const defaultEasingContext: EasingContextType = {
  easingType: EasingType.BEZIER,
  bezierStyle: BezierStyle.IN,
  bezierCurve: BezierCurve.DEFAULT,
  bezierValue: defaultBezierFunction,
  springCurve: SpringCurve.DEFAULT,
  springStiffness: defaultSpringFunction.stiffness,
  springDamping: defaultSpringFunction.damping,
  springInitialVelocity: defaultSpringFunction.initialVelocity,
  springAccuracy: LinearEasingAccuracy.HIGH,
  springValue: defaultSpringValue,
  bounceCurve: BounceCurve.DEFAULT,
  bounceBounces: defaultBounceFunction.bounces,
  bounceRestitution: defaultBounceFunction.restitution,
  bounceInitialHeight: defaultBounceFunction.initialHeight,
  bounceValue: defaultBounceValue,
  animationDuration: 1500,
};

// Create the context
export const EasingContext = createContext({
  state: defaultEasingContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveState: (state: Partial<EasingContextType>) => {},
});

export const EasingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<EasingContextType>(defaultEasingContext);

  const saveState = useCallback((statePartial: Partial<EasingContextType>) => {
    setState((oldState) => ({ ...oldState, ...statePartial }));
  }, []);

  return <EasingContext.Provider value={{ state, saveState }}>{children}</EasingContext.Provider>;
};
