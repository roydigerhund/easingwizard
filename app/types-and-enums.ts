export type Point = {
  x: number;
  y: number;
};

export enum EasingType {
  BEZIER = 'bézier',
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
  ANTICIPATE = 'anticipate',
}

export type BezierValue = [number, number, number, number];

export enum OvershootStyle {
  IN = 'in',
  OUT = 'out',
  IN_OUT = 'inOut',
}

// TODO Add more overshoot curves
export enum OvershootCurve {
  DEFAULT = 'default',
  OVERSHOOT = 'overshoot',
  ANTICIPATE = 'anticipate',
}

// TODO: Add more spring curves
export enum SpringCurve {
  DEFAULT = 'default',
  WOBBLY = 'wobbly',
  GENTLE = 'gentle',
  STIFF = 'stiff',
}

// TODO: Add more bounce curves
export enum BounceCurve {
  DEFAULT = 'default',
  FLOPPY = 'floppy',
  RELAXED = 'relaxed',
}

// TODO: Add more wiggle curves
export enum WiggleCurve {
  DEFAULT = 'default',
  LOOSE = 'loose',
  TIGHT = 'tight',
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
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  ULTRA = 'ULTRA',
}
