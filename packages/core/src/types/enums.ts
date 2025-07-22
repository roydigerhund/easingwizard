export enum EasingType {
  BEZIER = 'bezier',
  SPRING = 'spring',
  BOUNCE = 'bounce',
  WIGGLE = 'wiggle',
  OVERSHOOT = 'overshoot',
}

export enum BezierStyle {
  IN = 'in',
  OUT = 'out',
  IN_OUT = 'inOut',
  OUT_IN = 'outIn',
}

export enum BezierCurve {
  SINE = 'sine',
  QUAD = 'quad',
  CUBIC = 'cubic',
  QUART = 'quart',
  QUINT = 'quint',
  EXPO = 'expo',
  CIRC = 'circ',
  BACK = 'back',
  JUMP = 'jump',
  ANTICIPATE = 'anticipate',
}

export enum OvershootStyle {
  IN = 'in',
  OUT = 'out',
  IN_OUT = 'inOut',
}

export enum SpringCurve {
  HEAVY = 'heavy',
  BOUNCY = 'bouncy',
  DROP = 'drop',
  GLIDE = 'glide',
  SNAP = 'snap',
  LAZY = 'lazy',
  ELASTIC = 'elastic',
}

export enum BounceCurve {
  FIRM = 'firm',
  SOFT = 'soft',
  SHARP = 'sharp',
  SUBTLE = 'subtle',
  PLAYFUL = 'playful',
  SPRINGY = 'springy',
}

export enum WiggleCurve {
  SUBTLE = 'subtle',
  ENERGETIC = 'energetic',
  PLAYFUL = 'playful',
  SHARP = 'sharp',
  SMOOTH = 'smooth',
  INTENSE = 'intense',
  DYNAMIC = 'dynamic',
}

export enum OvershootCurve {
  SOFT = 'soft',
  FIRM = 'firm',
  SMOOTH = 'smooth',
  DYNAMIC = 'dynamic',
  DRAMATIC = 'dramatic',
}

export enum AnimationType {
  MOVE_X = 'moveX',
  MOVE_Y = 'moveY',
  WIDTH = 'width',
  HEIGHT = 'height',
  SCALE = 'scale',
  ROTATE = 'rotate',
  OPACITY = 'opacity',
  ROTATE_X = 'rotateX',
  ROTATE_Y = 'rotateY',
  SHAPE = 'shape',
}

export enum PreviewPlayMode {
  INFINITE = 'infinite',
  ONCE = 'once',
}

export enum LinearEasingAccuracy {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra',
}
