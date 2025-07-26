import { BezierStyle, OvershootStyle, type BezierStyleKey, type OvershootStyleKey } from './enums';

export const isBezierStyle = (key: string): key is BezierStyleKey => key in BezierStyle;

export const isOvershootStyle = (key: string): key is OvershootStyleKey => key in OvershootStyle;
