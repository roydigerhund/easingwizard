import {
  defaultEasingState,
  EasingType,
  encodeState,
  generateLinearEasing,
  reduceStateForShare,
  suggestDuration,
  type EasingState,
  type EasingTypeKey,
} from 'easingwizard-core';
import { create } from 'zustand';

export const LOCALSTORAGE_KEY = 'easingState';
export const MANUAL_DURATION_STORAGE_KEY = 'easingStateManualDuration';

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

function getSuggestedMidpoint(state: EasingState): number | undefined {
  switch (state.easingType) {
    case EasingType.SPRING: {
      const d = suggestDuration(
        EasingType.SPRING,
        {
          mass: state.springMass,
          stiffness: state.springStiffness,
          damping: state.springDamping,
          accuracy: state.editorAccuracy,
        },
        state.springTotalTime,
      );
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.BOUNCE: {
      const d = suggestDuration(EasingType.BOUNCE, {
        bounces: state.bounceBounces,
        mass: state.bounceMass,
        damping: state.bounceDamping,
        accuracy: state.editorAccuracy,
      });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.WIGGLE: {
      const d = suggestDuration(EasingType.WIGGLE, {
        wiggles: state.wiggleWiggles,
        mass: state.wiggleMass,
        damping: state.wiggleDamping,
        accuracy: state.editorAccuracy,
      });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    case EasingType.OVERSHOOT: {
      const d = suggestDuration(EasingType.OVERSHOOT, {
        style: state.overshootStyle,
        mass: state.overshootMass,
        damping: state.overshootDamping,
        accuracy: state.editorAccuracy,
      });
      return Math.round((d.min + d.max) / 2 / 25) * 25;
    }
    default:
      return undefined;
  }
}

type EasingAction = {
  setEasingType: (easingType: EasingTypeKey) => void;
  setState: (state: Partial<EasingState>) => void;
  updateCurve: (state: Partial<EasingState>, options?: { resetDuration: boolean }) => void;
  setPreviewDuration: (duration: number) => void;
  resetPreviewDuration: () => void;
  restoreState: (state: Partial<EasingState>, manualDuration?: boolean) => void;
  getCurrentState: () => EasingState;
};

type EasingStore = EasingState & EasingAction & { previewDurationIsManual: boolean };

export const useEasingStore = create<EasingStore>((set, get) => ({
  ...defaultEasingState,
  previewDurationIsManual: false,
  setEasingType: (easingType: EasingTypeKey) => {
    const state = get();
    if (state.easingType === easingType) return;
    if (easingType === EasingType.BEZIER) {
      set({
        easingType,
        editorExtraSpaceTop: Math.max(state.bezierY1, state.bezierY2) > 1,
        editorExtraSpaceBottom: Math.min(state.bezierY1, state.bezierY2) < 0,
        previewDuration: 600,
        previewDurationIsManual: false,
      });
    } else {
      state.updateCurve(
        { easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false },
        { resetDuration: true },
      );
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
  updateCurve: (patch, { resetDuration } = { resetDuration: false }) =>
    set((state) => {
      const curve = { ...state, ...patch };
      const regenerated = regenerateEasing(curve);
      const previewDurationIsManual = state.previewDurationIsManual && !resetDuration;
      const previewDuration = previewDurationIsManual
        ? state.previewDuration
        : (getSuggestedMidpoint({ ...curve, ...regenerated }) ?? state.previewDuration);
      return { ...patch, ...regenerated, previewDuration, previewDurationIsManual };
    }),
  setPreviewDuration: (previewDuration) => set({ previewDuration, previewDurationIsManual: true }),
  resetPreviewDuration: () => {
    const previewDuration = getSuggestedMidpoint(get());
    if (previewDuration !== undefined) set({ previewDuration, previewDurationIsManual: false });
  },
  restoreState: (patch, manualDuration) =>
    set((state) => {
      const restored = { ...state, ...patch };
      const suggested = getSuggestedMidpoint(restored);
      const previewDurationIsManual =
        manualDuration ?? (suggested !== undefined && restored.previewDuration !== suggested);
      return { ...patch, previewDurationIsManual };
    }),
  getCurrentState: () => {
    const {
      setEasingType: _type,
      setState: _state,
      updateCurve: _curve,
      setPreviewDuration: _duration,
      resetPreviewDuration: _suggested,
      restoreState: _restore,
      getCurrentState: _current,
      previewDurationIsManual: _manual,
      ...state
    } = get();
    return state;
  },
}));

// Debounced persist to localStorage
let saveTimeout: ReturnType<typeof setTimeout> | undefined;
useEasingStore.subscribe((state) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const reduced = reduceStateForShare(state);
      const encoded = encodeState(reduced);
      if (encoded) {
        localStorage.setItem(LOCALSTORAGE_KEY, encoded);
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
      if (encoded && state.previewDurationIsManual) {
        // Associate the flag with the exact saved curve and duration.
        localStorage.setItem(MANUAL_DURATION_STORAGE_KEY, encoded);
      } else {
        localStorage.removeItem(MANUAL_DURATION_STORAGE_KEY);
      }
    } catch {
      // Silently ignore localStorage errors (e.g. private browsing)
    }
  }, 500);
});
