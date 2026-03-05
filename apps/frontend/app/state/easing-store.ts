import { defaultEasingState, EasingType, suggestDuration, type EasingState, type EasingTypeKey } from 'easingwizard-core';
import { create } from 'zustand';

function getSuggestedMidpoint(state: EasingState & { easingType: EasingTypeKey }): number | undefined {
  switch (state.easingType) {
    case EasingType.SPRING: {
      const d = suggestDuration(EasingType.SPRING, { mass: state.springMass, stiffness: state.springStiffness, damping: state.springDamping, accuracy: state.editorAccuracy }, state.springTotalTime);
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.BOUNCE: {
      const d = suggestDuration(EasingType.BOUNCE, { bounces: state.bounceBounces, mass: state.bounceMass, damping: state.bounceDamping, accuracy: state.editorAccuracy });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.WIGGLE: {
      const d = suggestDuration(EasingType.WIGGLE, { wiggles: state.wiggleWiggles, mass: state.wiggleMass, damping: state.wiggleDamping, accuracy: state.editorAccuracy });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.OVERSHOOT: {
      const d = suggestDuration(EasingType.OVERSHOOT, { style: state.overshootStyle, mass: state.overshootMass, damping: state.overshootDamping, accuracy: state.editorAccuracy });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    default:
      return undefined;
  }
}

type EasingAction = {
  setEasingType: (easingType: EasingTypeKey) => void;
  setState: (state: Partial<EasingState>) => void;
  getCurrentState: () => EasingState;
};

export const useEasingStore = create<EasingState & EasingAction>((set, get) => ({
  ...defaultEasingState,
  setEasingType: (easingType: EasingTypeKey) => {
    const state = get();
    const stateWithType = { ...state, easingType };
    const previewDuration = getSuggestedMidpoint(stateWithType);
    switch (easingType) {
      case EasingType.BEZIER:
        set(({ bezierY1, bezierY2 }) => ({
          easingType,
          editorExtraSpaceTop: Math.max(bezierY1, bezierY2) > 1,
          editorExtraSpaceBottom: Math.min(bezierY1, bezierY2) < 0,
          previewDuration: 600,
        }));
        break;
      case EasingType.OVERSHOOT:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, previewDuration });
        break;
      case EasingType.SPRING:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, previewDuration });
        break;
      case EasingType.BOUNCE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, previewDuration });
        break;
      case EasingType.WIGGLE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, previewDuration });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
  getCurrentState: () => {
    const { setEasingType: _t, setState: _s, getCurrentState: _c, ...rest } = get();
    return rest as EasingState;
  },
}));
