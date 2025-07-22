import { BezierStyle, OvershootStyle } from './enums';

export const isBezierStyle = (key: string): key is BezierStyle => key in BezierStyle;

export const isOvershootStyle = (key: string): key is OvershootStyle => key in OvershootStyle;
