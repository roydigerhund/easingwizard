import { defaultEasingState, EasingType, type EasingState, type EasingTypeKey } from 'easingwizard-core';
import { create } from 'zustand';

type EasingAction = {
  setEasingType: (easingType: EasingTypeKey) => void;
  setState: (state: Partial<EasingState>) => void;
  getCurrentState: () => EasingState;
};

export const useEasingStore = create<EasingState & EasingAction>((set, get) => ({
  ...defaultEasingState,
  setEasingType: (easingType: EasingTypeKey) => {
    switch (easingType) {
      case EasingType.BEZIER:
        set(({ bezierY1, bezierY2 }) => ({
          easingType,
          editorExtraSpaceTop: Math.max(bezierY1, bezierY2) > 1,
          editorExtraSpaceBottom: Math.min(bezierY1, bezierY2) < 0,
        }));
        break;
      case EasingType.OVERSHOOT:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.SPRING:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.BOUNCE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
      case EasingType.WIGGLE:
        set({ easingType, editorExtraSpaceTop: false, editorExtraSpaceBottom: false });
        break;
    }
  },
  setState: (state: Partial<EasingState>) => set(state),
  getCurrentState: () => {
    const { setEasingType: _t, setState: _s, getCurrentState: _c, ...rest } = get();
    return rest as EasingState;
  },
}));
