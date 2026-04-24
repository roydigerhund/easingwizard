import { defaultEasingState, EasingType, encodeState, generateLinearEasing, reduceStateForShare, suggestDuration, type EasingState, type EasingTypeKey } from 'easingwizard-core';
import { create } from 'zustand';

const LOCALSTORAGE_KEY = 'easingState';

function regenerateEasing(state: EasingState): Partial<EasingState> {
  switch (state.easingType) {
    case EasingType.SPRING: {
      const { easingValue, sampledPoints, totalTime } = generateLinearEasing({
        type: EasingType.SPRING,
        accuracy: state.editorAccuracy,
        stiffness: state.springStiffness,
        damping: state.springDamping,
        mass: state.springMass,
      });
      return { springValue: easingValue, springPoints: sampledPoints, springTotalTime: totalTime };
    }
    case EasingType.BOUNCE: {
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: EasingType.BOUNCE,
        accuracy: state.editorAccuracy,
        bounces: state.bounceBounces,
        mass: state.bounceMass,
        damping: state.bounceDamping,
      });
      return { bounceValue: easingValue, bouncePoints: sampledPoints };
    }
    case EasingType.WIGGLE: {
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: EasingType.WIGGLE,
        accuracy: state.editorAccuracy,
        wiggles: state.wiggleWiggles,
        mass: state.wiggleMass,
        damping: state.wiggleDamping,
      });
      return { wiggleValue: easingValue, wigglePoints: sampledPoints };
    }
    case EasingType.OVERSHOOT: {
      const { easingValue, sampledPoints } = generateLinearEasing({
        type: EasingType.OVERSHOOT,
        accuracy: state.editorAccuracy,
        style: state.overshootStyle,
        mass: state.overshootMass,
        damping: state.overshootDamping,
      });
      return { overshootValue: easingValue, overshootPoints: sampledPoints };
    }
    default:
      return {};
  }
}

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
    const stateWithType = { ...state, easingType } as EasingState;
    const regenerated = regenerateEasing(stateWithType);
    const previewDuration = getSuggestedMidpoint({ ...stateWithType, ...regenerated });
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
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, ...regenerated, previewDuration });
        break;
      case EasingType.SPRING:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, ...regenerated, previewDuration });
        break;
      case EasingType.BOUNCE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, ...regenerated, previewDuration });
        break;
      case EasingType.WIGGLE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false, ...regenerated, previewDuration });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
  getCurrentState: () => {
    const { setEasingType: _t, setState: _s, getCurrentState: _c, ...rest } = get();
    return rest as EasingState;
  },
}));

// Debounced persist to localStorage
const KEYFRAMES_LOCALSTORAGE_KEY = 'easingKeyframes';
let saveTimeout: ReturnType<typeof setTimeout> | undefined;
useEasingStore.subscribe((state) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const { setEasingType: _t, setState: _s, getCurrentState: _c, ...rest } = state;
      const reduced = reduceStateForShare(rest as EasingState);
      const encoded = encodeState(reduced);
      if (encoded) {
        localStorage.setItem(LOCALSTORAGE_KEY, encoded);
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }

      // Persist keyframes text separately because the compact encoder only handles numbers
      if (rest.keyframesCSS !== undefined || rest.animationPropertyValue !== undefined) {
        localStorage.setItem(
          KEYFRAMES_LOCALSTORAGE_KEY,
          JSON.stringify({ k: rest.keyframesCSS, a: rest.animationPropertyValue }),
        );
      }
    } catch {
      // Silently ignore localStorage errors (e.g. private browsing)
    }
  }, 500);
});
