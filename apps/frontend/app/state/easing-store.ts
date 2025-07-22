import { create } from 'zustand';
import { EasingType } from '~/types-and-enums';

type EasingAction = {
  setEasingType: (easingType: EasingType) => void;
  setState: (state: Partial<EasingState>) => void;
  getCurrentState: () => EasingState;
};

export const useEasingStore = create<EasingState & EasingAction>((set, get) => ({
  ...defaultEasingState,
  setEasingType: (easingType: EasingType) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setEasingType, setState, getCurrentState, ...rest } = get();
    return rest as EasingState;
  },
}));
