export type Point = {
  x: number;
  y: number;
};

export enum EasingType {
  BEZIER = 'bezier',
  SPRING = 'spring',
  BOUNCE = 'bounce',
  WIGGLE = 'wiggle',
}

export enum BezierStyle {
  IN = 'in',
  OUT = 'out',
  IN_OUT = 'inOut',
}

export enum BezierCurve {
  DEFAULT = 'default',
  SINE = 'sine',
  QUAD = 'quad',
  CUBIC = 'cubic',
  QUART = 'quart',
  QUINT = 'quint',
  EXPO = 'expo',
  CIRC = 'circ',
  BACK = 'back',
}

export type BezierValue = [number, number, number, number];

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
  MOVE = 'move',
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
  ONCE = 'once',
  INFINITE = 'infinite',
}

export enum LinearEasingAccuracy {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  ULTRA = 'ULTRA',
  EVENLY = 'EVENLY',
}
